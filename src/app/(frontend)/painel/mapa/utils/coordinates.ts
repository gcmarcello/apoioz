import L, { LatLngBoundsExpression, LatLngExpression, MarkerCluster } from "leaflet";

export function retrieveBoundsFromGeoJSONS(array: any[]) {
  if (!array.length) return null;
  const jointGeoJSON = L.geoJSON(array);
  return jointGeoJSON.getBounds();
}

export function filterOutValues({
  zones,
  neighborhoods,
  sections,
  filter,
  data,
}: {
  zones: any[];
  neighborhoods: any[];
  sections: any[];
  filter: string;
  data: any;
}) {
  switch (filter) {
    case "sections":
      if (data.geocode) return null;
      if (
        !neighborhoods.find((n) => n.name === data.neighborhood).checked &&
        neighborhoods.some((n) => n.checked)
      ) {
        console.log(data.zone);
        return null;
      }

      if (!zones.find((z) => z.label === data.zone).checked) {
        console.log(data.zone);
        return null;
      }

      break;

    default:
      break;
  }
}
