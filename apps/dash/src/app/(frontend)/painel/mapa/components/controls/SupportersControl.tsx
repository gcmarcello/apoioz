import { Divider, For, toProperCase } from "odinkit";
import { useMapData } from "../../hooks/useMapData";
import clsx from "clsx";
import { useMap } from "react-leaflet";
import { LatLng, LatLngExpression } from "leaflet";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function SupporterControl() {
  const {
    supportersTopNeighborhood,
    zonesWithSupporters,
    neighborhoodsWithSupporters,
    zones,
    addresses,
    supportersTopZone,
    setSelectedAddress,
    viewMode,
    selectedZone,
    selectedNeighborhood,
    selectedAddress,
  } = useMapData();
  const map = useMap();

  if (selectedZone && viewMode === "zone") {
    const zoneAddresses = addresses.filter((a) => a.zoneId === selectedZone.id);
    const addressesWithSupporters = zoneAddresses;
    const supporters = zonesWithSupporters.find(
      (z) => z.id === selectedZone.id
    )?.supporters;

    return (
      <Disclosure defaultOpen>
        {({ open }) => (
          <div className="rounded-lg bg-white ">
            <DisclosureButton className="mb-2 flex w-full justify-center gap-2 rounded-lg bg-rose-600 text-white">
              <div className="... truncate text-lg font-semibold ">
                Zona {selectedZone.number}
              </div>
              {open ? (
                <ChevronUpIcon className="h-6 w-6" />
              ) : (
                <ChevronDownIcon className="h-6 w-6" />
              )}
            </DisclosureButton>
            <DisclosurePanel
              transition
              className="transition duration-200 ease-out data-[closed]:-translate-y-6 data-[closed]:opacity-0"
            >
              <Link
                target="_blank"
                href={`/painel/relatorios?zone=${selectedZone?.id}`}
                className={clsx(
                  "...  truncate font-semibold text-zinc-500 underline"
                )}
              >
                Relatório
              </Link>
              <div className="flex justify-between gap-4">
                <div className={clsx("text-lg font-semibold", "text-rose-500")}>
                  Colégios
                </div>
                <div className={clsx("text-lg font-semibold text-zinc-500")}>
                  {zoneAddresses.length}
                </div>
              </div>
              <div className="flex justify-between gap-4">
                <div className={clsx("text-zinc-500")}>Com apoiadores</div>
                <div className={clsx("text-zinc-500")}>
                  {addressesWithSupporters.length}
                </div>
              </div>
              <div className="flex justify-between gap-4">
                <div className={clsx("text-zinc-500")}>Sem apoiadores</div>
                <div className={clsx("text-zinc-500")}>
                  {zoneAddresses.length - addressesWithSupporters.length}
                </div>
              </div>
              <Divider className="my-3" />
              <div className="max-h-[300px] space-y-1 overflow-y-auto">
                <div className="flex justify-between gap-4">
                  <div
                    className={clsx("text-lg font-semibold", "text-rose-500")}
                  >
                    Apoiadores
                  </div>
                  <div className={clsx("text-lg font-semibold text-zinc-500")}>
                    {supporters?.length}
                  </div>
                </div>
                <For
                  each={addressesWithSupporters.sort(
                    (a, b) => b.supportersCount - a.supportersCount
                  )}
                >
                  {(address) => (
                    <div className="flex justify-between gap-4">
                      <div
                        onClick={() => {
                          setSelectedAddress(address);
                          map.flyTo(address.geocode as LatLngExpression, 18);
                        }}
                        className={clsx(
                          "...  cursor-pointer truncate hover:underline",
                          selectedAddress?.id === address.id
                            ? "font-semibold text-rose-500"
                            : "text-zinc-500"
                        )}
                      >
                        {toProperCase(address.location ?? "")}
                      </div>
                      <div className={clsx("text-zinc-500")}>
                        {address.supportersCount}
                      </div>
                    </div>
                  )}
                </For>
              </div>
            </DisclosurePanel>
          </div>
        )}
      </Disclosure>
    );
  }

  if (viewMode === "neighborhood" && selectedNeighborhood) {
    const neighborhoodAddresses = addresses.filter(
      (a) => a.neighborhood === selectedNeighborhood.name
    );
    const addressesWithSupporters = neighborhoodAddresses;
    const supporters = neighborhoodsWithSupporters.find(
      (z) => z.id === selectedNeighborhood.id
    )?.supporters;

    return (
      <div className="max-w-[300px] space-y-1 rounded-lg bg-white ">
        <div className="mb-4 flex justify-center rounded-lg bg-rose-600">
          <div className="... truncate text-lg font-semibold text-white">
            {toProperCase(selectedNeighborhood.name)}
          </div>
        </div>
        <Link
          target="_blank"
          href={`/painel/relatorios?neighborhood=${selectedNeighborhood?.name}`}
          className={clsx(
            "...  truncate font-semibold text-zinc-500 underline"
          )}
        >
          Relatório
        </Link>
        <div className="flex justify-between gap-4">
          <div className={clsx("text-lg font-semibold", "text-rose-500")}>
            Colégios
          </div>
          <div className={clsx("text-lg font-semibold text-zinc-500")}>
            {neighborhoodAddresses.length}
          </div>
        </div>
        <div className="flex justify-between gap-4">
          <div className={clsx("text-zinc-500")}>Com apoiadores</div>
          <div className={clsx("text-zinc-500")}>
            {addressesWithSupporters.length}
          </div>
        </div>
        <div className="flex justify-between gap-4">
          <div className={clsx("text-zinc-500")}>Sem apoiadores</div>
          <div className={clsx("text-zinc-500")}>
            {neighborhoodAddresses.length - addressesWithSupporters.length}
          </div>
        </div>
        <Divider className="my-3" />
        <div className="max-h-[300px] overflow-y-auto">
          <div className="flex justify-between gap-4">
            <div className={clsx("text-lg font-semibold", "text-rose-500")}>
              Apoiadores
            </div>
            <div className={clsx("text-lg font-semibold text-zinc-500")}>
              {supporters?.length}
            </div>
          </div>
          <For
            each={addressesWithSupporters.sort(
              (a, b) => b.supportersCount - a.supportersCount
            )}
          >
            {(address) => (
              <div className="flex justify-between gap-4">
                <div
                  onClick={() => {
                    setSelectedAddress(address);
                    map.flyTo(address.geocode as LatLngExpression, 18);
                  }}
                  className={clsx(
                    "...  cursor-pointer truncate hover:underline",
                    selectedAddress?.id === address.id
                      ? "font-semibold text-rose-500"
                      : "text-zinc-500"
                  )}
                >
                  {toProperCase(address.location ?? "")}
                </div>
                <div className={clsx("text-zinc-500")}>
                  {address.supportersCount}
                </div>
              </div>
            )}
          </For>
        </div>
      </div>
    );
  }

  return null;
}
