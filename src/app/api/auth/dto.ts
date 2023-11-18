import { z } from "zod";

export const loginDto = z.object({
  identifier: z.string().email(),
  password: z.string().min(6),
});

export type LoginDto = z.infer<typeof loginDto>;

export const signupDto = z.object({
  user: z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
    phone: z.string().min(10),
    stateId: z.string(),
    cityId: z.string(),
    zoneId: z.string(),
    sectionId: z.number(),
    birthDate: z.string(),
  }),
  campaign: z.object({
    type: z.string(),
    name: z.string(),
    partyId: z.string(),
    cityId: z.string(),
    stateId: z.string(),
    year: z.string(),
  }),
});

export type SignupDto = z.infer<typeof signupDto>;
