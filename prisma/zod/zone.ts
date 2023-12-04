import * as z from "zod"
import { CompleteCity_To_Zone, RelatedCity_To_ZoneModel, CompleteSection, RelatedSectionModel, CompleteState, RelatedStateModel, CompleteUserInfo, RelatedUserInfoModel, CompleteSupporter, RelatedSupporterModel, CompleteZoneGeoJSON, RelatedZoneGeoJSONModel } from "./index"

export const ZoneModel = z.object({
  id: z.string(),
  number: z.number().int(),
  stateId: z.string(),
})

export interface CompleteZone extends z.infer<typeof ZoneModel> {
  City_To_Zone: CompleteCity_To_Zone[]
  Section: CompleteSection[]
  State: CompleteState
  UserInfo: CompleteUserInfo[]
  Supporter: CompleteSupporter[]
  ZoneGeoJSON?: CompleteZoneGeoJSON | null
}

/**
 * RelatedZoneModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedZoneModel: z.ZodSchema<CompleteZone> = z.lazy(() => ZoneModel.extend({
  City_To_Zone: RelatedCity_To_ZoneModel.array(),
  Section: RelatedSectionModel.array(),
  State: RelatedStateModel,
  UserInfo: RelatedUserInfoModel.array(),
  Supporter: RelatedSupporterModel.array(),
  ZoneGeoJSON: RelatedZoneGeoJSONModel.nullish(),
}))
