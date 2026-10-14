import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";

import { build, type Rolldown } from "vite";

interface BundleOptions {
  /** A package that resolves through its "exports" map, as consumers do. */
  resolvePackage?: string;
  external?: string[];
}

/** Bundles a fixture of `test/package/fixtures` for production, and gives the kept exports by `<package>/dist/<file>`. */
export async function bundleFixture(
  fixture: URL,
  { resolvePackage, external }: BundleOptions = {},
) {
  const alias = resolvePackage
    ? [
        {
          find: new RegExp(`^${resolvePackage}$`),
          replacement: createRequire(fixture).resolve(resolvePackage),
        },
      ]
    : [];
  const output = (await build({
    configFile: false,
    logLevel: "silent",
    root: fileURLToPath(new URL("../../../", fixture)),
    resolve: { alias },
    build: {
      write: false,
      minify: true,
      lib: { entry: fileURLToPath(fixture), formats: ["es"] },
      rolldownOptions: { external },
    },
  })) as Rolldown.RolldownOutput[];
  const chunk = output[0]!.output.find((item) => item.type === "chunk")!;
  const keptExports = Object.fromEntries(
    Object.entries(chunk.modules)
      .filter(([id]) => id.includes("/dist/"))
      // Keeps the package folder, so that core and adapter modules stay apart.
      .map(([id, module]) => [
        id.slice(id.lastIndexOf("/", id.indexOf("/dist/") - 1) + 1),
        module.renderedExports,
      ]),
  );
  // Rolldown's //#region comments are not code.
  const code = chunk.code.replace(/^\/\/#(end)?region.*\n/gm, "");
  return { keptExports, bytes: Buffer.byteLength(code), gzip: gzipSync(code).length };
}
