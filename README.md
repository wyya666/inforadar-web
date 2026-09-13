# InfoRadar Web

InfoRadar 的 Next.js 用户端与管理员端，包括注册登录、雷达、结果时间线、
搜索服务设置、账户设置和运营管理页面。

## 本地开发

首次准备：

```bash
cp .env.example .env.local
corepack pnpm install
```

启动：

```bash
corepack pnpm dev        # http://localhost:3000
```

pnpm 未安装到 PATH 时统一通过 `corepack` 调用，版本由 `package.json` 的
`packageManager` 字段锁定。

前后端分离运行，API 由相邻的 `inforadar-server` 仓库在 `8080` 端口独立提供，
启动前端前需要它已经跑起来（该仓库 README 有启动步骤）。`.env.local` 必须指向它：

```text
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1
```

`.env.example` 已使用本地完整 API 地址；线上部署时应按实际 API 域名覆盖该变量。

**必须用 `http://localhost:3000` 访问，不能用 `127.0.0.1:3000`。**
跨域联调依赖 Server `config.yml` 里的 `auth.allowed_origin`（默认 `http://localhost:3000`），
CORS 和 CSRF 网关都对它做字面量精确比对，地址用错会导致所有写请求返回 403。

新账号注册后即可登录，无需验证邮箱。注册、重置和修改密码时，密码至少需要
4 个字符。

浏览器鉴权使用 Server 设置的 HttpOnly JWT Cookie；Web 不把 Access 或
Refresh JWT 写入 localStorage。非安全写请求会附带 CSRF Cookie 对应的请求头。

## 验证

```bash
corepack pnpm lint
corepack pnpm typecheck
corepack pnpm test
corepack pnpm build
corepack pnpm exec playwright test
```

Playwright 会自己拉起 `pnpm dev`，且 `e2e/critical.spec.ts` 用 `page.route` 把
`**/api/v1/**` 全部 mock，所以跑 E2E 不需要后端在运行。

OpenAPI 由相邻的 `inforadar-server` 仓库维护。Server 契约变更合并后运行：

```bash
corepack pnpm generate:api
```

提交生成后的 `lib/api/generated/schema.ts`。
