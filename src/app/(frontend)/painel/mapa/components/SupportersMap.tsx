"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, GeoJSON } from "react-leaflet";
import L, { LatLngBoundsExpression, LatLngExpression, MarkerCluster } from "leaflet";
import React from "react";
import clsx from "clsx";
import { toProperCase } from "@/_shared/utils/format";
import { For } from "@/app/(frontend)/_shared/components/For";
import { FullscreenControl } from "react-leaflet-fullscreen";
import MarkerClusterGroup from "react-leaflet-cluster";

const POSITION_CLASSES = {
  bottomleft: "leaflet-bottom leaflet-left",
  bottomright: "leaflet-bottom leaflet-right",
  topleft: "leaflet-top leaflet-left",
  topright: "leaflet-top leaflet-right",
};

export function SupportersMap({
  mapData,
  zones,
  mapOptions,
  neighborhoods,
}: {
  mapData: any;
  zones: any;
  mapOptions: any;
  neighborhoods: any;
}) {
  const [open, setOpen] = useState(false);
  const [modalInfo, setModalInfo] = useState(null);
  const center = [51.505, -0.09];
  const rectangle = [
    [51.49, -0.08],
    [51.5, -0.06],
  ];

  const mapRef = useRef(null);

  const handleMarkerClick = useCallback(
    (info) => {
      setModalInfo(info);
      setOpen(true);
    },
    [setModalInfo, setOpen]
  );

  let closeTimeout = null;

  function FitBoundsComponent() {
    const map = useMap();
    const markerCoords = mapData!.map((marker) => marker.geocode);
    useEffect(() => {
      if (!mapRef.current) {
        mapRef.current = map;
      }
      map.fitBounds(markerCoords as LatLngBoundsExpression);
    }, [map, markerCoords]);

    return null;
  }

  const createClusterCustomIcon = function (cluster: MarkerCluster) {
    const supporterCount = cluster
      .getAllChildMarkers()
      .reduce((acc, marker) => acc + marker.options.customOptions.supportersCount, 0);

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

  if (!mapData) return null;

  return (
    <>
      <MapContainer
        className="z-0 h-[450px] w-full lg:h-[600px]"
        center={center as LatLngExpression}
        scrollWheelZoom={true}
      >
        <FullscreenControl
          content={
            "<span class='text-lg font-semibold flex justify-center h-full pt-0.5'>\u{2921}</span>"
          }
        />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {mapOptions.showZones && (
          <For each={zones}>
            {({ geoJSON, color, checked, value }, index) =>
              (zones.every((zone) => !zone.checked) || checked) && (
                <GeoJSON key={`zone-${index}`} data={geoJSON} style={{ color }} />
              )
            }
          </For>
        )}
        {mapOptions.showNeighborhoods && (
          <For each={neighborhoods}>
            {({ geoJSON, color, checked, value }, index) =>
              (neighborhoods.every((neighborhood) => !neighborhood.checked) ||
                checked) && (
                <GeoJSON
                  key={`neighborhood-${index}`}
                  data={geoJSON}
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
                              {toProperCase(value)}
                            </div>
                          </div>
                        </article>
                      );
                    })()}
                  </Popup>
                </GeoJSON>
              )
            }
          </For>
        )}
        {mapOptions.showAddresses && (
          <MarkerClusterGroup
            chunkedLoading
            maxClusterRadius={100}
            showCoverageOnHover={false}
            iconCreateFunction={createClusterCustomIcon}
          >
            <For each={mapData} fallback={<p>Loading...</p>}>
              {({ geocode, location, address, supportersCount, sectionsCount }, index) =>
                (supportersCount || mapOptions.showEmptyAddresses) && (
                  <Marker
                    icon={createAddressCustomIcon(supportersCount)}
                    key={index}
                    customOptions={{
                      supportersCount,
                    }}
                    interactive={true}
                    position={geocode as LatLngExpression}
                    title={location!}
                    eventHandlers={{
                      mouseover: (event) => {
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
                                {location}
                                <div className="font mt-0.5 text-xs  text-gray-600">
                                  {toProperCase(address)}
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
                              onClick={() =>
                                handleMarkerClick({
                                  geocode,
                                  location,
                                  address,
                                  supportersCount,
                                  sectionsCount,
                                })
                              }
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
                )
              }
            </For>
          </MarkerClusterGroup>
        )}
        <FitBoundsComponent />
      </MapContainer>
      {/* <AddressDetailsModal open={open} setOpen={setOpen} modalInfo={modalInfo} /> */}
    </>
  );
}
