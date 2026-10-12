import { type Browser, chromium, firefox, type Page, webkit } from "playwright";
import { inject } from "vitest";

const baseURL = inject("baseURL");

// The page records CSP violations, which the console does not report in every engine.
function recordViolations() {
  const violations: string[] = [];
  Object.assign(window, { violations });
  document.addEventListener("securitypolicyviolation", (event) =>
    violations.push(`${event.violatedDirective} ${event.blockedURI}`),
  );
}

async function revealed(page: Page, selector: string) {
  await page.waitForFunction((selector) => {
    const element = document.querySelector(selector);
    return (
      element !== null &&
      !element.hasAttribute("data-reveal") &&
      getComputedStyle(element).opacity === "1" &&
      element.getAnimations({ subtree: true }).length === 0
    );
  }, selector);
}

function isHidden(page: Page, selector: string) {
  return page.$eval(
    selector,
    (element) =>
      element.getAttribute("data-reveal") === "hidden" && getComputedStyle(element).opacity === "0",
  );
}

describe.each([
  ["chromium", chromium],
  ["firefox", firefox],
  ["webkit", webkit],
])("example in %s", (_, browserType) => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await browserType.launch();
  });

  afterAll(async () => {
    await browser.close();
  });

  beforeEach(async () => {
    page = await browser.newPage({ baseURL, viewport: { width: 1280, height: 720 } });
    await page.addInitScript(recordViolations);
    // Astro does not support `security.csp` with the ClientRouter.
    await page.route("**/*", async (route) => {
      const response = await route.fetch();
      await route.fulfill({
        response,
        headers: { ...response.headers(), "content-security-policy": "style-src-attr 'none'" },
      });
    });
    await page.goto("/");
  });

  afterEach(async () => {
    expect(
      await page.evaluate(() => (window as unknown as { violations: string[] }).violations),
    ).toEqual([]);
    await page.close();
  });

  it("shows the hidden elements when a print rule of the page applies", async () => {
    await page.addStyleTag({
      content: '@media print { [data-reveal="hidden"] { opacity: 1 !important; } }',
    });
    expect(await isHidden(page, "#stagger")).toBe(true);

    await page.emulateMedia({ media: "print" });

    expect(await page.$eval("#stagger", (element) => getComputedStyle(element).opacity)).toBe("1");
  });

  it("reveals the element in the viewport, and keeps the others hidden", async () => {
    await revealed(page, "#default");

    expect(await isHidden(page, "#stagger")).toBe(true);
  });

  it("reveals an element when it scrolls into the viewport, and staggers its children", async () => {
    await page.locator("#stagger").scrollIntoViewIfNeeded();
    await page.waitForFunction(
      () => !document.querySelector("#stagger")!.hasAttribute("data-reveal"),
    );

    expect(
      await page.$$eval("#stagger > li", (items) =>
        items.map((item) => item.getAnimations().length),
      ),
    ).toEqual([1, 1, 1]);
    await revealed(page, "#stagger");
  });

  it("keeps the attributes of the element", async () => {
    const title = page.locator(".title");
    await title.scrollIntoViewIfNeeded();
    await revealed(page, ".title");

    expect(
      await title.evaluate((element: HTMLElement) => [
        element.localName,
        element.title,
        getComputedStyle(element).color,
      ]),
    ).toEqual(["h2", "A title attribute", "rgb(0, 128, 128)"]);
  });

  it("reveals an element in a server island", async () => {
    const island = page.locator("#server-island");
    await island.scrollIntoViewIfNeeded();

    await revealed(page, "#server-island");
  });

  it("reveals with `when` when the options attribute changes", async () => {
    await page.locator("#toggle").scrollIntoViewIfNeeded();
    expect(await isHidden(page, "#manual")).toBe(true);

    await page.locator("#toggle").click();

    await revealed(page, "#manual");
  });

  it("reveals the elements of a page after a ClientRouter navigation", async () => {
    await page.getByRole("link", { name: "Other page", exact: true }).click();
    await page.waitForURL("/other");

    await revealed(page, "#other");
  });

  it("reveals a Reveal with transition:persist after a navigation", async () => {
    await page.getByRole("link", { name: "Other page", exact: true }).click();
    await page.waitForURL("/other");
    expect(await isHidden(page, "#persisted-reveal")).toBe(true);

    await page.locator("#persisted-reveal").scrollIntoViewIfNeeded();

    await revealed(page, "#persisted-reveal");
  });

  it("does not play a transition:persist element again after a navigation", async () => {
    await page.locator("#persisted").scrollIntoViewIfNeeded();
    await revealed(page, "#persisted");
    await page.$eval("#persisted", (element) => element.setAttribute("data-before", ""));

    await page.getByRole("link", { name: "Go to the other page" }).click();
    await page.waitForURL("/other");
    // Lets the queued disconnection and IntersectionObserver callbacks run.
    await page.waitForTimeout(100);

    expect(
      await page.$eval("#persisted", (element) => [
        element.hasAttribute("data-before"),
        element.hasAttribute("data-reveal"),
        element.getAnimations().length,
      ]),
    ).toEqual([true, false, 0]);
  });
});

describe("example server markup", () => {
  let browser: Browser;

  beforeAll(async () => {
    browser = await chromium.launch();
  });

  afterAll(async () => {
    await browser.close();
  });

  it("hides the elements before the custom element starts", async () => {
    const page = await browser.newPage({ baseURL });
    await page.addInitScript(() => {
      const define = customElements.define.bind(customElements);
      customElements.define = (name, ...rest) => {
        if (name !== "awesome-reveal") define(name, ...rest);
      };
    });
    await page.goto("/");

    expect(await isHidden(page, "#default")).toBe(true);
  });

  it("shows the content without JavaScript", async () => {
    const page = await browser.newPage({ baseURL, javaScriptEnabled: false });
    await page.goto("/");

    expect(
      await page.$eval("#stagger", (element) => [
        element.getAttribute("data-reveal"),
        getComputedStyle(element).opacity,
      ]),
    ).toEqual(["hidden", "1"]);
  });
});
