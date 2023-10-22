export function bindToPayload(payload: any, bindObject: unknown) {
  payload["bind"] = bindObject;
}
