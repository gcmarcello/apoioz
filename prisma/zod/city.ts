import * as z from "zod"
import { CompleteAddress, RelatedAddressModel, CompleteState, RelatedStateModel, CompleteCity_To_Zone, RelatedCity_To_ZoneModel, CompleteUserInfo, RelatedUserInfoModel, CompleteCampaign, RelatedCampaignModel, CompleteNeighborhood, RelatedNeighborhoodModel } from "./index"

export const CityModel = z.object({
  id: z.string(),
  name: z.string(),
  stateId: z.string(),
})

export interface CompleteCity extends z.infer<typeof CityModel> {
  Address: CompleteAddress[]
  State: CompleteState
  City_To_Zone: CompleteCity_To_Zone[]
  UserInfo: CompleteUserInfo[]
  Campaign: CompleteCampaign[]
  Neighborhood: CompleteNeighborhood[]
}

/**
 * RelatedCityModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedCityModel: z.ZodSchema<CompleteCity> = z.lazy(() => CityModel.extend({
  Address: RelatedAddressModel.array(),
  State: RelatedStateModel,
  City_To_Zone: RelatedCity_To_ZoneModel.array(),
  UserInfo: RelatedUserInfoModel.array(),
  Campaign: RelatedCampaignModel.array(),
  Neighborhood: RelatedNeighborhoodModel.array(),
}))
