import {
  MiddlewareIdentifiers,
  MiddlewarePayload,
} from "@/next_decorators/decorators/UseMiddlewares";
import { getMetadata } from "@/next_decorators/utils";
import "reflect-metadata";

const VALIDATOR_METADATA = Symbol("validate");

export function ValidationSchema(type: object) {
  return (target: object, propertyKey: string) => {
    Reflect.defineMetadata(VALIDATOR_METADATA, type, target, propertyKey);
  };
}

export async function ValidatorMiddleware(
  payload: MiddlewarePayload,
  identifiers: MiddlewareIdentifiers
) {
  const schema = getMetadata(VALIDATOR_METADATA, identifiers);

  if (!schema) {
    console.error("No schema provided for validation.");
    return false;
  }

  const { success, error } = schema.safeParse(payload);

  if (!success) {
    console.error(error);
    return false;
  }
}
