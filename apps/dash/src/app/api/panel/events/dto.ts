import { z } from "zod";
import { readDto } from "../../_shared/dto/read";
import { Event } from "prisma/client";

const timeSlotDto = z.object({
  id: z.number(),
  name: z.string(),
  value: z.date(),
});

export const createEventDto = z.object({
  name: z.string(),
  dateStart: z.string(),
  dateEnd: z.string(),
  description: z.string(),
  location: z.string(),
  observations: z.string(),
});

export type CreateEventDto = z.infer<typeof createEventDto>;

export const readEventsDto = readDto(
  z.object({
    campaignId: z.string(),
    dateEnd: z.string().optional(),
    dateStart: z.string().optional(),
    description: z.string().optional(),
    location: z.string().optional(),
    hostId: z.string().optional(),
    id: z.string().optional(),
    name: z.string().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
    status: z.string().optional(),
    observations: z.string().optional(),
  })
);

export type ReadEventsDto = z.infer<typeof readEventsDto>;

export const readEventsAvailability = readDto(z.object({ day: z.string() }));

export type ReadEventsAvailability = z.infer<typeof readEventsAvailability>;
