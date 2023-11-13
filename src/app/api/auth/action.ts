"use server";

import * as authService from "./service";
import { cookies } from "next/headers";
import { _NextResponse } from "@/(shared)/utils/http/_NextResponse";
import { LoginDto } from "./dto";
import { ExistingUserMiddleware } from "./middlewares";
import { ActionResponse } from "../_shared/utils/ActionResponse";

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

export async function generatePasswordRecovery(request) {
  try {
    return new ActionResponse({
      data: await authService.generatePasswordRecovery(request.identifier),
      message: "Código de recuperação enviado com sucesso!",
    });
  } catch (error) {
    console.log(error);
    return new ActionResponse({ message: error, error: true });
  }
}

export async function checkRecoveryCode(request) {
  try {
    const verifyCode = await authService.checkRecoveryCode(request.code);
    return new ActionResponse({
      data: verifyCode,
      message: "Código de recuperação verificado com sucesso!",
    });
  } catch (error) {
    console.log(error);
    return new ActionResponse({
      error: true,
      message: error,
    });
  }
}

export async function resetPassword(request) {
  try {
    await authService.resetPassword(request);
    cookies().set("token", authService.generateToken({ id: request.userId }));
    return new ActionResponse({
      message: "Senha alterada com sucesso!",
    });
  } catch (error) {
    console.log(error);
    return new ActionResponse({
      error: true,
      message: error,
    });
  }
}
