import "reflect-metadata";

const VALIDATOR_METADATA = Symbol("validate");

export function ValidationSchema(type: object) {
  return (target: object, propertyKey: string) => {
    Reflect.defineMetadata(VALIDATOR_METADATA, type, target, propertyKey);
  };
}

export async function ValidatorMiddleware(
  payload: any,
  target: any,
  propertyKey?: string
) {
  try {
    const schema = Reflect.getMetadata(VALIDATOR_METADATA, target, propertyKey || "");

    if (!schema) {
      console.error("No schema provided for validation.");
      return false;
    }

    const { success, error } = schema.safeParse(payload);

    if (!success) {
      console.error(error);
      return false;
    }
  } catch (err) {
    console.log(err);
  }
}
