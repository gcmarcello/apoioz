import { z } from "zod";
import { phoneValidator } from "@/_shared/utils/validators/phone.validator";
import { readDto } from "../../_shared/dto/read";
import { pollAnswerDto } from "../polls/dto";
import { birthDateValidator } from "@/_shared/utils/validators/birthDate.validator";

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
  name: z.string().min(3),
  email: z.string().email().min(3),
  password: z.string().optional(),
  phone: z.custom(phoneValidator),
  info: z.object({
    zoneId: z.string(),
    sectionId: z.string(),
    birthDate: z.custom(birthDateValidator, { message: "Data de nascimento inválida" }),
  }),
  referralId: z.string().optional(),
  campaignId: z.string(),
  poll: pollAnswerDto,
});

export type CreateSupportersDto = z.infer<typeof createSupportersDto>;
