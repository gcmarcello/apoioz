import "reflect-metadata";
import { NextRequest } from "next/server";

export const PATH_METADATA = Symbol("pathMetadata");

export function Path(path: string) {
  return (target: object, propertyKey: string | symbol): void => {
    Reflect.defineMetadata(PATH_METADATA, path, target, propertyKey);
  };
}

function isMethod(instance: any, key: string): boolean {
  return key !== "constructor" && typeof instance[key] === "function";
}

function createInstance<T>(_class: new (...args: any[]) => T): T {
  return new _class() as any;
}

export function middlewareHandler(
  middlewareClass: new () => any
): (request: NextRequest) => any {
  return (request: NextRequest) => {
    const instance = createInstance(middlewareClass);
    return findMatchingMiddleware(instance, request);
  };
}

function findMatchingMiddleware(instance: any, request: NextRequest): any {
  for (const methodName of Object.getOwnPropertyNames(Object.getPrototypeOf(instance))) {
    if (!isMethod(instance, methodName)) continue;

    const path = Reflect.getMetadata(PATH_METADATA, instance, methodName);
    if (!path) continue;

    if (request.nextUrl.pathname.startsWith(path)) {
      return instance[methodName](request);
    }
  }
}
