export interface MiddlewareArguments<R = any, A = any> {
  request: R;
  additionalArguments?: A;
}

export async function UseMiddlewares<R = {}, A = {}>(
  {
    request,
    additionalArguments,
  }: {
    request: R;
    additionalArguments?: A;
  } = {
    request: {} as R,
    additionalArguments: {} as A,
  }
) {
  return {
    request: request as R,
    additionalArguments: additionalArguments as A,
  };
}

export type MiddlewareReturnType<M extends (...args: any) => any> = Awaited<
  ReturnType<M>
>;
