"use server";

import type { LoginDto } from "@/(shared)/dto/schemas/auth/login";
import * as authService from "./auth.service";
import { cookies } from "next/headers";
import { ExistingUserMiddleware } from "./middlewares/existingUser.middleware";
import { _NextResponse } from "@/(shared)/utils/http/_NextResponse";

export async function login(request: LoginDto) {
  const parsedRequest = await ExistingUserMiddleware({ request });

  const token = await authService.login(parsedRequest);

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
