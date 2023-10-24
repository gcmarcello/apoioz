import { _NextResponse } from "@/(shared)/utils/http/_NextResponse";
import {
  MiddlewareIdentifiers,
  MiddlewarePayload,
} from "@/next_decorators/decorators/UseMiddlewares";
import { getMetadata } from "@/next_decorators/utils";
import { NextRequest, NextResponse } from "next/server";
import "reflect-metadata";
import { ROLES_METADATA } from "../../constants/roles_metadata";

export async function AuthMiddleware(
  { data: request }: MiddlewarePayload<NextRequest>,
  identifiers: MiddlewareIdentifiers
) {
  const roles: string[] = getMetadata(ROLES_METADATA, identifiers);

  const token = request.cookies.get("token")?.value;

  if (!token) return _NextResponse.json({ message: "Deslogado.", status: 403 });

  const user = await fetch(`${request.nextUrl.origin}/api/auth/verify`, {
    headers: { Authorization: token },
  }).then((res) => res.json());

  const isAuthenticated = [...roles, "admin"].includes(user.role);

  if (!isAuthenticated)
    return _NextResponse.json({
      message: "Sua sessão expirou, faça login novamente.",
      status: 403,
    });

  request.headers.append("userId", user.id);
}
