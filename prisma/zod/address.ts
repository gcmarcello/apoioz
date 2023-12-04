import * as z from "zod"
import { CompleteCity, RelatedCityModel, CompleteSection, RelatedSectionModel } from "./index"

export const AddressModel = z.object({
  id: z.string(),
  lat: z.string().nullish(),
  lng: z.string().nullish(),
  address: z.string().nullish(),
  location: z.string().nullish(),
  neighborhood: z.string().nullish(),
  zipcode: z.string().nullish(),
  cityId: z.string(),
})

export interface CompleteAddress extends z.infer<typeof AddressModel> {
  City: CompleteCity
  Section: CompleteSection[]
}

/**
 * RelatedAddressModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedAddressModel: z.ZodSchema<CompleteAddress> = z.lazy(() => AddressModel.extend({
  City: RelatedCityModel,
  Section: RelatedSectionModel.array(),
}))
