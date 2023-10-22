import { LoginDto } from "@/(shared)/dto/schemas/auth/login";
import { bindToPayload } from "@/(shared)/utils/bind";
import { handlePrismaError } from "@/backend/prisma/prismaError";
import prisma from "@/tests/client";

export async function ExistingUserMiddleware(payload: LoginDto) {
  const isEmail = payload.identifier.includes("@");

  const user = await prisma.user.findFirst({
    where: isEmail ? { email: payload.identifier } : { name: payload.identifier },
  });

  if (!user) return handlePrismaError("Usuário", user);

  bindToPayload(payload, {
    user,
    isEmail,
  });
}
