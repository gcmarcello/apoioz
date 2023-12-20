export async function UseMiddlewares<R extends object = {}, A extends object = {}>(
  request: R = {} as R,
  additionalArguments: A = {} as A
) {
  return {
    request,
    additionalArguments,
  };
}
