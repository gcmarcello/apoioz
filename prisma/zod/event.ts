import * as z from "zod"
import { CompleteCampaign, RelatedCampaignModel, CompleteSupporter, RelatedSupporterModel } from "./index"

export const EventModel = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  location: z.string(),
  dateStart: z.date(),
  dateEnd: z.date(),
  campaignId: z.string(),
  hostId: z.string(),
  status: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  observations: z.string().nullish(),
})

export interface CompleteEvent extends z.infer<typeof EventModel> {
  Campaign: CompleteCampaign
  Supporter?: CompleteSupporter | null
}

/**
 * RelatedEventModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedEventModel: z.ZodSchema<CompleteEvent> = z.lazy(() => EventModel.extend({
  Campaign: RelatedCampaignModel,
  Supporter: RelatedSupporterModel.nullish(),
}))
