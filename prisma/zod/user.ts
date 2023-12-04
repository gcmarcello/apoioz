import * as z from "zod"
import { CompleteUserInfo, RelatedUserInfoModel, CompleteCampaign, RelatedCampaignModel, CompleteSupporter, RelatedSupporterModel, CompletePasswordRecovery, RelatedPasswordRecoveryModel } from "./index"

export const UserModel = z.object({
  id: z.string(),
  email: z.string(),
  phone: z.string().nullish(),
  name: z.string().nullish(),
  password: z.string().nullish(),
  role: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteUser extends z.infer<typeof UserModel> {
  info?: CompleteUserInfo | null
  campaign: CompleteCampaign[]
  supporter: CompleteSupporter[]
  PasswordRecovery: CompletePasswordRecovery[]
}

/**
 * RelatedUserModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedUserModel: z.ZodSchema<CompleteUser> = z.lazy(() => UserModel.extend({
  info: RelatedUserInfoModel.nullish(),
  campaign: RelatedCampaignModel.array(),
  supporter: RelatedSupporterModel.array(),
  PasswordRecovery: RelatedPasswordRecoveryModel.array(),
}))
