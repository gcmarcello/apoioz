import { Prisma, PrismaClient } from "@prisma/client";
import { LoginType, SignUpType, TokenGeneratorType } from "../../types/authTypes";
import { handlePrismaError } from "../../utils/prismaError";
import { compareHash, hashInfo } from "../../utils/bCrypt";

import jwt from "jsonwebtoken";
import prisma from "../../utils/prisma";
import { normalize } from "../../utils/normalize";

export async function signUp(data: SignUpType) {
  try {
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: normalize(data.email),
        password: await hashInfo(data.password),
        role: "user",
      },
    });
    return { name: user.name, email: user.email };
  } catch (error) {
    return handlePrismaError("usuário", error);
  }
}

export async function login(data: LoginType) {
  try {
    const isEmail = data.identifier.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
    const user = await prisma.user.findFirst({
      where: isEmail ? { email: data.identifier } : { name: data.identifier },
    });
    if (!user) return handlePrismaError("Usuário", user);
    if (!(await compareHash(data.password, user.password)))
      throw { message: `${isEmail ? "Email" : "Usuário"} ou senha incorretos.`, status: 404 };

    return generateToken({ id: user.id });
  } catch (error) {
    return handlePrismaError("usuário", error);
  }
}

export async function verifyUser(data: any) {
  const user = await prisma.user.findFirst({ where: { id: data.id } });
  if (user) return { user: user.name, role: user.role };
  else throw { message: "Você não tem autorização para fazer isto.", status: 403 };
}

export function generateToken(data: TokenGeneratorType) {
  if (!process.env.JWT_KEY) throw "O serviço de autenticação se encontra fora do ar. ERROR: MISSING JWTKEY";
  return jwt.sign({ id: data.id }, process.env.JWT_KEY, { expiresIn: "10h" });
}
