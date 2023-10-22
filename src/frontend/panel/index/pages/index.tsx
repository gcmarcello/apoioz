import { cookies, headers } from "next/headers";

import { listSupporters } from "@/backend/resources/supporters/supporters.actions";
import Footer from "../../(shared)/components/Footer";
import LatestSupporters from "../components/LatestSupporters";
import MainStats from "../components/MainStats";

export default async function PanelPage() {
  const userId = headers().get("userId")!;
  const supporters = await listSupporters({
    pagination: { pageIndex: 0, pageSize: 5 },
    ownerId: userId,
  });

  if (!supporters) return;

  return (
    <>
      <MainStats />
      <LatestSupporters userId={userId} supporters={supporters} />
      <Footer />
    </>
  );
}
