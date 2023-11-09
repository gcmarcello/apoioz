export interface ResponseObject<T = unknown> {
  message?: string[] | string;
  data?: T;
  error?: boolean;
}

export type Error = ResponseObject;

export class ActionResponse<T> {
  constructor({ message, data, error = false }: ResponseObject<T>) {
    return { message, data, error };
  }
}
