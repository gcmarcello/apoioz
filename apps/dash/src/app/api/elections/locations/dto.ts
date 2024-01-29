import { readDto } from "odinkit";
import { z } from "zod";

export const readAddressDto = readDto(
  z.object({
    cityId: z.string().uuid().optional(),
    campaignId: z.string().uuid().optional(),
    sectionId: z.string().uuid().optional(),
    location: z.string().optional(),
    address: z.string().optional(),
  })
);

export type ReadAddressDto = z.infer<typeof readAddressDto>;
