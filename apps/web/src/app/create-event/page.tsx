// apps/web/src/app/create-event/page.tsx
'use client';

import { useEffect } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const CREATE_EVENT_MUTATION = gql`
  mutation CreateEvent($title: String!, $description: String!, $date: DateTime!, $location: String!, $price: Float!) {
    createEvent(title: $title, description: $description, date: $date, location: $location, price: $price) {
      id
      title
    }
  }
`;

const createEventSchema = z.object({
  title: z.string().min(5, 'O título deve ter pelo menos 5 caracteres.'),
  description: z.string().min(10, 'A descrição deve ter pelo menos 10 caracteres.'),
  date: z.string().refine((val) => val && !isNaN(Date.parse(val)), {
    message: 'Por favor, forneça uma data e hora válidas.',
  }),
  location: z.string().min(3, 'A localização é obrigatória.'),
  price: z.coerce.number().min(0, 'O preço não pode ser negativo.'),
});

type CreateEventFormValues = z.infer<typeof createEventSchema>;

export default function CreateEventPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateEventFormValues>({
    resolver: zodResolver(createEventSchema),
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  const [createEvent, { loading: mutationLoading, error: apiError }] = useMutation(CREATE_EVENT_MUTATION, {
    onCompleted: (data) => {
      router.push(`/events/${data.createEvent.id}`);
    },
    refetchQueries: ['ListEvents'],
    onError: (error) => {
      console.error("Create Event Error:", error);
    }
  });

  // CORREÇÃO FINAL: Ajuste na submissão do formulário
  const onSubmit = (data: CreateEventFormValues) => {
    // 1. Pega a string de data local do formulário (ex: "2025-07-01T14:31")
    // 2. Cria um objeto Date, que o navegador interpreta no fuso horário local.
    // 3. Converte para uma string ISO 8601 completa em UTC (ex: "2025-07-01T17:31:00.000Z")
    const dateInUTC = new Date(data.date).toISOString();

    // 4. Envia a data no formato correto para a API
    createEvent({
      variables: {
        ...data,
        date: dateInUTC,
      },
    });
  };

  if (isLoading) {
    return <div className="text-center p-10">Carregando...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 shadow-xl space-y-6">
          <div className="border-b border-gray-200 dark:border-gray-800 pb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Criar Novo Evento</h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Preencha os detalhes abaixo para divulgar seu evento na plataforma.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Título do Evento</Label>
            <Input id="title" type="text" placeholder="Ex: Workshop de TypeScript Avançado" {...register('title')} />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Descreva os detalhes do seu evento: público-alvo, tópicos abordados, etc."
              {...register('description')}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="date">Data e Hora</Label>
              <Input id="date" type="datetime-local" {...register('date')} />
              {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Preço (R$)</Label>
              <Input id="price" type="number" step="0.01" placeholder="0.00 para gratuito" {...register('price')} />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Localização</Label>
            <Input id="location" type="text" placeholder="Ex: Online (via Zoom) ou Endereço Completo" {...register('location')} />
            {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>}
          </div>
          {apiError && <p className="text-red-500 text-sm text-center py-2">{apiError.message}</p>}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-800 flex justify-end">
            <Button type="submit" disabled={mutationLoading} className="w-full sm:w-auto">
              {mutationLoading ? 'Publicando...' : 'Publicar Evento'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}