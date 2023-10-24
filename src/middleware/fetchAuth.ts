import { ServerExceptionType } from "@/(shared)/types/serverExceptionTypes";
import { Logger } from "@/(shared)/utils/logger/Logger";
import { NextRequest, NextResponse } from "next/server";

export async function fetchAuth(roles: string[], request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;

    let isAuth = null;
    if (token) {
      const data = await fetch(`${request.nextUrl.origin}/api/auth/verify`, {
        headers: { Authorization: token },
      }).then((res) => res.json());
      isAuth = [...roles, "admin"].includes(data.role);
    }

    if (request.nextUrl.pathname.startsWith("/login") && !isAuth) {
      return;
    }

    if (request.nextUrl.pathname.startsWith("/registrar") && !isAuth) {
      return NextResponse.next();
    }

    if (request.nextUrl.pathname.startsWith("/registrar") && isAuth) {
      return NextResponse.redirect(new URL("/painel", request.url));
    }

    if (request.nextUrl.pathname.startsWith("/login") && isAuth) {
      return NextResponse.redirect(new URL("/painel", request.url));
    }

    if (isAuth) {
      const newHeaders = new Headers(request.headers);
      newHeaders.set("userId", response.id);
      return NextResponse.next({ headers: newHeaders });
    }

    if (request.nextUrl.pathname.startsWith("/api/")) {
      return NextResponse.json(
        { message: "Você não tem permissão para fazer isto.", status: 403 },
        { status: 403 }
      );
    }

    return NextResponse.redirect(new URL("/login", request.url));
  } catch (error) {
    console.log(error);
    return NextResponse.json(error, {
      status: (error as ServerExceptionType).status || 400,
    });
  }
}
