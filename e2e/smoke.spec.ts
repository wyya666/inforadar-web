import { expect, test } from "@playwright/test";

test("public landing page links to registration", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "让重要信息主动找到你" })).toBeVisible();
  await expect(page.getByRole("link", { name: /免费开始/ }).first()).toHaveAttribute("href", "/register");
});

test("login page exposes the JWT cookie based sign-in form", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: "继续关注重要变化" })).toBeVisible();
  await expect(page.getByLabel("邮箱")).toBeVisible();
  await expect(page.getByLabel("密码")).toBeVisible();
});
