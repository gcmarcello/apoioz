"use client";
import { useState } from "react";
import { Button } from "@/app/(frontend)/_shared/components/Button";
import Paragraph from "@/app/(frontend)/_shared/components/text/Paragraph";
import Modal from "@/app/(frontend)/_shared/components/Modal";
import { Dialog } from "@headlessui/react";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useAction } from "@odinkit/hooks/useAction";
import { leaveAsSupporter } from "@/app/api/panel/supporters/actions";
import { showToast } from "@/app/(frontend)/_shared/components/alerts/toast";
import { useRouter } from "next/navigation";
import { Campaign } from "@prisma/client";

export default function LeaveCampaignForm({
  campaign,
}: {
  campaign: Campaign;
}) {
  const [showCampaignLeaveModal, setShowCampaignLeaveModal] = useState(false);
  const router = useRouter();

  const { trigger: leaveCampaign, isMutating: isLoading } = useAction({
    action: leaveAsSupporter,
    onSuccess: () => {
      router.push("/painel");
      showToast({
        message: "Você saiu da campanha",
        variant: "success",
        title: "Sucesso",
      });
    },
    onError: (error) => {
      showToast({
        message: "Erro ao sair da campanha",
        variant: "error",
        title: "Erro",
      });
    },
  });

  return (
    <>
      <dl className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
        <div className="items-center pt-6 sm:flex">
          <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
            Deixar Campanha
          </dt>
          <dd className="mt-1 flex flex-col items-center justify-between gap-4 gap-x-6 sm:mt-0 sm:flex-auto md:flex-row md:gap-0">
            <Paragraph>
              Ao deixar a campanha, seu círculo de apoio será mantido, mas
              qualquer referência a você (nome, email e etc.) será removida.
            </Paragraph>
            <Button
              variant="danger"
              onClick={() => setShowCampaignLeaveModal(true)}
            >
              Sair da Campanha
            </Button>
          </dd>
        </div>
      </dl>
      <Modal
        title={"Deixar Campanha"}
        open={showCampaignLeaveModal}
        setOpen={setShowCampaignLeaveModal}
      >
        <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
          <div>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <XMarkIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
            </div>
            <div className="mt-3 text-center sm:mt-5">
              <Dialog.Title
                as="h3"
                className="text-base font-semibold leading-6 text-gray-900"
              >
                Deixar Campanha {campaign.name}
              </Dialog.Title>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Você realmente deseja deixar a campanha? Você não poderá mais
                  contribuir com a campanha e não receberá mais atualizações.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-5 flex justify-between gap-4 sm:mt-6">
            <Button
              variant="primary"
              className="flex-grow"
              onClick={() => setShowCampaignLeaveModal(false)}
            >
              Cancelar
            </Button>
            <Button variant="danger" onClick={() => leaveCampaign()}>
              Sair da Campanha
            </Button>
          </div>
        </Dialog.Panel>
      </Modal>
    </>
  );
}
