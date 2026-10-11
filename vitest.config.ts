import { fileURLToPath } from "node:url";

import { playwright } from "@vitest/browser-playwright";
import { coverageConfigDefaults, defineConfig } from "vitest/config";

// Unit tests run against the sources of the other workspace packages, so no build is necessary first.
const resolve = {
  alias: [
    ["@awesome-reveal/core", "packages/core/src/index.ts"],
    ["@awesome-reveal/core/keyframes", "packages/core/src/keyframes/index.ts"],
  ].map(([specifier, source]) => ({
    find: new RegExp(`^${specifier}$`),
    replacement: fileURLToPath(new URL(source!, import.meta.url)),
  })),
};

export default defineConfig({
  test: {
    globals: true,
    coverage: {
      provider: "istanbul",
      include: ["**/src/**"],
      // CI turns json-summary into the coverage table of the GitHub job summary.
      reporter: [...coverageConfigDefaults.reporter, "json-summary"],
      // Each CI job writes a blob with part of the coverage. CI checks the thresholds when it merges the blobs.
      thresholds: process.env.VITEST_BLOB_LABEL
        ? undefined
        : { lines: 90, functions: 90, branches: 85, statements: 90 },
    },
    projects: [
      {
        root: "packages/core",
        test: {
          name: "core:unit",
          environment: "node",
          include: ["test/**/*.test.ts"],
          exclude: ["test/package/**", "test/browser/**"],
        },
      },
      {
        root: "packages/core",
        test: {
          name: "core:browser",
          include: ["test/browser/**/*.test.ts"],
          retry: process.env.CI ? 2 : 0,
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [{ browser: "chromium" }, { browser: "firefox" }, { browser: "webkit" }],
            // The tests scroll by viewport heights.
            viewport: { width: 1280, height: 720 },
            trace: "on-first-retry",
          },
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
