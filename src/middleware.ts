import { NextRequest, NextResponse } from "next/server";
import { _NextResponse } from "./(shared)/utils/http/_NextResponse";
import { Path, middlewareHandler } from "./middleware/decorator";
import { AuthMiddleware } from "./middleware/functions/auth.middleware";

class Middleware {
  @Path("/api/panel")
  async panel(request: NextRequest) {
    return _NextResponse.next();
  }

  @Path("/api/signup")
  async signup(request: NextRequest) {
    return _NextResponse.next();
  }

  @Path("/registrar")
  async registrar(request: NextRequest) {
    return _NextResponse.next();
  }

  @Path("/login")
  async login(request: NextRequest) {
    return _NextResponse.next();
  }

  @Path("/painel")
  async painel(request: NextRequest) {
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
}
export const middleware = middlewareHandler(Middleware);
