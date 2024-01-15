export interface MiddlewareArguments<T = any, P = any> {
  request: T;
  additionalArguments?: P;
}
