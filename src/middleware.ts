import { NextRequest } from "next/server";
import { fetchAuth } from "./middleware/fetchAuth";
import { MiddlewarePath } from "../next_decorators/lib/decorators/MiddlewarePath";
import { middlewareHandler } from "../next_decorators/lib/handlers/middlewareHandler";

class Middleware {
  @MiddlewarePath("/api/panel")
  async panel(request: NextRequest) {
    return fetchAuth(["user"], request);
  }

  @MiddlewarePath("/api/signup")
  async signup(request: NextRequest) {
    return fetchAuth([], request);
  }

  @MiddlewarePath("/registrar")
  async registrar(request: NextRequest) {
    return fetchAuth(["user"], request);
  }

  @MiddlewarePath("/login")
  async login(request: NextRequest) {
    return fetchAuth(["user"], request);
  }

  @MiddlewarePath("/painel")
  async painel(request: NextRequest) {
    return fetchAuth(["user"], request);
  }

  @MiddlewarePath("/admin")
  async admin(request: NextRequest) {
    return fetchAuth([], request);
  }
}
export const middleware = middlewareHandler(Middleware);
