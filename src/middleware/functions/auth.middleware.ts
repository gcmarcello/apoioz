import { NextRequest, NextResponse } from "next/server";

export async function AuthMiddleware({
  request,
  additionalArguments,
}: {
  request: NextRequest;
  additionalArguments: { roles: string[] };
}) {
  const roles: string[] = additionalArguments.roles;

  const token = request.cookies.get("token")?.value;

  if (!token) return false;

  const user = await fetch(`${request.nextUrl.origin}/api/auth/verify`, {
    headers: { Authorization: token },
  }).then((res) => res.json());

  const isAuthenticated = [...roles, "admin"].includes(user.role);

  if (!isAuthenticated) return false;

  return user.id;
}
