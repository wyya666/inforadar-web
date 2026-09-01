import { expect, type Page, test } from "@playwright/test";

const user = {
  id: "01K4USER000000000000000000",
  email: "radar@example.com",
  display_name: "Radar User",
  role: "user",
  status: "active",
  email_verified_at: "2026-09-01T00:00:00Z",
  digest_enabled: true,
  search_credits: 76,
  credit_reset_at: "2026-10-01T00:00:00Z",
};

const radar = {
  id: "01K4RADAR00000000000000000",
  name: "AI Agent 行业进展",
  user_intent: "持续关注 AI Agent 的重要产品发布",
  search_query: "AI Agent 产品 发布",
  relevance_criteria: "必须是具体产品或版本发布",
  interval_minutes: 360,
  relevance_threshold: 70,
  status: "active",
  next_scan_at: "2026-09-01T12:00:00Z",
  last_scan_at: "2026-09-01T06:00:00Z",
  created_at: "2026-09-01T00:00:00Z",
  updated_at: "2026-09-01T06:00:00Z",
};

async function mockApi(page: Page) {
  await page.route("http://localhost:8080/api/v1/**", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const headers = {
      "access-control-allow-origin": "http://127.0.0.1:3000",
      "access-control-allow-credentials": "true",
      "access-control-allow-headers": "content-type,x-csrf-token",
      "access-control-allow-methods": "GET,POST,PATCH,DELETE,OPTIONS",
    };
    if (request.method() === "OPTIONS") {
      await route.fulfill({ status: 204, headers });
      return;
    }

    const responses: Record<string, unknown> = {
      "POST /api/v1/auth/login": { user },
      "GET /api/v1/users/me": { user },
      "GET /api/v1/radars": { radars: [radar] },
      "GET /api/v1/results/summary": { unread: 2 },
      "GET /api/v1/usage": {
        usage: {
          remaining: 76,
          monthly_limit: 100,
          reset_at: "2026-10-01T00:00:00Z",
        },
      },
      "GET /api/v1/results": {
        items: [
          {
            id: "01K4RESULT0000000000000000",
            radar_id: radar.id,
            scan_run_id: "01K4RUN0000000000000000000",
            title: "新的开源 Agent 框架发布",
            url: "https://source.example/agent-release",
            published_at: null,
            source: "source.example",
            provider_snippet: "Provider summary",
            summary: "该项目发布了可复现的多智能体协作框架。",
            relevance_reason: "符合具体产品发布标准",
            relevance_score: 92,
            is_relevant: true,
            is_read: false,
            created_at: "2026-09-01T06:00:00Z",
          },
        ],
      },
    };
    const key = `${request.method()} ${url.pathname}`;
    const response = responses[key];
    if (!response) {
      await route.fulfill({
        status: 404,
        headers,
        contentType: "application/json",
        body: JSON.stringify({ error: { code: "unmocked", message: key } }),
      });
      return;
    }
    await route.fulfill({
      status: 200,
      headers,
      contentType: "application/json",
      body: JSON.stringify(response),
    });
  });
}

test("registration rejects malformed account data before submission", async ({ page }) => {
  await page.goto("/register");
  await page.getByLabel("昵称").fill("测试用户");
  await page.getByLabel("邮箱").fill("not-an-email");
  await page.getByLabel("密码").fill("short");
  await page.getByRole("button", { name: "创建账户" }).click();

  await expect(page.getByText("请输入有效的邮箱地址")).toBeVisible();
  await expect(page.getByText("密码至少需要 12 个字符")).toBeVisible();
});

test("successful login reaches a live dashboard overview", async ({ page }) => {
  await mockApi(page);
  await page.goto("/login");
  await page.getByLabel("邮箱").fill("radar@example.com");
  await page.getByLabel("密码").fill("a-secure-password");
  await page.getByRole("button", { name: "登录" }).click();

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole("heading", { name: "你的信息雷达" })).toBeVisible();
  await expect(page.getByText("1 / 3")).toBeVisible();
  await expect(page.getByText("76 / 100")).toBeVisible();
  await expect(page.getByText("AI Agent 行业进展")).toBeVisible();
  await expect(page.getByText("Radar User")).toBeVisible();
});

test("result timeline labels AI content and preserves its source link", async ({ page }) => {
  await mockApi(page);
  await page.goto("/results");

  await expect(page.getByRole("heading", { name: "最新结果" })).toBeVisible();
  await expect(page.getByText("该项目发布了可复现的多智能体协作框架。")).toBeVisible();
  await expect(page.getByText("发布时间未知")).toBeVisible();
  await expect(page.getByRole("link", { name: /查看原文/ })).toHaveAttribute(
    "href",
    "https://source.example/agent-release",
  );
});
