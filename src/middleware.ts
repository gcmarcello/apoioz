import { NextRequest, NextResponse } from "next/server";
import { AuthMiddleware } from "./middleware/functions/auth.middleware";

export async function middleware(request: NextRequest) {
  const startsWith = request.nextUrl.pathname.startsWith;

  if (startsWith("/api/panel")) {
    return NextResponse.next();
  }

  if (startsWith("/api/signup")) {
    return NextResponse.next();
  }

  if (startsWith("/registrar")) {
    return NextResponse.next();
  }

  if (startsWith("/login")) {
    const isAuthenticated = await AuthMiddleware({
      request,
      additionalArguments: { roles: ["user"] },
    });

    if (isAuthenticated)
      return NextResponse.redirect(new URL("/painel", request.nextUrl).href);
  }

  if (startsWith("/painel")) {
    const userId = await AuthMiddleware({
      request,
      additionalArguments: { roles: ["user"] },
    });

    if (!userId) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    const requestHeaders = new Headers(request.headers);

    requestHeaders.set("userId", userId);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  if (startsWith("/admin")) {
    const parsedRequest = await AuthMiddleware({
      request,
      additionalArguments: { roles: ["admin"] },
    });

    if (parsedRequest)
      return NextResponse.next({
        headers: parsedRequest.newHeaders,
      });
  }

  if (startsWith("/apoiar")) {
    const isAuthenticated = await AuthMiddleware({
      request,
      additionalArguments: { roles: ["user"] },
    });

    if (isAuthenticated)
      return NextResponse.redirect(new URL("/painel", request.nextUrl).href);
  }

  if (startsWith("/recuperar")) {
    const isAuthenticated = await AuthMiddleware({
      request,
      additionalArguments: { roles: ["user"] },
    });

    if (isAuthenticated)
      return NextResponse.redirect(new URL("/painel", request.nextUrl).href);
  }
}
