import { findAddressBySection } from "@/backend/resources/elections/locations/locations.service";
import { ServerExceptionType } from "@/shared/types/serverExceptionTypes";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { sectionId: string } }
) {
  try {
    const { sectionId } = params;

    const address = await findAddressBySection({ sectionId });

    return NextResponse.json(address);
  } catch (error) {
    console.log(error);
    return NextResponse.json(error, {
      status: (error as ServerExceptionType).status || 400,
    });
  }
}
