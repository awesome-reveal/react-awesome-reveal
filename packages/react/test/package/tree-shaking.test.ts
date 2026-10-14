import { bundleFixture } from "@awesome-reveal/test-utils/bundle";

const bundle = (fixture: string) =>
  bundleFixture(new URL(`fixtures/${fixture}`, import.meta.url), {
    resolvePackage: "@awesome-reveal/react",
    external: ["react"],
  });

describe("consumer bundle", () => {
  it("keeps only the modules and exports that it imports", async () => {
    const { keptExports, bytes } = await bundle("reveal-only.js");

    expect(keptExports["core/dist/adapter.js"]).toContain("createReveal");
    expect(bytes).toBeLessThan(6000);
  });

  it("keeps no Reveal component for the hook alone", async () => {
    const { keptExports, bytes } = await bundle("hook-only.js");

    expect(keptExports["core/dist/adapter.js"]).toContain("createReveal");
    expect(bytes).toBeLessThan(5650);
    expect(keptExports).not.toHaveProperty("react/dist/Reveal.js");
  });
});
