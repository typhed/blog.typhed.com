import * as React from "react"

/**
 * Monochrome platform marks for the access-links panel, keyed by the frontmatter
 * platform slug. They are simple, original geometric renditions drawn with
 * `currentColor` so they inherit the row's active/dimmed color and track the
 * light/dark theme - not the platforms' trademarked artwork. An unknown slug
 * falls back to `GenericPlatformIcon` and a title-cased label.
 */

type IconProps = React.SVGProps<SVGSVGElement>

const base = (props: IconProps) => ({
  viewBox: "0 0 24 24",
  width: 20,
  height: 20,
  "aria-hidden": true as const,
  focusable: false as const,
  ...props,
})

/** TradingView — an ascending "chart up" mark: a stem glyph and a caret. */
function TradingViewIcon(props: IconProps) {
  return (
    <svg {...base(props)} fill="currentColor">
      <path d="M2 4h9v3H7.5v9h-3V7H2z" />
      <path d="M16 6l5.5 10h-11z" />
    </svg>
  )
}

/** NinjaTrader — a ring emblem with a bold diagonal blade through it. */
function NinjaTraderIcon(props: IconProps) {
  return (
    <svg {...base(props)} fill="none" stroke="currentColor" strokeWidth={2}>
      <circle cx={12} cy={12} r={9} />
      <path d="M8 16.5L16 7.5" strokeLinecap="round" />
      <path d="M8 7.5v9M16 7.5v9" strokeLinecap="round" />
    </svg>
  )
}

/** MetaTrader — the seven-circle "flower" cluster (MetaQuotes motif). */
function MetaTraderIcon(props: IconProps) {
  const dots: [number, number][] = [
    [12, 12],
    [17.3, 12],
    [14.65, 16.6],
    [9.35, 16.6],
    [6.7, 12],
    [9.35, 7.4],
    [14.65, 7.4],
  ]
  return (
    <svg {...base(props)} fill="currentColor">
      {dots.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={2.5} />
      ))}
    </svg>
  )
}

/** Thinkorswim — an eight-ray starburst / spark. */
function ThinkorswimIcon(props: IconProps) {
  return (
    <svg {...base(props)} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
      <path d="M12 2v20M2 12h20M4.9 4.9l14.2 14.2M19.1 4.9L4.9 19.1" />
    </svg>
  )
}

/** Fallback for any platform slug not in the registry. */
export function GenericPlatformIcon(props: IconProps) {
  return (
    <svg {...base(props)} fill="none" stroke="currentColor" strokeWidth={1.8}>
      <circle cx={12} cy={12} r={9} />
      <path d="M3 12h18M12 3c2.5 2.4 3.8 5.6 3.8 9s-1.3 6.6-3.8 9c-2.5-2.4-3.8-5.6-3.8-9S9.5 5.4 12 3z" />
    </svg>
  )
}

export interface PlatformMeta {
  label: string
  Icon: (props: IconProps) => React.JSX.Element
}

/** Known trading platforms: slug → display label + mark. */
export const PLATFORM_ICONS: Record<string, PlatformMeta> = {
  tradingview: { label: "TradingView", Icon: TradingViewIcon },
  ninjatrader: { label: "NinjaTrader", Icon: NinjaTraderIcon },
  metatrader: { label: "MetaTrader 4/5", Icon: MetaTraderIcon },
  thinkorswim: { label: "Thinkorswim", Icon: ThinkorswimIcon },
}

/** Title-case a platform slug for the fallback label ("my-broker" → "My Broker"). */
export function platformLabelFromSlug(slug: string): string {
  return slug
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

/** Look up a platform's label + icon, falling back for unknown slugs. */
export function resolvePlatform(slug: string): PlatformMeta {
  return PLATFORM_ICONS[slug] ?? { label: platformLabelFromSlug(slug), Icon: GenericPlatformIcon }
}
