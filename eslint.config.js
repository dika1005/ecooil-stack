      import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";

export default tseslint.config(
  // Ignore patterns
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.output/**",
      "**/.vinxi/**",
      "**/generated/**",
      "**/coverage/**",
    ],
  },

  // Base JavaScript rules
  js.configs.recommended,

  // TypeScript rules
  ...tseslint.configs.recommended,

  // Global settings
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        Bun: "readonly",
      },
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
  },

  // Custom rules for all files
  {
    rules: {
      // ========================================
      // Code Quality
      // ========================================
      "no-console": "off", // Allow console.log for debugging
      "no-debugger": "warn",
      "no-duplicate-imports": "error",
      "no-unused-expressions": "error",
      "prefer-const": "error",
      "no-var": "error",
      eqeqeq: ["error", "always", { null: "ignore" }],

      // ========================================
      // TypeScript Specific
      // ========================================
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_|^Card|^Button|^Show|^Truck|^authStore",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "off", // Allow any for flexibility
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-non-null-assertion": "off", // Allow ! operator
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],

      // ========================================
      // Best Practices
      // ========================================
      "no-return-await": "error",
      "require-await": "off", // Disabled: Prisma methods return Promises without await
      "no-throw-literal": "error",
      "prefer-promise-reject-errors": "error",

      // ========================================
      // Style (handled by Prettier, but enforced here too)
      // ========================================
      "comma-dangle": ["error", "only-multiline"],
      quotes: ["error", "double", { avoidEscape: true }],
      semi: ["error", "always"],
    },
  },

  // API-specific rules
  {
    files: ["apps/api/**/*.ts"],
    rules: {
      "no-console": "off", // API can use console for logging
    },
  },

  // Web-specific rules (SolidJS)
  {
    files: ["apps/web/**/*.tsx", "apps/web/**/*.ts"],
    rules: {
      // Allow unused vars starting with _ (common in JSX)
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_|^props$",
        },
      ],
    },
  }
);
