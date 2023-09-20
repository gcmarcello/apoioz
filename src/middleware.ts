import { NextRequest } from "next/server";
import { fetchAuth } from "./common/utils/fetchAuth";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api/panel")) {
    return fetchAuth(["user"], request);
  }
  if (request.nextUrl.pathname.startsWith("/login")) {
    return fetchAuth(["user"], request);
  }
  if (request.nextUrl.pathname.startsWith("/panel")) {
    return fetchAuth(["user"], request);
  }
}
