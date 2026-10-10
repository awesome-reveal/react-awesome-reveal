import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    coverage: {
      provider: "v8",
      include: ["src"],
      thresholds: { lines: 90, functions: 90, branches: 85, statements: 90 },
    },
    projects: [
      {
        // test-utils imports "react-dom/test-utils" without an extension, which Node cannot resolve on React 17.
        ssr: { noExternal: ["react-intersection-observer"] },
        test: {
          name: "unit",
          environment: "jsdom",
          setupFiles: ["./test/setup.ts"],
          include: ["test/**/*.test.{ts,tsx}"],
          exclude: ["test/package/**"],
          typecheck: {
            enabled: true,
            tsconfig: "./test/tsconfig.json",
            include: ["test/types/**/*.test-d.{ts,tsx}"],
          },
        },
      },
      {
        test: {
          name: "package",
          environment: "node",
          include: ["test/package/**/*.test.ts"],
        },
      },
    ],
  },
});
