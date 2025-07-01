'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from './ui/button';
import { ThemeSwitcher } from './theme-switcher';

export default function Navbar() {
  const { isAuthenticated, logout, isLoading } = useAuth();

  return (
    <header className="bg-white/80 dark:bg-gray-950/80 shadow-sm sticky top-0 z-50 backdrop-blur-lg">
      <nav className="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-gray-50 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          EventPlatform
        </Link>
        <div className="flex items-center space-x-2">
          <ThemeSwitcher />
          {isLoading ? (
            <div className="w-24 h-10 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse"></div>
          ) : isAuthenticated ? (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/create-event">Criar Evento</Link>
              </Button>
              <Button onClick={logout} variant="destructive" size="sm">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/signup">Cadastre-se</Link>
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}