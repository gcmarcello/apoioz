import { NextRequest, NextResponse } from "next/server";
import { ServerExceptionType } from "../types/serverExceptionTypes";

export async function fetchAuth(roles: string[], request: NextRequest) {
  try {
    const data = await fetch("http://localhost:3000/api/auth/verify", {
      method: "POST",
      body: JSON.stringify(request.cookies.get("token")),
    });
    const response = await data.json();

    const isAuth = [...roles, "admin"].includes(response.role);

    if (request.nextUrl.pathname.startsWith("/login") && !isAuth) {
      return NextResponse.next();
    }

    if (request.nextUrl.pathname.startsWith("/login") && isAuth) {
      return NextResponse.redirect(new URL("/panel", request.url));
    }

    if (isAuth) {
      const newHeaders = new Headers(request.headers);
      newHeaders.set("userId", response.id);
      return NextResponse.next({ headers: newHeaders });
    }

    if (request.nextUrl.pathname.startsWith("/api/")) {
      return NextResponse.json({ message: "Você não tem permissão para fazer isto.", status: 403 }, { status: 403 });
    }

    return NextResponse.redirect(new URL("/login", request.url));
  } catch (error) {
    return NextResponse.json(error, { status: (error as ServerExceptionType).status || 400 });
  }
}
