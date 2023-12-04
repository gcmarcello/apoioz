import * as z from "zod"
import { CompletePoll, RelatedPollModel, CompletePollOption, RelatedPollOptionModel } from "./index"

export const PollQuestionModel = z.object({
  id: z.string(),
  pollId: z.string(),
  question: z.string(),
  type: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompletePollQuestion extends z.infer<typeof PollQuestionModel> {
  poll: CompletePoll
  PollOption: CompletePollOption[]
}

/**
 * RelatedPollQuestionModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedPollQuestionModel: z.ZodSchema<CompletePollQuestion> = z.lazy(() => PollQuestionModel.extend({
  poll: RelatedPollModel,
  PollOption: RelatedPollOptionModel.array(),
}))
