import { Event } from "@prisma/client";

import EventListTable from "./EventListTable";

export default function EventList({
  events,
}: {
  events: { active: Event[]; pending: Event[] };
}) {
  return (
    <section className="divide-y">
      <div className="py-4">
        <h2 className="text-base font-semibold leading-6 text-gray-900">
          Próximos Eventos
        </h2>
        {events.active.length ? (
          <EventListTable events={events.active} />
        ) : (
          <span className="text-sm">Nenhum evento ativo</span>
        )}
      </div>
      <div className="py-4">
        <h2 className="text-base font-semibold leading-6 text-gray-900">
          Eventos Pendentes
        </h2>
        {events.pending.length ? (
          <EventListTable events={events.pending} />
        ) : (
          <span className="text-sm">Nenhum evento pendente</span>
        )}
      </div>
    </section>
  );
}
