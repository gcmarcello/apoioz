import PanelPage from "@/frontend/panel/index/pages";
import { cookies } from "next/headers";

export default async function Panel() {
  const activeCampaignId = cookies().get("activeCampaign")?.value;

  if (!activeCampaignId) return <></>;

  return (
    <>
      <PanelPage />
    </>
  );
}
