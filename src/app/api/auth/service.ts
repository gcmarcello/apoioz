import { TokenGeneratorType } from "@/(shared)/types/authTypes";
import { compareHash, hashInfo } from "@/(shared)/utils/bCrypt";
import jwt from "jsonwebtoken";
import { LoginDto } from "./dto";
import { User } from "@prisma/client";
import prisma from "prisma/prisma";
import { maskEmail, normalizePhone } from "@/(shared)/utils/format";
import dayjs from "dayjs";

export async function login(request: LoginDto & { user: User; isEmail: boolean }) {
  if (!request.user.password)
    throw {
      message: `Seu acesso ao painel está restrito. Clique <a href="/" class="underline text-indigo-400">aqui</a> para finalizar a configuração.`,
      status: 401,
    };

  if (!(await compareHash(request.password, request.user.password)))
    throw {
      message: `${request.isEmail ? "Email" : "Usuário"} ou senha incorretos.`,
      status: 401,
    };

  return generateToken({ id: request.user.id });
}

export function generateToken(data: TokenGeneratorType) {
  if (!process.env.JWT_KEY)
    throw "O serviço de autenticação se encontra fora do ar. ERROR: MISSING JWTKEY";
  return jwt.sign({ id: data.id }, process.env.JWT_KEY, { expiresIn: "10h" });
}

export async function generatePasswordRecovery(identifier: string) {
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

  await prisma.passwordRecovery.create({
    data: {
      userId: potentialUser.id,
      expiresAt: dayjs().add(10, "minutes").toISOString(),
    },
  });
  return { email: maskEmail(potentialUser.email) };
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

  await prisma.passwordRecovery.delete({ where: { id: verifyCode.code } });
}
