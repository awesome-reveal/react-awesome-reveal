import { bundleFixture } from "@awesome-reveal/test-utils/bundle";

it.concurrent.each([
  {
    entry: "reveal.js",
    animationExports: ["motionPreference", "motions"],
    bytes: 3550,
    gzip: 1525,
  },
  {
    entry: "both.js",
    animationExports: ["cascadeInterval", "motionPreference", "motions"],
    bytes: 3650,
    gzip: 1575,
  },
])(
  "keeps only the imperative modules for $entry",
  async ({ entry, animationExports, bytes, gzip }) => {
    const result = await bundleFixture(new URL(`fixtures/${entry}`, import.meta.url));
    expect(Object.keys(result.keptExports).sort()).toEqual([
      "core/dist/animation.js",
      "core/dist/observe.js",
      "core/dist/report.js",
      "core/dist/reveal.js",
    ]);
    expect(result.keptExports["core/dist/animation.js"]!.slice().sort()).toEqual(animationExports);
    expect(result.bytes).toBeLessThan(bytes);
    expect(result.gzip).toBeLessThan(gzip);
  },
);
