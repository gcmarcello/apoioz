import { z } from "zod";
import { createDto } from "../../_shared/dto/create";
import { createUserDto } from "../../user/dto";
import { createSupporterDto } from "../supporters/dto";

export const createCampaignDto = createDto(
  z.object({
    name: z.string(),
    type: z.enum([
      "conselheiro_tutelar",
      "vereador",
      "prefeito",
      "deputado_estadual",
      "deputado_federal",
      "senador",
      "governador",
      "presidente",
    ]),
    slug: z.string().max(15),
    year: z.string(),
    cityId: z.string(),
  })
);

export type CreateCampaignDto = z.infer<typeof createCampaignDto>;

export const updateCampaignDto = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  year: z.string(),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: "Formato inválido para o link.",
  }),
});

export type UpdateCampaignDto = z.infer<typeof updateCampaignDto>;

export const joinCampaignDto = z.object({
  campaignId: z.string(),
});

export type JoinCampaignDto = z.infer<typeof joinCampaignDto>;
