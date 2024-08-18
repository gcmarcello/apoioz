"use client";

import SlideOver from "@/app/(frontend)/_shared/components/SlideOver";
import { FunnelIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import MapDataProvider from "../providers/MapDataProvider";
import { MapDataStats } from "./MapDataStats";
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
      <div className="bg-white">
        <NoSsrMap />
      </div>
    </MapDataProvider>
  );
}
