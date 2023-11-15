"use server";

import * as authService from "./service";
import { cookies } from "next/headers";
import { LoginDto } from "./dto";
import { ExistingUserMiddleware } from "./middlewares";
import { ActionResponse } from "../_shared/utils/ActionResponse";

export async function login(request: LoginDto) {
  try {
    const parsedRequest = await ExistingUserMiddleware({ request });

    const token = await authService.login(parsedRequest);

    if (!token) throw `Erro ao efetuar login.`;

    cookies().set("token", token);

    return ActionResponse.success({
      data: token,
      message: "Login realizado com sucesso!",
    });
  } catch (err: any) {
    return ActionResponse.error(err);
  }
}

export async function generatePasswordRecovery(request: { identifier: string }) {
  try {
    return ActionResponse.success({
      data: await authService.generatePasswordRecovery(request.identifier),
      message: "Código de recuperação enviado com sucesso!",
    });
  } catch (error: any) {
    return ActionResponse.error(error);
  }
}

export async function checkRecoveryCode(request) {
  try {
    const verifyCode = await authService.checkRecoveryCode(request.code);
    return ActionResponse.success({
      data: verifyCode,
      message: "Código de recuperação verificado com sucesso!",
    });
  } catch (error: any) {
    return ActionResponse.error(error);
  }
}

export async function resetPassword(request) {
  try {
    await authService.resetPassword(request);
    cookies().set("token", authService.generateToken({ id: request.userId }));
    return ActionResponse.success({
      message: "Senha alterada com sucesso!",
      data: null,
    });
  } catch (error) {
    return ActionResponse.error(error);
  }
}
