"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Popup, useMap, GeoJSON } from "react-leaflet";
import L, { LatLngExpression, LeafletMouseEvent, MarkerCluster } from "leaflet";
import React from "react";
import clsx from "clsx";
import { toProperCase } from "@/_shared/utils/format";
import { For } from "@/app/(frontend)/_shared/components/For";
import { FullscreenControl } from "react-leaflet-fullscreen";
import MarkerClusterGroup from "react-leaflet-cluster";
import { retrieveBoundsFromGeoJSONS } from "../utils/coordinates";
import { useMapData } from "../hooks/useMapData";
import { Marker } from "./Marker";
import useSWRSubscription from "swr/subscription";
import { createMapData } from "@/app/api/panel/map/actions";
import { parseAddresses } from "../utils/parseAddresses";
import AddressDetailsModal from "./AddressDetailsModal";
import { MapAddressType, MapContextProps } from "../providers/MapDataProvider";
import { showToast } from "@/app/(frontend)/_shared/components/alerts/toast";
import SupporterBall from "@/app/(frontend)/_shared/components/SupporterBall";
import { useAction } from "odinkit/client";

const POSITION_CLASSES = {
  bottomleft: "leaflet-bottom leaflet-left",
  bottomright: "leaflet-bottom leaflet-right",
  topleft: "leaflet-top leaflet-left",
  topright: "leaflet-top leaflet-right",
};

export default function Map() {
  const {
    neighborhoods,
    addresses,
    zones,
    sections,
    supporterSession,
    ...mapData
  } = useMapData();
  const [wsConnected, setWsConnected] = useState(false);

  const [selectedAddress, setSelectedAddress] = useState<
    MapAddressType | undefined
  >(undefined);
  const { trigger } = useAction({
    action: createMapData,
    responseParser: ({ addresses }) => {
      mapData.setValue("addresses", parseAddresses(addresses) as any);
    },
  });

  const socketUrl =
    (process.env.NODE_ENV === "development" ? "ws" : "wss") +
    "://" +
    process.env.NEXT_PUBLIC_WS_SERVER;

  useSWRSubscription(socketUrl, (key, { next }) => {
    const socket = new WebSocket(key);
    socket.addEventListener("open", () => {
      setWsConnected(true);
      socket.send(`campaign:${supporterSession.campaignId}`);
    });
    socket.addEventListener("close", () => {
      setWsConnected(false);
    });
    socket.addEventListener("error", () => setWsConnected(false));

    socket.addEventListener("message", (event) => {
      trigger();
    });

    return () => socket.close();
  });

  const center = [0, 0];

  const mapRef = useRef<L.Map>();

  const [wasFitted, setWasFitted] = useState(false);

  function FitBoundsComponent() {
    const map = useMap();

    useEffect(() => {
      if (wasFitted) return;
      setWasFitted(true);
    }, []);

    useEffect(() => {
      if (!mapRef.current) {
        mapRef.current = map;
      }

      const markerCoords = addresses?.map(({ geocode }) => geocode);
      let geoJSONBounds: L.LatLngBounds | null = null;

      if (neighborhoods.filter((neighborhood) => neighborhood.checked).length) {
        geoJSONBounds = retrieveBoundsFromGeoJSONS(
          neighborhoods
            .filter((neighborhood) => neighborhood.checked)
            .map((neighborhood) => neighborhood.geoJSON)
        );
      } else if (zones.filter((zone) => zone.checked).length) {
        geoJSONBounds = retrieveBoundsFromGeoJSONS(
          zones.filter((zone) => zone.checked).map((zone) => zone.geoJSON)
        );
      }

      const mapBounds = (!wasFitted && markerCoords) || geoJSONBounds;

      if (!mapBounds) return;

      map.fitBounds(mapBounds as any);
    }, [map]);

    return null;
  }

  let closeTimeout: string | number | NodeJS.Timeout | null | undefined = null;

  const createClusterCustomIcon = function (cluster: MarkerCluster) {
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
      </div>`,
      className: "custom-marker-cluster",
      iconSize: L.point(44, 44, true),
    });
  };

  const createAddressCustomIcon = function (supporterCount?: number) {
    return L.divIcon({
      html: `<div class="relative h-14 w-14"><img src="${
        supporterCount ? "/urna.png" : "/urnaempty.png"
      }" alt="placeholder" class="h-14 w-14"/><div class="absolute top-4 left-0 right-0 bottom-0 flex items-center justify-center font-bold text-white">${supporterCount}</div></div>`,
      className: "custom-marker-cluster",
      iconSize: L.point(44, 44, true),
    });
  };

  if (!addresses) return null;

  return (
    <>
      <MapContainer
        className="z-0 h-[450px] w-full lg:h-[600px]"
        center={center as LatLngExpression}
        zoom={1}
        scrollWheelZoom={true}
      >
        <FullscreenControl
          content={
            "<span class='text-lg font-semibold flex justify-center h-full pt-0.5'>\u{2921}</span>"
          }
        />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png	"
        />
        <For identifier="zones" each={zones}>
          {({ geoJSON, color, checked, id }, index) => {
            if (!geoJSON) return <></>;
            if (!checked && zones.some((zone) => zone.checked)) return <></>;
            if (neighborhoods.some((neighborhood) => neighborhood.checked))
              return <></>;
            return (
              <GeoJSON
                key={`zone-${index}`}
                data={geoJSON as any}
                style={{ color }}
              />
            );
          }}
        </For>
        <For identifier="neighborhoods" each={neighborhoods}>
          {({ geoJSON, color, checked, name, id }, index) => {
            if (
              !geoJSON ||
              !checked ||
              (neighborhoods.some((neighborhood) => neighborhood.checked) &&
                !neighborhoods.find((neighborhood) => neighborhood.id === id)
                  ?.checked)
            )
              return <></>;
            return (
              <GeoJSON
                key={`neighborhood-${index}`}
                data={geoJSON as any}
                style={{ color }}
                eventHandlers={{
                  click: (event) => {
                    if (closeTimeout) clearTimeout(closeTimeout);
                    event.target.openPopup();
                  },
                  mouseout: (event) => {
                    closeTimeout = setTimeout(() => {
                      event.target.closePopup();
                    }, 300);
                  },
                }}
              >
                <Popup
                  interactive={true}
                  offset={[0, 0]}
                  eventHandlers={{
                    mouseover: (event) => {
                      if (closeTimeout) clearTimeout(closeTimeout);
                    },
                    mouseout: (event) => {
                      event.target._source.closePopup();
                    },
                  }}
                >
                  {(() => {
                    return (
                      <article className="flex max-w-2xl flex-col items-start  gap-y-3 ">
                        <div className="group relative">
                          <div className="text-sm font-bold text-gray-900">
                            {toProperCase(name)}
                          </div>
                        </div>
                      </article>
                    );
                  })()}
                </Popup>
              </GeoJSON>
            );
          }}
        </For>
        <MarkerClusterGroup
          key={JSON.stringify(addresses)}
          chunkedLoading
          maxClusterRadius={80}
          showCoverageOnHover={false}
          iconCreateFunction={createClusterCustomIcon}
        >
          <For
            identifier="addresses"
            each={addresses}
            fallback={<p>Loading...</p>}
          >
            {(
              {
                geocode,
                location,
                address,
                supportersCount,
                sectionsCount,
                zone,
                neighborhood,
                id,
              },
              index
            ) => {
              if (
                !geocode ||
                (!zones.find((z) => z.number === zone)?.checked &&
                  zones.some((z) => z.checked)) ||
                (!neighborhoods.find((n) => n.name === neighborhood)?.checked &&
                  neighborhoods.some((n) => n.checked)) ||
                (!sections.showEmptySections && supportersCount === 0)
              )
                return <></>;

              return (
                <Marker
                  icon={createAddressCustomIcon(supportersCount)}
                  key={index}
                  customOptions={{ supportersCount }}
                  interactive={true}
                  position={geocode as LatLngExpression}
                  title={location!}
                  eventHandlers={{
                    mouseover: (event: LeafletMouseEvent) => {
                      if (closeTimeout) clearTimeout(closeTimeout);
                      const marker = event.target as any as L.MarkerCluster;
                      marker.openPopup();
                    },
                    mouseout: (event: LeafletMouseEvent) => {
                      const marker = event.target as any as L.MarkerCluster;
                      closeTimeout = setTimeout(() => {
                        marker.closePopup();
                      }, 300);
                    },
                  }}
                >
                  <Popup
                    interactive={true}
                    offset={[0, 0]}
                    eventHandlers={{
                      mouseover: (event) => {
                        if (closeTimeout) clearTimeout(closeTimeout);
                      },
                      mouseout: (event) => {
                        event.target._source.closePopup();
                      },
                    }}
                  >
                    {(() => {
                      return (
                        <article className="flex max-w-2xl flex-col items-start  gap-y-3 ">
                          <div className="group relative">
                            <div className="text-sm font-bold text-gray-900">
                              {location}
                              <div className="font mt-0.5 text-xs  text-gray-600">
                                {toProperCase(address || "")}
                              </div>
                            </div>
                          </div>

                          <div className="flex w-full items-center justify-start">
                            <div className="font text-lg font-bold  text-gray-700 group-hover:text-gray-600">
                              {supportersCount} Apoiador
                            </div>
                            <div className="relative z-10 ml-1 rounded-full bg-gray-200 px-2 py-1 text-xs font-medium  text-gray-600 hover:bg-gray-100">
                              {sectionsCount} Seções
                            </div>
                          </div>

                          <div
                            onClick={() => {
                              setSelectedAddress({
                                geocode,
                                location,
                                address,
                                supportersCount,
                                sectionsCount,
                                zone,
                                neighborhood,
                                id,
                              });

                              if (document.fullscreenElement) {
                                document.exitFullscreen();
                              }
                            }}
                            className={clsx(
                              "bg-indigo-600 text-white shadow-sm hover:bg-indigo-500",
                              "flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            )}
                          >
                            Detalhes
                          </div>
                        </article>
                      );
                    })()}
                  </Popup>
                </Marker>
              );
            }}
          </For>
        </MarkerClusterGroup>
        <FitBoundsComponent />
      </MapContainer>
      <div className="mt-1.5 flex items-center justify-end gap-1.5 text-xs italic text-gray-400">
        {wsConnected ? (
          <>
            <SupporterBall level={3} /> ApoioZ© websockets server
          </>
        ) : (
          <>
            <SupporterBall level={1} /> Desconectado da rede de apoio ao vivo.
          </>
        )}
      </div>
      <AddressDetailsModal
        address={selectedAddress}
        setSelectedAddress={setSelectedAddress}
      />
    </>
  );
}
