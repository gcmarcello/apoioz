import { contrastingColor } from "@/app/(frontend)/_shared/utils/colors";
import { CalendarIcon, MapPinIcon, UserIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import dayjs from "dayjs";
import { EventListActions } from "./EventListActions";
import { Event, Supporter } from "prisma/client";
import { Date } from "@/app/(frontend)/_shared/components/Date";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { SupporterSessionMiddleware } from "@/middleware/functions/supporterSession.middleware";
import { LockClosedIcon } from "@heroicons/react/20/solid";

export default async function EventListTable({
  events,
}: {
  events: (Event & { Supporter: Supporter & { user: { name: string } } })[];
}) {
  const {
    request: { supporterSession },
  } = await UseMiddlewares()
    .then(UserSessionMiddleware)
    .then(SupporterSessionMiddleware);

  function getInitials(name: string) {
    const letters = name.split("");
    return (letters[0] || "" + letters[1]).toLocaleUpperCase();
  }

  return (
    <ol className="divide-y divide-gray-100 text-sm leading-6 ">
      {events.map((event) => {
        const [bgColor, letterColor] = contrastingColor();
        return (
          <li key={event.id} className="relative flex space-x-6 py-6 xl:static">
            <div
              style={{
                backgroundColor: bgColor || "transparent",
                color: letterColor || "transparent",
              }}
              className={clsx(
                `flex h-14 min-w-[3.5rem] items-center justify-center rounded-full font-bold `
              )}
            >
              {getInitials(event.name)}
            </div>
            <div className="flex-auto">
              <div className="flex justify-between">
                <div>
                  <h3 className="pr-10 font-semibold text-gray-900 xl:pr-0">
                    {event.name}
                  </h3>
                  <div className="flex items-center gap-3">
                    <UserIcon className="h-5 w-5 text-gray-500" />
                    <h3 className="text-gray-500 xl:pr-0">
                      {event.Supporter.user.name}
                    </h3>
                    {event.private && (
                      <LockClosedIcon className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                </div>
                {supporterSession.level === 4 && (
                  <div className="px-2">
                    <EventListActions event={event} />
                  </div>
                )}
              </div>

              <dl className="mt-2 flex flex-col gap-x-5 text-gray-500 xl:flex-row">
                <div>
                  <div className="flex items-start space-x-3">
                    <dt className="mt-0.5">
                      <span className="sr-only">Date</span>
                      <CalendarIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </dt>
                    <dd>
                      <div className="flex items-baseline">
                        <time dateTime={dayjs(event.dateStart).toISOString()}>
                          {
                            <Date
                              value={dayjs(event.dateStart)
                                .utcOffset(-3)
                                .format("DD/MM/YYYY HH:mm")}
                            />
                          }
                        </time>
                        <span className="mx-1"> - </span>
                        <time dateTime={dayjs(event.dateEnd).toISOString()}>
                          {
                            <Date
                              value={dayjs(event.dateEnd)
                                .utcOffset(-3)
                                .locale("pt-br")
                                .format("HH:mm")}
                            />
                          }
                        </time>
                      </div>
                    </dd>
                  </div>
                </div>

                <div className="mt-2 flex items-start space-x-3 xl:ml-3.5 xl:mt-0 xl:border-l xl:border-gray-400 xl:border-opacity-50 xl:pl-3.5">
                  <dt className="mt-0.5">
                    <span className="sr-only">Location</span>
                    <MapPinIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </dt>
                  <dd>{event.location}</dd>
                </div>
              </dl>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
