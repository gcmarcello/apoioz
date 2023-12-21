"use client";
import { Neighborhood, Zone, Address } from "@prisma/client";
import { useFormContext } from "react-hook-form";
import { MapDataContext } from "../providers/MapDataProvider";

export const useMapData = () => {
  const mapData = useFormContext<MapDataContext>();

  const neighborhoods = mapData.watch("neighborhoods");

  const zones = mapData.watch("zones");

  const addresses = mapData.watch("addresses");

  const sections = mapData.watch("sections");

  return { neighborhoods, zones, addresses, sections, ...mapData };
};
