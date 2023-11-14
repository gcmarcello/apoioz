"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Tooltip } from "react-leaflet";
import L, { LatLngBoundsExpression, LatLngExpression } from "leaflet";
import React from "react";
import MarkerClusterGroup from "react-leaflet-cluster";
import clsx from "clsx";
import { toProperCase } from "@/_shared/utils/format";
import { For } from "@/app/(frontend)/_shared/components/For";
import { generateMapData } from "@/app/api/panel/map/actions";
import { useAction } from "@/app/(frontend)/_shared/hooks/useAction";

export function SupportersMap() {
  const { data: mapData, trigger } = useAction({
    action: generateMapData,
    parser: (data) => {
      const parsed = data.map((a) => ({
        address: a.address,
        geocode: [Number(a.lat), Number(a.lng)],
        location: a.location,
        sectionsCount: a.Section.length,
        supportersCount: a.Section.reduce((accumulator, section) => {
          return accumulator + section.Supporter.length;
        }, 0),
        id: a.id,
      }));

      const parsed2 = parsed.filter((a) => a.supportersCount > 0);

      return parsed2;
    },
  });

  const center = [51.505, -0.09];
  const rectangle = [
    [51.49, -0.08],
    [51.5, -0.06],
  ];

  useEffect(() => {
    trigger();
  }, [trigger]);

  const customIcon = new L.Icon({
    iconUrl: "/urna.png",
    iconSize: new L.Point(55, 55),
  });

  if (!mapData) return null;

  let closeTimeout = null;

  function FitBoundsComponent() {
    const map = useMap();

    const markerCoords = mapData!.map((marker) => marker.geocode);

    useEffect(() => {
      map.fitBounds(markerCoords as LatLngBoundsExpression);
    }, [map, markerCoords]);

    return null;
  }

  return (
    <>
      <MapContainer
        className="z-0 h-[600px]"
        center={center as LatLngExpression}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MarkerClusterGroup
          chunkedLoading
          maxClusterRadius={100}
          showCoverageOnHover={false}
        >
          <For each={mapData} fallback={<p>Loading...</p>}>
            {({ geocode, location, address, supportersCount, sectionsCount }, index) => (
              <Marker
                icon={customIcon}
                key={index}
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
                  offset={[0, -20]}
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
            )}
          </For>
        </MarkerClusterGroup>
        <FitBoundsComponent />
      </MapContainer>
    </>
  );
}
