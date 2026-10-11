import { fileURLToPath } from "node:url";

import { getViteConfig } from "astro/config";

function source(path: string) {
  return fileURLToPath(new URL(path, import.meta.url));
}

// The root config lists this file, so that the Astro compiler comes from this package.
// Then the CI job for an older Astro version installs it only here.
export default getViteConfig(
  {
    resolve: {
      alias: [
        { find: /^@awesome-reveal\/core$/, replacement: source("../core/src/index.ts") },
        {
          find: /^@awesome-reveal\/core\/keyframes$/,
          replacement: source("../core/src/keyframes/index.ts"),
        },
        {
          find: /^@awesome-reveal\/test-utils\/(.+)$/,
          replacement: source("../test-utils/src/$1.ts"),
        },
      ],
    },
    test: {
      name: "astro:ssr",
      // A project file does not inherit the root options.
      globals: true,
      environment: "node",
      setupFiles: ["./test/setup/console.ts"],
      include: ["test/ssr.test.ts", "test/build.test.ts"],
    },
  },
  { root: source("."), logLevel: "error" },
);
