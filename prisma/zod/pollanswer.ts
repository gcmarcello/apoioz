import * as z from "zod"
import { CompletePoll, RelatedPollModel, CompletePollOption, RelatedPollOptionModel, CompletePollQuestion, RelatedPollQuestionModel, CompleteSupporter, RelatedSupporterModel } from "./index"

export const PollAnswerModel = z.object({
  id: z.string(),
  optionId: z.string().nullish(),
  freeAnswer: z.string().nullish(),
  pollId: z.string(),
  questionId: z.string(),
  supporterId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompletePollAnswer extends z.infer<typeof PollAnswerModel> {
  poll: CompletePoll
  option?: CompletePollOption | null
  PollQuestion: CompletePollQuestion
  supporter: CompleteSupporter
}

/**
 * RelatedPollAnswerModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedPollAnswerModel: z.ZodSchema<CompletePollAnswer> = z.lazy(() => PollAnswerModel.extend({
  poll: RelatedPollModel,
  option: RelatedPollOptionModel.nullish(),
  PollQuestion: RelatedPollQuestionModel,
  supporter: RelatedSupporterModel,
}))
