import L, { MarkerCluster } from "leaflet";
import React from "react";
import MarkerClusterGroup from "react-leaflet-cluster";

function createClusterCustomIcon(cluster: MarkerCluster, label?: string) {
  const supporterCount = (
    cluster.getAllChildMarkers() as (MarkerCluster & {
      options: { customOptions: { supportersCount: number } };
    })[]
  ).reduce(
    (acc, marker) => acc + marker.options.customOptions.supportersCount,
    0
  );

  return L.divIcon({
    html: `<div class="relative text-white font-bold flex justify-center items-center w-12 h-12">
    <div class="bg-${
      supporterCount ? "indigo" : "yellow"
    }-300 absolute rounded-full opacity-70 h-10 w-10"></div>
    <div class="bg-${
      supporterCount ? "indigo" : "yellow"
    }-500 flex justify-center items-center rounded-full h-8 w-8 z-10">
    ${supporterCount}
    </div>
    </div>${label}`,
    className: "custom-marker-cluster",
    iconSize: L.point(44, 44, true),
  });
}

function NeighborhoodMarkerCluster({
  children,
  neighborhood,
}: {
  children: React.ReactNode;
  neighborhood: string;
}) {
  return (
    <MarkerClusterGroup
      iconCreateFunction={(cluster) =>
        createClusterCustomIcon(cluster, neighborhood)
      }
      key={neighborhood}
      chunkedLoading
      maxClusterRadius={200}
      singleMarkerMode={true}
      showCoverageOnHover={false}
    >
      {children}
    </MarkerClusterGroup>
  );
}

export default NeighborhoodMarkerCluster;
