import jwt from "jsonwebtoken";
import { LoginDto, PasswordResetDto, PasswordUpdateDto } from "./dto";
import { User } from "prisma/client";
import { prisma } from "prisma/prisma";
import dayjs from "dayjs";
import { sendEmail } from "../emails/service";
import { compareHash, hashInfo } from "@/_shared/utils/bCrypt";
import { normalizePhone, maskEmail } from "@/_shared/utils/format";
import { getEnv } from "@/_shared/utils/settings";
import { UserSession } from "@/middleware/functions/userSession.middleware";

export async function login(
  request: LoginDto & { user: User; isEmail: boolean }
) {
  if (!request.user.password)
    throw `Seu acesso ao painel está restrito. Clique no link abaixo para criar uma senha.`;

  if (!(await compareHash(request.password, request.user.password)))
    throw `${request.isEmail ? "Email" : "Usuário"} ou senha incorretos.`;

  return createToken({ id: request.user.id });
}

export function createToken(request: { id: string }) {
  const JWT_KEY = getEnv("JWT_KEY");
  if (!JWT_KEY)
    throw "O serviço de autenticação se encontra fora do ar. ERROR: MISSING JWTKEY.";
  return jwt.sign({ id: request.id }, JWT_KEY, { expiresIn: "7d" });
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
  if (!potentialUser.email)
    throw "Usuário não possui email cadastrado. Contate o líder do seu grupo.";

  const existingRecovery = await prisma.passwordRecovery.findFirst({
    where: {
      AND: [
        { userId: potentialUser.id },
        { expiresAt: { gte: dayjs().toISOString() } },
      ],
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
    templateId: "recover_pass",
    dynamicData: {
      name: potentialUser.name,
      recoveryLink: `${getEnv("NEXT_PUBLIC_SITE_URL")}/recuperar/${
        recovery.id
      }`,
      subject: "Recuperação de Senha - ApoioZ",
    },
  });
  return maskEmail(potentialUser.email);
}

export async function checkRecoveryCode(code: string) {
  if (
    !/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/.test(code)
  )
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

export async function resetPassword(request: PasswordResetDto) {
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

export async function updatePassword(
  request: PasswordUpdateDto & { userSession: UserSession }
) {
  await prisma.user.update({
    data: { password: await hashInfo(request.password) },
    where: { id: request.userSession.id },
  });
}
