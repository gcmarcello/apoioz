"use server";
import {
  readCampaignLeader,
  verifyConflictingSupporter,
} from "@/app/api/panel/supporters/service";
import { CampaignHeader } from "../_shared/components/CampaignHeader";
import {
  readCampaign,
  verifyCampaignSupportAvailabilityByZone,
} from "@/app/api/panel/campaigns/service";
import { readUser } from "@/app/api/user/service";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { Button } from "../_shared/components/Button";
import ProfileDropdown from "../_shared/components/navigation/ProfileDropdown";
import { TopNavigation } from "../_shared/components/navigation/TopNavigation";
import { SectionTitle } from "../_shared/components/text/SectionTitle";
import Link from "next/link";
import ErrorAlert from "../_shared/components/alerts/errorAlert";
import JoinCampaign from "./components/JoinCampaign";

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

  const conflictingZone = await verifyCampaignSupportAvailabilityByZone({
    userId,
    campaignId: campaign?.id,
  });

  const referral = await readCampaignLeader(campaign?.id);

  if (!campaign) {
    notFound();
  }

  if (!user) {
    redirect("/login?support=" + campaign?.slug);
  }

  const conflictingSupport = await verifyConflictingSupporter(campaign, user.id);

  return (
    <>
      <TopNavigation className="flex justify-between p-4 shadow-md lg:justify-end">
        <div className="block lg:hidden">
          <SectionTitle>{user.name}</SectionTitle>
        </div>
        <ProfileDropdown user={user} />
      </TopNavigation>
      <div className="mt-24 flex flex-col items-center">
        <CampaignHeader
          campaign={campaign}
          subtitle={
            conflictingSupport
              ? conflictingSupport.type === "sameCampaign"
                ? "Você já faz parte da nossa rede, muito obrigado pelo apoio!"
                : ""
              : "Seja um apoiador da nossa campanha!"
          }
        />
        {conflictingZone && (
          <div className="mx-4 my-3">
            <ErrorAlert errors={["Esta campanha não faz parte da sua região."]} />
          </div>
        )}

        {!conflictingZone && conflictingSupport ? (
          conflictingSupport.type === "otherCampaign" ? (
            <div className="mx-4 my-3">
              <ErrorAlert errors={[conflictingSupport.message]} />
            </div>
          ) : (
            <Link href="/painel">
              <Button variant="primary">Voltar ao painel de controle</Button>
            </Link>
          )
        ) : (
          <JoinCampaign referral={referral} campaign={campaign} />
        )}
      </div>
    </>
  );
}
