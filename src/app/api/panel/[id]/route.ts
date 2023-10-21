import { verifyPermission } from "@/backend/resources/campaign/campaign.service";
import { listUsers } from "@/backend/resources/users/users.service";
import { ServerExceptionType } from "@/shared/types/serverExceptionTypes";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const permission: number = (
      await verifyPermission(request.headers.get("userId"), params.id)
    ).level;
    return NextResponse.json(await listUsers());
  } catch (error) {
    return NextResponse.json(error, {
      status: (error as ServerExceptionType).status || 400,
    });
  }
}
