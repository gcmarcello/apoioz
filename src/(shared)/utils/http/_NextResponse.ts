import { HttpStatusCode } from "axios";
import { NextResponse } from "next/server";

export interface ResponseObject<T = unknown> {
  message?: string[] | string;
  data?: T;
  status?: keyof typeof HttpStatusCode | HttpStatusCode;
}

export type Error = ResponseObject;

export class _NextResponse {
  static raw<T>({ message, data, status }: ResponseObject<T>, isError?: boolean) {
    const isStatusNumeric = typeof status === "number";

    const statusCode = status
      ? isStatusNumeric
        ? status
        : HttpStatusCode[status]
      : isError
      ? 400
      : 200;

    const response = {
      message,
      data,
      statusCode,
    };

    return response;
  }

  static json(response: ResponseObject) {
    const _response = this.raw(response);
    return NextResponse.json(_response, { status: _response.statusCode });
  }

  static rawError(response: Omit<ResponseObject, "data">) {
    return this.raw(response);
  }

  static jsonError(response: Omit<ResponseObject, "data">) {
    const _response = this.raw(response);
    return NextResponse.json(_response, { status: _response.statusCode });
  }

  static next() {
    return NextResponse.next();
  }
}
