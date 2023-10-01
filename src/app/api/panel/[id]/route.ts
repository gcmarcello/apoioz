import { NextResponse } from "next/server";
import { ServerExceptionType } from "../../../../common/types/serverExceptionTypes";
import { listUsers } from "../../../../resources/api/services/user";
import { verifyPermission } from "../../../../resources/api/services/campaign";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const permission: number = await verifyPermission(request.headers.get("userId"), params.id);
    return NextResponse.json(await listUsers(params.id, permission));
  } catch (error) {
    return NextResponse.json(error, { status: (error as ServerExceptionType).status || 400 });
  }
}
