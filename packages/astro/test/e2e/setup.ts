import { mkdtemp, rm } from "node:fs/promises";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { build, preview } from "astro";
import type { TestProject } from "vitest/node";

declare module "vitest" {
  export interface ProvidedContext {
    baseURL: string;
  }
}

function path(relative: string) {
  return fileURLToPath(new URL(relative, import.meta.url));
}

// The playground runs on the sources, so no package build is necessary first.
const alias = Object.entries({
  "@awesome-reveal/astro": "../../src/index.ts",
  "@awesome-reveal/astro/keyframes": "../../src/keyframes.ts",
  "@awesome-reveal/core": "../../../core/src/index.ts",
  "@awesome-reveal/core/keyframes": "../../../core/src/keyframes/index.ts",
}).map(([specifier, source]) => ({
  find: new RegExp(`^${specifier.replaceAll(".", "\\.")}$`),
  replacement: path(source),
}));

// The preview server of the Node adapter reports the configured port, so port 0 does not work.
function freePort() {
  return new Promise<number>((resolve) => {
    const server = createServer().listen(0, () => {
      const { port } = server.address() as { port: number };
      server.close(() => resolve(port));
    });
  });
}

/** Builds the playground and serves it with `astro preview`, as production serves it. */
export default async function setup(project: TestProject) {
  const outDir = await mkdtemp(join(tmpdir(), "awesome-reveal-astro-"));
  const config = {
    root: path("../../../../playgrounds/astro/"),
    outDir,
    logLevel: "error" as const,
    vite: { resolve: { alias } },
  };
  await build(config);
  const port = await freePort();
  const server = await preview({ ...config, server: { port } });
  project.provide("baseURL", `http://localhost:${port}`);

  return async () => {
    await server.stop();
    await rm(outDir, { recursive: true, force: true });
  };
}
