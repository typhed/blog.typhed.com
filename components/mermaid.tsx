"use client"

import * as React from "react"
import { useTheme } from "next-themes"

/**
 * Renders a ```mermaid fence as an SVG diagram, client-side only.
 *
 * Mermaid needs the DOM, so it is imported lazily inside the effect: posts
 * without a diagram never load the library, and it never runs during the
 * static export (the server render emits the placeholder below, then the
 * browser draws the SVG on mount). The diagram re-renders when the theme
 * changes so its colors track light/dark. `securityLevel: "strict"` runs the
 * output through mermaid's DOMPurify sanitiser.
 */
type MermaidModule = typeof import("mermaid")

let mermaidPromise: Promise<MermaidModule["default"]> | null = null
function loadMermaid() {
  if (!mermaidPromise) mermaidPromise = import("mermaid").then((m) => m.default)
  return mermaidPromise
}

let instanceCounter = 0

export function Mermaid({ chart }: { chart: string }) {
  const { resolvedTheme } = useTheme()
  const [svg, setSvg] = React.useState("")
  const [error, setError] = React.useState("")
  const idRef = React.useRef(`mermaid-${(instanceCounter += 1)}`)

  React.useEffect(() => {
    let cancelled = false
    const isDark =
      resolvedTheme === "dark" ||
      (resolvedTheme == null && document.documentElement.classList.contains("dark"))

    loadMermaid()
      .then(async (mermaid) => {
        mermaid.initialize({ startOnLoad: false, securityLevel: "strict" })
        // `mermaid.initialize` is global, so setting the theme there races across
        // the several diagrams on a page. Pin the theme per-diagram with an init
        // directive in the source instead, which is deterministic per render.
        const themed = `%%{init: {"theme": "${isDark ? "dark" : "default"}"}}%%\n${chart}`
        // A theme-suffixed id keeps re-renders from colliding in mermaid's cache.
        const { svg: rendered } = await mermaid.render(
          `${idRef.current}-${isDark ? "d" : "l"}`,
          themed,
        )
        if (!cancelled) {
          setSvg(rendered)
          setError("")
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : String(err))
      })

    return () => {
      cancelled = true
    }
  }, [chart, resolvedTheme])

  if (error) {
    return (
      <pre className="my-6 overflow-x-auto rounded-lg border border-destructive/50 bg-card p-4 font-mono text-sm text-destructive">
        {`Diagram failed to render: ${error}\n\n${chart}`}
      </pre>
    )
  }

  if (!svg) {
    return (
      <div className="my-6 flex min-h-[8rem] items-center justify-center rounded-lg border border-border bg-card/50 text-sm text-muted-foreground">
        Rendering diagram…
      </div>
    )
  }

  return (
    <div
      className="my-6 flex justify-center overflow-x-auto rounded-lg border border-border bg-card/50 p-4 [&_svg]:h-auto [&_svg]:max-w-full"
      // svg is produced by mermaid from trusted post content and sanitised by
      // securityLevel:"strict"; there is no user-supplied markup here.
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}

export default Mermaid
