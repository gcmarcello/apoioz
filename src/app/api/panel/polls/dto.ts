import { z } from "zod";

export const createPollDto = z.object({
  title: z.string(),
  activeAtSignUp: z.boolean(),
  questions: z.array(
    z.object({
      question: z.string(),
      allowFreeAnswer: z.boolean(),
      allowMultipleAnswers: z.boolean(),
      options: z.array(z.object({ name: z.string() })),
    })
  ),
});

export type CreatePollDto = z.infer<typeof createPollDto>;
