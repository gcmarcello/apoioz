import { NextResponse } from "next/server";
import { ServerExceptionType } from "../../../types/serverExceptionTypes";

export async function GET(request: Request) {
  try {
    return NextResponse.json("Hello");
  } catch (error) {
    return NextResponse.json(error, { status: (error as ServerExceptionType).status || 400 });
  }
}
