import { fileURLToPath } from "node:url";

import { coverageConfigDefaults, defineConfig } from "vitest/config";

// Unit tests run against the sources of the other workspace packages, so no build is necessary first.
const resolve = {
  alias: {
    "@awesome-reveal/core/keyframes": fileURLToPath(
      new URL("packages/core/src/keyframes/index.ts", import.meta.url),
    ),
  },
};

export default defineConfig({
  test: {
    globals: true,
    coverage: {
      provider: "v8",
      include: ["**/src/**"],
      // CI turns json-summary into the coverage table of the GitHub job summary.
      reporter: [...coverageConfigDefaults.reporter, "json-summary"],
      thresholds: { lines: 90, functions: 90, branches: 85, statements: 90 },
    },
    projects: [
      {
        root: "packages/core",
        test: {
          name: "core:unit",
          environment: "node",
          include: ["test/**/*.test.ts"],
          exclude: ["test/package/**"],
        },
      },
      {
        root: "packages/core",
        test: {
          name: "core:package",
          environment: "node",
          include: ["test/package/**/*.test.ts"],
        },
      },
      {
        root: "packages/react",
        resolve,
        test: {
          name: "react:unit",
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
        root: "packages/react",
        resolve,
        test: {
          name: "react:ssr",
          environment: "node",
          setupFiles: ["./test/setup/console.ts"],
          include: ["test/ssr.test.tsx"],
        },
      },
      {
        root: "packages/react",
        test: {
          name: "react:package",
          environment: "node",
          setupFiles: ["./test/setup/console.ts"],
          include: ["test/package/**/*.test.ts"],
        },
      },
    ],
  },
});
