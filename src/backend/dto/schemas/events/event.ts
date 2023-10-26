import { z } from "zod";

const timeSlotValidator = z.object({
  id: z.number(),
  name: z.string(),
  value: z.string(),
});

export const createEventDto = z.object({
  name: z.string(),
  campaignId: z.string().optional(),
  dateStart: timeSlotValidator,
  dateEnd: timeSlotValidator,
  description: z.string(),
  location: z.string(),
  userId: z.string(),
});

export type CreateEventDto = z.infer<typeof createEventDto>;
