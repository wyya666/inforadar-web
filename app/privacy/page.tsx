import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "隐私政策 — InfoRadar",
  description: "InfoRadar 收集、使用和保护个人信息的说明。",
};

const sections = [
  {
    title: "我们处理的信息",
    paragraphs: [
      "账户信息：邮箱、昵称、密码的安全哈希、邮箱验证状态和登录会话记录。我们不会保存可还原的明文密码。",
      "服务数据：你描述的关注目标、雷达方案、搜索查询、搜索结果、AI 判断与摘要、已读状态、额度和通知偏好。",
      "模型凭证：你主动提供的 DeepSeek API Key 会经过加密保存。我们会记录脱敏尾号、验证状态和余额状态，不会向页面返回完整密钥。",
      "安全与运行数据：请求和追踪标识、时间、状态码、任务状态、审计记录，以及防止滥用和排查故障所需的有限日志。日志不应包含密码、完整 JWT 或完整 Provider Key。",
    ],
  },
  {
    title: "我们如何使用和提供信息",
    paragraphs: [
      "我们使用上述信息来注册和验证账户、提供 JWT 会话、执行雷达搜索与 AI 分析、展示结果、发送安全邮件和每日摘要、计算额度，以及保障和改进服务。",
      "为完成你的指令，搜索查询会发送给当前搜索服务商；关注标准以及搜索结果中的标题、链接、时间和摘要会使用你的 Key 发送给 DeepSeek；邮件地址和必要模板参数会发送给腾讯云 SES。首版不主动抓取网页正文。",
      "我们不会出售个人信息，也不会把你的 DeepSeek API Key 提供给与该模型调用无关的第三方。法律要求、保护用户安全或完成你主动请求的服务时，可能按必要范围处理或提供信息。",
    ],
  },
  {
    title: "存储、安全与保留",
    paragraphs: [
      "我们采用访问控制、传输加密、AES-256-GCM 凭证加密、会话撤销、审计、备份等措施降低风险，但任何互联网服务都无法承诺绝对安全。",
      "账户存续期间会保留提供服务所需的数据。删除账户后，我们会按产品流程删除或匿名化主要账户数据；依法需要保留的安全、审计和备份数据会在必要期限内隔离保留并到期清理。",
      "公开 Beta 的实际部署地区、运营主体、数据保留期限和跨境处理安排会在开放注册前补充确认。如果相关安排发生实质变化，我们会更新本政策并按适用要求通知或取得同意。",
    ],
  },
  {
    title: "你的选择和权利",
    paragraphs: [
      "你可以在设置中查看和修改资料、替换或删除 DeepSeek Key、关闭每日摘要、修改密码、退出会话或删除账户。验证和安全邮件无法关闭。",
      "如需访问、更正、复制、删除个人信息，撤回同意，注销账户，或对处理规则提出问题，可通过公开 Beta 前公布的运营方联系渠道提出。我们会在核验身份后依法处理。",
      "本服务不面向未满 14 周岁的未成年人。若我们发现未经监护人同意处理了相关信息，会尽快停止处理并删除。",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main className="legal-shell">
      <header className="legal-header">
        <Link className="brand" href="/">InfoRadar</Link>
        <Link className="button button-ghost" href="/">返回首页</Link>
      </header>
      <article className="legal-document">
        <span className="legal-kicker">最后更新：2026 年 9 月 1 日</span>
        <h1>隐私政策</h1>
        <p className="legal-lead">
          本政策说明 InfoRadar MVP 如何处理你的个人信息。它不是公开 Beta
          最终法律文本；运营主体、联系地址及实际部署地区必须在开放注册前补充。
        </p>
        {sections.map((section) => (
          <section key={section.title}>
            <h2>{section.title}</h2>
            {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </section>
        ))}
      </article>
    </main>
  );
}
