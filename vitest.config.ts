import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      include: [
        "apps/*/src/**/*.ts",
        "apps/*/src/**/*.tsx",
        "packages/*/src/**/*.ts",
      ],
    },
  },
})
