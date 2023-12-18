"use client";
import { Button } from "@/app/(frontend)/_shared/components/Button";
import { showToast } from "@/app/(frontend)/_shared/components/alerts/toast";
import { useAction } from "@/app/(frontend)/_shared/hooks/useAction";
import { createSupporter } from "@/app/api/panel/supporters/actions";
import { cookies } from "next/headers";
import { useRouter } from "next/navigation";
import { Router } from "next/router";
import { Campaign, Supporter } from "prisma/generated/zod";
import { UserWithoutPassword } from "prisma/types/User";

export default function JoinCampaign({
  campaign,
  referral,
}: {
  campaign: Campaign;
  referral: Supporter;
}) {
  const router = useRouter();
  const { trigger: join, isMutating: isLoading } = useAction({
    action: createSupporter,
    onSuccess: () => {
      showToast({ message: "Apoiando!", title: "Sucesso", variant: "success" });
      router.push("/painel");
    },
    onError: (error) => {
      showToast({ message: error, title: "Erro", variant: "error" });
    },
  });
  return (
    <Button
      onClick={() => join({ campaignId: campaign.id, referralId: referral.id })}
      variant="primary"
    >
      Apoiar!
    </Button>
  );
}
