import * as z from "zod"
import { CompleteCity, RelatedCityModel, CompleteZone, RelatedZoneModel, CompleteUserInfo, RelatedUserInfoModel, CompleteCampaign, RelatedCampaignModel } from "./index"

export const StateModel = z.object({
  id: z.string(),
  code: z.string(),
  name: z.string(),
})

export interface CompleteState extends z.infer<typeof StateModel> {
  City: CompleteCity[]
  Zone: CompleteZone[]
  UserInfo: CompleteUserInfo[]
  Campaign: CompleteCampaign[]
}

/**
 * RelatedStateModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedStateModel: z.ZodSchema<CompleteState> = z.lazy(() => StateModel.extend({
  City: RelatedCityModel.array(),
  Zone: RelatedZoneModel.array(),
  UserInfo: RelatedUserInfoModel.array(),
  Campaign: RelatedCampaignModel.array(),
}))
