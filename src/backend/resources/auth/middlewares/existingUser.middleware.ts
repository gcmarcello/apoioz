import { handlePrismaError } from "@/backend/prisma/prismaError";
import prisma from "@/tests/client";

export async function ExistingUserMiddleware({ request }: any) {
  const isEmail = request.identifier.includes("@");

  const user = await prisma.user.findFirst({
    where: isEmail ? { email: request.identifier } : { name: request.identifier },
  });

  if (!user) return handlePrismaError("Usuário", user);

  return {
    ...request,
    user,
    isEmail,
  };
}
