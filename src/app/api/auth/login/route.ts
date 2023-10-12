import { NextRequest, NextResponse } from "next/server";
import { login } from "../../../../resources/api/services/auth";
import { LoginType, SignUpType } from "../../../../common/types/authTypes";
import { ServerExceptionType } from "../../../../common/types/serverExceptionTypes";

export async function POST(request: NextRequest, response: NextResponse) {
  try {
    const body: LoginType = await request.json();
    const userLogin = await login(body);

    if (userLogin) {
      response.cookies.set("token", userLogin!);
      return NextResponse.json(userLogin);
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(error, {
      status: (error as ServerExceptionType).status || 400,
    });
  }
}
