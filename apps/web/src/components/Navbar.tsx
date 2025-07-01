'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from './ui/button';

export default function Navbar() {
  const { isAuthenticated, logout, isLoading } = useAuth();

  // Renderiza um placeholder ou um skeleton enquanto o estado de autenticação carrega
  // Isso evita o "flash" de conteúdo incorreto.
  if (isLoading) {
    return (
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-3 h-[68px]"></div>
      </header>
    );
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
          EventPlatform
        </Link>
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Button asChild variant="ghost" className="mt-1 text-sm text-gray-600">
                <Link href="/create-event">Criar Evento</Link>
              </Button>
              <Button onClick={logout} variant="destructive">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Cadastre-se</Link>
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}