"use server";

import * as authService from "./service";
import { cookies } from "next/headers";
import { LoginDto } from "./dto";
import { ExistingUserMiddleware } from "./middlewares";
import { ActionResponse } from "../_shared/utils/ActionResponse";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { CreateSupportersDto } from "../panel/supporters/dto";

export async function login(request: LoginDto) {
  try {
    const parsedRequest = await UseMiddlewares(request).then(ExistingUserMiddleware);

    const token = await authService.login(parsedRequest);

    if (!token) throw `Erro ao efetuar login.`;

    cookies().set("token", token);

    return ActionResponse.success({
      data: token,
      message: "Login realizado com sucesso!",
    });
  } catch (err: any) {
    console.log(err);
    return ActionResponse.error(err);
  }
}

export async function createPasswordRecovery(request: { identifier: string }) {
  try {
    return ActionResponse.success({
      data: await authService.createPasswordRecovery(request.identifier),
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
    cookies().set("token", authService.createToken({ id: request.userId }));
    return ActionResponse.success({
      message: "Senha alterada com sucesso!",
      data: null,
    });
  } catch (error) {
    return ActionResponse.error(error);
  }
}

export async function signUp() {
  try {
    return ActionResponse.success({
      message: "Usuário cadastrado com sucesso!",
      data: null,
    });
  } catch (error) {
    return ActionResponse.error(error);
  }
}

export async function signUpAsSupporter(request: CreateSupportersDto) {
  try {
    const newSupporter = await authService.signUpAsSupporter(request);

    return ActionResponse.success({
      data: newSupporter,
      message: "Sucesso ao criar novo apoiador!",
    });
  } catch (error) {
    console.log(error);
    return ActionResponse.error(error);
  }
}
