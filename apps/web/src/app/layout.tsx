// apps/web/src/app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";

// ADIÇÃO CRÍTICA: Importa o CSS global que conecta o Tailwind
import "./globals.css";

// Nossos providers
import { ThemeProvider } from "@/components/theme-provider";
import { ApolloWrapper } from "@/lib/apollo-provider";
import { AuthProvider } from '@/context/AuthContext';

// Nosso componente de UI
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EventPlatform | Encontre Eventos Incríveis",
  description: "Conecte-se, aprenda e cresça. Encontre os melhores workshops, meetups e conferências.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      {/* MUDANÇA 1: As classes de cor de fundo e texto base são aplicadas diretamente no <body>.
        Isso garante que TODA a página visível tenha a cor de tema correta.
      */}
      <body className={`${inter.className} antialiased bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ApolloWrapper>
            <AuthProvider>
              {/* MUDANÇA 2: Usamos um layout flexbox vertical que ocupa no mínimo a altura total da tela.
                Isso resolve o problema de páginas curtas e prepara o terreno para um rodapé fixo no futuro.
              */}
              <div className="flex flex-col min-h-screen">
                <Navbar />
                {/* MUDANÇA 3: A tag <main> agora é um container flexível que cresce para ocupar o espaço disponível.
                  Ela não precisa mais de classes de cor de fundo.
                */}
                <main className="flex-grow">
                  {children}
                </main>
                {/* Um <Footer /> poderia ser adicionado aqui no futuro e ficaria corretamente no final da página */}
              </div>
            </AuthProvider>
          </ApolloWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}