"use server";
import { readSupporterFromUser } from "@/app/api/panel/supporters/service";
import { CampaignHeader } from "../../_shared/components/CampaignHeader";
import { readCampaign } from "@/app/api/panel/campaigns/service";
import { readUser } from "@/app/api/user/service";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { Button } from "../../_shared/components/Button";
import JoinCampaignSection from "./components/JoinCampaignSection";
import ProfileDropdown from "../../_shared/components/navigation/ProfileDropdown";

export default async function CampaignLandingPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const campaign = await readCampaign({ slug: params.slug });
  const userId = headers().get("userId");

  const user = await readUser(userId);

  if (!campaign) {
    notFound();
  }

  if (!user) {
    redirect("/login?support=" + campaign?.slug);
  }

  const supporter = await readSupporterFromUser({
    userId: user.id,
    campaignId: campaign.id,
  });

  return (
    <div className="mt-6">
      <JoinCampaignSection user={user} campaign={campaign} />
    </div>
  );
}
