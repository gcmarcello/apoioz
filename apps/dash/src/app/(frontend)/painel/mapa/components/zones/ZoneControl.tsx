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
import { useRef } from "react";
import clsx from "clsx";

export default function ZoneControl() {
  const { zones, setZones } = useMapData();
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div ref={ref} className="w-full">
      <Disclosure>
        {({ open }) => (
          <>
            <DisclosureButton
              className={clsx(
                "flex w-full items-center justify-center gap-2 rounded-lg bg-rose-500 p-2 text-white",
                "transition-colors duration-200",
                open ? "bg-rose-600" : "bg-rose-500"
              )}
            >
              <BuildingLibraryIcon className="h-6 w-6" />
              <div className="hidden text-lg font-semibold lg:block">Zonas</div>
              {open ? (
                <ChevronUpIcon className="h-6 w-6" />
              ) : (
                <ChevronDownIcon className="h-6 w-6" />
              )}
            </DisclosureButton>
            <DisclosurePanel
              transition
              className={clsx(
                "mt-3 max-h-[250px] origin-top overflow-y-auto rounded-lg bg-white shadow-lg transition duration-200 ease-out data-[closed]:-translate-y-6 data-[closed]:opacity-0",
                open ? "translate-y-0 opacity-100" : "-translate-y-6 opacity-0"
              )}
            >
              {zones.map((zone) => (
                <label key={zone.id} className="mb-2 flex items-center px-3">
                  <input
                    type="checkbox"
                    checked={zone.checked}
                    className="h-4 w-4 rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                    onChange={(e) => {
                      setZones((prev) =>
                        prev.map((z) =>
                          z.id === zone.id
                            ? { ...z, checked: e.target.checked }
                            : z
                        )
                      );
                    }}
                  />
                  <span className="ml-2 text-gray-700">{zone.number}</span>
                </label>
              ))}
            </DisclosurePanel>
          </>
        )}
      </Disclosure>
    </div>
  );
}
