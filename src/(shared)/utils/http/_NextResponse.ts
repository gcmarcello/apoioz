import { HttpStatusCode } from "axios";
import { NextResponse } from "next/server";

interface ResponseObject {
  messages?: string[];
  data?: unknown;
  status?: keyof typeof HttpStatusCode | HttpStatusCode;
}

export class _NextResponse {
  static raw({ messages, data, status }: ResponseObject) {
    const isStatusNumeric = typeof status === "number";

    const statusCode = status ? (isStatusNumeric ? status : HttpStatusCode[status]) : 200;

    const response = {
      messages,
      data,
      statusCode,
    };

    return response;
  }

  static json(response: ResponseObject) {
    const _response = this.raw(response);
    return NextResponse.json(_response, { status: _response.statusCode });
  }

  static next() {
    return NextResponse.next();
  }
}
