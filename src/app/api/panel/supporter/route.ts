import { headers, cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { ServerExceptionType } from "../../../../common/types/serverExceptionTypes";
import { listSupporters } from "../../../../resources/api/services/campaign";

export async function GET(request: NextRequest) {
  try {
    const page = request.nextUrl.searchParams.get("page") || 1;
    const userId = headers().get("userId");
    const campaignId = cookies().get("activeCampaign")?.value;
    if (!userId || !campaignId) return;
    const supporters = await listSupporters({
      userId,
      campaignId,
      pagination: {
        pageSize: 10,
        pageIndex: 1,
      },
    });

    return NextResponse.json(supporters);
  } catch (error) {
    console.log(error);
    return NextResponse.json(error, {
      status: (error as ServerExceptionType).status || 400,
    });
  }
}
