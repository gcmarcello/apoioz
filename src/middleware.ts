import { NextRequest, NextResponse } from "next/server";
import { AuthMiddleware } from "./middleware/functions/auth.middleware";

export async function middleware(request: NextRequest) {
  const startsWith = (arg: string | RegExp) => {
    if (typeof arg === "string") return request.nextUrl.pathname.startsWith(arg);
    return arg.test(request.nextUrl.pathname);
  };

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

  if (/^\/[^\/.]+[^.]$/.test(request.nextUrl.pathname)) {
    const userId = await AuthMiddleware({
      request,
      additionalArguments: { roles: ["user"] },
    });

    const requestHeaders = new Headers(request.headers);

    requestHeaders.set("userId", userId);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }
}
