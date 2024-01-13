"use client";

import SlideOver from "@/app/(frontend)/_shared/components/SlideOver";
import { FunnelIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import MapDataProvider from "../providers/MapDataProvider";
import { MapDataStats } from "./MapDataStats";
import { MapFilter } from "./MapFilter";
import { NoSsrMap } from "./NoSsrMap";
import { RawMapData } from "../types/RawMapData";

export function MapIndex({ data }: { data: RawMapData }) {
  const [openMobileFilter, setOpenMobileFilter] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

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
            <div className="lg:col-span-3 xl:col-span-2">
              {!openMobileFilter && ( //@todo
                <div className="hidden lg:block">
                  <MapFilter />
                </div>
              )}
              <MapDataStats />
            </div>
            <div className="lg:col-span-9 xl:col-span-10">
              <NoSsrMap />
            </div>
          </div>
        </section>
      </div>
    </MapDataProvider>
  );
}
