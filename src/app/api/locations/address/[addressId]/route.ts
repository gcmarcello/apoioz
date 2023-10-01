import { NextResponse } from "next/server";
import { ServerExceptionType } from "../../../../../common/types/serverExceptionTypes";
import { findAddress } from "../../../../../resources/api/services/locations";

export async function GET(request: Request, { params }: { params: { addressId: string } }) {
  try {
    const { addressId } = params;

    const address = await findAddress({ addressId });

    return NextResponse.json(address);
  } catch (error) {
    console.log(error);
    return NextResponse.json(error, { status: (error as ServerExceptionType).status || 400 });
  }
}
