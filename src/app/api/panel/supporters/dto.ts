import { z } from "zod";
import { paginationDto } from "../../_shared/dto/pagination";
import { phoneValidator } from "@/_shared/utils/validators/phone.validator";

export const listSupportersDto = z.object({
  pagination: paginationDto,
  data: z
    .object({
      campaignOwnerId: z.string().optional(),
      ownerId: z.string().optional(),
    })
    .optional(),
});

export type ListSupportersDto = z.infer<typeof listSupportersDto>;

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
  campaign: z
    .object({
      referralId: z.string(),
      campaignId: z.string(),
    })
    .optional(),
});

export type CreateSupportersDto = z.infer<typeof createSupportersDto>;
