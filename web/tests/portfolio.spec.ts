import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { executeCommand } from "../lib/terminal-commands";
import { safeHref } from "../content/socials";
import { projects } from "../content/projects";

// Skip the once-per-session boot sequence everywhere except its own test.
test.beforeEach(async ({ page }, testInfo) => {
  if (!testInfo.title.startsWith("boot"))
    await page.addInitScript(() => sessionStorage.setItem("solara-booted", "1"));
});

test("content and command boundaries remain factual and safe", () => {
  expect(projects).toHaveLength(6);
  expect(new Set(projects.map((project) => project.slug)).size).toBe(6);
  expect(
    projects.every((project) => safeHref(project.github) !== null),
  ).toBeTruthy();
  expect(safeHref("javascript:alert(1)")).toBeNull();
  expect(safeHref("//evil.example")).toBeNull();
  expect(safeHref("https://example.com")).toBe("https://example.com");
  expect(executeCommand("rm -rf /").href).toBeUndefined();
  expect(executeCommand("__proto__").lines[0]).toContain("Unknown command");
  expect(executeCommand("projects").lines).toHaveLength(6);
});

test("home loads without errors, images render, and keyboard entry works", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.locator(".world")).toHaveAttribute("data-mode", "game");
  await expect(page.locator("main h1")).toContainText("Mukul Rana");
  await expect(page.locator(".sunset-scene")).toBeVisible();
  await expect(page.locator(".boot")).toHaveCount(0);
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
  await page.screenshot({
    path: testInfo.outputPath("home.png"),
    fullPage: true,
  });
  expect(errors).toEqual([]);
});

test("every public section and project is reachable", async ({ page }) => {
  // Loads 17 pages in one test, so it needs more than the default timeout.
  test.slow();
  for (const route of [
    "map",
    "about",
    "experience",
    "missions",
    "hackathons",
    "skills",
    "achievements",
    "gallery",
    "timeline",
    "contact",
    "resume",
    ...projects.map((project) => `missions/${project.slug}`),
  ]) {
    const response = await page.goto(`/${route}`);
    expect(response?.status(), route).toBe(200);
    await expect(page.locator("main h1")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      route,
    ).toBeTruthy();
  }
  await page.goto("/outside-the-map");
  await expect(
    page.getByRole("heading", { name: "404", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Return to the city" }),
  ).toHaveAttribute("href", "/map");
});

test("projects list and skill relationships work", async ({ page }) => {
  await page.goto("/missions");
  await expect(page.locator(".project-card")).toHaveCount(6);
  await expect(page.locator(".project-card .project-metric").first()).toBeVisible();
  await page.goto("/skills");
  await page.getByRole("button", { name: "Backend", exact: true }).click();
  await expect(page.locator(".skill-item")).toHaveCount(17);
  await expect(page.getByRole("region", { name: "Equipped weapon" })).toContainText("Python");
  await page.getByText("FastAPI", { exact: true }).click();
  await expect(
    page.locator("details[open]").getByRole("link", { name: "Offline Multimodal RAG" }),
  ).toHaveAttribute("href", "/missions/offline-multimodal-rag");
  await page
    .getByRole("textbox", { name: "Search skills" })
    .fill("no-such-tech");
  await expect(
    page.getByText("No technologies match this search."),
  ).toBeVisible();
});

test("settings, focus, sound opt-in, and recruiter persistence", async ({
  page,
}) => {
  await page.goto("/");
  // Radio lives in the pause menu now; the header keeps only the main controls.
  await page.getByRole("button", { name: "Open pause menu" }).click();
  await page
    .getByRole("dialog", { name: "Paused" })
    .getByRole("button", { name: "Radio & settings" })
    .click();
  await expect(
    page.getByRole("checkbox", { name: "Sound enabled" }),
  ).not.toBeChecked();
  await page.getByRole("slider", { name: "Master volume" }).fill("23");
  await page
    .getByRole("combobox", { name: "Music station" })
    .selectOption("ambient");
  await page.getByRole("checkbox", { name: "Sound enabled" }).check();
  await expect(
    page.getByRole("checkbox", { name: "Sound enabled" }),
  ).toBeChecked();
  await page.getByRole("button", { name: "Close settings" }).click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await page
    .getByRole("button", { name: "Recruiter mode", exact: true })
    .click();
  await expect(page.locator(".world")).toHaveAttribute(
    "data-mode",
    "recruiter",
  );
  await page.reload();
  await expect(page.locator(".world")).toHaveAttribute(
    "data-mode",
    "recruiter",
  );
  await page.getByRole("button", { name: "Open settings" }).click();
  await expect(page.getByRole("slider", { name: "Master volume" })).toHaveValue(
    "23",
  );
  await expect(
    page.getByRole("checkbox", { name: "Sound enabled" }),
  ).not.toBeChecked();
  await expect(
    page.getByRole("checkbox", { name: "Sound enabled" }),
  ).toBeDisabled();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
});

test("menu, terminal commands, secret and keyboard dismissal", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu", exact: true }).click();
  await expect(
    page.getByRole("dialog", { name: "Quick travel" }),
  ).toBeVisible();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Open terminal", exact: true })
    .click();
  await page
    .getByRole("textbox", { name: "Terminal command" })
    .fill("projects");
  await page.getByRole("button", { name: "Run command" }).click();
  await expect(page.getByRole("log")).toContainText("06 SonarAudio Scenes");
  await page
    .getByRole("textbox", { name: "Terminal command" })
    .fill("sudo hire-mukul");
  await page.getByRole("button", { name: "Run command" }).click();
  await expect(page.getByRole("status")).toContainText("SECRET FOUND");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
});

test("reduced motion and representative accessibility audit", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  expect(
    await page
      .locator(".hero-content")
      .evaluate((element) => getComputedStyle(element).animationName),
  ).toBe("none");
  for (const route of [
    "/",
    "/map",
    "/skills",
    "/contact",
    "/missions/anonproof",
  ]) {
    await page.goto(route);
    const scan = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      scan.violations,
      `${route}: ${JSON.stringify(scan.violations.map((item) => ({ id: item.id, nodes: item.nodes.map((node) => node.target) })))}`,
    ).toEqual([]);
  }
});

test("metadata, sitemap, and robots are served", async ({ page, request }) => {
  await page.goto("/missions/anonproof");
  await expect(page).toHaveTitle("AnonProof | Mukul Rana");
  expect(
    await page.locator('link[rel="canonical"]').getAttribute("href"),
  ).toContain("/missions/anonproof");
  expect(
    await page.locator('script[type="application/ld+json"]').textContent(),
  ).toContain('"@type":"Person"');
  expect((await request.get("/sitemap.xml")).status()).toBe(200);
  expect((await request.get("/robots.txt")).status()).toBe(200);
});

test("boot sequence plays once per session and can be skipped", async ({
  page,
}, testInfo) => {
  await page.goto("/");
  if (testInfo.project.name === "mobile") {
    await expect(page.locator(".boot")).toHaveCount(0);
    await expect(page.getByRole("dialog", { name: "Main menu" })).toHaveCount(0);
    await expect(page.locator("main h1")).toBeVisible();
    await page.goto("/experience/asr-aviation");
    await expect(page.locator(".boot")).toHaveCount(0);
    await expect(page.locator("main")).toContainText("Django");
    return;
  }
  const boot = page.getByRole("dialog", { name: "Intro" });
  await expect(boot).toBeVisible();
  await page.getByRole("button", { name: "Press start" }).first().click();
  await expect(boot).toHaveCount(0);
  const menu = page.getByRole("dialog", { name: "Main menu" });
  await expect(menu).toBeVisible();
  await menu.getByRole("button", { name: "Controls" }).click();
  await expect(menu.getByText("Quick travel wheel")).toBeVisible();
  await menu.getByRole("button", { name: "Back" }).click();
  // "Continue" once any progress exists, e.g. the Night Owl trophy after 8 PM local time.
  await menu.getByRole("button", { name: /^(Play|Continue)\b/ }).click();
  await expect(menu).toBeHidden();
  await page.reload();
  await expect(page.locator(".boot")).toBeHidden();
  await page.goto("/missions");
  await expect(page.locator(".boot")).toBeHidden();
});

test("boot sequence never shows in recruiter mode", async ({ page }) => {
  await page.addInitScript(() =>
    localStorage.setItem("solara-preferences", JSON.stringify({ mode: "recruiter" })),
  );
  await page.goto("/");
  await expect(page.locator(".boot")).toBeHidden();
  await expect(page.locator(".objective")).toHaveCount(0);
});

test("game shortcuts open quick travel and the pause menu", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "keyboard shortcuts are desktop only");
  await page.goto("/");
  await page.locator("main h1").click();
  await page.keyboard.press("q");
  const travel = page.getByRole("dialog", { name: "Quick travel" });
  await expect(travel).toBeVisible();
  await expect(travel.getByRole("link", { name: /Projects/ })).toHaveAttribute("href", "/missions");
  await page.keyboard.press("Escape");
  await expect(travel).toBeHidden();
  await page.keyboard.press("Escape");
  const pause = page.getByRole("dialog", { name: "Paused" });
  await expect(pause).toBeVisible();
  await expect(pause.getByText("Districts discovered")).toBeVisible();
  await pause.getByRole("button", { name: "Controls" }).click();
  await expect(pause.getByText("Quick travel")).toBeVisible();
  await pause.getByRole("button", { name: "Resume" }).click();
  await expect(pause).toBeHidden();
  await page.keyboard.press("m");
  await expect(page).toHaveURL(/\/map$/);
});

test("districts are discovered and operations complete at the end", async ({
  page,
}) => {
  await page.goto("/map");
  await expect(page.locator(".map-marker.is-unknown")).toHaveCount(8);
  await page.goto("/missions/hydrosense");
  await page.locator(".mission-status").scrollIntoViewIfNeeded();
  await expect(page.locator(".mission-status")).toHaveText(/Operation complete/);
  await page.goto("/map");
  await expect(page.locator(".map-marker.is-known")).toHaveCount(1);
  await page.getByRole("button", { name: "Zoom in" }).click();
  await expect(page.locator(".map-canvas")).toHaveAttribute("style", /scale\(1\.3\)/);
  await page.goto("/achievements");
  await expect(page.getByText("First Operation")).toBeVisible();
});

test("photo mode gallery shows real event photos and filters them", async ({ page }) => {
  await page.goto("/gallery");
  await expect(page.locator(".photo-card")).toHaveCount(12);
  await page.getByRole("button", { name: /Show more/ }).click();
  await expect(page.locator(".photo-card")).toHaveCount(24);
  await page.getByRole("button", { name: "Hackathons", exact: true }).click();
  await expect(page.locator(".photo-card")).toHaveCount(12);
  await page.locator(".photo-card").first().click();
  const photo = page.getByRole("dialog", { name: "Smart India Hackathon 2025 Grand Finale" });
  await expect(photo).toBeVisible();
  await photo.getByRole("button", { name: "Next photo" }).click();
  await expect(page.getByRole("dialog", { name: "Hack Better Than Me" })).toBeVisible();
});

test("explain toggle defaults to plain words, switches to technical and remembers it", async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem("solara-booted", "1"));
  await page.goto("/");
  const hero = page.locator(".hero");
  await expect(hero.getByText("I build apps and the systems behind them")).toBeVisible();
  await expect(hero.getByText("Python and TypeScript, Postgres")).toBeHidden();
  await page.locator("#abilities").getByRole("button", { name: "Technically" }).click();
  await expect(hero.getByText("Python and TypeScript, Postgres")).toBeVisible();
  await page.reload();
  await expect(page.locator(".ability-card .say-tech").first()).toBeVisible();
  await page.evaluate(() => localStorage.removeItem("solara-explain"));
});

test("story mode lives on About as a GPS route, and /timeline redirects there", async ({ page }) => {
  await page.goto("/timeline");
  await expect(page).toHaveURL(/\/about#story$/);
  await expect(page.locator(".story-mission")).toHaveCount(8);
  await expect(page.getByRole("table", { name: "Story progress" })).toContainText("%");
  await page.locator(".story-mission").last().scrollIntoViewIfNeeded();
  await expect(page.locator(".story-mission.is-passed").first()).toBeVisible();
});

test("footer carries the calls to action", async ({ page }) => {
  await page.goto("/");
  const footer = page.locator("footer");
  await expect(footer.getByRole("link", { name: "Email me" })).toHaveAttribute("href", /^mailto:/);
  await expect(footer.getByRole("link", { name: "Resume" })).toHaveAttribute("href", "/resume");
  await expect(footer.getByRole("link", { name: "Story" })).toHaveAttribute("href", "/about#story");
});

test("hackathons are a flat list and certifications link to verification", async ({ page }) => {
  await page.goto("/hackathons");
  await expect(page.locator(".hack-row")).toHaveCount(12);
  await expect(page.locator(".hack-list a[href^='/hackathons/']")).toHaveCount(0);
  const missing = await page.goto("/hackathons/smart-india-hackathon-2025");
  expect(missing?.status()).toBe(404);
  await page.goto("/achievements");
  await expect(page.locator(".cert-card")).toHaveCount(10);
  await expect(page.locator(".cert-card a").first()).toHaveAttribute("href", /coursera\.org\/verify\//);
});

test("mobile reading stays vertical with direct, usable navigation", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "phone layout only");
  for (const viewport of [{ width: 320, height: 568 }, { width: 390, height: 844 }, { width: 760, height: 600 }]) {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await expect(page.locator(".career-road")).not.toHaveClass(/is-pinned/);
    await expect(page.locator(".scene").first()).toHaveCSS("position", "relative");
    const layout = await page.evaluate(() => {
      const cards = [...document.querySelectorAll(".road-stop")].map((card) => card.getBoundingClientRect());
      const links = [...document.querySelectorAll(".mobile-dock a")].map((link) => link.getBoundingClientRect());
      return {
        overflow: document.documentElement.scrollWidth > innerWidth,
        stacked: cards.every((card, index) => index === 0 || card.top >= cards[index - 1].bottom),
        targets: links.every((link) => link.width >= 44 && link.height >= 44),
      };
    });
    expect(layout).toEqual({ overflow: false, stacked: true, targets: true });
    if (viewport.width <= 420) {
      // Wait for the existing hero entrance transform before measuring.
      await expect.poll(() => page.evaluate(() => {
        const actions = document.querySelector(".hero-actions")!.getBoundingClientRect();
        const dock = document.querySelector(".mobile-dock")!.getBoundingClientRect();
        return actions.bottom <= dock.top;
      })).toBe(true);
    }
  }
  const nav = page.getByRole("navigation", { name: "Mobile navigation" });
  for (const [name, route] of [["Projects", "/missions"], ["Experience", "/experience"], ["Resume", "/resume"], ["Contact", "/contact"]]) {
    await nav.getByRole("link", { name, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`${route}$`));
    await expect(nav.getByRole("link", { name, exact: true })).toHaveAttribute("aria-current", "page");
    await expect(page.locator("main h1")).toBeVisible();
  }
  await page.getByRole("button", { name: "Open menu", exact: true }).click();
  await expect(page.getByRole("dialog", { name: "Quick travel" })).toBeVisible();
});

test("career pinning responds to viewport and motion preferences", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "desktop transition coverage");
  await page.goto("/");
  const road = page.locator(".career-road");
  await expect(road).toHaveClass(/is-pinned/);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(road).not.toHaveClass(/is-pinned/);
  await expect(road).not.toHaveAttribute("style", /height/);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect(road).toHaveClass(/is-pinned/);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(road).not.toHaveClass(/is-pinned/);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(road).toHaveClass(/is-pinned/);
  await page.getByRole("button", { name: "Recruiter mode", exact: true }).click();
  await expect(road).not.toHaveClass(/is-pinned/);
});

test("both role resumes download as PDFs", async ({ page, request }) => {
  await page.goto("/resume");
  for (const [role, path] of [
    ["GenAI Engineer", "/Mukul_Rana_GenAI_Engineer_Resume.pdf"],
    ["Software Engineer", "/Mukul_Rana_Software_Engineer_Resume.pdf"],
  ]) {
    const link = page.getByRole("link", { name: `${role} resume`, exact: true });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", path);
    const [download] = await Promise.all([page.waitForEvent("download"), link.click()]);
    expect(await download.failure()).toBeNull();
    const response = await request.get(path);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("application/pdf");
    expect((await response.body()).subarray(0, 5).toString()).toBe("%PDF-");
  }
});
