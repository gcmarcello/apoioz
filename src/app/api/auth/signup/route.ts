import { NextResponse } from "next/server";
import { SignUpType } from "../../../../common/types/authTypes";
import { ServerExceptionType } from "../../../../common/types/serverExceptionTypes";
import { createUser } from "../../../../services/api/user";

export async function POST(request: Request, response: Response) {
  try {
    const body: SignUpType = await request.json();
    const newUser = await createUser(body);
    return NextResponse.json(newUser);
  } catch (error) {
    return NextResponse.json(error, { status: (error as ServerExceptionType).status || 400 });
  }
}
