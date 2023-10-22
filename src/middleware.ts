import { NextRequest } from "next/server";
import { fetchAuth } from "./middleware/fetchAuth";
import { Path } from "./next_decorators/lib/decorators/Path";
import { middlewareHandler } from "./next_decorators/lib/handlers/middlewareHandler";

class Middleware {
  @Path("/api/panel")
  async panel(request: NextRequest) {
    return fetchAuth(["user"], request);
  }

  @Path("/api/signup")
  async signup(request: NextRequest) {
    return fetchAuth([], request);
  }

  @Path("/registrar")
  async registrar(request: NextRequest) {
    return fetchAuth(["user"], request);
  }

  @Path("/login")
  async login(request: NextRequest) {
    return fetchAuth(["user"], request);
  }

  @Path("/painel")
  async painel(request: NextRequest) {
    return fetchAuth(["user"], request);
  }

  @Path("/admin")
  async admin(request: NextRequest) {
    return fetchAuth([], request);
  }
}
export const middleware = middlewareHandler(Middleware);
