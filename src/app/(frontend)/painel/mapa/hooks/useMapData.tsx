"use client";
import { useFormContext } from "react-hook-form";

export const useMapData = () => {
  const mapData = useFormContext();

  const neighborhoods = mapData.watch("neighborhoods");

  const zones = mapData.watch("zones");

  const addresses = mapData.watch("addresses");

  const sections = mapData.watch("sections");

  return { neighborhoods, zones, addresses, sections, ...mapData };
};
