import type { Element, Root } from "hast"
import { toString } from "hast-util-to-string"
import { visit } from "unist-util-visit"

export interface TocItem {
  /** Heading level: 2, 3, or 4. */
  depth: number
  /** Rendered heading text. */
  text: string
  /** The slug `id` rehype-slug assigned to the heading element. */
  id: string
}

/**
 * Harvests h2–h4 headings into `sink` for building a table of contents,
 * reading the `id` that rehype-slug already assigned rather than recomputing
 * slugs. Must run AFTER rehypeSlug (and before the heading text is wrapped by
 * autolink is fine — the text extraction and id are unaffected) so the
 * collected ids match the rendered anchors exactly.
 */
export function rehypeCollectHeadings(sink: TocItem[]) {
  // Returns a unified attacher (a plugin) that closes over `sink`; unified calls
  // this to obtain the transformer below. Returning the transformer directly
  // would make unified run it with an undefined tree.
  return function attacher() {
    return (tree: Root) => {
      visit(tree, "element", (node: Element) => {
        if (!/^h[2-4]$/.test(node.tagName)) return
        const id = node.properties?.id
        if (typeof id !== "string" || id.length === 0) return
        const text = toString(node).trim()
        if (text.length === 0) return
        sink.push({ depth: Number(node.tagName.slice(1)), text, id })
      })
    }
  }
}

export default rehypeCollectHeadings
