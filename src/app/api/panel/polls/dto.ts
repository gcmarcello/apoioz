import { z } from "zod";

export const upsertPollDto = z.object({
  title: z.string().min(1, "Nome é obrigatório"),
  activeAtSignUp: z.boolean(),
  id: z.string().optional(),
  active: z.boolean(),
  questions: z.array(
    z.object({
      id: z.string().optional(),
      question: z
        .string()
        .min(1, "Texto da pergunta é obrigatório. Remova a pergunta para excluir"),
      allowFreeAnswer: z.boolean(),
      allowMultipleAnswers: z.boolean(),
      active: z.boolean(),
      options: z
        .array(
          z.object({
            id: z.string().optional(),
            name: z.string(),
            active: z.boolean(),
          })
        )
        .optional(),
    })
  ),
});

export const readPollDto = z.object({
  title: z.string(),
  questions: z.object({
    question: z.string(),
    id: z.string(),
    answers: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
      })
    ),
  }),
});

export const readPollsStats = z.array(
  z.object({
    name: z.string(),
    stat: z.number(),
    previousStat: z.number(),
    change: z.number().or(z.string()),
    changeType: z.string().or(z.boolean()),
    changeText: z.string(),
  })
);

export const pollAnswerDto = z.object({
  pollId: z.string(),
  questions: z.array(
    z.object({
      supporterId: z.string().optional(),
      questionId: z.string().uuid({ message: "ID da pergunta é obrigatório" }),
      answers: z.object({
        options: z.record(z.boolean()).or(z.string()).or(z.array(z.string())).optional(),
        freeAnswer: z.string().optional(),
      }),
    })
  ),
});

export type UpsertPollDto = z.infer<typeof upsertPollDto>;
export type PollAnswerDto = z.infer<typeof pollAnswerDto>;
export type ReadPollsStats = z.infer<typeof readPollsStats>;
