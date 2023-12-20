import { Event } from "@prisma/client";
import dayjs from "dayjs";

function generateDay(today: any, index: number): string {
  const date = today.date(index + 1);
  return date.format("YYYY-MM-DD");
}

export function generateCalendarDays(
  today: any,
  events?: { active: Event[]; pending: Event[] }
) {
  const actualToday = dayjs();
  const daysInMonth = today.daysInMonth();
  const month = today.month();
  const firstDayOfTheMonth = today.startOf("month");
  const firstWeekDayOfTheMonth = today.startOf("month").day();
  const lastDayOfTheMonth = today.endOf("month");

  const daysBefore = Array.from(
    { length: firstWeekDayOfTheMonth === 0 ? 0 : firstWeekDayOfTheMonth },
    (_, i) => ({
      date: firstDayOfTheMonth.subtract(i + 1, "day").format("YYYY-MM-DD"),
      isCurrentMonth: false,
      isPreviousMonth: true,
      isToday: false,
      isSelected: false,
    })
  ).reverse();

  const monthDays = Array.from({ length: daysInMonth }, (_, i) => ({
    date: generateDay(today, i),
    isCurrentMonth: dayjs(generateDay(today, i)).month() === month,
    isToday:
      dayjs(generateDay(today, i)).date() === dayjs().date() &&
      dayjs(generateDay(today, i)).month() === dayjs().month() &&
      dayjs(generateDay(today, i)).year() === dayjs().year(),
    isSelected: false,
    events: events?.active?.filter(
      (event) => dayjs(event.dateStart).format("YYYY-MM-DD") === generateDay(today, i)
    ),
  }));

  const daysAfter = Array.from(
    { length: 42 - [...daysBefore, ...monthDays].length },
    (_, i) => {
      const afterDate = lastDayOfTheMonth.add(i + 1, "day").format("YYYY-MM-DD");
      return {
        date: afterDate,
        isCurrentMonth: false,
        isNextMonth: true,
        isToday: false,
        isSelected: false,
        events: events?.active?.filter(
          (event) => dayjs(event.dateStart).format("YYYY-MM-DD") === afterDate
        ),
      };
    }
  );

  return [...daysBefore, ...monthDays, ...daysAfter];
}
