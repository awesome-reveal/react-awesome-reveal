import { fileURLToPath } from "node:url";

import { getViteConfig } from "astro/config";

function source(path: string) {
  return fileURLToPath(new URL(path, import.meta.url));
}

// A config of its own, so that the Astro 6 CI job can install Astro 6 only in this package.
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
          find: /^@awesome-reveal\/core\/reveal\.css$/,
          replacement: source("../core/src/reveal.css"),
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
