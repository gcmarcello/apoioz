import { createCampaign } from "@/backend/resources/campaign/campaign.service";
import { createUser } from "@/backend/resources/users/users.service";
import { SignUpType } from "@/shared/types/authTypes";
import { ServerExceptionType } from "@/shared/types/serverExceptionTypes";
import { NextResponse } from "next/server";

export async function POST(request: Request, response: Response) {
  try {
    const body: SignUpType = await request.json();
    const newUser = await createUser(body.user);
    if (body.campaign && newUser) {
      body.campaign.userId = newUser.id;
      const campaign = await createCampaign(body.campaign);
      return NextResponse.json({ user: newUser, campaign: campaign });
    }
    return NextResponse.json(newUser);
  } catch (error) {
    return NextResponse.json(error, {
      status: (error as ServerExceptionType).status || 400,
    });
  }
}
