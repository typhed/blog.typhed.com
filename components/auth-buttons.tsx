"use client"

import { SignInButton, UserButton, useAuth } from "@clerk/react"

import { CLERK_ENABLED } from "@/lib/constants"

function AuthButtonsInner() {
  const { isLoaded, isSignedIn } = useAuth()

  // Until Clerk resolves the session, render nothing rather than flash the
  // wrong control.
  if (!isLoaded) return null

  if (isSignedIn) return <UserButton />

  return (
    <SignInButton mode="modal">
      <button
        type="button"
        className="rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-brand/50 hover:text-foreground"
      >
        Sign in
      </button>
    </SignInButton>
  )
}

/**
 * Header auth island: a modal "Sign in" button when signed out, the Clerk user
 * menu when signed in. Sign-in opens in a modal so the reader stays on the blog.
 * Renders nothing when Clerk is not configured, keeping the placeholder header
 * clean in an unauthenticated build. The hook lives in the inner component so it
 * only runs when a ClerkProvider is actually mounted.
 */
export function AuthButtons() {
  if (!CLERK_ENABLED) return null
  return <AuthButtonsInner />
}
