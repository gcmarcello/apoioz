import {
  LoginType,
  SignUpType,
  TokenGeneratorType,
} from "../../../common/types/authTypes";

import jwt from "jsonwebtoken";

import prisma from "../../../common/utils/prisma";
import { handlePrismaError } from "../../../common/utils/prismaError";
import { compareHash } from "../../../common/utils/bCrypt";

export async function login(data: LoginType) {
  try {
    const isEmail = data.identifier.match(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    );
    const user = await prisma.user.findFirst({
      where: isEmail ? { email: data.identifier } : { name: data.identifier },
    });
    if (!user) return handlePrismaError("Usuário", user);

    if (!user.password)
      throw {
        message: `Seu acesso ao painel está restrito. Clique <a href="/" class="underline text-indigo-400">aqui</a> para finalizar a configuração.`,
        status: 401,
      };

    if (!(await compareHash(data.password, user.password)))
      throw {
        message: `${isEmail ? "Email" : "Usuário"} ou senha incorretos.`,
        status: 401,
      };

    return generateToken({ id: user.id });
  } catch (error) {
    return handlePrismaError("usuário", error);
  }
}

export function generateToken(data: TokenGeneratorType) {
  if (!process.env.JWT_KEY)
    throw "O serviço de autenticação se encontra fora do ar. ERROR: MISSING JWTKEY";
  return jwt.sign({ id: data.id }, process.env.JWT_KEY, { expiresIn: "10h" });
}
