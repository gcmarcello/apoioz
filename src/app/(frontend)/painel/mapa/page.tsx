"use client";
import { createMapData } from "@/app/api/panel/map/actions";
import { Neighborhood, Zone } from "@prisma/client";
import { Squares2X2Icon, FunnelIcon } from "@heroicons/react/24/solid";
import MapDataProvider from "./providers/MapDataProvider";
import { MapFilter } from "./components/MapFilter";
import { useEffect, useState } from "react";
import { useAction } from "../../_shared/hooks/useAction";
import { NoSsrMap } from "./components/NoSsrMap";
import { MapDataStats } from "./components/MapDataStats";
import SlideOver from "../../_shared/components/SlideOver";

type FilterForm = {
  zones: (Zone & { label: number; color: string; checked: boolean })[];
  neighborhoods: (Neighborhood & { label: string; color: string; checked: boolean })[];
  sections: {
    showEmptySections: boolean;
  };
};

export default function MapPage() {
  const [openMobileFilter, setOpenMobileFilter] = useState(false);
  const { trigger, data } = useAction({
    action: createMapData,
  });

  useEffect(() => {
    trigger();
  }, []);

  if (!data) return;

  return (
    <MapDataProvider value={data}>
      <SlideOver open={openMobileFilter} setOpen={setOpenMobileFilter}>
        <MapFilter />
      </SlideOver>
      <div className="bg-white">
        <div className="flex items-baseline justify-between border-b border-gray-200 lg:hidden">
          <div className="flex items-center">
            <button
              type="button"
              className="flex gap-2 p-2 text-gray-400 hover:text-gray-500 sm:ml-6"
              onClick={() => setOpenMobileFilter(true)}
            >
              <FunnelIcon className="h-5 w-5" aria-hidden="true" />

              <span className="">Filtros</span>
            </button>
          </div>
        </div>
        <section aria-labelledby="products-heading" className="pb-24">
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-12">
            <div className="lg:col-span-2">
              {!openMobileFilter && ( //@todo
                <div className="hidden lg:block">
                  <MapFilter />
                </div>
              )}
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
