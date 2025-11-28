"use client"

import React, { useEffect, useState, ReactNode } from "react"
import { ThemeProvider as NextThemesProvider, ThemeProviderProps } from "next-themes"

interface LocalThemeProviderProps extends Omit<ThemeProviderProps, 'children'> {
  children: ReactNode
}

// Guard rendering of next-themes until mounted to avoid SSR/CSR hydration
// mismatches where next-themes mutates the <html> class before React hydrates.
export function ThemeProvider({ children, ...props }: LocalThemeProviderProps): React.ReactElement {
  const [mounted, setMounted] = useState<boolean>(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Render children without theme provider on server / until mount to keep
  // server HTML identical to the client initial HTML and avoid hydration errors.
  if (!mounted) return <>{children}</>

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}