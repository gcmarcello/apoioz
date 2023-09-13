import { NextRequest } from "next/server";
import { fetchAuth } from "./utils/authFetch";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api/panel")) {
    return fetchAuth(["user"], request.cookies.get("token"));
  }
}
