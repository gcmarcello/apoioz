import * as z from "zod"
import { CompleteUserInfo, RelatedUserInfoModel } from "./index"

export const PartyModel = z.object({
  id: z.string(),
  number: z.number().int(),
  name: z.string(),
  ideology: z.string(),
})

export interface CompleteParty extends z.infer<typeof PartyModel> {
  UserInfo: CompleteUserInfo[]
}

/**
 * RelatedPartyModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedPartyModel: z.ZodSchema<CompleteParty> = z.lazy(() => PartyModel.extend({
  UserInfo: RelatedUserInfoModel.array(),
}))
