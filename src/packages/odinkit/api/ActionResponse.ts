import { redirect as _redirect } from "next/navigation";
import { Pagination } from "./dto/read";

export type SuccessResponse<T> = {
  data?: T;
  pagination?: Pagination;
  message?: string | string[];
};

export type ExtractSuccessResponse<T extends (...args: any) => any> = Awaited<
  ReturnType<T>
> extends ActionResponseType<infer U>
  ? U extends { data: infer D }
    ? D
    : U
  : never;

export interface ErrorResponse {
  message: string | string[];
  error: true;
}

export type ActionResponseType<T> = SuccessResponse<T> | ErrorResponse | void;

export class ActionResponse {
  public static success<T>({
    data,
    pagination,
    message = "Operação realizada com sucesso",
    redirect,
  }: SuccessResponse<T> & {
    redirect?: string;
  }): SuccessResponse<T> | void {
    if (redirect) _redirect(redirect);

    return { data, pagination, message };
  }

  public static error(message: unknown = "Operação falhou"): ErrorResponse {
    if (typeof message != "string" && !Array.isArray(message)) {
      message = "Operação falhou";
    }

    if (Array.isArray(message)) {
      message = message.join(", ");
    }

    return { message: message as string, error: true };
  }
}
