// Serves the built app of the smoke test and checks it in HTML and in Chromium.
// Each page of smoke.mjs has a #top element in view, and a #below element below the fold.
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { join } from "node:path";

import { chromium } from "playwright";

const servers = {
  vite: (port) => ["vite", "preview", "--port", port, "--strictPort", "--host", "127.0.0.1"],
  // In an AI agent session, Astro 7 runs the preview in the background, and kill() does not reach it.
  astro: (port) => ["astro", "preview", "--port", port, "--host", "127.0.0.1", "--ignore-lock"],
  next: (port) => ["next", "start", "-p", port, "-H", "127.0.0.1"],
};

const freePort = () =>
  new Promise((resolve, reject) => {
    const server = createServer().unref().on("error", reject);
    server.listen(0, () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
  });

async function waitFor(url, server) {
  for (let attempt = 0; attempt < 300; attempt++) {
    if (server.exitCode !== null) throw new Error(`The server exited with code ${server.exitCode}`);
    try {
      return await fetch(url);
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
  throw new Error(`${url} did not start`);
}

const expect = (condition, message) => {
  if (!condition) throw new Error(message);
};

async function checkBrowser(base, more) {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 800, height: 600 } });
    const problems = [];
    page.on("console", (message) => {
      if (["error", "warning"].includes(message.type())) problems.push(message.text());
    });
    page.on("pageerror", (error) => problems.push(error.message));

    await page.goto(base);
    // The first element is in view, so it reveals. The element below the fold stays hidden until the
    // test scrolls to it.
    await page.waitForSelector("#top:not([data-awesome-reveal])");
    expect(
      (await page.locator("#below").getAttribute("data-awesome-reveal")) === "hidden",
      "#below is not hidden before it scrolls into view",
    );
    expect(
      (await page.locator("#below").evaluate((element) => getComputedStyle(element).opacity)) ===
        "0",
      "reveal.css does not hide #below",
    );
    await page.locator("#below").scrollIntoViewIfNeeded();
    await page.waitForSelector("#below:not([data-awesome-reveal])");
    await more?.(page);

    expect(problems.length === 0, `The browser reported problems:\n${problems.join("\n")}`);
  } finally {
    await browser.close();
  }
}

// Each of `paths` must have hidden server markup.
export async function verifyInBrowser(cwd, server, { paths = [], more } = {}) {
  const port = await freePort();
  const base = `http://127.0.0.1:${port}`;
  const [command, ...args] = servers[server](String(port));
  // The binary runs directly, so that kill() reaches the server and not a pnpm wrapper.
  const child = spawn(join(cwd, "node_modules/.bin", command), args, { cwd, stdio: "inherit" });
  const exited = new Promise((resolve) => child.once("exit", resolve));
  try {
    await waitFor(base, child);
    await Promise.all(
      paths.map(async (path) => {
        const response = await fetch(base + path);
        expect(response.ok, `${path} answered ${response.status}`);
        expect(
          (await response.text()).includes('data-awesome-reveal="hidden"'),
          `${path} has no hidden element in the HTML`,
        );
      }),
    );
    await checkBrowser(base, more);
  } finally {
    child.kill();
    await exited;
  }
}

// Each page links to the next one, and the last links home. The ids are in the pages of smoke.mjs.
const nextRoutes = [
  { path: "/", id: "#top" },
  { path: "/about", id: "#about" },
  { path: "/legacy", id: "#legacy" },
];

export const verifyNext = (cwd) =>
  verifyInBrowser(cwd, "next", {
    paths: nextRoutes.map(({ path }) => path),
    async more(page) {
      await page.locator("#card").scrollIntoViewIfNeeded();
      await page.waitForSelector("#card:not([data-awesome-reveal])");

      // Each page mounts its own reveal after a client navigation.
      for (const { path, id } of nextRoutes.slice(1)) {
        await page.locator(`a[href="${path}"]`).click();
        await page.waitForURL(`**${path}`);
        await page.waitForSelector(`${id}:not([data-awesome-reveal])`);
      }
    },
  });
