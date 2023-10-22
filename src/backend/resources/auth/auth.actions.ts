"use server";

import { LoginDto, loginDto } from "@/(shared)/dto/schemas/auth/login";
import { User } from "@prisma/client";
import type { Bind } from "@/next_decorators/utils/functions/bindToPayload";
import * as authService from "./auth.service";
import { UseMiddlewares } from "@/next_decorators/lib/decorators/UseMiddlewares";
import { ExistingUserMiddleware } from "./middlewares/existingUser.middleware";
import {
  ValidationSchema,
  ValidatorMiddleware,
} from "@/next_decorators/utils/middlewares/validator.middleware";

class AuthActions {
  @ValidationSchema(loginDto)
  @UseMiddlewares(ValidatorMiddleware, ExistingUserMiddleware)
  async login(payload: Bind<LoginDto, { user: User; isEmail: boolean }>) {
    return authService.login(payload);
  }
}

export const { login } = new AuthActions();
