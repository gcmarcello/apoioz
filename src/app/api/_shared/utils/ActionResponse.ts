import { Pagination } from "../dto/read";

export interface SuccessResponse<T> {
  data: T;
  pagination?: Pagination;
  message?: string | string[];
}

export interface ErrorResponse {
  message: string | string[];
  error: true;
}

export type ActionResponseType<T> = SuccessResponse<T> | ErrorResponse;

export class ActionResponse {
  public static success<T>({
    data,
    message = "Operação realizada com sucesso",
  }: SuccessResponse<T>): SuccessResponse<T> {
    return { data, message };
  }

  public static error(message: string | string[] = "Operação falhou"): ErrorResponse {
    if (typeof message != "string" && !Array.isArray(message)) {
      message = "Operação falhou";
    }

    if (Array.isArray(message)) {
      message = message.join(", ");
    }

    return { message, error: true };
  }
}
