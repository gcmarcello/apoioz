import * as z from "zod"
import { CompleteUser, RelatedUserModel, CompleteParty, RelatedPartyModel, CompleteState, RelatedStateModel, CompleteCity, RelatedCityModel, CompleteZone, RelatedZoneModel, CompleteSection, RelatedSectionModel } from "./index"

export const UserInfoModel = z.object({
  userId: z.string(),
  birthDate: z.date().nullish(),
  stateId: z.string().nullish(),
  partyId: z.string().nullish(),
  cityId: z.string().nullish(),
  zoneId: z.string().nullish(),
  sectionId: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteUserInfo extends z.infer<typeof UserInfoModel> {
  user: CompleteUser
  party?: CompleteParty | null
  State?: CompleteState | null
  City?: CompleteCity | null
  Zone?: CompleteZone | null
  Section?: CompleteSection | null
}

/**
 * RelatedUserInfoModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedUserInfoModel: z.ZodSchema<CompleteUserInfo> = z.lazy(() => UserInfoModel.extend({
  user: RelatedUserModel,
  party: RelatedPartyModel.nullish(),
  State: RelatedStateModel.nullish(),
  City: RelatedCityModel.nullish(),
  Zone: RelatedZoneModel.nullish(),
  Section: RelatedSectionModel.nullish(),
}))
