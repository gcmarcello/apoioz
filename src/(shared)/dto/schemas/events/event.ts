import { z } from "zod";

export const createEventDto = z.object({
  name: z.string(),
  campaignId: z.string(),
  dateStart: z.string(),
  dateEnd: z.string(),
  description: z.string(),
  location: z.string(),
  hostId: z.string(),
});

export type CreateEventDto = z.infer<typeof createEventDto>;
