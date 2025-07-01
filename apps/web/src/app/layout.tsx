// apps/web/src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
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
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ApolloWrapper>
            <AuthProvider>
              <Navbar />
              <main className="bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
                {children}
              </main>
            </AuthProvider>
          </ApolloWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}