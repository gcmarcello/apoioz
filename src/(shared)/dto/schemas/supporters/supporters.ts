import { z } from "zod";
import { paginationDto } from "../(shared)/pagination";
import { phoneValidator } from "../../validators/phone.validator";

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
  phone: z.custom(phoneValidator),
  password: z.string().optional(),
  zoneId: z.string(),
  sectionId: z.string(),
  birthDate: z.string(),
  campaign: z.object({
    referralId: z.string().optional(),
    campaignId: z.string(),
  }),
});

export type CreateSupportersDto = z.infer<typeof createSupportersDto>;
