import { NextResponse } from "next/server";
import { signUp } from "../../../../services/api/auth";
import { SignUpType } from "../../../../types/authTypes";

export async function POST(request: Request, response: Response) {
  try {
    const body: SignUpType = await request.json();
    await signUp(body);
    return NextResponse.json({ body });
  } catch (error) {
    return NextResponse.json(error, { status: 400 });
  }
}
