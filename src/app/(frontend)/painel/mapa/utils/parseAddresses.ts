import { RawMapData } from "../types/RawMapData";

export function parseAddresses(addresses: RawMapData["addresses"]) {
  const parsedAddresses = addresses.map((a) => {
    const sectionsCount = a.Section.length;
    const supportersCount = a.Section.reduce((accumulator, section) => {
      return accumulator + section.Supporter.length;
    }, 0);

    return {
      address: a.address,
      geocode: [Number(a.lat), Number(a.lng)],
      location: a.location,
      neighborhood: a.neighborhood,
      zone: a.Section[0].Zone.number,
      sectionsCount,
      supportersCount,
      id: a.id,
    };
  });
  return parsedAddresses;
}
