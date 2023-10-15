import { Event } from "@prisma/client";
import dayjs from "dayjs";

export default function googleCalendarLink(event: Event) {
  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${
    event.name
  }&dates=${dayjs(event.date).format("YYYYMMDDTHHmmssZZ")}/${dayjs(
    event.date
  ).format("YYYYMMDDTHHmmssZZ")}&location=${
    event.location
  }&sprop=name:Name&sprop=website:EventWebite&details=${
    event.description
  }&sf=true&output=xml`;
}
