import { z } from "zod";

export const upsertWhatsappDto = z.object({
  group: z
    .object({
      url: z.string().regex(/^(https:\/\/chat\.whatsapp\.com\/)[A-Za-z0-9]+$/, {
        message: "Link de convite inválido",
      }),
      public: z.boolean().optional(),
    })
    .optional(),
  channel: z
    .object({
      url: z
        .string()
        .regex(/^(https:\/\/whatsapp\.com\/channel\/[A-Za-z0-9]+)?$/, {
          message: "Link de canal inválido",
        })
        .optional(),
      public: z.boolean().optional(),
    })
    .optional(),
});

export type UpsertWhatsappDto = z.infer<typeof upsertWhatsappDto>;
