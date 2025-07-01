'use client';

import { useAuth } from "@/context/AuthContext";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { gql, useMutation } from "@apollo/client";
import { useState } from "react";

const REGISTER_FOR_EVENT_MUTATION = gql`
  mutation RegisterForEvent($eventId: ID!) {
    registerForEvent(eventId: $eventId) {
      id
      status
    }
  }
`;

export default function EventRegistrationButton({ eventId }: { eventId: string }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [isRegistered, setIsRegistered] = useState(false); // Simples estado para feedback

  const [register, { loading: mutationLoading, error }] = useMutation(REGISTER_FOR_EVENT_MUTATION, {
    onCompleted: () => {
      setIsRegistered(true);
    },
    onError: (err) => {
      // Se o erro for "já inscrito", atualiza a UI para refletir isso
      if (err.message.includes("Você já está inscrito")) {
        setIsRegistered(true);
      }
      console.error("Registration failed:", err);
    }
  });

  const handleRegister = () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    register({ variables: { eventId } });
  };

  if (isLoading) {
    return <div className="h-12 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>;
  }

  if (isRegistered) {
    return (
      <Button disabled className="w-full sm:w-auto bg-green-600 hover:bg-green-600">
        Você está inscrito!
      </Button>
    );
  }

  return (
    <>
      <Button
        onClick={handleRegister}
        disabled={mutationLoading}
        className="w-full sm:w-auto transition-transform transform hover:scale-105"
      >
        {mutationLoading ? 'Processando...' : 'Inscreva-se Agora'}
      </Button>
      {error && !isRegistered && <p className="text-sm text-red-500 mt-2">{error.message}</p>}
    </>
  );
}