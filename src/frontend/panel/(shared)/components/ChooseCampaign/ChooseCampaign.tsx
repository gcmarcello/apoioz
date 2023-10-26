import {
  activateCampaign,
  createCampaign,
  listCampaigns,
} from "@/backend/resources/campaign/campaign.actions";
import clsx from "clsx";
import { Toast } from "@/frontend/(shared)/components/alerts/toast";
import { fakerPT_BR } from "@faker-js/faker";
import dayjs from "dayjs";
import { BottomRightMocker } from "@/frontend/(shared)/components/Mocker";
import { Prisma } from "@prisma/client";
import { CampaignList } from "./CampaignList";
import { revalidatePath } from "next/cache";

export default async function ChooseCampaign({
  user,
}: {
  user: Prisma.UserGetPayload<{ include: { info: true } }>;
}) {
  const campaigns = await listCampaigns(user.id);

  async function mockAndSubmit() {
    "use server";
    const date = dayjs(fakerPT_BR.date.soon({ days: Math.ceil(Math.random() * 30) }));

    await createCampaign({
      userId: user.id,
      name: fakerPT_BR.person.fullName() + " " + date.format("YYYY"),
      type: "vereador",
      cityId: user?.info?.cityId,
      stateId: null,
      year: date.format("YYYY"),
    });

    revalidatePath("/painel");
  }

  return (
    <>
      <BottomRightMocker submit={mockAndSubmit} />
      <div className="mt-6 px-4 sm:px-6 lg:px-8">
        <Toast />
        <div className="flex">
          <h2 className="mb-4 text-4xl font-medium text-gray-900">Bem Vindo,</h2>
          <div className="flex">
            {user ? (
              <div className="mb-4 ms-3 text-4xl font-medium text-gray-900">
                {user?.name}
              </div>
            ) : (
              <div className="mb-4 ms-3 flex w-64  animate-pulse items-center rounded-lg bg-gray-300"></div>
            )}
          </div>
        </div>

        <h2 className="text-sm font-medium text-gray-900">Campanhas Ativas</h2>
        <ul
          role="list"
          className="mt-3 grid grid-cols-1 gap-4 empty:hidden sm:grid-cols-2 sm:gap-6 xl:grid-cols-4"
        >
          <CampaignList campaigns={campaigns} />
        </ul>
      </div>
    </>
  );
}
