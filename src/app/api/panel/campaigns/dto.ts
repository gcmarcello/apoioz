import { z } from "zod";

export const updateCampaignDto = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  year: z.string(),
  options: z
    .object({
      primaryColor: z.string().optional(),
      secondaryColor: z.string().optional(),
    })
    .nullable(),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: "Formato inválido para o link.",
  }),
});

export type UpdateCampaignDto = z.infer<typeof updateCampaignDto>;
