# Frontend release and rollback

## Preconditions

- Server 的 OpenAPI 契约已先合并，生成的 TypeScript Client 没有未提交变化。
- lint、typecheck、Vitest、production build 和 Playwright 全部通过。
- 隐私政策和服务条款中的运营主体、联系方式、部署地区、保留期限与争议条款
  已由运营和法律负责人补齐并审阅。
- Server 与 Web 使用相同阶段版本号，并在发布记录中保存两个 commit SHA。
- 生产环境只引用不可变版本标签，禁止使用 `latest`。

## Create a release

1. 从受保护的 `main` 创建带注释标签并推送：

   ```sh
   git tag -a v0.9.0-rc.1 -m "InfoRadar Web v0.9.0-rc.1"
   git push origin v0.9.0-rc.1
   ```

2. GitHub Actions 构建 Next standalone 镜像并发布到
   `ghcr.io/OWNER/inforadar-web:v0.9.0-rc.1`，同时发布 commit SHA 标签；工作流
   不生成 `latest`。
3. 确认镜像构建来源、SBOM、目标架构和 digest，并把 digest 写入发布记录。
4. 在 Server 仓库的生产主机 `deploy/.env` 中同时更新 `SERVER_VERSION` 与
   `WEB_VERSION`，按 Server 的 `deploy/RUNBOOK.md` 拉取和发布配对镜像。
5. 验证首页、注册、登录、JWT 刷新、仪表盘、雷达创建、结果原文链接、设置、
   管理员权限和移动端布局。观察 Caddy/Web 5xx、浏览器错误和 API 延迟至少
   15 分钟。

Web 默认请求当前域名下的 `/api/v1`，由 Caddy 转发到 Server。因此同一镜像
可以部署到不同域名，不需要把生产域名烘焙进浏览器 bundle。

## Rollback

优先回滚 Server 与 Web 的已验证配对版本，避免页面调用不兼容的契约：

1. 在生产 `deploy/.env` 中恢复上一组 `SERVER_VERSION` 与 `WEB_VERSION`。
2. 按 Server Runbook 拉取并重建 `api`、`worker`、`web` 服务。
3. 重新执行登录、概览、结果和设置 smoke test，并观察错误率。

只回滚 Web 的前提是 Server 契约保持向后兼容。不要删除已发布镜像或移动旧
标签；若必须修复同一版本，创建新的 patch/RC 标签。数据库恢复属于 Server
事故流程，不应因单纯前端故障执行。

## Release failure

- 镜像构建失败：不移动生产版本，修复后创建新提交再重新打标签。
- Web 健康检查失败：保留 Caddy 和数据服务，立即恢复上一组镜像版本。
- 页面可用但 API 全部失败：检查同源 `/api/v1` 路由、Caddy 和 Server ready
  状态，不要在前端临时暴露跨域 Provider 地址。
- 发现法律文本仍含占位说明：停止公开注册，补齐并审阅后再发布。
