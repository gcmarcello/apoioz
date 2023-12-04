import * as z from "zod"
import { CompleteCity, RelatedCityModel } from "./index"

// Helper schema for JSON fields
type Literal = boolean | number | string
type Json = Literal | { [key: string]: Json } | Json[]
const literalSchema = z.union([z.string(), z.number(), z.boolean()])
const jsonSchema: z.ZodSchema<Json> = z.lazy(() => z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]))

export const NeighborhoodModel = z.object({
  id: z.string(),
  name: z.string(),
  cityId: z.string(),
  geoJSON: jsonSchema,
})

export interface CompleteNeighborhood extends z.infer<typeof NeighborhoodModel> {
  City: CompleteCity
}

/**
 * RelatedNeighborhoodModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedNeighborhoodModel: z.ZodSchema<CompleteNeighborhood> = z.lazy(() => NeighborhoodModel.extend({
  City: RelatedCityModel,
}))
