// Installs the packed tarballs into a clean project outside the workspace, then builds and type-checks it.
// Usage: node scripts/smoke.mjs <core|react|compat|vue|astro|next> [dependency@version ...]
// The packages must be built first (pnpm build). Extra arguments replace the default framework dependencies.
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// Next.js would send telemetry on each build and start.
process.env.NEXT_TELEMETRY_DISABLED = "1";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const [name, ...extra] = process.argv.slice(2);

const hiddenCheck = (render) => `
const html = ${render};
if (!html.includes('data-reveal="hidden"')) throw new Error("The server markup is not hidden: " + html);
console.log(html);
`;

const nextPage = (id, module, next, extra = "") => `
import Link from "next/link";
import { Reveal } from "${module}";
import { fade } from "${module}/keyframes";

${extra}
export default function Page() {
  return (
    <main>
      <Reveal id="${id}" keyframes={fade()}>
        ${id}
      </Reveal>
      <Link href="${next}">Next</Link>
    </main>
  );
}
`;

const cases = {
  core: {
    packages: ["core"],
    deps: [],
    typescript: true,
    files: {
      "src/main.ts": `
import { createReveal, reveal } from "@awesome-reveal/core";
import { enter } from "@awesome-reveal/core/keyframes";

const controller = reveal(document.body, { keyframes: enter({ y: 16 }) });
controller.setOptions({ once: false });
export const state = createReveal({ when: true });
`,
      "src/ssr.ts": `
import { reveal } from "@awesome-reveal/core";
import "@awesome-reveal/core/keyframes";

if (typeof reveal !== "function") throw new Error("reveal is not a function");
`,
    },
  },
  react: {
    packages: ["core", "react"],
    deps: ["react@19", "react-dom@19", "@types/react@19", "@types/react-dom@19"],
    typescript: true,
    files: {
      "src/main.tsx": `
import { Reveal, useReveal } from "@awesome-reveal/react";
import { fade } from "@awesome-reveal/react/keyframes";

export function Card() {
  const { getProps } = useReveal<HTMLElement>({ keyframes: fade() });
  return <article {...getProps({ className: "card" })}>Card</article>;
}

export const App = () => <Reveal keyframes={fade()}><Card /></Reveal>;
`,
      "src/ssr.tsx": `
import { renderToString } from "react-dom/server";
import { App } from "./main.js";

${hiddenCheck("renderToString(<App />)")}
`,
    },
  },
  compat: {
    packages: ["core", "react", "react-awesome-reveal"],
    deps: ["react@19", "react-dom@19", "@types/react@19", "@types/react-dom@19"],
    typescript: true,
    files: {
      "src/main.tsx": `
import { Reveal } from "react-awesome-reveal";
import { fade } from "react-awesome-reveal/keyframes";

export const App = () => <Reveal keyframes={fade()}>Hello</Reveal>;
`,
      "src/ssr.tsx": `
import { renderToString } from "react-dom/server";
import { App } from "./main.js";

${hiddenCheck("renderToString(<App />)")}
`,
    },
  },
  vue: {
    packages: ["core", "vue"],
    deps: ["vue@3.5", "@vitejs/plugin-vue", "vue-tsc"],
    plugins: `import vue from "@vitejs/plugin-vue";`,
    pluginCall: "vue()",
    check: ["vue-tsc", "--noEmit"],
    files: {
      "src/App.vue": `
<script setup lang="ts">
import { Reveal, vReveal } from "@awesome-reveal/vue";
import { fade } from "@awesome-reveal/vue/keyframes";
</script>

<template>
  <Reveal :keyframes="fade()">Component</Reveal>
  <p v-reveal="{ keyframes: fade() }">Directive</p>
</template>
`,
      "src/main.ts": `
import { createApp } from "vue";
import App from "./App.vue";

createApp(App).mount(document.body);
`,
      "src/ssr.ts": `
import { createSSRApp } from "vue";
import { renderToString } from "vue/server-renderer";
import App from "./App.vue";

${hiddenCheck("await renderToString(createSSRApp(App))")}
`,
      "src/env.d.ts": `/// <reference types="vite/client" />`,
    },
  },
  next: {
    packages: ["core", "react", "react-awesome-reveal"],
    deps: ["next@16", "react@19", "react-dom@19", "@types/react@19", "@types/react-dom@19"],
    scaffold: false,
    build: ["next", "build"],
    verify: async (app) => (await import("./smoke-next.mjs")).verifyNext(app),
    files: {
      // Next writes the rest. Some Next versions set "node", which cannot resolve the package exports.
      "tsconfig.json": `{ "compilerOptions": { "module": "esnext", "moduleResolution": "bundler" } }\n`,
      "app/layout.tsx": `
import type { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
`,
      // A Server Component creates the keyframes, so they cross the server boundary as props.
      "app/page.tsx": `
import Link from "next/link";
import { Reveal } from "@awesome-reveal/react";
import { slide, spring } from "@awesome-reveal/react/keyframes";

import { Card } from "./card";

export default function Page() {
  return (
    <main>
      <Reveal id="top" keyframes={slide()}>
        Top
      </Reveal>
      <div style={{ height: "200vh" }} />
      <Reveal id="below" keyframes={slide({ easing: spring() })} stagger={50}>
        <p>One</p>
        <p>Two</p>
      </Reveal>
      <Card />
      <Link href="/about">About</Link>
    </main>
  );
}
`,
      "app/card.tsx": `
"use client";

import { useReveal } from "@awesome-reveal/react";
import { fade } from "@awesome-reveal/react/keyframes";

export function Card() {
  const { getProps } = useReveal<HTMLElement>({ keyframes: fade() });
  return <article {...getProps({ id: "card" })}>Card</article>;
}
`,
      // The other pages are prerendered. This one renders on each request.
      "app/about/page.tsx": nextPage(
        "about",
        "@awesome-reveal/react",
        "/legacy",
        'export const dynamic = "force-dynamic";',
      ),
      // The compat package re-exports the React package, so it crosses the same boundary.
      "app/legacy/page.tsx": nextPage("legacy", "react-awesome-reveal", "/"),
    },
  },
  astro: {
    packages: ["core", "astro"],
    deps: ["astro@7", "@astrojs/check", "typescript@5.9"],
    scaffold: false,
    check: ["astro", "check"],
    build: ["astro", "build"],
    verify: (app) => {
      const html = readFileSync(join(app, "dist/index.html"), "utf8");
      if (!html.includes('data-reveal="hidden"'))
        throw new Error("The built page has no hidden element");
    },
    files: {
      "astro.config.mjs": `import { defineConfig } from "astro/config";\nexport default defineConfig({});\n`,
      "tsconfig.json": `{ "extends": "astro/tsconfigs/strict", "include": [".astro/types.d.ts", "**/*"], "exclude": ["dist"] }\n`,
      "src/pages/index.astro": `
---
import { Reveal } from "@awesome-reveal/astro";
import { fade } from "@awesome-reveal/astro/keyframes";
---

<Reveal keyframes={fade()}>Hello</Reveal>
`,
    },
  },
};

const config = cases[name];
if (!config) {
  console.error(
    `Usage: node scripts/smoke.mjs <${Object.keys(cases).join("|")}> [dependency@version ...]`,
  );
  process.exit(2);
}

const run = (command, args, cwd) => {
  console.log(`\n$ ${command} ${args.join(" ")}`);
  execFileSync(command, args, { cwd, stdio: "inherit" });
};

const work = mkdtempSync(join(tmpdir(), `awesome-reveal-smoke-${name}-`));
const tarballs = join(work, "tarballs");
const app = join(work, "app");
mkdirSync(tarballs);
mkdirSync(app);

try {
  const own = {};
  for (const dir of config.packages) {
    const destination = join(tarballs, dir);
    run("pnpm", ["pack", "--pack-destination", destination], join(root, "packages", dir));
    const { name: packageName } = JSON.parse(
      readFileSync(join(root, "packages", dir, "package.json"), "utf8"),
    );
    own[packageName] = `file:${join(destination, readdirSync(destination)[0])}`;
  }

  const deps = extra.length ? extra : config.deps;
  const toEntry = (spec) => {
    const at = spec.lastIndexOf("@");
    return at > 0 ? [spec.slice(0, at), spec.slice(at + 1)] : [spec, "latest"];
  };
  const files = {
    "package.json": JSON.stringify(
      {
        name: "smoke",
        private: true,
        type: "module",
        dependencies: { ...own, ...Object.fromEntries(deps.map(toEntry)) },
        devDependencies: {
          "@types/node": "^24.0.0",
          typescript: "^5.9.0",
          ...(config.scaffold === false ? {} : { vite: "^8.3.4" }),
        },
      },
      null,
      2,
    ),
    // The adapters depend on core by version. The override makes pnpm use the tarball and not the registry.
    "pnpm-workspace.yaml": `overrides:\n${Object.entries(own)
      .map(([key, value]) => `  "${key}": "${value}"`)
      .join("\n")}\nallowBuilds:\n  esbuild: false\n  sharp: false\n`,
    ...config.files,
  };
  if (config.typescript || config.check) {
    files["tsconfig.json"] ??= JSON.stringify({
      compilerOptions: {
        module: "ESNext",
        moduleResolution: "Bundler",
        target: "ESNext",
        lib: ["DOM", "ESNext"],
        jsx: "react-jsx",
        strict: true,
        noEmit: true,
        skipLibCheck: false,
        types: ["node"],
      },
      include: ["src"],
    });
  }
  if (config.scaffold !== false) {
    files["index.html"] =
      `<!doctype html><script type="module" src="/src/main.${name === "react" || name === "compat" ? "tsx" : "ts"}"></script>`;
    files["vite.config.ts"] =
      `${config.plugins ?? ""}\nexport default { plugins: [${config.pluginCall ?? ""}] };\n`;
  }
  for (const [file, content] of Object.entries(files)) {
    mkdirSync(dirname(join(app, file)), { recursive: true });
    writeFileSync(join(app, file), content.trimStart());
  }

  run("pnpm", ["install"], app);

  const core = readdirSync(join(app, "node_modules/.pnpm")).filter((entry) =>
    entry.startsWith("@awesome-reveal+core@"),
  );
  if (core.length !== 1 || !core[0].includes("file"))
    throw new Error(`Core does not come from the tarball: ${core}`);

  if (config.build) {
    if (config.check) run("pnpm", ["exec", ...config.check], app);
    run("pnpm", ["exec", ...config.build], app);
    await config.verify(app);
  } else {
    run("pnpm", ["exec", "vite", "build"], app);
    run(
      "pnpm",
      [
        "exec",
        "vite",
        "build",
        "--ssr",
        `src/ssr.${files["src/ssr.tsx"] ? "tsx" : "ts"}`,
        "--outDir",
        "dist-ssr",
      ],
      app,
    );
    run("node", ["dist-ssr/ssr.js"], app);
  }

  if (config.check && !config.build) run("pnpm", ["exec", ...config.check], app);
  if (config.typescript) {
    for (const typescript of ["5.9", "6", "7"]) {
      run("pnpm", ["add", "-D", `typescript@${typescript}`], app);
      for (const moduleResolution of ["Bundler", "NodeNext"]) {
        const module = moduleResolution === "NodeNext" ? "NodeNext" : "ESNext";
        run(
          "pnpm",
          [
            "exec",
            "tsc",
            "-p",
            "tsconfig.json",
            "--module",
            module,
            "--moduleResolution",
            moduleResolution,
          ],
          app,
        );
      }
    }
  }
  console.log(`\nSmoke test "${name}" passed.`);
} finally {
  rmSync(work, { recursive: true, force: true });
}
