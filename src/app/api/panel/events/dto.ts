import { z } from "zod";
import { readDto } from "../../_shared/dto/read";
import { EventSchema } from "prisma/generated/zod/index";

export const createEventDto = z.object({
  name: z.string(),
  dateStart: z.string(),
  dateEnd: z.string(),
  description: z.string(),
  location: z.string(),
});

export type CreateEventDto = z.infer<typeof createEventDto>;

export const readEventsDto = readDto(EventSchema);

export type ReadEventsDto = z.infer<typeof readEventsDto>;

export const readEventsAvailability = readDto(z.object({ day: z.string() }));

export type ReadEventsAvailability = z.infer<typeof readEventsAvailability>;
