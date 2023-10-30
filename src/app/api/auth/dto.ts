import { z } from "zod";

export const loginDto = z.object({
  identifier: z.string().email(),
  password: z.string().min(6),
});

export type LoginDto = z.infer<typeof loginDto>;
