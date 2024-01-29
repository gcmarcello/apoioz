export interface MiddlewareArguments<R = any, A = any> {
  request: R;
  additionalArguments?: A;
}

export async function UseMiddlewares<
  R extends object = {},
  A extends object = {},
>(
  {
    request,
    additionalArguments,
  }: {
    request?: R;
    additionalArguments?: A;
  } = {
    request: {} as R,
    additionalArguments: {} as A,
  }
) {
  return {
    request,
    additionalArguments,
  };
}

export type MiddlewareReturnType<M extends (...args: any) => any> = Awaited<
  ReturnType<M>
>;
