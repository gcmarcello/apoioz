import { NextResponse } from "next/server";
import { login } from "../../../../resources/api/auth";
import { LoginType, SignUpType } from "../../../../common/types/authTypes";
import { ServerExceptionType } from "../../../../common/types/serverExceptionTypes";

export async function POST(request: Request, response: Response) {
  try {
    const body: LoginType = await request.json();
    const userLogin = await login(body);
    return NextResponse.json("Login", {
      headers: { "Set-Cookie": `token=${userLogin}; path=/` },
    });
  } catch (error) {
    return NextResponse.json(error, { status: (error as ServerExceptionType).status || 400 });
  }
}
