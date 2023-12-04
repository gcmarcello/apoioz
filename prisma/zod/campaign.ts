import * as z from "zod"
import { CampaignTypes } from "@prisma/client"
import { CompleteUser, RelatedUserModel, CompleteSupporter, RelatedSupporterModel, CompleteCity, RelatedCityModel, CompleteState, RelatedStateModel, CompleteEvent, RelatedEventModel, CompleteInviteCode, RelatedInviteCodeModel, CompletePoll, RelatedPollModel } from "./index"

// Helper schema for JSON fields
type Literal = boolean | number | string
type Json = Literal | { [key: string]: Json } | Json[]
const literalSchema = z.union([z.string(), z.number(), z.boolean()])
const jsonSchema: z.ZodSchema<Json> = z.lazy(() => z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]))

export const CampaignModel = z.object({
  id: z.string(),
  userId: z.string(),
  options: jsonSchema,
  name: z.string(),
  year: z.string(),
  cityId: z.string().nullish(),
  stateId: z.string().nullish(),
  type: z.nativeEnum(CampaignTypes),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteCampaign extends z.infer<typeof CampaignModel> {
  user?: CompleteUser | null
  supporters: CompleteSupporter[]
  city?: CompleteCity | null
  state?: CompleteState | null
  Event: CompleteEvent[]
  InviteCode: CompleteInviteCode[]
  Poll: CompletePoll[]
}

/**
 * RelatedCampaignModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedCampaignModel: z.ZodSchema<CompleteCampaign> = z.lazy(() => CampaignModel.extend({
  user: RelatedUserModel.nullish(),
  supporters: RelatedSupporterModel.array(),
  city: RelatedCityModel.nullish(),
  state: RelatedStateModel.nullish(),
  Event: RelatedEventModel.array(),
  InviteCode: RelatedInviteCodeModel.array(),
  Poll: RelatedPollModel.array(),
}))
