import { expect, test } from "@playwright/test";

const isMobile = (name: string) => name === "mobile";

test.describe("home", () => {
  test("positioning, work and contact are present", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("link", { name: "See the work" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Email me" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Selected work" })).toBeAttached();
  });

  test("no horizontal page scroll", async ({ page }) => {
    for (const path of ["/", "/work", "/work/lease-lens", "/system", "/about"]) {
      await page.goto(path);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow, path).toBeLessThanOrEqual(0);
    }
  });

  test("navigation matches the device", async ({ page }, info) => {
    await page.goto("/");
    const bottom = page.locator("nav[data-bottom-nav]");
    if (isMobile(info.project.name)) {
      await expect(bottom).toBeVisible();
      await bottom.getByRole("link", { name: "Work" }).click();
    } else {
      await expect(bottom).toBeHidden();
      await page.locator("header").getByRole("link", { name: "Work" }).click();
    }
    await expect(page).toHaveURL(/\/work$/);
  });
});

test.describe("work", () => {
  test("filters update the URL and can be loaded from it", async ({ page }) => {
    await page.goto("/work");
    const all = await page.locator("main article").count();
    await page.getByRole("button", { name: "Design", exact: true }).click();
    await expect(page).toHaveURL(/discipline=design/);
    const filtered = await page.locator("main article").count();
    expect(filtered).toBeLessThan(all);

    await page.goto("/work?discipline=design");
    await expect(page.getByRole("button", { name: "Design", exact: true })).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("main article")).toHaveCount(filtered);
  });

  test("card-depth projects show a compact card but no case study", async ({ page }) => {
    await page.goto("/work");
    const card = page.locator("main article", { hasText: "Rékọjá" });
    await expect(card.getByRole("link", { name: /Visit site/ })).toHaveAttribute("href", "https://rekoja.shop");
    const res = await page.goto("/work/rekoja");
    expect(res?.status()).toBe(404);
  });


  test("case study has contents and next project", async ({ page }) => {
    await page.goto("/work/lease-lens");
    await expect(page.getByRole("heading", { level: 1, name: "Lease Lens" })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "On this page" })).toBeAttached();
    await page.getByRole("navigation", { name: "More projects" }).getByRole("link").last().click();
    await expect(page).not.toHaveURL(/lease-lens$/);
  });
});

test.describe("command palette", () => {
  test("search and navigate", async ({ page }, info) => {
    await page.goto("/");
    if (info.project.name === "desktop") {
      // The shortcut is live once hydrated; retry rather than guess a delay.
      await expect(async () => {
        await page.keyboard.press("ControlOrMeta+k");
        await expect(page.getByRole("dialog", { name: "Search the site" })).toBeVisible({ timeout: 500 });
      }).toPass();
    } else if (isMobile(info.project.name)) {
      await page.locator("nav[data-bottom-nav]").getByRole("button", { name: "Search" }).click();
    } else {
      await page.locator("header").getByRole("button", { name: /Search/ }).click();
    }
    const dialog = page.getByRole("dialog", { name: "Search the site" });
    await expect(dialog).toBeVisible();
    await dialog.getByRole("combobox").fill("myareaa");
    await expect(dialog.getByRole("option").first()).toContainText("MyAreaa");
    await dialog.getByRole("combobox").press("Enter");
    await expect(page).toHaveURL(/\/work\/myareaa$/);
    await expect(dialog).toBeHidden();
  });
});

test.describe("inspect mode", () => {
  test("toggles with I, persists to the URL and closes with Escape", async ({ page }) => {
    await page.goto("/");
    await page.locator("body").press("i");
    await expect(page).toHaveURL(/inspect=1/);
    await expect(page.getByRole("status").filter({ hasText: "Inspect mode" })).toBeVisible();
    await expect(page.getByRole("button", { name: /^Annotation 1:/ })).toBeAttached();
    await page.keyboard.press("Escape");
    await expect(page).not.toHaveURL(/inspect=1/);
  });

  test("a shared ?inspect=1 link opens in inspect mode", async ({ page }) => {
    await page.goto("/work?inspect=1");
    await expect(page.getByRole("status").filter({ hasText: "Inspect mode" })).toBeVisible();
  });
});

test.describe("theme", () => {
  test("explicit choice persists across reloads", async ({ page }) => {
    await page.goto("/");
    const toggle = page.getByRole("button", { name: /theme\. Switch to/ });
    await toggle.click(); // system -> light
    await toggle.click(); // light -> dark
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  });
});

test.describe("contact form", () => {
  test("validates and reports errors without leaving the page", async ({ page }) => {
    await page.goto("/");
    const form = page.locator("form[action='/api/contact']");
    await form.getByLabel("Name").fill("Test");
    await form.getByLabel("Email").fill("test@example.com");
    await form.getByLabel("Message").fill("Hello, this is a test message.");
    await form.getByRole("button", { name: "Send message" }).click();
    // No RESEND_API_KEY in tests: the route explains how to reach you instead.
    await expect(form.getByText(/email meetonomeosika@gmail.com/)).toBeVisible();
    await expect(page).toHaveURL(/\/$/);
  });
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("content is server-rendered", async ({ page }) => {
    await page.goto("/work/lease-lens");
    await expect(page.getByRole("heading", { level: 1, name: "Lease Lens" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Privacy and security" })).toBeVisible();
    await page.goto("/work");
    expect(await page.locator("main article").count()).toBeGreaterThan(3);
  });
});
