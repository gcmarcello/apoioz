import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { login } from "@/backend/resources/auth/auth.service";
import { LoginType } from "@/shared/types/authTypes";
import { ServerExceptionType } from "@/shared/types/serverExceptionTypes";

export async function POST(request: NextRequest, response: NextResponse) {
  try {
    const body: LoginType = await request.json();
    const userLogin = await login(body);

    if (userLogin) {
      return cookies().set("token", userLogin);
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(error, {
      status: (error as ServerExceptionType).status || 400,
    });
  }
}
