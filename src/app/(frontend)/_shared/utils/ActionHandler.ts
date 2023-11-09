import { ResponseObject } from "@/app/api/_shared/utils/ActionResponse";

type ActionFunction<T> = (...args: any[]) => Promise<ResponseObject<T>>;

export function ActionHandler<T>(action: ActionFunction<T>, ...args: any[]): Promise<T> {
  return action(...args).then((res: ResponseObject<T>) => {
    if (res.error) {
      throw res.message?.toString() || "An error occurred";
    }
    if (res.data === undefined) {
      throw "No data returned";
    }
    return res.data;
  });
}
