import { coverageConfigDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    coverage: {
      provider: "v8",
      include: ["src"],
      // CI turns json-summary into the coverage table of the GitHub job summary.
      reporter: [...coverageConfigDefaults.reporter, "json-summary"],
      thresholds: { lines: 90, functions: 90, branches: 85, statements: 90 },
    },
    projects: [
      {
        test: {
          name: "unit",
          environment: "jsdom",
          setupFiles: ["./test/setup/console.ts", "./test/setup/dom.ts"],
          include: ["test/**/*.test.{ts,tsx}"],
          exclude: ["test/package/**", "test/ssr.test.tsx"],
          typecheck: {
            enabled: true,
            tsconfig: "./test/tsconfig.json",
            include: ["test/types/**/*.test-d.{ts,tsx}"],
          },
        },
      },
      {
        test: {
          name: "ssr",
          environment: "node",
          setupFiles: ["./test/setup/console.ts"],
          include: ["test/ssr.test.tsx"],
        },
      },
      {
        test: {
          name: "package",
          environment: "node",
          setupFiles: ["./test/setup/console.ts"],
          include: ["test/package/**/*.test.ts"],
        },
      },
    ],
  },
});
