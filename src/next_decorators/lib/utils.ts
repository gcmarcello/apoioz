export function isMethod(instance: any, key: string): boolean {
    return key !== "constructor" && typeof instance[key] === "function";
}

export function bindMethodToInstance<T>(instance: any, key: string): T {
    return instance[key].bind(instance) as T;
}

export function createInstance<T>(_class: new (...args: any[]) => T): T {
    return new _class() as any;
}

export function isPromise(object: any): object is Promise<any> {
    return object && Promise.resolve(object) === object;
  }
  
export  function isFunction(func: any): func is Function {
    return typeof func === "function" || func instanceof Function;
}
  
export function bindToPayload(payload: any, bindObject: unknown) {
  payload["bind"] = bindObject;
}
  