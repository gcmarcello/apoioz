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
  campaignId: z.string().optional(),
  dateStart: timeSlotValidator,
  dateEnd: timeSlotValidator,
  description: z.string(),
  location: z.string(),
  userId: z.string(),
});

export type CreateEventDto = z.infer<typeof createEventDto>;

export const readEventsByCampaign = readDto(EventModel);

export type ReadEventsByCampaignDto = z.infer<typeof readEventsByCampaign>;

export const readAvailableTimesByDay = readDto(z.object({ day: z.string() }));

export type ReadAvailableTimesByDayDto = z.infer<typeof readAvailableTimesByDay>;
