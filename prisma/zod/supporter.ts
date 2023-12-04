import * as z from "zod"
import { CompleteCampaign, RelatedCampaignModel, CompleteUser, RelatedUserModel, CompleteSupporterGroupMembership, RelatedSupporterGroupMembershipModel, CompleteEvent, RelatedEventModel, CompleteSection, RelatedSectionModel, CompleteZone, RelatedZoneModel, CompleteInviteCode, RelatedInviteCodeModel, CompletePollAnswer, RelatedPollAnswerModel } from "./index"

export const SupporterModel = z.object({
  id: z.string(),
  campaignId: z.string(),
  userId: z.string(),
  referralId: z.string().nullish(),
  level: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  sectionId: z.string().nullish(),
  zoneId: z.string().nullish(),
})

export interface CompleteSupporter extends z.infer<typeof SupporterModel> {
  campaign?: CompleteCampaign | null
  user: CompleteUser
  referral?: CompleteSupporter | null
  referred: CompleteSupporter[]
  supporterGroupsMemberships: CompleteSupporterGroupMembership[]
  Event: CompleteEvent[]
  Section?: CompleteSection | null
  Zone?: CompleteZone | null
  InviteCode: CompleteInviteCode[]
  PollAnswer: CompletePollAnswer[]
}

/**
 * RelatedSupporterModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedSupporterModel: z.ZodSchema<CompleteSupporter> = z.lazy(() => SupporterModel.extend({
  campaign: RelatedCampaignModel.nullish(),
  user: RelatedUserModel,
  referral: RelatedSupporterModel.nullish(),
  referred: RelatedSupporterModel.array(),
  supporterGroupsMemberships: RelatedSupporterGroupMembershipModel.array(),
  Event: RelatedEventModel.array(),
  Section: RelatedSectionModel.nullish(),
  Zone: RelatedZoneModel.nullish(),
  InviteCode: RelatedInviteCodeModel.array(),
  PollAnswer: RelatedPollAnswerModel.array(),
}))
