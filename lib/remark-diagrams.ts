import type { Code, Root, RootContent } from "mdast"
import { visit } from "unist-util-visit"

/**
 * Rewrites special fenced code blocks into non-code renderings, before the
 * rehype phase would otherwise hand them to rehype-pretty-code as
 * syntax-highlighted text:
 *
 *   - ```mermaid / ```chart become MDX JSX elements mapped to the `Mermaid` /
 *     `Chart` client components via compileMDX's `components` prop.
 *   - ```latex / ```math / ```tex become a display-math block that
 *     rehype-katex renders - the block-level counterpart to inline `$x^2$`,
 *     which remark-math already handles. The fence body is the raw TeX.
 *
 * This runs on the mdast, where a fenced block is a single, unfragmented `code`
 * node - so it must be listed BEFORE the rehype phase. For diagrams the raw
 * fence body is passed through as a plain string attribute; for math it becomes
 * the text of a `div.math-display` via mdast-util-to-hast's `hName`/`hChildren`
 * hooks, which is exactly the element shape rehype-katex looks for.
 */
const FENCE_TO_COMPONENT: Record<string, { name: string; prop: string }> = {
  mermaid: { name: "Mermaid", prop: "chart" },
  chart: { name: "Chart", prop: "spec" },
}

/** Fence languages that render as display math instead of highlighted code. */
const MATH_FENCE_LANGS = new Set(["latex", "math", "tex"])

export function remarkDiagrams() {
  return (tree: Root) => {
    visit(tree, "code", (node: Code, index, parent) => {
      if (index === undefined || parent === undefined) return
      const lang = node.lang ?? ""

      const mapping = FENCE_TO_COMPONENT[lang]
      if (mapping) {
        const element = {
          type: "mdxJsxFlowElement",
          name: mapping.name,
          attributes: [{ type: "mdxJsxAttribute", name: mapping.prop, value: node.value }],
          children: [],
        }
        parent.children[index] = element as unknown as RootContent
        return
      }

      if (MATH_FENCE_LANGS.has(lang)) {
        // Emit the same hast a `$$…$$` block would: a `div.math-display` whose
        // text is the raw TeX, which rehype-katex then renders in place.
        const mathBlock = {
          type: "math",
          value: node.value,
          data: {
            hName: "div",
            hProperties: { className: ["math", "math-display"] },
            hChildren: [{ type: "text", value: node.value }],
          },
        }
        parent.children[index] = mathBlock as unknown as RootContent
      }
    })
  }
}

export default remarkDiagrams
