import { Event } from "@prisma/client";
import { createContext } from "react";

export class CalendarContextProps {
  selectedEvent: Event | null;
  setSelectedEvent: React.Dispatch<React.SetStateAction<Event | null>>;
  showEventOverview: boolean;
  setShowEventOverview: React.Dispatch<React.SetStateAction<boolean>>;
  handleEventOverview: (event: Event) => void;
}

export const CalendarContext = createContext(new CalendarContextProps());
