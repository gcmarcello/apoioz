"use client";
import { useState } from "react";
import Calendar from "../components/Calendar";
import { CalendarContext } from "../contexts/calendar.ctx";
import { Event } from "prisma/client";

export default function CalendarProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventOverview, setShowEventOverview] = useState(false);

  function handleEventOverview(event: Event) {
    setSelectedEvent(event);
    setShowEventOverview(true);
  }

  return (
    <CalendarContext.Provider
      value={{
        selectedEvent,
        setSelectedEvent,
        setShowEventOverview,
        showEventOverview,
        handleEventOverview,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
}
