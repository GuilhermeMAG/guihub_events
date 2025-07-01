// apps/web/src/components/theme-provider.tsx
'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

// Usamos o utilitário 'ComponentProps' do React para extrair os tipos de props
// diretamente do componente 'NextThemesProvider'. É uma técnica mais robusta.
type ThemeProviderProps = React.ComponentProps<typeof NextThemesProvider>;

// Este componente agora está corretamente tipado e funcional.
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}