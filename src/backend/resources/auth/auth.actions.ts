"use server";

import type { LoginDto } from "@/(shared)/dto/schemas/auth/login";
import * as authService from "./auth.service";
import { cookies } from "next/headers";
import { ExistingUserMiddleware } from "./middlewares/existingUser.middleware";
import { _NextResponse, type ResponseObject } from "@/(shared)/utils/http/_NextResponse";
import { Supporter, User } from "@prisma/client";
import { Catch } from "@/next_decorators/decorators/Catch";
import { UseMiddlewares } from "@/next_decorators/decorators/UseMiddlewares";

class AuthActions {
  @Catch((err: ResponseObject) => {
    return _NextResponse.rawError(err);
  })
  @UseMiddlewares(ExistingUserMiddleware)
  async login(payload: LoginDto, bind?: { user: User; isEmail: boolean }) {
    const token = await authService.login({
      ...payload,
      ...bind!,
    });

    if (!token)
      return _NextResponse.rawError({
        message: "Erro fazer login, tente novamente",
      });

    cookies().set("token", token);

    return _NextResponse.raw({
      data: token,
      message: "Login realizado com sucesso!",
    });
  }
}

export const { login } = new AuthActions();
