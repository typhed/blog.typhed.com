"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

/**
 * Recharts renderer for a ```chart JSON fence. Loaded only on the client (via
 * the `next/dynamic` wrapper in `chart.tsx`), so Recharts never runs during the
 * static export and posts without a chart never pay for it.
 *
 * Colors, axes, grid, and tooltip follow the `dataviz` skill: categorical
 * series colors come from the validated `--chart-*` tokens (read from CSS so
 * they track the theme), grid/axes are recessive text-token ink, a legend is
 * always shown for two or more series, and the numeric table beside the chart
 * in the post serves as the table-view relief.
 *
 * Layout defaults for every chart: the title is centered inside the chart box
 * (a `figcaption` at the top of the framed `figure`), and the series legend sits
 * at the bottom-right of the plot.
 */

interface Series {
  key: string
  label?: string
}

interface RefLine {
  x?: number
  y?: number
  label?: string
}

interface ChartSpec {
  type: "line" | "area" | "bar"
  title?: string
  xKey: string
  xLabel?: string
  yLabel?: string
  smooth?: boolean
  xType?: "number" | "category"
  series: Series[]
  data: Record<string, number | string>[]
  refLines?: RefLine[]
}

const SERIES_TOKENS = ["--chart-1", "--chart-2", "--chart-3", "--chart-4"] as const
const FALLBACK = {
  series: ["#6467f2", "#0891a5", "#c2410c", "#a21caf"],
  axis: "#64748b",
  grid: "#e2e8f0",
}

/** Reads the validated chart tokens from CSS, re-reading when the theme flips. */
function useChartTheme(resolvedTheme: string | undefined) {
  const [colors, setColors] = React.useState(FALLBACK)
  React.useEffect(() => {
    const style = getComputedStyle(document.documentElement)
    const hsl = (name: string) => {
      const value = style.getPropertyValue(name).trim()
      return value ? `hsl(${value})` : ""
    }
    setColors({
      series: SERIES_TOKENS.map(hsl),
      axis: hsl("--muted-foreground"),
      grid: hsl("--border"),
    })
  }, [resolvedTheme])
  return colors
}

interface TooltipEntry {
  dataKey?: string | number
  name?: string
  value?: number | string
  color?: string
}

function ChartTooltip({
  active,
  payload,
  label,
  xLabel,
}: {
  active?: boolean
  payload?: TooltipEntry[]
  label?: number | string
  xLabel?: string
}) {
  if (!active || !payload || payload.length === 0) return null
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-md">
      <p className="mb-1 font-medium text-foreground">
        {xLabel ? `${xLabel}: ` : ""}
        {label}
      </p>
      {payload.map((entry) => (
        <p key={String(entry.dataKey)} className="flex items-center gap-2 text-muted-foreground">
          <span
            className="inline-block h-2 w-2 shrink-0 rounded-full"
            style={{ backgroundColor: entry.color }}
            aria-hidden="true"
          />
          <span className="text-foreground">{entry.name}</span>
          <span className="ml-3 font-mono tabular-nums text-foreground">
            {typeof entry.value === "number" ? entry.value.toFixed(3) : entry.value}
          </span>
        </p>
      ))}
    </div>
  )
}

function parseSpec(spec: string): ChartSpec | { error: string } {
  let parsed: unknown
  try {
    parsed = JSON.parse(spec)
  } catch (err) {
    return { error: err instanceof Error ? err.message : "invalid JSON" }
  }
  const value = parsed as Partial<ChartSpec>
  if (value.type !== "line" && value.type !== "area" && value.type !== "bar") {
    return { error: `unknown chart type "${String(value.type)}" (use line, area, or bar)` }
  }
  if (typeof value.xKey !== "string") return { error: 'missing string "xKey"' }
  if (!Array.isArray(value.series) || value.series.length === 0) {
    return { error: 'missing non-empty "series" array' }
  }
  if (!Array.isArray(value.data) || value.data.length === 0) {
    return { error: 'missing non-empty "data" array' }
  }
  return value as ChartSpec
}

export default function ChartInner({ spec }: { spec: string }) {
  const { resolvedTheme } = useTheme()
  const theme = useChartTheme(resolvedTheme)
  const parsed = React.useMemo(() => parseSpec(spec), [spec])

  if ("error" in parsed) {
    return (
      <pre className="my-6 overflow-x-auto rounded-lg border border-destructive/50 bg-card p-4 font-mono text-sm text-destructive">
        {`Chart spec error: ${parsed.error}\n\n${spec}`}
      </pre>
    )
  }

  const { type, title, xKey, xLabel, yLabel, smooth, series, data, refLines } = parsed
  const numericX =
    parsed.xType === "number" ||
    (parsed.xType === undefined && data.every((row) => typeof row[xKey] === "number"))

  const color = (i: number) => theme.series[i % theme.series.length]

  const axes = [
    <CartesianGrid key="grid" stroke={theme.grid} vertical={false} />,
    <XAxis
      key="x"
      dataKey={xKey}
      type={numericX ? "number" : "category"}
      domain={numericX ? ["dataMin", "dataMax"] : undefined}
      stroke={theme.axis}
      tick={{ fill: theme.axis, fontSize: 12 }}
      tickLine={false}
      axisLine={{ stroke: theme.grid }}
      label={
        xLabel
          ? { value: xLabel, position: "insideBottom", offset: -4, fill: theme.axis, fontSize: 12 }
          : undefined
      }
    />,
    <YAxis
      key="y"
      width={48}
      stroke={theme.axis}
      tick={{ fill: theme.axis, fontSize: 12 }}
      tickLine={false}
      axisLine={{ stroke: theme.grid }}
      label={
        yLabel
          ? { value: yLabel, angle: -90, position: "insideLeft", fill: theme.axis, fontSize: 12 }
          : undefined
      }
    />,
    <Tooltip
      key="tip"
      content={<ChartTooltip xLabel={xLabel} />}
      cursor={{ stroke: theme.axis, strokeDasharray: "3 3" }}
    />,
    series.length > 1 ? (
      <Legend key="legend" align="right" verticalAlign="bottom" />
    ) : null,
    ...(refLines ?? []).map((r, i) => (
      <ReferenceLine
        key={`ref-${i}`}
        x={r.x}
        y={r.y}
        stroke={theme.axis}
        strokeDasharray="4 4"
        label={
          r.label ? { value: r.label, fill: theme.axis, fontSize: 11, position: "top" } : undefined
        }
      />
    )),
  ]

  const margin = { top: 12, right: 56, bottom: xLabel ? 24 : 8, left: yLabel ? 12 : 0 }

  let chart: React.ReactElement
  if (type === "bar") {
    chart = (
      <BarChart data={data} margin={margin} barCategoryGap="20%">
        {axes}
        {series.map((s, i) => (
          <Bar
            key={s.key}
            dataKey={s.key}
            name={s.label ?? s.key}
            fill={color(i)}
            radius={[4, 4, 0, 0]}
            isAnimationActive={false}
          />
        ))}
      </BarChart>
    )
  } else if (type === "area") {
    chart = (
      <AreaChart data={data} margin={margin}>
        {axes}
        {series.map((s, i) => (
          <Area
            key={s.key}
            type={smooth ? "monotone" : "linear"}
            dataKey={s.key}
            name={s.label ?? s.key}
            stroke={color(i)}
            strokeWidth={2}
            fill={color(i)}
            fillOpacity={0.15}
            dot={false}
            activeDot={{ r: 4 }}
            isAnimationActive={false}
          />
        ))}
      </AreaChart>
    )
  } else {
    chart = (
      <LineChart data={data} margin={margin}>
        {axes}
        {series.map((s, i) => (
          <Line
            key={s.key}
            type={smooth ? "monotone" : "linear"}
            dataKey={s.key}
            name={s.label ?? s.key}
            stroke={color(i)}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
            isAnimationActive={false}
          />
        ))}
      </LineChart>
    )
  }

  return (
    <figure className="my-6 rounded-lg border border-border bg-card/50 p-4">
      {title ? (
        <figcaption className="mb-3 text-center text-sm font-medium text-foreground">
          {title}
        </figcaption>
      ) : null}
      <ResponsiveContainer width="100%" height={340}>
        {chart}
      </ResponsiveContainer>
    </figure>
  )
}
