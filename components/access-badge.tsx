import { ACCESS_CATEGORIES, type AccessCategory } from "@/lib/constants"
import { cn } from "@/lib/utils"

/**
 * Pill showing a post's access tier: 👥 Public or 🔓 Freemium. Server
 * component — it renders a static glyph and label with no interactivity, so it
 * works on both the index and the post header. The emoji is decorative and the
 * label carries the meaning for screen readers.
 */
export function AccessBadge({
  category,
  className,
}: {
  category: AccessCategory
  className?: string
}) {
  const meta = ACCESS_CATEGORIES[category]

  return (
    <span
      title={meta.description}
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground",
        className,
      )}
    >
      <span aria-hidden="true">{meta.emoji}</span>
      <span>{meta.label}</span>
    </span>
  )
}
