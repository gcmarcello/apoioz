"use client";
import { useFormContext } from "react-hook-form";
import { MapContextProps } from "../providers/MapDataProvider";

export const useMapData = () => {
  const form = useFormContext<MapContextProps>();

  const neighborhoods = form.watch("neighborhoods");

  const zones = form.watch("zones");

  const addresses = form.watch("addresses");

  const sections = form.watch("sections");

  const supporterSession = form.watch("supporterSession");

  return {
    sections: sections,
    addresses,
    neighborhoods,
    zones,
    supporterSession,
    ...form,
  };
};
