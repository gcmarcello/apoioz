import * as z from "zod"
import { CompleteAddress, RelatedAddressModel, CompleteZone, RelatedZoneModel, CompleteUserInfo, RelatedUserInfoModel, CompleteSupporter, RelatedSupporterModel } from "./index"

export const SectionModel = z.object({
  id: z.string(),
  number: z.number().int(),
  addressId: z.string().nullish(),
  zoneId: z.string(),
})

export interface CompleteSection extends z.infer<typeof SectionModel> {
  Address?: CompleteAddress | null
  Zone: CompleteZone
  UserInfo: CompleteUserInfo[]
  Supporter: CompleteSupporter[]
}

/**
 * RelatedSectionModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedSectionModel: z.ZodSchema<CompleteSection> = z.lazy(() => SectionModel.extend({
  Address: RelatedAddressModel.nullish(),
  Zone: RelatedZoneModel,
  UserInfo: RelatedUserInfoModel.array(),
  Supporter: RelatedSupporterModel.array(),
}))
