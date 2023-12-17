import type { Campaign, Supporter, User, UserInfo } from "@prisma/client";
import { normalizeEmail, normalizePhone } from "@/_shared/utils/format";
import dayjs from "dayjs";
import { UserWithoutPassword } from "prisma/types/User";

import prisma from "prisma/prisma";
import { hashInfo } from "@/_shared/utils/bCrypt";
import { getEnv, isProd } from "@/_shared/utils/settings";
import { verifyExistingUser } from "@/app/api/user/service";
import { sendEmail } from "@/app/api/emails/service";
import { findCampaignById } from "../../campaigns/service";
import { CreateSupportersDto } from "../dto";

export async function createSupporter(
  request: CreateSupportersDto & {
    userSession: UserWithoutPassword;
    supporterSession: Supporter;
  }
) {
  const existingUser = await verifyExistingUser(request.phone, request.email);

  const campaign = await findCampaignById(request.supporterSession.campaignId);

  if (request.supporterSession.level < 4 && request.referralId)
    throw "Você não pode cadastrar um apoiador para um apoiador.";

  const referral = request.referralId
    ? await prisma.supporter.findFirst({
        where: { id: request.referralId },
      })
    : request.supporterSession;

  if (!referral) throw "Apoiador não encontrado";

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

  const supporter = await prisma.supporter
    .create({
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
    })
    .catch((err) => console.log(err));

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

export async function verifyConflictingSupporter(campaign: Campaign, userId: string) {
  const conflictingCampaigns: string[] = (
    await prisma.campaign.findMany({
      where: {
        AND: [
          { cityId: campaign.cityId },
          { type: campaign.type },
          { year: campaign.year },
        ],
      },
    })
  ).map((campaign) => campaign.id);

  const conflictingSupporter = await prisma.supporter.findFirst({
    where: {
      userId: userId,
      campaignId: { in: conflictingCampaigns },
    },
  });
  console.log(conflictingSupporter);

  if (conflictingSupporter?.campaignId === campaign.id)
    return {
      type: "sameCampaign",
      supporter: conflictingSupporter,
      message: "Você já faz parte desta rede.",
    };
  if (conflictingSupporter)
    return {
      type: "otherCampaign",
      supporter: conflictingSupporter,
      message: "Você já faz parte da rede de outro candidato.",
    };

  return null;
}
