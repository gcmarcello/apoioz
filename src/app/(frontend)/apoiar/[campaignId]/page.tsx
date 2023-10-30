import { getCampaignBasicInfo } from "@/app/api/panel/campaigns/actions";
import { findSupporter } from "@/app/api/user/actions";
import Footer from "../../painel/_shared/components/Footer";
import SupporterSignUpPage from "./components/SupporterSignUpPage";

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
