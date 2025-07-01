// apps/web/src/components/theme-switcher.tsx
'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // useEffect só roda no cliente, então usamos isso para garantir que não haja
  // erro de hidratação ao tentar renderizar um ícone diferente no servidor e no cliente.
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Se o componente ainda não montou, renderiza um placeholder para evitar layout shift.
  if (!mounted) {
    return <div className="w-10 h-10" />;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  );
}