import { NextResponse } from "next/server";

import jwt from "jsonwebtoken";
import { headers } from "next/headers";
import { prisma } from "prisma/prisma";
import { getEnv } from "@/_shared/utils/settings";

export async function GET(request: Request, response: NextResponse) {
  try {
    const token = headers().get("Authorization");

    if (!token) throw "Token não encontrado.";

    const authenticated = jwt.verify(token, getEnv("JWT_KEY")!);

    if (typeof authenticated === "string") throw "Token inválido.";

    const user = await prisma.user.findFirst({
      where: { id: authenticated.id },
    });

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ message: error, status: 403 }, { status: 403 });
  }
}
