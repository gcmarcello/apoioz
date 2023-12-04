import * as z from "zod"
import { CompleteUser, RelatedUserModel } from "./index"

export const PasswordRecoveryModel = z.object({
  id: z.string(),
  userId: z.string(),
  createdAt: z.date(),
  expiresAt: z.date(),
  updatedAt: z.date(),
})

export interface CompletePasswordRecovery extends z.infer<typeof PasswordRecoveryModel> {
  user: CompleteUser
}

/**
 * RelatedPasswordRecoveryModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedPasswordRecoveryModel: z.ZodSchema<CompletePasswordRecovery> = z.lazy(() => PasswordRecoveryModel.extend({
  user: RelatedUserModel,
}))
