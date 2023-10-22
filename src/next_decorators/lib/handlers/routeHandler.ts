import { createInstance, isMethod, bindMethodToInstance } from "../utils";

export interface IRequestHandler {
    (request: Request): Promise<NextResponse>;
}

export function routeHandler<T>(routeClass: new (...args: any[]) => T): T {
    const instance = createInstance(routeClass);
    return mapInstanceMethodsToHandlers(instance);
}

function mapInstanceMethodsToHandlers<T>(instance: T): T {
    const exportedHandlers: { [key in keyof T]?: IRequestHandler } = {};

    for (const key of Object.getOwnPropertyNames(Object.getPrototypeOf(instance))) {
        if (isMethod(instance, key)) {
            exportedHandlers[key as keyof T] = bindMethodToInstance(instance, key);
        }
    }

    return exportedHandlers as T;
}


