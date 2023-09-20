import { NextResponse } from "next/server";

import jwt from "jsonwebtoken";
import { findUser } from "../../../../resources/api/user";

export async function POST(request: any) {
  try {
    const body = await request.json();
    if (!body || !process.env.JWT_KEY) throw "Erro ao realizar validacao";
    const token = jwt.verify(body.value, process.env.JWT_KEY);
    return NextResponse.json(await findUser(token));
  } catch (error) {
    return NextResponse.json({ message: "Você não tem autorização para fazer isto.", status: 403 }, { status: 403 });
  }
}
