import { getClient } from "@/lib/client";
import { gql } from "@apollo/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Tipagem para evitar 'any'
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
  const page = parseInt(searchParams.page || '1', 10);
  const limit = 6;
  const offset = (page - 1) * limit;

  // Usando um try-catch para lidar com possíveis falhas na API
  let events: EventSummary[] = [];
  let totalCount = 0;
  try {
    const { data } = await getClient().query<ListEventsData>({
      query: LIST_EVENTS_QUERY,
      variables: { limit, offset },
      context: { fetchOptions: { next: { revalidate: 10 } } }, // Revalida a cada 10s
    });
    if (data && data.listEvents) {
      events = data.listEvents.events;
      totalCount = data.listEvents.totalCount;
    }
  } catch (error) {
    console.error("Falha ao buscar eventos:", error);
    // Pode renderizar um componente de erro aqui
  }

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="bg-gray-50">
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">Descubra Eventos Incríveis</h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Conecte-se, aprenda e cresça. Encontre os melhores workshops, meetups e conferências perto de você.
          </p>
        </div>

        {events.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
                <Link href={`/events/${event.id}`} key={event.id} className="block group">
                  <div className="bg-white rounded-xl shadow-md overflow-hidden h-full transform transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-1">
                    <div className="p-6 flex flex-col justify-between h-full">
                      <div>
                        <p className="text-sm font-semibold text-blue-600 mb-1">
                          {new Date(event.date).toLocaleDateString('pt-BR', { month: 'long', day: 'numeric' })}
                        </p>
                        <h2 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-blue-600 transition-colors">
                          {event.title}
                        </h2>
                        <p className="text-gray-600 text-sm">{event.location}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="flex justify-center items-center space-x-4 mt-12">
              <Button asChild variant="outline" disabled={page <= 1}>
                <Link href={`/?page=${page - 1}`}>Anterior</Link>
              </Button>
              <span className="text-gray-700">Página {page} de {totalPages}</span>
              <Button asChild variant="outline" disabled={page >= totalPages}>
                <Link href={`/?page=${page + 1}`}>Próxima</Link>
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold text-gray-700">Nenhum evento encontrado.</h2>
            <p className="text-gray-500 mt-2">Por que não cria o primeiro?</p>
            <Button asChild className="mt-6">
              <Link href="/create-event">Criar Evento</Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}