import { LoginDto } from "@/(shared)/dto/schemas/auth/login";
import { handlePrismaError } from "@/backend/prisma/prismaError";
import prisma from "@/tests/client";

export async function ExistingUserMiddleware({ request }: { request: LoginDto }) {
  const isEmail = request.identifier.includes("@");

  const user = await prisma.user
    .findFirst({
      where: isEmail ? { email: request.identifier } : { name: request.identifier },
    })
    .then((user) => {
      if (!user) handlePrismaError("Usuário", user);
      return user!;
    });

  return {
    ...request,
    user,
    isEmail,
  };
}
