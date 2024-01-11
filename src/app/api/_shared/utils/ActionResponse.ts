import { getEnv, isDev } from "@/_shared/utils/settings";
import { Pagination } from "../dto/read";
import { isString } from "lodash";

export interface SuccessResponse<T> {
  data: T;
  pagination?: Pagination;
  message?: string | string[];
}

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

export type ActionResponseType<T> = SuccessResponse<T> | ErrorResponse;

export class ActionResponse {
  public static success<T>({
    data,
    pagination,
    message = "Operação realizada com sucesso",
  }: SuccessResponse<T>): SuccessResponse<T> {
    return { data, pagination, message };
  }

  public static error(message: unknown = "Operação falhou"): ErrorResponse {
    if (!isDev) {
      if (typeof message != "string" && !Array.isArray(message)) {
        message = "Operação falhou";
      }

      if (Array.isArray(message)) {
        message = message.join(", ");
      }
    }

    return {
      message: isString(message)
        ? message
        : (JSON.stringify(message) as string),
      error: true,
    };
  }
}
