import * as z from "zod"
import { CompleteCity, RelatedCityModel, CompleteZone, RelatedZoneModel } from "./index"

export const City_To_ZoneModel = z.object({
  id: z.string(),
  cityId: z.string(),
  zoneId: z.string(),
})

export interface CompleteCity_To_Zone extends z.infer<typeof City_To_ZoneModel> {
  City: CompleteCity
  Zone: CompleteZone
}

/**
 * RelatedCity_To_ZoneModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedCity_To_ZoneModel: z.ZodSchema<CompleteCity_To_Zone> = z.lazy(() => City_To_ZoneModel.extend({
  City: RelatedCityModel,
  Zone: RelatedZoneModel,
}))
