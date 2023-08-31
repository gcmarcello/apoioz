import { Prisma, PrismaClient } from "@prisma/client";
import { LoginType, SignUpType, TokenGeneratorType } from "../../types/authTypes";
import { handlePrismaError } from "../../utils/PrismaError";
import { compareHash, hashInfo } from "../../utils/bCrypt";

const prisma = new PrismaClient();
import jwt from "jsonwebtoken";

export async function signUp(data: SignUpType) {
  try {
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: await hashInfo(data.password),
      },
    });
    return { name: data.name, email: data.email };
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
      throw `${isEmail ? "Email" : "Usuário"} ou senha incorretos.`;

    return generateToken({ id: user.id });
  } catch (error) {
    console.log(error);
    return handlePrismaError("usuário", error);
  }
}

export function generateToken(data: TokenGeneratorType) {
  if (!process.env.JWT_KEY) throw "O serviço de autenticação se encontra fora do ar. ERROR: MISSING JWTKEY";
  return jwt.sign({ id: data.id }, process.env.JWT_KEY, { expiresIn: "10h" });
}
