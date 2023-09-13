import { NextResponse } from "next/server";
import { ServerExceptionType } from "../types/serverExceptionTypes";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";

export async function fetchAuth(roles: string[], cookie?: RequestCookie) {
  try {
    const data = await fetch("http://localhost:3000/api/auth/verify", {
      method: "POST",
      body: JSON.stringify(cookie),
    });
    const response = await data.json();
    if (!roles.includes(response.role) || response.role !== "admin")
      return NextResponse.json({ message: "Você não tem permissão para fazer isto.", status: 403 }, { status: 403 });
    else return NextResponse.next();
  } catch (error) {
    return NextResponse.json(error, { status: (error as ServerExceptionType).status || 400 });
  }
}
