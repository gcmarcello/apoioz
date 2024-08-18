import { MapAddressType } from "../providers/MapDataProvider";

export const viewModeFilter = (addressViewMode: "all" | "empty" | "some") => {
  return (address: MapAddressType) => {
    if (addressViewMode === "all") return true;
    if (addressViewMode === "empty") return address.supportersCount === 0;
    if (addressViewMode === "some") return address.supportersCount > 0;
    return false;
  };
};
