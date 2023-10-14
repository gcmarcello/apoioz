import { NextResponse } from "next/server";
import { ServerExceptionType } from "../../../../../common/types/serverExceptionTypes";
import { getSectionsByZone } from "../../../../../resources/api/services/sections";

export async function GET(
  request: Request,
  { params }: { params: { zoneId: string } }
) {
  try {
    const { zoneId } = params;

    const sections = await getSectionsByZone(zoneId);

    return NextResponse.json(sections);
  } catch (error) {
    console.log(error);
    return NextResponse.json(error, {
      status: (error as ServerExceptionType).status || 400,
    });
  }
}
