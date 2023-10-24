import { NextRequest, NextResponse } from "next/server";
import { fetchAuth } from "./middleware/fetchAuth";
import { AuthMiddleware } from "./backend/(shared)/utils/middlewares/auth.middleware";
import { _NextResponse } from "./(shared)/utils/http/_NextResponse";
import { UseMiddlewares } from "./next_decorators/decorators/UseMiddlewares";
import { middlewareHandler } from "./next_decorators/handlers/middlewareHandler";
import { Path } from "./next_decorators/decorators/Path";

class Middleware {
  @Path("/api/panel")
  @UseMiddlewares(AuthMiddleware)
  async panel(request: NextRequest) {
    return _NextResponse.next();
  }

  @Path("/api/signup")
  @UseMiddlewares(AuthMiddleware)
  async signup(request: NextRequest) {
    return _NextResponse.next();
  }

  @Path("/registrar")
  @UseMiddlewares(AuthMiddleware)
  async registrar(request: NextRequest) {
    return _NextResponse.next();
  }

  @Path("/login")
  @UseMiddlewares(AuthMiddleware, AuthMiddleware)
  async login(request: NextRequest) {
    return _NextResponse.next();
  }

  @Path("/painel")
  @UseMiddlewares(AuthMiddleware)
  async painel(request: NextRequest) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  @Path("/admin")
  @UseMiddlewares(AuthMiddleware)
  async admin(request: NextRequest) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
}
export const middleware = middlewareHandler(Middleware);
