import L from "leaflet";

export function handleMarkerHover(
  closeTimeout: string | number | NodeJS.Timeout | undefined | null,
  marker: L.MarkerCluster,
  action: "mouseover" | "mouseout"
) {
  if (closeTimeout && action === "mouseover") clearTimeout(closeTimeout);

  if (action === "mouseout") {
    closeTimeout = setTimeout(() => {
      marker.closePopup();
    }, 300);
  } else {
    marker.openPopup();
  }
}
