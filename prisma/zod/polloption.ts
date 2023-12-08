import * as z from "zod"
import { CompletePollQuestion, RelatedPollQuestionModel } from "./index"

export const PollOptionModel = z.object({
  id: z.string(),
  questionId: z.string().nullish(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  active: z.boolean(),
})

export interface CompletePollOption extends z.infer<typeof PollOptionModel> {
  question?: CompletePollQuestion | null
}

/**
 * RelatedPollOptionModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedPollOptionModel: z.ZodSchema<CompletePollOption> = z.lazy(() => PollOptionModel.extend({
  question: RelatedPollQuestionModel.nullish(),
}))
