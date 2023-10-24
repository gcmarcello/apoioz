import "reflect-metadata";
import { ROLES_METADATA } from "../constants/roles_metadata";

export function Roles(...middlewares: string[]) {
  return (target: object, propertyKey: string | symbol): void => {
    Reflect.defineMetadata(ROLES_METADATA, middlewares, target, propertyKey);
  };
}
