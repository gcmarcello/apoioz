import { ZodTypeAny, z } from "zod";

const paginationDto = z.object({
  pageSize: z.number().optional(),
  pageIndex: z.number().optional(),
  count: z.number().optional(),
});

export type Pagination = z.infer<typeof paginationDto>;

export const readDto = <W extends ZodTypeAny>(where: W) =>
  z.object({
    pagination: paginationDto.optional(),
    where: where,
  });
