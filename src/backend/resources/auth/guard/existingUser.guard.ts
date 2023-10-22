import { handlePrismaError } from "@/backend/prisma/prismaError";
import { CanActivate } from "@/next_decorators/decorators/Guard";
import { LoginDto } from "@/shared/types/dto/auth/login";
import { bindToPayload } from "@/shared/utils/bind";
import { _NextResponse } from "@/shared/utils/http/_NextResponse";
import prisma from "@/tests/client";

export class ExistingUserGuard implements CanActivate {
  async canActivate(payload: any) {
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
