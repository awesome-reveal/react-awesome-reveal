---
paths:
  - "packages/astro/**"
  - "playgrounds/astro/**"
---

# Astro adapter

- `Reveal.astro` ships uncompiled. Astro compiles the `.astro` files of a dependency that has the `astro` peer dependency or the `astro-component` keyword. `vite.config.ts` copies the file into `dist`, and keeps the `./Reveal.astro` import of `index.ts` external. Node cannot import `dist/index.js`, so the package tests load the root entry only through an Astro build.
- `index.ts` exports `Reveal` with an explicit type, because only the Astro language tools resolve a `.astro` import. A `.d.ts` that imports `Reveal.astro` fails attw, and plain `tsc` cannot resolve it.
- The client side is the `<awesome-reveal>` custom element in `src/element.ts`. Astro hydrates nothing, so there is no hydration test.
- `element.ts` has no class fields, because Safari 13.1 does not support them. Use a `static get` getter and `private declare`.
- `connectedMoveCallback` and the microtask in `disconnectedCallback` keep the state of a `transition:persist` element. The ClientRouter uses `moveBefore()` where it exists, and a remove and append in one task elsewhere. The e2e persist test fails in all three engines without them.
- `Reveal.astro` moves the `transition:persist` attributes from the inner element to `<awesome-reveal>`. The new body connects before the ClientRouter moves the persisted element in, so a persisted inner element would lose its controller.
- The server markup hides the element with `data-reveal="hidden"` and a rule in `@media (scripting: enabled)`. Do not add a `style` attribute: `security.csp` blocks style attributes. The build test checks the markup with `security.csp`. Astro does not support `security.csp` with the ClientRouter, so the e2e test sets `style-src-attr 'none'` itself and fails on each violation.
- `astro:ssr` lives in `packages/astro/vitest.config.ts`, so that the Astro compiler comes from this package, and the Astro 6 CI job can install Astro 6 only here. A project file does not inherit the root options, so it sets `globals: true`. `test/tsconfig.json` does not include this file: with Astro 6, the Vite types of `getViteConfig` have no `test` key.
- The Vite config of Astro aliases the bare `astro` import to its types. In that environment, import `build` and `preview` by the resolved path, as `test/build-site.ts` does.
- The programmatic `build` and `preview` need `root` and `outDir` as filesystem paths. With file URL strings, Astro builds 0 pages. The preview server of `@astrojs/node` reports the configured port, so port 0 does not work.
- Astro 6 and 7 give different output: Astro 6 adds `data-astro-source-file` and whitespace in the container, and the minifiers write `@media(` or `@media (` and other quotes. Keep the test patterns tolerant.
- The playground and `astro:browser` need Astro 7, because `@astrojs/node` 11.1.3 and later need Astro 7.2.1 or later. The Astro 6 CI job runs only `astro:unit` and `astro:ssr`.
- `tsc` cannot read `.astro` files. `test/astro.d.ts` declares them for the tests. `astro check` reports only the files of the tsconfig `include`, so the playground tsconfig includes `packages/astro/src/**/*.astro`. The `tsconfig.base.json` paths resolve the imports to the sources. The e2e test also builds the playground on the sources.
