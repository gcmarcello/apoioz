import jwt from "jsonwebtoken";
import { LoginDto } from "./dto";
import { User } from "@prisma/client";
import prisma from "prisma/prisma";
import dayjs from "dayjs";
import { sendEmail } from "../emails/service";
import { compareHash, hashInfo } from "@/_shared/utils/bCrypt";
import { normalizePhone, maskEmail, normalizeEmail } from "@/_shared/utils/format";
import { getEnv } from "@/_shared/utils/settings";
import { findCampaignById } from "../panel/campaigns/service";
import { answerPoll } from "../panel/polls/service";
import { CreateSupportersDto } from "../panel/supporters/dto";
import { verifyExistingUser } from "../user/service";
import { verifyConflictingSupporter } from "../panel/supporters/service";

export async function login(request: LoginDto & { user: User; isEmail: boolean }) {
  if (!request.user.password)
    throw `Seu acesso ao painel está restrito. Clique <a href="/" class="underline text-indigo-400">aqui</a> para finalizar a configuração.`;

  if (!(await compareHash(request.password, request.user.password)))
    throw `${request.isEmail ? "Email" : "Usuário"} ou senha incorretos.`;

  return createToken({ id: request.user.id });
}

export function createToken(request: { id: string }) {
  if (!getEnv("JWT_KEY"))
    throw "O serviço de autenticação se encontra fora do ar. ERROR: MISSING JWTKEY";
  return jwt.sign({ id: request.id }, getEnv("JWT_KEY"), { expiresIn: "7d" });
}

export async function createPasswordRecovery(identifier: string) {
  const identifierType = identifier.includes("@") ? "email" : "phone";
  const potentialUser = await prisma.user.findFirst({
    where: {
      [identifierType]:
        identifierType === "phone" ? normalizePhone(identifier) : identifier,
    },
  });
  if (!potentialUser) throw "Usuário não encontrado.";

  const existingRecovery = await prisma.passwordRecovery.findFirst({
    where: {
      AND: [{ userId: potentialUser.id }, { expiresAt: { gte: dayjs().toISOString() } }],
    },
  });

  if (existingRecovery) throw "Recuperação de senha já solicitada.";

  const recovery = await prisma.passwordRecovery.create({
    data: {
      userId: potentialUser.id,
      expiresAt: dayjs().add(10, "minutes").toISOString(),
    },
  });

  await sendEmail({
    to: potentialUser.email,
    templateId: "password_recovery",
    dynamicData: {
      name: potentialUser.name,
      recoveryLink: `${getEnv("NEXT_PUBLIC_SITE_URL")}/recuperar/${recovery.id}`,
      subject: "Recuperação de Senha - ApoioZ",
    },
  });
  return maskEmail(potentialUser.email);
}

export async function checkRecoveryCode(code: string) {
  if (!/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/.test(code))
    throw "Código inválido.";

  const potentialCode = await prisma.passwordRecovery.findFirst({
    where: { AND: [{ id: code }] },
    include: { user: true },
  });

  if (!potentialCode) throw "Código inválido.";

  if (potentialCode.expiresAt < dayjs().toDate()) throw "Código expirado.";

  return {
    valid: true,
    code,
    userName: potentialCode.user.name,
    userId: potentialCode.userId,
  };
}

export async function resetPassword(request) {
  const verifyCode = await checkRecoveryCode(request.code);

  await prisma.user.update({
    data: { password: await hashInfo(request.password) },
    where: { id: verifyCode.userId },
  });

  await prisma.passwordRecovery.update({
    where: { id: verifyCode.code },
    data: { expiresAt: dayjs().toISOString() },
  });
}

export async function signUpAsSupporter(request: CreateSupportersDto) {
  const existingUser = await verifyExistingUser(request.phone, request.email);

  const campaign = await findCampaignById(request.campaignId);
  const referral = await prisma.supporter.findFirst({
    where: { id: request.referralId },
  });

  if (!referral) throw "Referral não encontrado";

  if (!campaign) throw "Campanha não encontrada";

  if (existingUser) {
    const conflictingSupporter = await verifyConflictingSupporter(
      campaign,
      existingUser.id
    );

    if (conflictingSupporter?.type === "sameCampaign")
      throw "Usuário já cadastrado nesta campanha.";
    if (conflictingSupporter?.type === "otherCampaign") {
      throw "Usuário já cadastrado em outra campanha do mesmo tipo.";
    }
  }

  const referralsSupporterGroups = await prisma.supporterGroup.findMany({
    where: {
      memberships: {
        some: {
          supporterId: referral.id,
        },
      },
    },
  });

  const createSupporterGroupMembershipQuery = referralsSupporterGroups.map(
    (supporterGroup) => ({
      isOwner: false,
      supporterGroup: {
        connect: {
          id: supporterGroup.id,
        },
      },
    })
  );

  const user = existingUser
    ? existingUser
    : await prisma.user.create({
        include: {
          info: true,
        },
        data: {
          email: normalizeEmail(request.email),
          password: request.password ? await hashInfo(request.password) : null,
          name: request.name,
          role: "user",
          phone: normalizePhone(request.phone),
          info: {
            create: {
              ...request.info,
              birthDate: dayjs(request.info.birthDate, "DD/MM/YYYY").toISOString(),
            },
          },
        },
      });

  if (!user || !user.info?.sectionId || !user.info?.zoneId) throw "Erro ao criar usuário";

  const supporter = await prisma.supporter.create({
    include: { user: true },
    data: {
      level: 1,
      Section: { connect: { id: user.info.sectionId } },
      Zone: { connect: { id: user.info.zoneId } },
      campaign: { connect: { id: referral.campaignId } },
      referral: { connect: { id: referral.id } },
      user: { connect: { id: user.id } },
      supporterGroupsMemberships: {
        create: [
          {
            isOwner: true,
            supporterGroup: {
              create: {},
            },
          },
          ...createSupporterGroupMembershipQuery,
        ],
      },
    },
  });

  if (supporter && request.poll.questions) {
    for (const question of request.poll.questions) {
      question.supporterId = supporter.id;
    }
    await answerPoll({ ...request.poll, bypassIpCheck: true });
  }

  await sendEmail({
    to: user.email,
    templateId: "welcome_email",
    dynamicData: {
      name: user.name,
      siteLink: `${getEnv("NEXT_PUBLIC_SITE_URL")}/painel`,
      campaignName: campaign.name,
      subject: `Bem Vindo à Campanha ${campaign.name}! - ApoioZ`,
    },
  });

  const referralInfo = await prisma.supporter.findFirst({
    where: { id: referral.id },
    include: { user: { include: { info: true } } },
  });

  await sendEmail({
    to: referralInfo.user.email,
    templateId: "invite_notification",
    dynamicData: {
      name: referralInfo.user.name,
      siteLink: `${getEnv("NEXT_PUBLIC_SITE_URL")}/painel`,
      campaignName: campaign.name,
      supporterName: user.name,
      subject: `Novo apoiador convidado na campanha ${campaign.name}! - ApoioZ`,
    },
  });

  return supporter;
}
