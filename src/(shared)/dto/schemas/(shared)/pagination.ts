import { z } from "zod";

export const paginationDto = z.object({
  pageSize: z.number(),
  pageIndex: z.number(),
});

export type PaginationDto = z.infer<typeof paginationDto>;
