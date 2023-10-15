import { createNewUser } from "@/backend/resources/users/users.service";
import { SignUpType } from "@/shared/types/authTypes";
import { ServerExceptionType } from "@/shared/types/serverExceptionTypes";
import { NextResponse } from "next/server";

export async function POST(request: Request, response: Response) {
  try {
    const body: SignUpType = await request.json();
    const newUser = await createNewUser(body);
    return NextResponse.json(newUser);
  } catch (error) {
    return NextResponse.json(error, {
      status: (error as ServerExceptionType).status || 400,
    });
  }
}
