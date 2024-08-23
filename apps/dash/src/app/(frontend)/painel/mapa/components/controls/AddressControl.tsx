import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { useMapData } from "../../hooks/useMapData";
import {
  BuildingLibraryIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from "@heroicons/react/20/solid";
import { useEffect, useMemo, useRef } from "react";
import clsx from "clsx";
import { useAction } from "odinkit/client";
import { readSectionsByAddress } from "@/app/api/elections/sections/action";
import { Divider, For, toProperCase } from "odinkit";
import { LoadingSpinner } from "@/app/(frontend)/_shared/components/Spinners";
import Link from "next/link";

export default function AddressControl() {
  const { selectedAddress } = useMapData();
  const ref = useRef<HTMLDivElement>(null);

  const {
    data: sectionData,
    trigger,
    isMutating,
  } = useAction({
    action: readSectionsByAddress,
  });

  useEffect(() => {
    if (selectedAddress) {
      trigger(selectedAddress.id);
    }
  }, [selectedAddress]);

  const supportersWithSections = useMemo(
    () => sectionData?.reduce((acc, curr) => acc + curr.Supporter.length, 0),
    [sectionData]
  );

  console.log(supportersWithSections, selectedAddress?.supportersCount);

  return (
    <div ref={ref} className="max-h-[200px] min-h-[100px] overflow-y-auto">
      <div className="mb-4 flex items-center justify-center rounded-lg bg-rose-600">
        <div className="... truncate  px-1 text-center text-lg font-semibold text-white">
          {toProperCase(selectedAddress?.location ?? "")}
        </div>
      </div>
      <div className="mb-1 flex justify-between gap-4">
        <Link
          target="_blank"
          href={`/painel/relatorios?address=${selectedAddress?.id}`}
          className={clsx(
            "...  truncate font-semibold text-zinc-500 underline"
          )}
        >
          Relatório
        </Link>
      </div>
      <div className="flex justify-between gap-4">
        <div className={clsx("...  truncate font-semibold text-zinc-500")}>
          Bairro
        </div>
        <div className={clsx("font-semibold text-zinc-500")}>
          {toProperCase(selectedAddress?.neighborhood ?? "")}
        </div>
      </div>
      {isMutating ? (
        <div className="flex min-h-[100px] items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          <Divider className="my-2" />
          <div className="flex justify-between gap-4">
            <div className={clsx("...  truncate font-semibold text-zinc-500")}>
              Seção
            </div>
            <div className={clsx("font-semibold text-zinc-500")}>
              Apoiadores
            </div>
          </div>
          {selectedAddress && (
            <div className="flex justify-between gap-4">
              <div className={clsx("...  truncate text-zinc-500")}>
                Sem seção
              </div>
              <div className={clsx("text-zinc-500")}>
                {selectedAddress.supportersCount - supportersWithSections}
              </div>
            </div>
          )}
          <For
            each={sectionData?.sort(
              (a, b) => b.Supporter.length - a.Supporter.length
            )}
          >
            {(section) => (
              <div className="flex justify-between gap-4">
                <div className={clsx("...  truncate text-zinc-500")}>
                  {section.number}
                </div>
                <div className={clsx("text-zinc-500")}>
                  {section.Supporter.length}
                </div>
              </div>
            )}
          </For>
        </>
      )}
    </div>
  );
}
