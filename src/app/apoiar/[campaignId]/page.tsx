import Footer from "../../../common/components/footer";
import { getCampaignBasicInfo } from "../../../resources/api/services/campaign";
import { findSupporter, findUser } from "../../../resources/api/services/user";
import SupporterSignUpPage from "../../../resources/apoiar/page";

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
