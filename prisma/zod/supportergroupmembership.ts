import * as z from "zod"
import { CompleteSupporter, RelatedSupporterModel, CompleteSupporterGroup, RelatedSupporterGroupModel } from "./index"

export const SupporterGroupMembershipModel = z.object({
  supporterId: z.string(),
  supporterGroupId: z.string(),
  isOwner: z.boolean(),
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteSupporterGroupMembership extends z.infer<typeof SupporterGroupMembershipModel> {
  supporter: CompleteSupporter
  supporterGroup: CompleteSupporterGroup
}

/**
 * RelatedSupporterGroupMembershipModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedSupporterGroupMembershipModel: z.ZodSchema<CompleteSupporterGroupMembership> = z.lazy(() => SupporterGroupMembershipModel.extend({
  supporter: RelatedSupporterModel,
  supporterGroup: RelatedSupporterGroupModel,
}))
