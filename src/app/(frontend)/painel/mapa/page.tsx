"use client";
import { createMapData } from "@/app/api/panel/map/actions";
import { Zone } from "prisma/generated/zod";
import { Neighborhood } from "@prisma/client";
import { Squares2X2Icon, FunnelIcon } from "@heroicons/react/24/solid";
import MapDataProvider from "./providers/MapDataProvider";
import { MapFilter } from "./components/MapFilter";
import { useEffect } from "react";
import { useAction } from "../../_shared/hooks/useAction";
import { NoSsrMap } from "./components/NoSsrMap";
import { MapDataStats } from "./components/MapDataStats";

type FilterForm = {
  zones: (Zone & { label: number; color: string; checked: boolean })[];
  neighborhoods: (Neighborhood & { label: string; color: string; checked: boolean })[];
  sections: {
    showEmptySections: boolean;
  };
};

export default function MapPage() {
  const { trigger, data } = useAction({
    action: createMapData,
  });

  useEffect(() => {
    trigger();
  }, []);

  if (!data) return;

  console.log(
    `kkkkkkkkkkkkk`,
    data.addresses.find((a) => a.Section.find((s) => s.Supporter))
  );

  return (
    <MapDataProvider value={data}>
      <div className="bg-white">
        <div className="flex items-baseline justify-between border-b border-gray-200 pb-4 lg:hidden">
          <div className="flex items-center">
            <button
              type="button"
              className="-m-2 ml-1 p-2 text-gray-400 hover:text-gray-500 sm:ml-7"
            >
              <span className="sr-only">View grid</span>
              <Squares2X2Icon className="h-5 w-5" aria-hidden="true" />
            </button>

            <button
              type="button"
              className="-m-2 ml-2 p-2 text-gray-400 hover:text-gray-500 sm:ml-6"
            >
              <span className="sr-only">Filtros</span>
              <FunnelIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
        <section aria-labelledby="products-heading" className="pb-24">
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 lg:grid-cols-12">
            <div className="lg:col-span-2">
              <MapFilter />
              <MapDataStats />
            </div>
            <div className="lg:col-span-10">
              <NoSsrMap />
            </div>
          </div>
        </section>
      </div>
    </MapDataProvider>
  );
}
