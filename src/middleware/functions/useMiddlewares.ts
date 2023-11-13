export async function UseMiddlewares(request: any = {}, additionalArguments: any = {}) {
  return {
    request,
    additionalArguments,
  };
}
