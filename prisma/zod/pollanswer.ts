import * as z from "zod"
import { CompletePoll, RelatedPollModel, CompletePollQuestion, RelatedPollQuestionModel, CompleteSupporter, RelatedSupporterModel } from "./index"

// Helper schema for JSON fields
type Literal = boolean | number | string
type Json = Literal | { [key: string]: Json } | Json[]
const literalSchema = z.union([z.string(), z.number(), z.boolean()])
const jsonSchema: z.ZodSchema<Json> = z.lazy(() => z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]))

export const PollAnswerModel = z.object({
  id: z.string(),
  answer: jsonSchema,
  pollId: z.string(),
  questionId: z.string(),
  supporterId: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompletePollAnswer extends z.infer<typeof PollAnswerModel> {
  poll: CompletePoll
  PollQuestion: CompletePollQuestion
  supporter?: CompleteSupporter | null
}

/**
 * RelatedPollAnswerModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedPollAnswerModel: z.ZodSchema<CompletePollAnswer> = z.lazy(() => PollAnswerModel.extend({
  poll: RelatedPollModel,
  PollQuestion: RelatedPollQuestionModel,
  supporter: RelatedSupporterModel.nullish(),
}))
