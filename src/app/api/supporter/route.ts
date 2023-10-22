import { NextRequest, NextResponse } from "next/server";
import { createUser } from "@/backend/resources/users/users.service";
import { ServerExceptionType } from "@/(shared)/types/serverExceptionTypes";
import { UserType } from "@/(shared)/types/userTypes";

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
