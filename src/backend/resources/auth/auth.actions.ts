"use server";

import { LoginDto } from "@/(shared)/dto/schemas/auth/login";
import { User } from "@prisma/client";
import { Bind } from "../../../../next_decorators/utils/functions/bindToPayload";
import * as authService from "./auth.service";

class AuthActions {
  async login(payload: Bind<LoginDto, { user: User; isEmail: boolean }>) {
    return authService.login(payload);
  }
}

export const { login } = new AuthActions();
