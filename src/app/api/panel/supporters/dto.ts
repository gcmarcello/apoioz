import { z } from "zod";
import { phoneValidator } from "@/_shared/utils/validators/phone.validator";
import { readDto } from "../../_shared/dto/read";
import { pollAnswerDto } from "../polls/dto";
import { birthDateValidator } from "@/_shared/utils/validators/birthDate.validator";

export const readSupportersDto = readDto(
  z.object({
    user: z.object({
      id: z.string().optional(),
      name: z.string().optional(),
      email: z.string().optional(),
      phone: z.string().optional(),
    }),
  })
);

export type ReadSupportersDto = z.infer<typeof readSupportersDto>;

export const createSupportersDto = z
  .object({
    name: z.string().min(3, { message: "Nome deve ter no mínimo 3 caracteres" }),
    email: z.string().email({ message: "Email inválido" }).min(3),
    password: z.string().optional(),
    phone: z.custom(phoneValidator, { message: "Telefone inválido" }),
    info: z.object({
      zoneId: z.string().uuid().optional(),
      sectionId: z.string().uuid().optional(),
      birthDate: z.custom(birthDateValidator, { message: "Data de nascimento inválida" }),
    }),
    referralId: z.string().optional(),
    campaignId: z.string().optional(),
    externalSupporter: z.boolean().optional().default(false),
    poll: pollAnswerDto.optional(),
  })
  .refine(
    (data) => {
      if (
        (Boolean(data.info.sectionId) === false || Boolean(data.info.zoneId) === false) &&
        Boolean(data.externalSupporter) === false
      )
        return false;
      return true;
    },
    {
      message: "Seção e Zona são obrigatórios para apoiadores internos",
      path: ["externalSupporter"],
    }
  );

export type CreateSupportersDto = z.infer<typeof createSupportersDto>;

export const readSupporterBranchesDto = readDto(
  z.object({
    supporterId: z.string().optional(),
    branches: z.number().optional(),
  })
);

export type ReadSupporterBranchesDto = z.infer<typeof readSupporterBranchesDto>;
