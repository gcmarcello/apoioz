import { NextResponse } from "next/server";
import { signUp } from "../../../../services/api/auth";
import { SignUpType } from "../../../../types/authTypes";
import { ServerExceptionType } from "../../../../types/serverExceptionTypes";

export async function POST(request: Request, response: Response) {
  try {
    const body: SignUpType = await request.json();
    const newUser = await signUp(body);
    return NextResponse.json(newUser);
  } catch (error) {
    return NextResponse.json(error, { status: (error as ServerExceptionType).status || 400 });
  }
}
