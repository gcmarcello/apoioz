import Footer from "../../../common/components/footer";
import { getCampaignBasicInfo } from "../../../resources/api/services/campaign";
import { findUser } from "../../../resources/api/services/user";
import SupporterSignUpPage from "../../../resources/apoiar/page";

export default async function Apoiar({
  params,
  searchParams,
}: {
  params: { campaignId: string };
  searchParams: { referral: string };
}) {
  const campaign = await getCampaignBasicInfo(params.campaignId);

  const referral = await findUser({ id: searchParams.referral });

  return (
    <>
      <SupporterSignUpPage referral={referral} campaign={campaign} />
      <Footer />
    </>
  );
}
