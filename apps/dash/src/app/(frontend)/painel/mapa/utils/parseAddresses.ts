import { RawMapData } from "../types/RawMapData";

export function parseAddresses(addresses: RawMapData["addresses"]) {
  const parsedAddresses = addresses.map((a) => {
    return {
      address: a.address,
      geocode: [Number(a.lat), Number(a.lng)],
      sectionsCount: a._count.Section,
      supportersCount: a.Supporter.length,
      location: a.location,
      neighborhood: a.neighborhood,
      zoneId: a.zoneId ?? "",
      id: a.id,
    };
  });
  return parsedAddresses;
}
