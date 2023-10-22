import "reflect-metadata";
import { isMethod, createInstance } from "../utils";

export interface MiddlewareImplementation {
  implementation(payload: unknown, target: any, propertyKey?: string): Promise<unknown>;
}

export function UseMiddlewares(
  ...GuardClasses: Array<new () => MiddlewareImplementation>
) {
  return function (
    target: any,
    propertyKey?: string,
    descriptor?: PropertyDescriptor
  ): any {
    if (propertyKey) {
      if (descriptor && descriptor.value) {
        descriptor.value = wrapWithGuard(
          descriptor.value,
          GuardClasses,
          target,
          propertyKey
        );
        return descriptor;
      }
      return;
    }

    wrapPrototypeMethods(target, GuardClasses);
  };
}

function wrapWithGuard(
  originalMethod: any,
  GuardClasses: Array<new () => MiddlewareImplementation>,
  target: any,
  propertyKey?: string
) {
  return async function (payload: unknown): Promise<unknown> {
    for (const GuardClass of GuardClasses) {
      const guardInstance = createInstance(GuardClass);
      await guardInstance.implementation(payload, target, propertyKey);
    }

    return await originalMethod.call(this as any, payload);
  };
}

function wrapPrototypeMethods(
  target: any,
  GuardClasses: Array<new () => MiddlewareImplementation>
) {
  const prototype = target.prototype;

  Object.getOwnPropertyNames(prototype).forEach((method) => {
    if (!isMethod(prototype, method)) return;

    const originalMethod = prototype[method];
    prototype[method] = wrapWithGuard(originalMethod, GuardClasses, target);
  });
}
