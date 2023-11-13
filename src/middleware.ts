import { NextRequest, NextResponse } from "next/server";
import { Path, middlewareHandler } from "./middleware/decorator";
import { AuthMiddleware } from "./middleware/functions/auth.middleware";

class Middleware {
  @Path("/api/panel")
  async panel(request: NextRequest) {
    return NextResponse.next();
  }

  @Path("/api/signup")
  async signup(request: NextRequest) {
    return NextResponse.next();
  }

  @Path("/registrar")
  async registrar(request: NextRequest) {
    return NextResponse.next();
  }

  @Path("/login")
  async login(request: NextRequest) {
    const isAuthenticated = await AuthMiddleware({
      request,
      additionalArguments: { roles: ["user"] },
    });

    if (isAuthenticated)
      return NextResponse.redirect(new URL("/painel", request.nextUrl).href);
  }

  @Path("/painel")
  async painel(request: NextRequest) {
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

  @Path("/admin")
  async admin(request: NextRequest) {
    const parsedRequest = await AuthMiddleware({
      request,
      additionalArguments: { roles: ["admin"] },
    });

    if (parsedRequest)
      return NextResponse.next({
        headers: parsedRequest.newHeaders,
      });
  }

  @Path("/apoiar")
  async support(request: NextRequest) {
    const isAuthenticated = await AuthMiddleware({
      request,
      additionalArguments: { roles: ["user"] },
    });

    if (isAuthenticated)
      return NextResponse.redirect(new URL("/painel", request.nextUrl).href);
  }

  @Path("/recuperar")
  async recover(request: NextRequest) {
    const isAuthenticated = await AuthMiddleware({
      request,
      additionalArguments: { roles: ["user"] },
    });

    if (isAuthenticated)
      return NextResponse.redirect(new URL("/painel", request.nextUrl).href);
  }
}
export const middleware = middlewareHandler(Middleware);
