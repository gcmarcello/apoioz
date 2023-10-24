import { LoginDto } from "@/(shared)/dto/schemas/auth/login";
import { handlePrismaError } from "@/backend/prisma/prismaError";
import { MiddlewarePayload } from "@/next_decorators/decorators/UseMiddlewares";
import prisma from "@/tests/client";

export async function ExistingUserMiddleware({
  data: { identifier },
  bind,
}: MiddlewarePayload<LoginDto>) {
  const isEmail = identifier.includes("@");

  const user = await prisma.user.findFirst({
    where: isEmail ? { email: identifier } : { name: identifier },
  });

  if (!user) return handlePrismaError("Usuário", user);

  bind["user"] = user;
  bind["isEmail"] = isEmail;
}
