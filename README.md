# InfoRadar Web

InfoRadar 的 Next.js 用户端与管理员端，包括注册登录、雷达、结果时间线、
额度、设置和运营管理页面。

## Local development

```powershell
Copy-Item .env.example .env.local
corepack pnpm install
corepack pnpm dev
```

pnpm 未安装到 PATH 时统一通过 `corepack` 调用，版本由 `package.json` 的
`packageManager` 字段锁定。

默认页面地址为 <http://localhost:3000>。前后端分离运行，API 由相邻的
`inforadar-server` 仓库在 `8080` 端口独立提供，因此 `.env.local` 需要指向它：

```text
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1
```

`.env.example` 里的同源 `/api/v1` 适用于线上由反向代理把两者合到同一域名的场景。
跨域联调依赖 Server `config.yml` 里的 `auth.allowed_origin`（默认 `http://localhost:3000`）——
用 `127.0.0.1:3000` 访问会因 Origin 精确比对而导致写请求返回 403。

完整的环境准备与启动步骤见
[`../分析/启动说明.md`](../分析/启动说明.md)。

浏览器鉴权使用 Server 设置的 HttpOnly JWT Cookie；Web 不把 Access 或
Refresh JWT 写入 localStorage。非安全写请求会附带 CSRF Cookie 对应的请求头。

## Verification

```powershell
corepack pnpm lint
corepack pnpm typecheck
corepack pnpm test
corepack pnpm build
corepack pnpm exec playwright test
```

OpenAPI 由相邻的 `inforadar-server` 仓库维护。Server 契约变更合并后运行：

```powershell
corepack pnpm generate:api
```

提交生成后的 `lib/api/generated/schema.ts`。
