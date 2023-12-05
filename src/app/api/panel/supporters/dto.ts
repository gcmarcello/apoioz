import { z } from "zod";
import { phoneValidator } from "@/_shared/utils/validators/phone.validator";
import { readDto } from "../../_shared/dto/read";

export const readSupportersDto = readDto(
  z.object({
    user: z.object({
      id: z.string().optional(),
      name: z.string().optional(),
      email: z.string().optional(),
      phone: z.string().optional(),
    }),
    eager: z.boolean().optional(),
  })
);

export type ReadSupportersDto = z.infer<typeof readSupportersDto>;

export const createSupportersDto = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().optional(),
  phone: z.custom(phoneValidator),
  info: z.object({
    zoneId: z.string(),
    sectionId: z.string(),
    birthDate: z.string(),
  }),
  referralId: z.string().optional(),
  campaignId: z.string().optional(),
});

export type CreateSupportersDto = z.infer<typeof createSupportersDto>;
