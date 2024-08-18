import clsx from "clsx";
import { toProperCase, Badge } from "odinkit";
import { Popup } from "react-leaflet";

export default function MarkerPopup({
  closeTimeout,
  location,
  address,
  supportersCount,
  sectionsCount,
  geocode,
  zone,
  neighborhood,
  id,
  setSelectedAddress,
}: {
  closeTimeout: string | number | NodeJS.Timeout | undefined | null;
  location: string;
  address: string;
  supportersCount: number;
  sectionsCount: number;
  geocode: number[];
  zone: number;
  neighborhood: string;
  id: string;
  setSelectedAddress: any;
}) {
  return (
    <Popup
      interactive={true}
      offset={[0, 0]}
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
          <article className="max-w-23xl flex flex-col items-start  gap-y-3 ">
            <div className="text-wrap	text-sm font-bold text-gray-900">
              {location}
              <div className="font mt-0.5 text-xs  text-gray-600">
                {toProperCase(address || "")}
              </div>
            </div>

            <div className="flex w-full items-center justify-start gap-3">
              <Badge color="indigo">
                {supportersCount +
                  (supportersCount > 1 ? " Apoiadores" : " Apoiador")}
              </Badge>
              <Badge color="emerald">
                {sectionsCount + (sectionsCount > 1 ? " Seções" : " Seção")}
              </Badge>
            </div>

            <div
              onClick={() => {
                setSelectedAddress({
                  geocode,
                  location,
                  address,
                  supportersCount,
                  sectionsCount,
                  zone,
                  neighborhood,
                  id,
                });

                if (document.fullscreenElement) {
                  document.exitFullscreen();
                }
              }}
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
  );
}
