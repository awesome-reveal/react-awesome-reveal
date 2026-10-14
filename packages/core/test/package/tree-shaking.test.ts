import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";
import { build, type Rolldown } from "vite";

async function bundle(entry: string) {
  const result = (await build({
    configFile: false,
    logLevel: "silent",
    build: {
      write: false,
      minify: true,
      lib: { entry: fileURLToPath(new URL(`fixtures/${entry}`, import.meta.url)), formats: ["es"] },
    },
  })) as Rolldown.RolldownOutput[];
  const chunk = result[0]!.output.find((output) => output.type === "chunk")!;
  const code = chunk.code.replace(/^\/\/#(end)?region.*\n/gm, "");
  return {
    modules: Object.keys(chunk.modules)
      .filter((id) => id.includes("/core/dist/"))
      .map((id) => id.split("/").at(-1))
      .sort(),
    animationExports: Object.entries(chunk.modules)
      .find(([id]) => id.endsWith("/core/dist/animation.js"))![1]
      .renderedExports.slice()
      .sort(),
    bytes: Buffer.byteLength(code),
    gzip: gzipSync(code).length,
  };
}
it.each([
  { entry: "reveal.js", animationExports: ["motion", "motionPreference", "motions"] },
  {
    entry: "both.js",
    animationExports: ["cascadeInterval", "motion", "motionPreference", "motions"],
  },
])("keeps only the imperative modules for $entry", async ({ entry, animationExports }) => {
  const result = await bundle(entry);
  expect(result.modules).toEqual(["animation.js", "observe.js", "report.js", "reveal.js"]);
  expect(result.animationExports).toEqual(animationExports);
  expect(result.bytes).toBeLessThan(5044);
  expect(result.gzip).toBeLessThan(2089);
});
