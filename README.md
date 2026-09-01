# InfoRadar Web

InfoRadar 的 Next.js 用户端与管理员端，包括注册登录、雷达、结果时间线、
额度、设置和运营管理页面。

## Local development

```powershell
Copy-Item .env.example .env.local
pnpm install
pnpm dev
```

默认页面地址为 <http://localhost:3000>。`.env.example` 使用同源
`/api/v1`；如果 API 在本地 `8080` 端口独立运行，可在 `.env.local` 中设置：

```text
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1
```

浏览器鉴权使用 Server 设置的 HttpOnly JWT Cookie；Web 不把 Access 或
Refresh JWT 写入 localStorage。非安全写请求会附带 CSRF Cookie 对应的请求头。

## Verification

```powershell
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm exec playwright test
```

OpenAPI 由相邻的 `inforadar-server` 仓库维护。Server 契约变更合并后运行：

```powershell
pnpm generate:api
```

提交生成后的 `lib/api/generated/schema.ts`。发布与回滚流程见
[`docs/RELEASE.md`](docs/RELEASE.md)。
