import * as z from "zod"
import { CompleteZone, RelatedZoneModel } from "./index"

// Helper schema for JSON fields
type Literal = boolean | number | string
type Json = Literal | { [key: string]: Json } | Json[]
const literalSchema = z.union([z.string(), z.number(), z.boolean()])
const jsonSchema: z.ZodSchema<Json> = z.lazy(() => z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]))

export const ZoneGeoJSONModel = z.object({
  zoneId: z.string(),
  geoJSON: jsonSchema,
})

export interface CompleteZoneGeoJSON extends z.infer<typeof ZoneGeoJSONModel> {
  Zone: CompleteZone
}

/**
 * RelatedZoneGeoJSONModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedZoneGeoJSONModel: z.ZodSchema<CompleteZoneGeoJSON> = z.lazy(() => ZoneGeoJSONModel.extend({
  Zone: RelatedZoneModel,
}))
