import { handlePrismaError } from "@/backend/prisma/prismaError";
import { TokenGeneratorType } from "@/(shared)/types/authTypes";
import { compareHash } from "@/(shared)/utils/bCrypt";
import jwt from "jsonwebtoken";
import { LoginDto } from "@/(shared)/dto/schemas/auth/login";
import { User } from "@prisma/client";

export async function login(data: LoginDto & { isEmail: boolean; user: User }) {
  try {
    if (!data.user.password)
      throw {
        message: `Seu acesso ao painel está restrito. Clique <a href="/" class="underline text-indigo-400">aqui</a> para finalizar a configuração.`,
        status: 401,
      };

    if (!(await compareHash(data.password, data.user.password)))
      throw {
        message: `${data.isEmail ? "Email" : "Usuário"} ou senha incorretos.`,
        status: 401,
      };

    return generateToken({ id: data.user.id });
  } catch (error) {
    return handlePrismaError("usuário", error);
  }
}

export async function generateToken(data: TokenGeneratorType) {
  if (!process.env.JWT_KEY)
    throw "O serviço de autenticação se encontra fora do ar. ERROR: MISSING JWTKEY";
  return jwt.sign({ id: data.id }, process.env.JWT_KEY, { expiresIn: "10h" });
}
