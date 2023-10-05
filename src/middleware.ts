import { NextRequest } from "next/server";
import { fetchAuth } from "./common/utils/fetchAuth";
import { headers } from "next/headers";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api/painel")) {
    return fetchAuth(["user"], request);
  }
  if (request.nextUrl.pathname.startsWith("/login")) {
    return fetchAuth(["user"], request);
  }
  if (request.nextUrl.pathname.startsWith("/painel")) {
    return fetchAuth(["user"], request);
  }
}
