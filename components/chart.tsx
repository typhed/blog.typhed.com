"use client"

import dynamic from "next/dynamic"

/**
 * Client entry point for a ```chart fence. The Recharts implementation is
 * loaded with `ssr: false` so the heavy library is split into its own chunk,
 * fetched only when a chart is actually on the page, and never evaluated during
 * the static export. `spec` is the raw JSON body of the fence.
 */
const ChartInner = dynamic(() => import("./chart-inner"), {
  ssr: false,
  loading: () => (
    <div className="my-6 flex min-h-[8rem] items-center justify-center rounded-lg border border-border bg-card/50 text-sm text-muted-foreground">
      Loading chart…
    </div>
  ),
})

export function Chart({ spec }: { spec: string }) {
  return <ChartInner spec={spec} />
}

export default Chart
