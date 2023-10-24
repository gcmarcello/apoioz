import { _NextResponse } from "@/(shared)/utils/http/_NextResponse";
import { NextRequest } from "next/server";

export async function AuthMiddleware({
  request,
  additionalArguments,
}: {
  request: NextRequest;
  additionalArguments: { roles: string[] };
}) {
  const roles: string[] = additionalArguments.roles;

  const token = request.cookies.get("token")?.value;

  if (!token) {
    _NextResponse.json({ message: "Deslogado.", status: 403 });
    return;
  }

  const user = await fetch(`${request.nextUrl.origin}/api/auth/verify`, {
    headers: { Authorization: token },
  }).then((res) => res.json());

  const isAuthenticated = [...roles, "admin"].includes(user.role);

  if (!isAuthenticated) {
    _NextResponse.json({ message: "Deslogado.", status: 403 });
    return;
  }

  const newHeaders = new Headers(request.headers);
  newHeaders.set("userId", user.id);

  return {
    ...request,
    newHeaders: newHeaders,
  };
}
