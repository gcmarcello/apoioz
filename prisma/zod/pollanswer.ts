import * as z from "zod"
import { CompletePollOption, RelatedPollOptionModel, CompleteSupporter, RelatedSupporterModel } from "./index"

export const PollAnswerModel = z.object({
  id: z.string(),
  optionId: z.string(),
  supporterId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompletePollAnswer extends z.infer<typeof PollAnswerModel> {
  option: CompletePollOption
  supporter: CompleteSupporter
}

/**
 * RelatedPollAnswerModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedPollAnswerModel: z.ZodSchema<CompletePollAnswer> = z.lazy(() => PollAnswerModel.extend({
  option: RelatedPollOptionModel,
  supporter: RelatedSupporterModel,
}))
