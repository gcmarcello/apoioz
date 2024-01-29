"use client";
import { Button } from "@/app/(frontend)/_shared/components/Button";
import { showToast } from "@/app/(frontend)/_shared/components/alerts/toast";
import { useAction } from "odinkit/client";
import { joinCampaign } from "@/app/api/panel/campaigns/actions";
import { useRouter } from "next/navigation";

export default function JoinCampaign({ campaignId }: { campaignId: string }) {
  const router = useRouter();
  const { trigger: join, isMutating: isLoading } = useAction({
    action: joinCampaign,
    onSuccess: () => {
      showToast({ message: "Apoiando!", title: "Sucesso", variant: "success" });
      router.push("/painel");
    },
    onError: (error) => {
      showToast({ message: error, title: "Erro", variant: "error" });
    },
  });
  return (
    <Button onClick={() => join({ campaignId })} variant="primary">
      Apoiar!
    </Button>
  );
}
