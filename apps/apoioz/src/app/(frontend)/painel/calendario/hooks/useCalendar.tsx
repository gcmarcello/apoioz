import { useContext } from "react";
import { CalendarContext } from "../contexts/calendar.ctx";

export const useCalendar = () => {
  const calendarContext = useContext(CalendarContext);

  return calendarContext;
};
