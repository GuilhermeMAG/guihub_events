import { getClient } from "@/lib/client";
import { gql } from "@apollo/client";
import { Calendar, MapPin, User, DollarSign, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

// Definindo um tipo para o evento, para evitar 'any'
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

// Função para formatar data de forma mais elegante
function formatEventDate(dateString: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: 'America/Sao_Paulo',
  }).format(new Date(dateString));
}

// Função para formatar preço
function formatPrice(price: number) {
  if (price === 0) return 'Gratuito';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
}

export default async function EventDetailPage({ params }: { params: { id: string } }) {
  try {
    const { data } = await getClient().query<{ getEvent: Event | null }>({
      query: GET_EVENT_QUERY,
      variables: { id: params.id },
      // Evita que um erro na busca de um evento que não existe quebre a build
      errorPolicy: 'all',
    });

    if (!data || !data.getEvent) {
      notFound(); // Renderiza a página 404 do Next.js
    }

    const { getEvent: event } = data;

    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-12">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:underline mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para todos os eventos
          </Link>
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
            <div className="p-8 md:p-12">
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">{event.title}</h1>
              <div className="flex flex-wrap gap-x-6 gap-y-3 text-lg text-gray-600 mb-8">
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

              <div className="prose prose-lg max-w-none text-gray-800 mb-10">
                <p>{event.description}</p>
              </div>

              <div className="border-t pt-8">
                <div className="flex flex-col sm:flex-row justify-between items-center">
                  <div className="flex items-center text-3xl font-bold text-gray-900 mb-4 sm:mb-0">
                    <DollarSign className="h-8 w-8 mr-2 text-green-500" />
                    <span>{formatPrice(event.price)}</span>
                  </div>
                  <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-transform transform hover:scale-105">
                    Inscreva-se Agora
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Erro ao buscar evento:", error);
    return <div className="text-center p-10">Ocorreu um erro ao carregar esta página.</div>
  }
}