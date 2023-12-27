import { z } from "zod";
import { createUserDto } from "../user/dto";
import { pollAnswerDto } from "../panel/polls/dto";

export const signUpAsSupporterDto = z.object({
  user: createUserDto,
  poll: pollAnswerDto.nullable(),
  inviteCodeId: z.string(),
});

export type SignUpAsSupporterDto = z.infer<typeof signUpAsSupporterDto>;

export const loginDto = z.object({
  identifier: z.string(),
  password: z.string().min(6, { message: "A senha tem no mínimo 6 caracteres" }),
});

export type LoginDto = z.infer<typeof loginDto>;

export const signupDto = z.object({
  user: z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string(),
    phone: z.string().min(10),
    stateId: z.string(),
    cityId: z.string(),
    zoneId: z.string(),
    sectionId: z.number(),
    birthDate: z.string(),
  }),
  campaign: z.object({
    type: z.string(),
    name: z.string(),
    partyId: z.string(),
    cityId: z.string(),
    stateId: z.string(),
    year: z.string(),
  }),
});

export type SignupDto = z.infer<typeof signupDto>;

export const passwordResetRequestDto = z.object({
  identifier: z.string().email(),
});

export type PasswordResetRequestDto = z.infer<typeof passwordResetRequestDto>;

export const passwordResetDto = z
  .object({
    password: z.string().min(6, { message: "A senha deve ter no mínimo 6 caracteres" }),
    confirmPassword: z
      .string()
      .min(6, { message: "A senha deve ter no mínimo 6 caracteres" }),
    code: z.string(),
    userId: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword);

export type PasswordResetDto = z.infer<typeof passwordResetDto>;

export const passwordUpdateDto = z
  .object({
    password: z.string().min(6, { message: "A senha deve ter no mínimo 6 caracteres" }),
    confirmPassword: z
      .string()
      .min(6, { message: "A senha deve ter no mínimo 6 caracteres" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "As senhas não são iguais",
  });

export type PasswordUpdateDto = z.infer<typeof passwordUpdateDto>;
