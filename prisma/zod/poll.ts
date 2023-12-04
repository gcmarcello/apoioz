import * as z from "zod"
import { CompleteCampaign, RelatedCampaignModel, CompletePollQuestion, RelatedPollQuestionModel } from "./index"

export const PollModel = z.object({
  id: z.string(),
  title: z.string(),
  campaignId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompletePoll extends z.infer<typeof PollModel> {
  campaign: CompleteCampaign
  PollQuestion: CompletePollQuestion[]
}

/**
 * RelatedPollModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedPollModel: z.ZodSchema<CompletePoll> = z.lazy(() => PollModel.extend({
  campaign: RelatedCampaignModel,
  PollQuestion: RelatedPollQuestionModel.array(),
}))
