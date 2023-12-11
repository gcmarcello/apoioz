import { z } from "zod";
import { phoneValidator } from "@/_shared/utils/validators/phone.validator";
import { readDto } from "../../_shared/dto/read";
import { pollAnswerDto } from "../polls/dto";
import { birthDateValidator } from "@/_shared/utils/validators/birthDate.validator";
import { UserInfoSchema, UserSchema } from "prisma/generated/zod";

export const readSupportersDto = readDto(
  z.object({
    user: z.object({
      id: z.string().optional(),
      name: z.string().optional(),
      email: z.string().optional(),
      phone: z.string().optional(),
    }),
  })
);

export type ReadSupportersDto = z.infer<typeof readSupportersDto>;

export const createSupportersDto = z.object({
  name: z.string().min(3, { message: "Nome deve ter no mínimo 3 caracteres" }),
  email: z.string().email({ message: "Email inválido" }).min(3),
  password: z.string().optional(),
  phone: z.custom(phoneValidator, { message: "Telefone inválido" }),
  info: z.object({
    zoneId: z.string().uuid(),
    sectionId: z.string().uuid(),
    birthDate: z.custom(birthDateValidator, { message: "Data de nascimento inválida" }),
  }),
  referralId: z.string().optional(),
  campaignId: z.string(),
  poll: pollAnswerDto,
});

export type CreateSupportersDto = z.infer<typeof createSupportersDto>;

export const joinAsSupporterDto = z.object({
  campaignId: z.string(),
  referralId: z.string().optional(),
});

export type JoinAsSupporterDto = z.infer<typeof joinAsSupporterDto>;
export const readSupportersAsTreeDto = readDto(
  z.object({
    supporterId: z.string().optional(),
    nestLevel: z.number().optional(),
  })
);

export type ReadSupportersAsTreeDto = z.infer<typeof readSupportersAsTreeDto>;
