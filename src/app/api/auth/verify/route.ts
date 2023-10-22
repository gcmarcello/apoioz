import { NextRequest, NextResponse } from "next/server";

import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies, headers } from "next/headers";
import { findUser } from "@/backend/resources/users/users.service";

export async function GET(request: Request, response: NextResponse) {
  try {
    const token = headers().get("Authorization");
    if (!token) throw "Token não encontrado.";

    const authenticated = jwt.verify(token, process.env.JWT_KEY!);

    if (typeof authenticated === "string") throw authenticated;

    return NextResponse.json(await findUser(authenticated));
  } catch (error) {
    return NextResponse.json({ message: error, status: 403 }, { status: 403 });
  }
}
