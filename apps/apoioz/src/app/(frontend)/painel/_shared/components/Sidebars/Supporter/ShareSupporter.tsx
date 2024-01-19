"use client";
import { createInviteCode } from "@/app/api/auth/invites/action";
import { ArrowPathIcon } from "@heroicons/react/24/solid";
import { Campaign, Prisma, User } from "@prisma/client";
import Link from "next/link";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { useSidebar } from "../lib/useSidebar";
import { set } from "react-hook-form";
import { LoadingSpinner } from "@/app/(frontend)/_shared/components/Spinners";
import { UserWithoutPassword } from "prisma/types/User";
import { useAction } from "odinkit/hooks/useAction";
import { showToast } from "@/app/(frontend)/_shared/components/alerts/toast";

export function ShareSupporter({
  user,
  campaign,
}: {
  user: UserWithoutPassword;
  campaign: Campaign;
}) {
  const [isMounted, setMounted] = useState(false);
  const { supporter } = useSidebar();

  const {
    data: inviteCode,
    trigger: generateInviteCode,
    isMutating: isCreatingCode,
    reset: resetCode,
  } = useAction({
    action: createInviteCode,
    onError: (err) => {
      showToast({ message: err, variant: "error", title: "Erro" });
    },
    onSuccess: (res) => {
      showToast({
        message: `Código gerado com sucesso!`,
        variant: "success",
        title: "Código gerado",
      });
    },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!inviteCode && isMounted) generateInviteCode();
  }, [isMounted]);

  if (!isMounted) return <></>;

  return (
    <div className="flex flex-col items-center space-y-6 pb-5 pt-8">
      <div className="flex flex-col gap-3">
        <button
          onClick={() => generateInviteCode()}
          className="flex items-center justify-center gap-1 font-semibold text-indigo-600"
        >
          Gerar novo QR code <ArrowPathIcon className="h-4 w-4   opacity-100" />
        </button>
        {inviteCode?.id && (
          <div className="flex justify-center">
            <QRCode
              className=" h-[250px] w-[250px] rounded-md"
              value={`${window.location.origin}/apoiar/${inviteCode?.id}`}
            />
          </div>
        )}
        {isCreatingCode && (
          <div className="my-4 flex justify-center">
            <LoadingSpinner />
          </div>
        )}
      </div>

      <div className="w-[300px] space-y-4">
        <button
          onClick={(e) => {
            e.preventDefault();
            navigator.clipboard
              .writeText(`${window.location.origin}/apoiar/${inviteCode?.id}`)
              .catch((err) => console.log(err));

            showToast({
              variant: "success",
              title: "Link copiado",
              message: "O link foi copiado para a área de transferência",
            });
          }}
          className="w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Copiar Link
        </button>
        <Link
          href={`https://wa.me/?text=${window.location.origin}/apoiar/${inviteCode?.id}`}
          target="_blank"
        >
          <div className="my-4 flex justify-center space-x-2 rounded-md bg-green-500 px-3 py-2 text-sm font-semibold text-white hover:bg-green-400">
            <svg
              role="button"
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 fill-white"
              viewBox="0 0 24 24"
            >
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
            </svg>
            <div>Compartilhar no WhatsApp</div>
          </div>
        </Link>
        <div className="text-center text-sm text-gray-500">
          O QR Code e links são válidos por 1 hora. Após este período, clique no
          botão acima para gerar novos.
        </div>
      </div>
    </div>
  );
}
