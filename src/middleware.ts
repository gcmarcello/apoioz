import { NextRequest } from "next/server";
import { fetchAuth } from "./middleware/fetchAuth";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api/panel")) {
    return fetchAuth(["user"], request);
  }
  if (request.nextUrl.pathname.startsWith("/login")) {
    return fetchAuth(["user"], request);
  }
  if (request.nextUrl.pathname.startsWith("/painel")) {
    return fetchAuth(["user"], request);
  }
  if (request.nextUrl.pathname.startsWith("/admin")) {
    return fetchAuth([], request);
  }
}
