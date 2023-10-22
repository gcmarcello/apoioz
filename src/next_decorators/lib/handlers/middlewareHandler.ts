import "reflect-metadata";
import { createInstance, isMethod } from "../utils";
import { PATH_METADATA } from "../constants/path_metadata";
import { NextRequest } from "next/server";

export function middlewareHandler(
  middlewareClass: new () => any
): (request: NextRequest) => any | undefined {
  return (request: NextRequest) => {
    const instance = createInstance(middlewareClass);
    return findMatchingMiddleware(instance, request);
  };
}

function findMatchingMiddleware(instance: any, request: NextRequest): any | undefined {
  for (const methodName of Object.getOwnPropertyNames(Object.getPrototypeOf(instance))) {
    if (!isMethod(instance, methodName)) continue;

    const path = Reflect.getMetadata(PATH_METADATA, instance, methodName);
    if (!path) continue;

    if (request.nextUrl.pathname.startsWith(path)) {
      return instance[methodName](request);
    }
  }
}
