import "reflect-metadata";
import { isMethod, createInstance } from "../utils";
import { MIDDLEWARE_METADATA } from "../constants/middleware_metadata";

export interface MiddlewarePayload<D = any, B = any> {
  data: D;
  bind: B;
}

export interface MiddlewareIdentifiers {
  target: any;
  propertyKey?: string;
}

type MiddlewareImplementation<T, P> = (
  payload: MiddlewarePayload,
  identifiers: MiddlewareIdentifiers
) => Promise<unknown>;

export function UseMiddlewares(...middlewares: MiddlewareImplementation<any, any>[]) {
  return function (
    target: any,

    propertyKey?: string,

    descriptor?: PropertyDescriptor
  ): any {
    if (propertyKey) {
      if (descriptor && descriptor.value) {
        Reflect.defineMetadata(MIDDLEWARE_METADATA, middlewares, target, propertyKey);

        descriptor.value = wrapWithMiddlewares(
          descriptor.value,
          middlewares,
          target,
          propertyKey
        );
        return descriptor;
      }
      return;
    }

    wrapPrototypeMethods(target, middlewares);
  };
}

function wrapWithMiddlewares(
  originalMethod: any,

  middlewares: MiddlewareImplementation<any, any>[],

  target: any,

  propertyKey?: string
) {
  return async function (data: unknown, bind: unknown = {}): Promise<unknown> {
    for (const middleware of middlewares) {
      await middleware(
        {
          data,
          bind,
        },
        {
          target,
          propertyKey,
        }
      );
    }

    // @ts-ignore: Tipar o 'this' abaixo é difícil.
    return await originalMethod.call(this as any, payload, bind);
  };
}

function wrapPrototypeMethods(
  target: any,
  middlewares: MiddlewareImplementation<any, any>[]
) {
  const prototype = target.prototype;

  Object.getOwnPropertyNames(prototype).forEach((propertyKey) => {
    if (!isMethod(prototype, propertyKey)) return;

    const originalMethod = prototype[propertyKey];

    const existingMiddlewares = Reflect.getMetadata(
      MIDDLEWARE_METADATA,
      target,
      propertyKey
    );

    const combinedMiddlewares = existingMiddlewares
      ? [...existingMiddlewares, ...middlewares]
      : middlewares;

    prototype[propertyKey] = wrapWithMiddlewares(
      originalMethod,
      combinedMiddlewares,
      target,
      propertyKey
    );

    Reflect.defineMetadata(MIDDLEWARE_METADATA, combinedMiddlewares, target, propertyKey);
  });
}
