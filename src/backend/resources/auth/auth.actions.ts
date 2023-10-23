"use server";

import { LoginDto, loginDto } from "@/(shared)/dto/schemas/auth/login";
import { User } from "@prisma/client";
import type { Bind } from "@/next_decorators/utils/functions/bindToPayload";
import * as authService from "./auth.service";
import { cookies } from "next/headers";
import { UseMiddlewares } from "@/next_decorators/lib/decorators/UseMiddlewares";
import { ExistingUserMiddleware } from "./middlewares/existingUser.middleware";
import { Catch } from "@/next_decorators/lib/decorators/Catch";
import { _NextResponse, type ResponseObject } from "@/(shared)/utils/http/_NextResponse";

class AuthActions {
  @Catch((err: ResponseObject) => {
    return _NextResponse.rawError(err);
  })
  @UseMiddlewares(ExistingUserMiddleware)
  async login(payload: Bind<LoginDto, { user: User; isEmail: boolean }>) {
    const token = await authService.login(payload);

    if (!token)
      return _NextResponse.rawError({
        message: "Erro fazer login, tente novamente",
        status: 500,
      });

    cookies().set("token", token);

    return _NextResponse.raw({
      data: token,
      message: "Login realizado com sucesso!",
    });
  }
}

export const { login } = new AuthActions();
