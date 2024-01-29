"use server";
import { ZodObject, ZodRawShape, ZodTypeAny, ZodEffects } from "zod";
import { MiddlewareArguments } from "./useMiddlewares";
import { FieldValues } from "react-hook-form";

export async function ValidatorMiddleware<R, A, Fields extends FieldValues>({
  additionalArguments,
  schema,
  request,
}: MiddlewareArguments<R, A> & {
  schema: ZodObject<ZodRawShape, "strip", ZodTypeAny, Fields, Fields>;
}) {
  if (!schema) throw "Missing schema for validation";

  const { success, error } = schema.safeParse(request) as any;

  if (!success) {
    throw error;
  }

  return {
    request,
    additionalArguments,
  };
}
