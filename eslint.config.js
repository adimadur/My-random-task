import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import react from "eslint-plugin-react";
import tseslint from "typescript-eslint";

export default tseslint.config(
  // Ignore build, UI components, Tailwind files, and entrypoint
  { ignores: ["dist", "src/components/ui", "src/main.tsx", "tailwind.config.*", "postcss.config.*"] },

  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react: react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      // === RUNTIME/APP-BREAKING ERRORS ONLY ===

      // Turn off no-undef (ignore undefined variables in React)
      "no-undef": "off",
      "react/jsx-no-undef": "off",

      // React Runtime Crashes
      "react/jsx-key": "error",                // Missing keys crash React lists
      "react/jsx-no-duplicate-props": "error", // Duplicate props break components
      "react/no-unescaped-entities": "error",  // Unescaped & < > break JSX parsing
      "react/no-unknown-property": "error",    // Invalid DOM props crash rendering

      // React Hooks (prevent crashes and infinite loops)
      ...reactHooks.configs.recommended.rules,

      // Disable react-hooks errors for react.useEffect usage
      "react-hooks/rules-of-hooks": "off",
      "react-hooks/exhaustive-deps": "off",

      // JavaScript Runtime Errors
      "no-unreachable": "error",
      "no-duplicate-case": "error",
      "no-obj-calls": "error",
      "no-sparse-arrays": "error",
      "use-isnan": "error",
      "valid-typeof": "error",
      "no-irregular-whitespace": "error",

      // TypeScript Runtime Errors
      "@typescript-eslint/no-non-null-assertion": "error",

      // Async Errors
      "no-async-promise-executor": "error",

      // === DISABLE ALL NON-BREAKING RULES ===
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-inferrable-types": "off",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-unnecessary-type-assertion": "off",
      "no-useless-catch": "off",
      "no-fallthrough": "off",
      "require-await": "off",
      "react-refresh/only-export-components": "off",
      "react/jsx-uses-react": "off",
      "react/jsx-uses-vars": "off",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  // Node.js globals for vite.config.ts
  {
    files: ["vite.config.ts"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  }
);