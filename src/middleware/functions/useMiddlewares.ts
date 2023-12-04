export async function UseMiddlewares<R, A>(request?: R, additionalArguments?: A) {
  return {
    request: request ?? {},
    additionalArguments: additionalArguments ?? {},
  };
}
