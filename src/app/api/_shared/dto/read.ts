import { ZodRawShape, z } from "zod";

export const readDto = <W extends ZodRawShape>(where: W) =>
  z.object({
    pagination: z.object({
      pageSize: z.number(),
      pageIndex: z.number(),
    }),
    where: z.object(where),
  });
