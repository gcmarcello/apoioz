import { NextResponse } from "next/server";

import jwt from "jsonwebtoken";
import { headers } from "next/headers";
import { findUser } from "../../user/service";

export async function GET(request: Request, response: NextResponse) {
  try {
    const token = headers().get("Authorization");
    if (!token) throw "Token não encontrado.";

    const authenticated = jwt.verify(token, process.env.JWT_KEY!);

    return NextResponse.json(await findUser(authenticated));
  } catch (error) {
    return NextResponse.json({ message: error, status: 403 }, { status: 403 });
  }
}
