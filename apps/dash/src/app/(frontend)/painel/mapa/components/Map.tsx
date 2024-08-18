"use client";

import { useRef, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import L, { LatLngExpression } from "leaflet";
import React from "react";
import clsx from "clsx";
import { FullscreenControl } from "react-leaflet-fullscreen";
import { useMapData } from "../hooks/useMapData";
import SupporterBall from "@/app/(frontend)/_shared/components/SupporterBall";
import { FitBoundsComponent } from "./FitBoundsComponent";
import { NeighborhoodLayer } from "./neighborhoods/NeighborhoodLayer";
import { ZoneLayer } from "./zones/ZoneLayer";
import MapControl from "./MapControl";
import ZoneControl from "./zones/ZoneControl";
import NeighborhoodControl from "./neighborhoods/controls/NeighborhoodControl";
import SupporterControl from "./neighborhoods/controls/SupportersControl";
import { ViewControl } from "./neighborhoods/controls/ViewControl";
import AddressControl from "./neighborhoods/controls/AddressControl";

export default function Map() {
  const {
    addresses,
    neighborhoods,
    zones,
    viewMode,
    selectedNeighborhood,
    selectedZone,
    selectedAddress,
  } = useMapData();
  const [wsConnected, setWsConnected] = useState(false);

  /* useSWRSubscription(wsURL, (key) =>
    mapWebSocketHandling(key, supporterSession, setWsConnected, trigger)
  ); */

  const center = [0, 0];

  const mapRef = useRef<L.Map>();

  if (!addresses) return null;

  return (
    <>
      <MapContainer
        className="z-0 h-[450px] w-full lg:h-[768px]"
        center={center as LatLngExpression}
        zoom={1}
        scrollWheelZoom={true}
        attributionControl={false}
      >
        <FullscreenControl
          content={
            "<span class='text-lg font-semibold flex justify-center h-full pt-0.5'>\u{2921}</span>"
          }
        />

        {viewMode === "zone" ? (
          <MapControl position="bottomleft">
            <ZoneControl />
          </MapControl>
        ) : (
          <MapControl position="bottomleft">
            <NeighborhoodControl />
          </MapControl>
        )}

        <ViewControl />

        {(selectedNeighborhood || selectedZone) && (
          <MapControl position="topright">
            <SupporterControl />
          </MapControl>
        )}

        {selectedAddress && (
          <MapControl position="topright">
            <AddressControl />
          </MapControl>
        )}

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png	"
        />
        <NeighborhoodLayer isVisible={viewMode === "neighborhood"} />
        <ZoneLayer isVisible={viewMode === "zone"} />

        <FitBoundsComponent
          addresses={addresses}
          mapRef={mapRef}
          neighborhoods={neighborhoods}
          zones={zones}
        />
      </MapContainer>
      <div
        className={clsx(
          "mt-1.5 flex items-start justify-between gap-1.5 text-xs italic text-gray-400 transition-all duration-200"
        )}
      >
        {/* <div>
          <div className="flex gap-2">
            <div
              className={clsx(
                "my-auto max-w-2 flex-none rounded-full p-1",
                "bg-red-500"
              )}
            />
            <div className="text-sm font-normal text-gray-600 lg:text-xs">
              Menos de 50% de apoiadores da área líder
            </div>
          </div>
          <div className="flex gap-2">
            <div
              className={clsx(
                "my-auto max-w-2 flex-none rounded-full p-1",
                "bg-green-500"
              )}
            />
            <div className="text-sm font-normal text-gray-600 lg:text-xs">
              Mais de 75% de apoiadores da área líder
            </div>
          </div>
          <div className="flex gap-2">
            <div
              className={clsx(
                "my-auto max-w-2 flex-none rounded-full p-1",
                "bg-yellow-400"
              )}
            />
            <div className="text-sm font-normal text-gray-600 lg:text-xs">
              Entre 50% e 75% de apoiadores da área líder
            </div>
          </div>
        </div> */}
        <div className="flex gap-1">
          {wsConnected ? (
            <>
              <div className="my-auto">
                <SupporterBall level={3} />
              </div>{" "}
              ApoioZ© websockets server
            </>
          ) : (
            <>
              <SupporterBall level={1} /> Desconectado da rede de apoio ao vivo.
            </>
          )}
        </div>
      </div>
    </>
  );
}
