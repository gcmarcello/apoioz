"use server";
import { CampaignHeader } from "../../_shared/components/CampaignHeader";
import {
  checkUserCanJoinCampaign,
  readCampaign,
} from "@/app/api/panel/campaigns/service";
import { notFound, redirect } from "next/navigation";
import { Button } from "../../_shared/components/Button";
import ProfileDropdown from "../../_shared/components/navigation/ProfileDropdown";
import { TopNavigation } from "../../_shared/components/navigation/TopNavigation";
import { SectionTitle } from "../../_shared/components/text/SectionTitle";
import Link from "next/link";
import ErrorAlert from "../../_shared/components/alerts/errorAlert";
import JoinCampaign from "./components/JoinCampaign";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
export default async function CampaignLandingPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const {
    request: { userSession },
  } = await UseMiddlewares().then(UserSessionMiddleware);

  const campaign = await readCampaign({ slug: params.slug });

  if (!userSession) {
    redirect("/login?support=" + campaign?.slug);
  }

  if (!campaign) {
    notFound();
  }

  const userCanJoinCampaign = await checkUserCanJoinCampaign({
    campaignId: campaign.id,
    userId: userSession.id,
  });

  return (
    <div>
      <header>
        <TopNavigation className="flex justify-between p-4 shadow-md lg:justify-end">
          <div className="block lg:hidden">
            <SectionTitle>{userSession.name}</SectionTitle>
          </div>
          <ProfileDropdown user={userSession} />
        </TopNavigation>
      </header>
      <div className="mt-24 flex flex-col items-center">
        <CampaignHeader
          campaign={campaign}
          subtitle={
            userCanJoinCampaign != "canJoin"
              ? userCanJoinCampaign === "sameCampaign"
                ? "Você já faz parte da nossa rede, muito obrigado pelo apoio!"
                : ""
              : "Seja um apoiador da nossa campanha!"
          }
        />
        {!userCanJoinCampaign && (
          <div className="mx-4 my-3">
            <ErrorAlert errors={["Esta campanha não faz parte da sua região."]} />
          </div>
        )}

        {userCanJoinCampaign != "canJoin" &&
          (userCanJoinCampaign === "otherCampaign" ? (
            <div className="mx-4 my-3">
              <ErrorAlert
                errors={["Você já está cadastrado numa campanha dessa região."]}
              />
            </div>
          ) : (
            <Link href="/painel">
              <Button variant="primary">Voltar ao painel de controle</Button>
            </Link>
          ))}

        {userCanJoinCampaign != "canJoin" && userCanJoinCampaign && (
          <JoinCampaign campaignId={campaign.id} />
        )}
      </div>
    </div>
  );
}
