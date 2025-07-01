// apps/web/src/app/page.tsx

import { getClient } from "@/lib/client";
import { gql } from "@apollo/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type EventSummary = {
  id: string;
  title: string;
  date: string;
  location: string;
};

type ListEventsData = {
  listEvents: {
    totalCount: number;
    events: EventSummary[];
  };
};

const LIST_EVENTS_QUERY = gql`
  query ListEvents($limit: Int, $offset: Int) {
    listEvents(limit: $limit, offset: $offset) {
      totalCount
      events {
        id
        title
        date
        location
      }
    }
  }
`;

export default async function HomePage({ searchParams }: { searchParams: { page?: string } }) {
  const page = parseInt(searchParams?.page || '1', 10);
  const limit = 6;
  const offset = (page - 1) * limit;

  let events: EventSummary[] = [];
  let totalCount = 0;
  try {
    const { data } = await getClient().query<ListEventsData>({
      query: LIST_EVENTS_QUERY,
      variables: { limit, offset },
      context: { fetchOptions: { next: { revalidate: 0 } } },
    });
    if (data?.listEvents) {
      events = data.listEvents.events;
      totalCount = data.listEvents.totalCount;
    }
  } catch (error) {
    console.error("Falha ao buscar eventos:", error);
  }

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-gray-50">Descubra Eventos Incríveis</h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Conecte-se, aprenda e cresça. Encontre os melhores workshops, meetups e conferências perto de você.
          </p>
        </div>

        {events.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
                <Link href={`/events/${event.id}`} key={event.id} className="block group">
                  <div className="bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 shadow-md overflow-hidden h-full transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <div className="p-6 flex flex-col justify-between h-full">
                      <div>
                        <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-1">
                          {format(new Date(event.date), "dd 'de' MMMM", { locale: ptBR })}
                        </p>
                        <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-50 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {event.title}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">{event.location}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-4 mt-12">
                <Button asChild variant="outline" disabled={page <= 1}>
                  <Link href={page > 1 ? `/?page=${page - 1}` : '#'}>Anterior</Link>
                </Button>
                <span className="text-gray-700 dark:text-gray-300">
                  Página {page} de {totalPages}
                </span>
                <Button asChild variant="outline" disabled={page >= totalPages}>
                  <Link href={page < totalPages ? `/?page=${page + 1}` : '#'}>Próxima</Link>
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">Nenhum evento encontrado.</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Por que não cria o primeiro?</p>
            <Button asChild className="mt-6">
              <Link href="/create-event">Criar Evento</Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}