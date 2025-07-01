// apps/web/src/app/events/[id]/page.tsx

import { getClient } from "@/lib/client";
import { gql } from "@apollo/client";
import { Calendar, MapPin, User, DollarSign, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import EventRegistrationButton from "@/components/EventRegistrationButton";

type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  price: number;
  organizer: {
    name: string;
  };
};

const GET_EVENT_QUERY = gql`
  query GetEvent($id: ID!) {
    getEvent(id: $id) {
      id
      title
      description
      date
      location
      price
      organizer {
        name
      }
    }
  }
`;

function formatEventDate(dateString: string) {
  return format(new Date(dateString), "EEEE, dd 'de' MMMM 'de' ইন্ডিয়ার, 'às' HH:mm'h'", { locale: ptBR });
}

function formatPrice(price: number) {
  if (price === 0) return 'Gratuito';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
}

export default async function EventDetailPage({ params }: { params: { id: string } }) {
  const eventId = params?.id;

  try {
    const { data } = await getClient().query<{ getEvent: Event | null }>({
      query: GET_EVENT_QUERY,
      variables: { id: eventId },
      errorPolicy: 'all',
      context: { fetchOptions: { next: { revalidate: 0 } } },
    });

    if (!data || !data.getEvent) {
      notFound();
    }

    const { getEvent: event } = data;

    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-12">
          <Link href="/" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para todos os eventos
          </Link>
          <div className="bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 shadow-lg overflow-hidden">
            <div className="p-8 md:p-12">
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-gray-50 mb-4">{event.title}</h1>
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-x-6 gap-y-3 text-lg text-gray-600 dark:text-gray-300 mb-8">
                <div className="flex items-center">
                  <User className="h-5 w-5 mr-2 text-blue-600" />
                  <span>Organizado por <strong>{event.organizer.name}</strong></span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                  <span>{formatEventDate(event.date)}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                  <span>{event.location}</span>
                </div>
              </div>

              <div className="prose prose-lg dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 mb-10">
                <p>{event.description}</p>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
                <div className="flex flex-col sm:flex-row justify-between items-center">
                  <div className="flex items-center text-3xl font-bold text-gray-900 dark:text-gray-50 mb-4 sm:mb-0">
                    <DollarSign className="h-8 w-8 mr-2 text-green-500" />
                    <span>{formatPrice(event.price)}</span>
                  </div>
                  <EventRegistrationButton eventId={event.id} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Erro ao buscar evento:", error);
    notFound();
  }
}