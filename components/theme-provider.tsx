"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

/**
 * Thin wrapper around next-themes. Configuration (attribute, default theme,
 * enableSystem) is passed by the consumer in `app/layout.tsx`.
 * Inlined from the shared @typhed/ui package.
 */
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
