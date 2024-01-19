"use server";

import * as authService from "./service";
import { cookies } from "next/headers";
import {
  LoginDto,
  PasswordResetDto,
  PasswordResetRequestDto,
  PasswordUpdateDto,
  SignUpAsSupporterDto,
} from "./dto";
import { ExistingUserMiddleware } from "./middlewares";
import { ActionResponse } from "odinkit/api/ActionResponse";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { createSupporter } from "../panel/supporters/service";
import { validateInviteCode } from "./invites/service";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";

export async function login(request: LoginDto) {
  try {
    const parsedRequest = await UseMiddlewares(request).then(
      ExistingUserMiddleware
    );

    const token = await authService.login(parsedRequest);

    if (!token) throw `Erro ao efetuar login.`;

    cookies().set("token", token);
  } catch (err: any) {
    return ActionResponse.error(err);
  }

  return ActionResponse.success({
    redirect: "/painel",
    message: "Login realizado com sucesso!",
  });
}

export async function createPasswordRecovery(request: PasswordResetRequestDto) {
  try {
    return ActionResponse.success({
      data: await authService.createPasswordRecovery(request.identifier),
      message: "Código de recuperação enviado com sucesso!",
    });
  } catch (error: any) {
    return ActionResponse.error(error);
  }
}

export async function checkRecoveryCode(request: any) {
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

export async function resetPassword(request: PasswordResetDto) {
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

export async function updatePassword(request: PasswordUpdateDto) {
  try {
    const { request: parsedRequest } = await UseMiddlewares(request).then(
      UserSessionMiddleware
    );
    await authService.updatePassword(parsedRequest);
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
    console.log(error);
    return ActionResponse.error(error);
  }
}

export async function signUpAsSupporter(request: SignUpAsSupporterDto) {
  try {
    const inviteCode = await validateInviteCode(request.inviteCodeId);

    if (!inviteCode) throw "Código de convite inválido";

    const newSupporter = await createSupporter({
      user: request.user,
      referralId: inviteCode.referralId,
      campaignId: inviteCode.campaignId,
      poll: request.poll,
    });

    return ActionResponse.success({
      data: newSupporter,
      message: "Sucesso ao criar novo apoiador!",
    });
  } catch (error) {
    return ActionResponse.error(error);
  }
}
