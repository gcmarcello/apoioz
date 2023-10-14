import { NextResponse } from "next/server";
import { ServerExceptionType } from "../../../../../common/types/serverExceptionTypes";
import { findAddressBySection } from "../../../../../resources/api/services/locations";

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
