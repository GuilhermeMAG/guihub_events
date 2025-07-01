// apps/web/src/lib/apollo-provider.tsx
"use client";

import { ApolloLink, HttpLink } from "@apollo/client";
import {
  ApolloNextAppProvider,
  ApolloClient,
  InMemoryCache,
} from "@apollo/experimental-nextjs-app-support";

function makeClient() {
  const httpLink = new HttpLink({
    uri: "http://localhost:4000/", // URL da nossa API GraphQL
    fetchOptions: { cache: "no-store" },
  });

  // Middleware para adicionar o token de autenticação
  const authLink = new ApolloLink((operation, forward) => {
    // Pega o token do localStorage
    const token = typeof window !== "undefined" ? localStorage.getItem("event-platform-token") : null;

    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : "",
      },
    });

    return forward(operation);
  });

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink),
  });
}

export function ApolloWrapper({ children }: React.PropsWithChildren) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}