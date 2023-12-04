import { z } from "zod";

export const upsertPollDto = z.object({
  title: z.string().min(1, "Nome é obrigatório"),
  activeAtSignUp: z.boolean(),
  id: z.string().optional(),
  questions: z.array(
    z.object({
      id: z.string().optional(),
      question: z
        .string()
        .min(1, "Texto da pergunta é obrigatório. Remova a pergunta para excluir"),
      allowFreeAnswer: z.boolean(),
      allowMultipleAnswers: z.boolean(),
      disabled: z.boolean(),
      options: z
        .array(
          z.object({
            id: z.string().optional(),
            name: z
              .string()
              .min(1, "Texto da opção é obrigatório. Remova a opção para excluir"),
            disabled: z.boolean(),
          })
        )
        .optional(),
    })
  ),
});

export type UpsertPollDto = z.infer<typeof upsertPollDto>;
