"use client";
import { Button } from "@/app/(frontend)/_shared/components/Button";
import { CampaignHeader } from "@/app/(frontend)/_shared/components/CampaignHeader";
import ProfileDropdown from "@/app/(frontend)/_shared/components/navigation/ProfileDropdown";
import { TopNavigation } from "@/app/(frontend)/_shared/components/navigation/TopNavigation";
import { SectionTitle } from "@/app/(frontend)/_shared/components/text/SectionTitle";

export default function JoinCampaignSection({ user, campaign }) {
  return (
    <>
      <TopNavigation className="flex justify-between p-4 shadow-md lg:justify-end">
        <div className="block lg:hidden">
          <SectionTitle>{user.name}</SectionTitle>
        </div>
        <ProfileDropdown user={user} />
      </TopNavigation>
      <div className="mt-24">
        <CampaignHeader campaign={campaign} />
        <div className="flex justify-center">
          <Button variant="primary">Apoiar!</Button>
        </div>
      </div>
    </>
  );
}
