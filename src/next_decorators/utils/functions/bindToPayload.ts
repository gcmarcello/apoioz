export type Bind<A, B> = A & { bind?: B };

export function bindToPayload(payload: any, bindObject: unknown) {
  payload["bind"] = bindObject;
}
