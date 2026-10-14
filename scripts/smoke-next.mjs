// Starts the built Next.js app of the smoke test and checks it in HTML and in Chromium.
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { join } from "node:path";

import { chromium } from "playwright";

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
    if (server.exitCode !== null) throw new Error(`next start exited with code ${server.exitCode}`);
    try {
      return await fetch(url);
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
  throw new Error(`${url} did not start`);
}

// Each page links to the next one, and the last links home. The ids are in the pages of smoke.mjs.
const routes = [
  { path: "/", id: "#top" },
  { path: "/about", id: "#about" },
  { path: "/legacy", id: "#legacy" },
];

const expect = (condition, message) => {
  if (!condition) throw new Error(message);
};

async function checkBrowser(base) {
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
    await page.waitForSelector("#top:not([data-reveal])");
    expect(
      (await page.locator("#below").getAttribute("data-reveal")) === "hidden",
      "#below is not hidden before it scrolls into view",
    );
    expect(
      (await page.locator("#below").evaluate((element) => getComputedStyle(element).opacity)) ===
        "0",
      "reveal.css does not hide #below",
    );
    await page.locator("#below").scrollIntoViewIfNeeded();
    await page.waitForSelector("#below:not([data-reveal])");
    await page.locator("#card").scrollIntoViewIfNeeded();
    await page.waitForSelector("#card:not([data-reveal])");

    // Each page mounts its own reveal after a client navigation.
    for (const { path, id } of routes.slice(1)) {
      await page.locator(`a[href="${path}"]`).click();
      await page.waitForURL(`**${path}`);
      await page.waitForSelector(`${id}:not([data-reveal])`);
    }

    expect(problems.length === 0, `The browser reported problems:\n${problems.join("\n")}`);
  } finally {
    await browser.close();
  }
}

export async function verifyNext(cwd) {
  const port = await freePort();
  const base = `http://127.0.0.1:${port}`;
  // The binary runs directly, so that kill() reaches the server and not a pnpm wrapper.
  const server = spawn(
    join(cwd, "node_modules/.bin/next"),
    ["start", "-p", String(port), "-H", "127.0.0.1"],
    { cwd, stdio: "inherit" },
  );
  const exited = new Promise((resolve) => server.once("exit", resolve));
  try {
    await waitFor(base, server);
    await Promise.all(
      routes.map(async ({ path }) => {
        const response = await fetch(base + path);
        expect(response.ok, `${path} answered ${response.status}`);
        expect(
          (await response.text()).includes('data-reveal="hidden"'),
          `${path} has no hidden element in the HTML`,
        );
      }),
    );
    await checkBrowser(base);
  } finally {
    server.kill();
    await exited;
  }
}
