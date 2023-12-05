import { z } from "zod";
import { readDto } from "../../_shared/dto/read";
import { EventModel } from "prisma/zod";

const timeSlotValidator = z.object({
  id: z.number(),
  name: z.string(),
  value: z.string(),
});

export const createEventDto = z.object({
  name: z.string(),
  dateStart: timeSlotValidator,
  dateEnd: timeSlotValidator,
  description: z.string(),
  location: z.string(),
});

export type CreateEventDto = z.infer<typeof createEventDto>;

export const readEventsByCampaign = readDto(EventModel);

export type ReadEventsByCampaignDto = z.infer<typeof readEventsByCampaign>;

export const readEventsAvailability = readDto(z.object({ day: z.string() }));

export type ReadEventsAvailability = z.infer<typeof readEventsAvailability>;
