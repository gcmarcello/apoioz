import * as z from "zod"
import { CompletePoll, RelatedPollModel, CompletePollOption, RelatedPollOptionModel, CompletePollAnswer, RelatedPollAnswerModel } from "./index"

export const PollQuestionModel = z.object({
  id: z.string(),
  pollId: z.string(),
  question: z.string(),
  allowMultipleAnswers: z.boolean(),
  allowFreeAnswer: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompletePollQuestion extends z.infer<typeof PollQuestionModel> {
  poll: CompletePoll
  PollOption: CompletePollOption[]
  PollAnswer: CompletePollAnswer[]
}

/**
 * RelatedPollQuestionModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedPollQuestionModel: z.ZodSchema<CompletePollQuestion> = z.lazy(() => PollQuestionModel.extend({
  poll: RelatedPollModel,
  PollOption: RelatedPollOptionModel.array(),
  PollAnswer: RelatedPollAnswerModel.array(),
}))
