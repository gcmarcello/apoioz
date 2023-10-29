"use client";

import { getAddressesByCampaign } from "@/backend/resources/elections/locations/locations.actions";
import { For } from "@/frontend/(shared)/components/For";
import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  FeatureGroup,
  LayerGroup,
  Rectangle,
  useMap,
} from "react-leaflet";
import useSWRMutation from "swr/mutation";
import L from "leaflet";
import React from "react";
import MarkerClusterGroup from "react-leaflet-cluster";

export function SupportersMap() {
  const { data: addresses, trigger } = useSWRMutation("getAddresses", async () => {
    const addresses = await getAddressesByCampaign();

    console.log(addresses);

    return addresses.map((a) => ({
      id: a.id,
      geocode: [Number(a.lat), Number(a.lng)],
      location: a.location,
    }));
  });

  useEffect(() => {
    (async () => {
      const addresses = await trigger();

      console.log(addresses);
    })();
  }, []);

  const center = [51.505, -0.09];
  const rectangle = [
    [51.49, -0.08],
    [51.5, -0.06],
  ];

  if (!addresses) return;

  const customIcon = new L.Icon({
    iconUrl: "/urna.png",
    iconSize: new L.Point(40, 47),
  });

  function FitBoundsComponent() {
    const map = useMap();

    const markerCoords = addresses!.map((marker) => marker.geocode);

    useEffect(() => {
      map.fitBounds(markerCoords);
    }, [map]);

    return null;
  }

  return (
    <MapContainer className="z-0 h-[600px]" center={center} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MarkerClusterGroup chunkedLoading maxClusterRadius={80}>
        <For each={addresses} fallback={<p>Loading...</p>}>
          {({ geocode, location }, index) => (
            <Marker icon={customIcon} key={index} position={geocode} title={location!} />
          )}
        </For>
      </MarkerClusterGroup>
      <FitBoundsComponent />
    </MapContainer>
  );
}
