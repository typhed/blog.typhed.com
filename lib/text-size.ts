/**
 * Site-wide text-size control.
 *
 * Typography here is entirely rem/em based (Tailwind's default scale plus `em`
 * for inline code and KaTeX), so scaling the root `html` font-size cascades to
 * every piece of text on the page. We drive that font-size from a single CSS
 * variable (`--font-scale`) so the header control, the pre-paint init script,
 * and the persisted value all share one source of truth.
 *
 * The value is a multiplier applied to the reader's *browser default* font size
 * (via `font-size: calc(100% * var(--font-scale))` in globals.css), so a user
 * who has bumped their browser default keeps that baseline — we scale on top.
 *
 * Deliberately free of `node:*` imports so the client control can import it
 * without pulling server-only modules into the browser bundle.
 */

/** localStorage key holding the persisted multiplier. */
export const TEXT_SIZE_STORAGE_KEY = "typhed-blog:font-scale"

/** CSS custom property the root font-size reads (see `app/globals.css`). */
export const TEXT_SIZE_CSS_VAR = "--font-scale"

/** Smallest allowed multiplier (80% of the browser default). */
export const TEXT_SIZE_MIN = 0.8

/** Largest allowed multiplier (150% of the browser default). */
export const TEXT_SIZE_MAX = 1.5

/** Increment applied per button press. */
export const TEXT_SIZE_STEP = 0.1

/** Neutral multiplier: render at the browser default. */
export const TEXT_SIZE_DEFAULT = 1

/**
 * Clamp to the allowed range and round to two decimals, so repeated stepping
 * (0.8 + 0.1 + 0.1 …) never accumulates binary-float drift.
 */
export function clampScale(value: number): number {
  const bounded = Math.min(TEXT_SIZE_MAX, Math.max(TEXT_SIZE_MIN, value))
  return Math.round(bounded * 100) / 100
}

/** Next multiplier one step larger, clamped. */
export function nextScale(current: number): number {
  return clampScale(current + TEXT_SIZE_STEP)
}

/** Next multiplier one step smaller, clamped. */
export function previousScale(current: number): number {
  return clampScale(current - TEXT_SIZE_STEP)
}

/**
 * Read the persisted multiplier. Returns the default when unset, invalid, or
 * when storage is unavailable (SSR, private mode). Always returns a clamped
 * value so a tampered localStorage entry can never escape the range.
 */
export function readStoredScale(): number {
  if (typeof window === "undefined") return TEXT_SIZE_DEFAULT
  try {
    const raw = window.localStorage.getItem(TEXT_SIZE_STORAGE_KEY)
    if (raw === null) return TEXT_SIZE_DEFAULT
    const parsed = Number.parseFloat(raw)
    return Number.isNaN(parsed) ? TEXT_SIZE_DEFAULT : clampScale(parsed)
  } catch {
    return TEXT_SIZE_DEFAULT
  }
}

/**
 * Apply a multiplier to the document (updates the CSS variable, which cascades
 * to every rem/em) and persist it. No-ops on the server; tolerates storage
 * write failures (quota, private mode) without losing the visual update.
 */
export function applyScale(scale: number): void {
  if (typeof document === "undefined") return
  const clamped = clampScale(scale)
  document.documentElement.style.setProperty(TEXT_SIZE_CSS_VAR, String(clamped))
  try {
    window.localStorage.setItem(TEXT_SIZE_STORAGE_KEY, String(clamped))
  } catch {
    /* ignore write failures — the visual change still applies for this session */
  }
}

/**
 * A tiny IIFE, stringified, that applies the persisted multiplier before first
 * paint so there is no flash of default-sized text. Runs from `app/layout.tsx`
 * as an inline blocking script. Built from the constants above so it can never
 * drift from the runtime clamp range. Reads storage directly (it runs before
 * any bundle loads) and swallows every error so a broken value never blocks
 * rendering.
 */
export function textSizeInitScript(): string {
  return (
    `(function(){try{` +
    `var v=parseFloat(localStorage.getItem(${JSON.stringify(TEXT_SIZE_STORAGE_KEY)}));` +
    `if(!isNaN(v)){` +
    `var s=Math.min(${TEXT_SIZE_MAX},Math.max(${TEXT_SIZE_MIN},v));` +
    `document.documentElement.style.setProperty(${JSON.stringify(TEXT_SIZE_CSS_VAR)},String(s));` +
    `}}catch(e){}})();`
  )
}
