import { NextResponse } from "next/server";
import { UserType } from "../../../common/types/userTypes";
import { ServerExceptionType } from "../../../common/types/serverExceptionTypes";
import { createUser } from "../../../services/api/user";

export async function POST(request: Request) {
  try {
    const body: UserType = await request.json();
    const user = await createUser(body);
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(error, { status: (error as ServerExceptionType).status || 400 });
  }
}
