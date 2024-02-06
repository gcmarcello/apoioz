import Image from "next/image";
import { PageTitle } from "./text/PageTitle";
import { PageSubtitle } from "./text/PageSubtitle";
import { Campaign } from "prisma/client";

export function CampaignHeader({
  campaign,
  subtitle,
  children,
}: {
  campaign: Campaign;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <>
      <div
        className="absolute inset-x-0 -z-10 transform-gpu overflow-hidden blur-3xl lg:top-[-10rem]"
        aria-hidden="true"
      >
        <div
          className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none  rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>

      <div className="flex flex-col items-center justify-center">
        <Image
          width={100}
          height={100}
          className="rounded-full bg-gray-50"
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
          alt=""
        />
        <div className="my-2 flex flex-col items-center">
          <PageTitle>{campaign.name}</PageTitle>
          <PageSubtitle className="mt-2 text-center">{subtitle}</PageSubtitle>
        </div>

        {children}
      </div>
    </>
  );
}
