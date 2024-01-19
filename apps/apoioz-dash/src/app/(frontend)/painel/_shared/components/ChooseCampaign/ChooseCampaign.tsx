import clsx from "clsx";
import { fakerPT_BR } from "@faker-js/faker";
import dayjs from "dayjs";
import { Prisma } from "@prisma/client";
import { CampaignList } from "./CampaignList";
import { revalidatePath } from "next/cache";
import {
  listCampaigns,
  createCampaign,
} from "@/app/api/panel/campaigns/actions";
import { TopNavigation } from "@/app/(frontend)/_shared/components/navigation/TopNavigation";
import ProfileDropdown from "@/app/(frontend)/_shared/components/navigation/ProfileDropdown";
import { SectionTitle } from "@/app/(frontend)/_shared/components/text/SectionTitle";
import Paragraph from "@/app/(frontend)/_shared/components/text/Paragraph";
/* import { BottomRightMocker } from "@/app/(frontend)/_shared/components/Mocker"; */

export default async function ChooseCampaign({
  user,
}: {
  user: Prisma.UserGetPayload<{ include: { info: true } }>;
}) {
  const campaigns = await listCampaigns(user.id);

  /* async function mockAndSubmit() {
    "use server";
    const date = dayjs(fakerPT_BR.date.soon({ days: Math.ceil(Math.random() * 30) }));

    await createCampaign({
      name: fakerPT_BR.person.fullName() + " " + date.format("YYYY"),
      type: "vereador",
      cityId: "3550308",
      slug: fakerPT_BR.word.noun(),
      year: date.format("YYYY"),
    });

    revalidatePath("/painel");
  } */

  return (
    <>
      {/* <BottomRightMocker submit={mockAndSubmit} /> */}
      <div className="mt-6 px-4 sm:px-6 lg:px-8">
        <TopNavigation className="z-50 flex justify-between p-4 shadow-md">
          <SectionTitle>Olá, {user.name}!</SectionTitle>
          <ProfileDropdown user={user} />
        </TopNavigation>

        <div className="mt-20">
          {campaigns.length ? (
            <CampaignList campaigns={campaigns} />
          ) : (
            <Paragraph>
              Você não está participando de nenhuma campanha!
            </Paragraph>
          )}
        </div>
      </div>
    </>
  );
}
