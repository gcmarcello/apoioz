import { ZodRawShape, z } from "zod";

export const updateDto = <D extends ZodRawShape, W extends ZodRawShape>(
  where: W,
  data: D
) =>
  z.object({
    where: z.object(where),
    data: z.object(data),
  });
