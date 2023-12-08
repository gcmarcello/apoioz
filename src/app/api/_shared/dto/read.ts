import { ZodTypeAny, z } from "zod";

const paginationDto = z.object({
  pageSize: z.number(),
  pageIndex: z.number(),
});

export type Pagination = z.infer<typeof paginationDto>;

export const readDto = <W extends ZodTypeAny>(where: W) =>
  z.object({
    pagination: paginationDto,
    where: where,
  });
