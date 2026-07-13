import type { Code, Root, RootContent } from "mdast"
import { visit } from "unist-util-visit"

/**
 * Rewrites fenced ```mermaid and ```chart code blocks into MDX JSX elements so
 * they map to client components (`Mermaid`, `Chart`) via compileMDX's
 * `components` prop, instead of being handled by rehype-pretty-code as
 * syntax-highlighted text.
 *
 * This runs on the mdast, where a fenced block is a single, unfragmented `code`
 * node — so it must be listed BEFORE the rehype phase. The raw fence body is
 * passed through as a plain string attribute; the receiving component parses it
 * (JSON for charts, diagram source for mermaid). No estree is constructed here.
 */
const FENCE_TO_COMPONENT: Record<string, { name: string; prop: string }> = {
  mermaid: { name: "Mermaid", prop: "chart" },
  chart: { name: "Chart", prop: "spec" },
}

export function remarkDiagrams() {
  return (tree: Root) => {
    visit(tree, "code", (node: Code, index, parent) => {
      if (index === undefined || parent === undefined) return
      const mapping = node.lang ? FENCE_TO_COMPONENT[node.lang] : undefined
      if (!mapping) return

      const element = {
        type: "mdxJsxFlowElement",
        name: mapping.name,
        attributes: [{ type: "mdxJsxAttribute", name: mapping.prop, value: node.value }],
        children: [],
      }
      parent.children[index] = element as unknown as RootContent
    })
  }
}

export default remarkDiagrams
