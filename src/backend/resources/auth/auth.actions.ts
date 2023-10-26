"use server";

import type { LoginDto } from "@/backend/dto/schemas/auth/login";
import * as authService from "./auth.service";
import { cookies } from "next/headers";
import { ExistingUserMiddleware } from "./middlewares/existingUser.middleware";
import { _NextResponse } from "@/(shared)/utils/http/_NextResponse";

export async function login(request: LoginDto) {
  try {
    const parsedRequest = await ExistingUserMiddleware({ request });

    const token = await authService.login(parsedRequest);

    if (!token)
      throw {
        message: `Erro ao efetuar login.`,
        status: 401,
      };

    cookies().set("token", token);

    return _NextResponse.raw({
      data: token,
      message: "Login realizado com sucesso!",
    });
  } catch (err: any) {
    return _NextResponse.rawError(err);
  }
}
