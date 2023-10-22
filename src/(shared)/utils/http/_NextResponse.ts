import { NextResponse } from "next/server";
import { HttpStatus } from "../../types/http/HttpStatus";

interface ResponseObject {
  messages?: string[];
  data?: unknown;
  status?: keyof typeof HttpStatus | HttpStatus;
}

export class _NextResponse {
  static raw({ messages, data, status }: ResponseObject) {
    const isStatusNumeric = typeof status === "number";

    const statusCode = status
      ? isStatusNumeric
        ? status
        : HttpStatus[status]
      : 200;

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
