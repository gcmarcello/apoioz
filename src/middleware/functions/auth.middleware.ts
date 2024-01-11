import { getEnv } from "@/_shared/utils/settings";
import { ActionResponse } from "@odinkit/api/ActionResponse";
import { NextRequest, NextResponse } from "next/server";

export async function AuthMiddleware({
  request,
  additionalArguments,
}: {
  request: { token: string | undefined };
  additionalArguments: { roles: string[] };
}) {
  if (!request.token) return false;

  const roles: string[] = additionalArguments.roles;

  const url = getEnv("NEXT_PUBLIC_SITE_URL");

  const user = await fetch(`${url}/api/auth/verify`, {
    headers: { Authorization: request.token },
  })
    .then((res) => res.json())
    .catch((error) => error);

  if (!user) return false;

  const isAuthenticated = [...roles, "admin"].includes(user.role);

  if (!isAuthenticated) return false;

  return user.id;
}
