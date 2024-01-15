import { z } from "zod";
import { readDto } from "../../_shared/dto/read";
import { pollAnswerDto } from "../polls/dto";
import { createUserDto } from "../../user/dto";

export const readSupportersDto = readDto(
  z.object({
    supporterId: z.string().optional(),
    user: z
      .object({
        id: z.string().optional(),
        name: z.string().optional(),
        email: z.string().optional(),
        phone: z.string().optional(),
      })
      .optional(),
  })
);

export type ReadSupportersDto = z.infer<typeof readSupportersDto>;

export const createSupporterDto = z.object({
  user: createUserDto,
  userId: z.string().optional(),
  referralId: z.string().optional(),
  campaignId: z.string(),
  poll: pollAnswerDto.nullable(),
  externalSupporter: z.boolean().optional(),
});

export type CreateSupporterDto = z.infer<typeof createSupporterDto>;

export const addSupporterDto = createSupporterDto
  .omit({
    campaignId: true,
    userId: true,
  })
  .merge(
    z.object({
      user: createUserDto,
    })
  )
  .refine(
    (data) => {
      if (
        (Boolean(data.user.info.sectionId) === false ||
          Boolean(data.user.info.zoneId) === false) &&
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

export type AddSupporterDto = z.infer<typeof addSupporterDto>;

export const readSupporterBranchesDto = readDto(
  z.object({
    supporterId: z.string().nullable().optional(),
    branches: z.number().optional(),
  })
);

export type ReadSupporterBranchesDto = z.infer<typeof readSupporterBranchesDto>;
