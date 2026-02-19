import nextPlugin from "eslint-config-next"

// eslint-config-next[0] bundles eslint-plugin-react@7 which is incompatible with
// ESLint 10 (uses legacy rule context API). We drop the react plugin and its rules,
// keeping react-hooks, import, jsx-a11y and @next/next.
const [nextBase, nextTypescript] = nextPlugin

// Files that should never be linted (build artifacts, generated files)
const ignoresConfig = {
  ignores: [".next/**", "public/sw.js"],
}

const { react: _react, ...pluginsWithoutReact } = nextBase.plugins

const reactRuleKeys = Object.keys(nextBase.rules || {}).filter((r) => r.startsWith("react/"))
const rulesWithoutReact = Object.fromEntries(
  Object.entries(nextBase.rules || {}).filter(([key]) => !reactRuleKeys.includes(key))
)

const eslintConfig = [
  ignoresConfig,
  {
    ...nextBase,
    plugins: pluginsWithoutReact,
    rules: {
      ...rulesWithoutReact,
      // Downgrade to warning: accessing refs during animation (framer-motion pattern)
      "react-hooks/refs": "warn",
      // Downgrade to warning: React Compiler memoization hints (advisory, not blocking)
      "react-hooks/preserve-manual-memoization": "warn",
      // Downgrade to warning: useCallback/useMemo structure rules (can't inline in all patterns)
      "react-hooks/use-memo": "warn",
    },
  },
  nextTypescript,
]

export default eslintConfig
