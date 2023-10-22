"use server";
import { UseGuards } from "@/next_decorators/decorators/Guard";
import { _NextResponse } from "@/shared/utils/http/_NextResponse";
import { ExistingUserGuard } from "./guard/existingUser.guard";
import type { Bind } from "@/shared/types/http/Bind";
import type { User } from "@prisma/client";
import { LoginDto } from "@/shared/types/dto/auth/login";
import { Body, ValidatorGuard } from "@/next_decorators/utils/Validator.guard";
import { authService } from "./auth.service";

class AuthActions {
  async login(payload: Bind<LoginDto, { user: User; isEmail: boolean }>) {
    return authService.login(payload);
  }
}

export const { login } = new AuthActions();
