import * as z from "zod"
import { CompleteCampaign, RelatedCampaignModel, CompleteSupporter, RelatedSupporterModel } from "./index"

export const InviteCodeModel = z.object({
  id: z.string(),
  campaignId: z.string(),
  referralId: z.string(),
  expiresAt: z.date(),
  enteredAt: z.date().nullish(),
  submittedAt: z.date().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteInviteCode extends z.infer<typeof InviteCodeModel> {
  campaign: CompleteCampaign
  referral: CompleteSupporter
}

/**
 * RelatedInviteCodeModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedInviteCodeModel: z.ZodSchema<CompleteInviteCode> = z.lazy(() => InviteCodeModel.extend({
  campaign: RelatedCampaignModel,
  referral: RelatedSupporterModel,
}))
