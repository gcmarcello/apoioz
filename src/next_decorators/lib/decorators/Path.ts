import { PATH_METADATA } from "../constants/path_metadata";
import "reflect-metadata";

export function Path(path: string) {
  return (target: object, propertyKey: string | symbol): void => {
    Reflect.defineMetadata(PATH_METADATA, path, target, propertyKey);
  };
}
