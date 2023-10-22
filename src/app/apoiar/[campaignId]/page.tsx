import { getCampaignBasicInfo } from "@/backend/resources/campaign/campaign.service";
import { findSupporter } from "@/backend/resources/users/users.service";
import Footer from "@/frontend/(shared)/components/footer";
import SupporterSignUpPage from "../../../frontend/support/pages";

export default async function Apoiar({
  params,
  searchParams,
}: {
  params: { campaignId: string };
  searchParams: { referral: string };
}) {
  const userId = searchParams.referral;
  const campaignId = params.campaignId;
  const campaign = await getCampaignBasicInfo(campaignId);
  const referral = await findSupporter(userId, campaignId);

  return (
    <>
      <SupporterSignUpPage referral={referral} campaign={campaign} />
      <Footer />
    </>
  );
}
