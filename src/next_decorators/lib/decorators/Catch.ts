import { isPromise, isFunction } from "../utils";

export type Handler = (err: any, context: any, ...args: any) => any;

const Factory = (
  ErrorClassConstructor: Function | Handler,
  handler?: Handler
) => {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    const { value } = descriptor;

    if (!handler) {
      handler = ErrorClassConstructor as Handler;
      ErrorClassConstructor = undefined as unknown as any;
    }

    descriptor.value = async function (...args: any[]) {
      try {
        const response = value.apply(this, args);
        return isPromise(response) ? await response : Promise.resolve(response);
      } catch (error) {
        if (
          isFunction(handler) &&
          (ErrorClassConstructor === undefined ||
            error instanceof ErrorClassConstructor)
        ) {
          return handler.call(null, error, this, ...args);
        }
        throw error;
      }
    };

    return descriptor;
  };
};

export const ThenCatch = (ErrorClassConstructor: Function, handler: Handler) =>
  Factory(ErrorClassConstructor, handler);

export const Catch = (handler: Handler) => Factory(handler);
