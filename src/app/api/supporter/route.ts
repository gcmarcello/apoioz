import { NextRequest, NextResponse } from "next/server";
import { UserType } from "../../../common/types/userTypes";
import { ServerExceptionType } from "../../../common/types/serverExceptionTypes";
import { createUser } from "../../../resources/api/services/user";
import { listSupporters } from "../../../resources/api/services/campaign";
import { cookies, headers } from "next/headers";

export async function POST(request: Request) {
  try {
    const body: UserType = await request.json();
    const user = await createUser(body);
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(error, {
      status: (error as ServerExceptionType).status || 400,
    });
  }
}
