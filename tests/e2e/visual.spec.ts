import { expect, test } from "@playwright/test";

// Baselines are per-platform; generate them on the machine/CI image that compares them.
const pages = ["/", "/work", "/work/lease-lens", "/work/connectafrobeats-platform", "/system", "/about"];

for (const path of pages) {
  test(`visual ${path} @visual`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
    await page.goto(path);
    await page.evaluate(() => document.fonts.ready);
    await expect(page).toHaveScreenshot({
      fullPage: true,
      animations: "disabled",
      // The hero canvas depends on the time of day.
      mask: [page.locator("canvas")],
    });
  });
}
