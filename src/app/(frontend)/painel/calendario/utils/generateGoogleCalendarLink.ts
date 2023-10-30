import { Event } from "@prisma/client";
import dayjs from "dayjs";

export function googleCalendarLink(event: Event) {
  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${
    event.name
  }&dates=${dayjs(event.dateStart).format("YYYYMMDDTHHmmssZZ")}/${dayjs(
    event.dateStart
  ).format("YYYYMMDDTHHmmssZZ")}&location=${
    event.location
  }&sprop=name:Name&sprop=website:EventWebite&details=${
    event.description
  }&sf=true&output=xml`;
}
