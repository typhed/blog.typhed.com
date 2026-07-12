"use client"

import * as React from "react"
import { ClerkProvider } from "@clerk/react"

import { CLERK_ENABLED, CLERK_PUBLISHABLE_KEY } from "@/lib/constants"

/**
 * Client-side Clerk provider. This blog is a static export (`output: "export"`)
 * with no server, so auth is client-only: no middleware, no `auth()`, no API
 * routes. Marking the wrapper `"use client"` keeps ClerkProvider on the client
 * path and off the server helpers that a static export cannot run.
 *
 * With no publishable key configured, the provider is skipped entirely so the
 * site still builds and runs untracked. Components that use Clerk's control
 * components guard on `CLERK_ENABLED` for the same reason.
 */
export function ClerkAuthProvider({ children }: { children: React.ReactNode }) {
  if (!CLERK_ENABLED) return <>{children}</>

  return (
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY}
      appearance={{ variables: { colorPrimary: "#6366f1" } }}
    >
      {children}
    </ClerkProvider>
  )
}
