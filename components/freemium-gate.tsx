"use client"

import * as React from "react"
import { SignInButton, useAuth } from "@clerk/react"

import { ACCESS_CATEGORIES, CLERK_ENABLED } from "@/lib/constants"

function SignInCard() {
  return (
    <div className="my-8 rounded-xl border border-border bg-card/50 p-8 text-center">
      <p className="text-2xl" aria-hidden="true">
        {ACCESS_CATEGORIES.freemium.emoji}
      </p>
      <h2 className="mt-3 font-display text-xl font-semibold text-foreground">
        Sign in to keep reading
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        This is a freemium post. Sign in with a free TyPhed account, the same login as the main
        site, to read the rest.
      </p>
      <div className="mt-5 flex justify-center">
        <SignInButton mode="modal">
          <button
            type="button"
            className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90"
          >
            Sign in to read
          </button>
        </SignInButton>
      </div>
    </div>
  )
}

function FreemiumGateInner({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth()

  // Hold the space quietly until Clerk resolves the session, so the body does
  // not flash before the gate decides.
  if (!isLoaded) {
    return <div className="my-8 h-40 animate-pulse rounded-xl border border-border bg-card/30" />
  }

  return isSignedIn ? <>{children}</> : <SignInCard />
}

/**
 * Gate for a freemium post body: signed-in readers see the content, everyone
 * else gets a sign-in card. With Clerk not configured, the body renders
 * ungated so an unauthenticated build still shows every post.
 *
 * This is a soft gate. The body is compiled at build time and travels in the
 * page payload, so it is hidden, not secret - which is the right trade for
 * freemium. Genuine paid content would need a server or edge check instead.
 */
export function FreemiumGate({ children }: { children: React.ReactNode }) {
  if (!CLERK_ENABLED) return <>{children}</>
  return <FreemiumGateInner>{children}</FreemiumGateInner>
}
