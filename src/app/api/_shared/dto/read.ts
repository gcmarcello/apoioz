import { ZodTypeAny, z } from "zod";

export const readDto = <W extends ZodTypeAny>(where: W) =>
  z.object({
    pagination: z.object({
      pageSize: z.number(),
      pageIndex: z.number(),
    }),
    where: where,
  });
