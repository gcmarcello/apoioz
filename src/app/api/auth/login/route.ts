import { NextResponse } from "next/server";
import { login, signUp } from "../../../../services/api/auth";
import { LoginType, SignUpType } from "../../../../types/authTypes";
import { ServerExceptionType } from "../../../../types/serverExceptionTypes";

export async function POST(request: Request, response: Response) {
  try {
    const body: LoginType = await request.json();
    const userLogin = await login(body);
    return NextResponse.json({ token: userLogin });
  } catch (error) {
    return NextResponse.json(error, { status: (error as ServerExceptionType).status || 400 });
  }
}
