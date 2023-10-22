import { LoginDto } from "@/(shared)/dto/schemas/auth/login";
import { handlePrismaError } from "@/backend/prisma/prismaError";

import prisma from "@/tests/client";
import { MiddlewareImplementation } from "@/next_decorators/lib/decorators/UseMiddlewares";
import { bindToPayload } from "@/(shared)/utils/bind";

export class ExistingUserMiddleware implements MiddlewareImplementation {
  async implementation(payload: any) {
    const data = payload as LoginDto;

    const isEmail = data.identifier.includes("@");

    const user = await prisma.user.findFirst({
      where: isEmail ? { email: data.identifier } : { name: data.identifier },
    });

    if (!user) return handlePrismaError("Usuário", user);

    bindToPayload(data, {
      user,
      isEmail,
    });
  }
}
