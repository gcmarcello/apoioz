import { isProd } from "../settings";

export class Logger {
  public static log(arg: unknown) {
    if (isProd) return;

    const currentFile = new Error().stack
      ?.split("\n")[2]
      .split("./")
      .pop()
      ?.split(":")[0];

    console.log({
      currentFile,
      arg,
    });
  }
}
