"use server";

import { LoginDto, loginDto } from "@/(shared)/dto/schemas/auth/login";
import { User } from "@prisma/client";
import type { Bind } from "@/next_decorators/utils/functions/bindToPayload";
import * as authService from "./auth.service";
import { cookies } from "next/headers";

class AuthActions {
  async login(payload: Bind<LoginDto, { user: User; isEmail: boolean }>) {
    const token = await authService.login(payload);
    if (token) return cookies().set("token", token);
  }
}

export const { login } = new AuthActions();
