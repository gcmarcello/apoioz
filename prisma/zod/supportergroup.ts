import * as z from "zod"
import { CompleteSupporterGroupMembership, RelatedSupporterGroupMembershipModel } from "./index"

export const SupporterGroupModel = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteSupporterGroup extends z.infer<typeof SupporterGroupModel> {
  memberships: CompleteSupporterGroupMembership[]
}

/**
 * RelatedSupporterGroupModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedSupporterGroupModel: z.ZodSchema<CompleteSupporterGroup> = z.lazy(() => SupporterGroupModel.extend({
  memberships: RelatedSupporterGroupMembershipModel.array(),
}))
