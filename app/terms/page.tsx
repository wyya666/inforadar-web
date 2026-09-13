import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "服务条款 — InfoRadar",
  description: "使用 InfoRadar MVP 的规则和服务边界。",
};

const sections = [
  {
    title: "服务内容与 Beta 状态",
    paragraphs: [
      "InfoRadar 根据你设置的关注目标，调用第三方搜索和 DeepSeek 服务，对公开网页搜索结果进行筛选、评分和摘要，并通过站内时间线或邮件呈现。MVP 不抓取网页正文。",
      "本服务处于公开 Beta 前阶段，功能、支持地区和可用性可能调整。搜索调用使用你配置的第三方凭证，实际额度、计费和限制由对应服务商决定。",
    ],
  },
  {
    title: "账户与第三方凭证",
    paragraphs: [
      "你应提供真实可用的邮箱，妥善保护账户，并对账户下的操作负责。发现未经授权的使用时，应立即修改密码并撤销会话。",
      "你必须有权使用所提交的 DeepSeek、智谱或 Tavily API Key，并自行承担第三方服务产生的费用及其服务条款约束。请勿提交他人的密钥、生产核心密钥或超出本服务所需权限的凭证。",
    ],
  },
  {
    title: "合理使用",
    paragraphs: [
      "不得利用服务违法收集个人信息、侵犯隐私或知识产权、规避访问控制、发送垃圾信息、监控非法目标、攻击系统、消耗他人额度，或处理法律禁止的内容。",
      "为保护用户、平台和第三方，我们可以限制异常请求、暂停扫描、撤销会话或封禁严重违规账户，并保留必要的审计记录。",
    ],
  },
  {
    title: "AI 与外部信息的限制",
    paragraphs: [
      "我们不保证互联网信息完整、实时、准确，也不保证搜索服务商一定收录目标页面。AI 可能误判、遗漏或生成不准确摘要；相关性分数和摘要不是原文，也不构成医疗、法律、投资或其他专业建议。",
      "你应通过始终展示的原文链接核验重要信息。第三方网站的内容、可用性、安全性和合法性由对应第三方负责。",
    ],
  },
  {
    title: "变更、终止与责任边界",
    paragraphs: [
      "我们会尽力维护服务并提供合理安全措施，但维护、网络、第三方 Provider、不可抗力或 Beta 调整可能造成中断。对重大规则变化，我们会通过页面或可用的联系方式提前说明。",
      "你可以随时删除账户。服务终止后，我们会按隐私政策和法律要求处理数据。适用法律允许的范围内，双方应就争议先友好协商；最终运营主体、联系地址、适用法律和争议解决地将在公开 Beta 前补充。",
    ],
  },
];

export default function TermsPage() {
  return (
    <main className="legal-shell">
      <header className="legal-header">
        <Link className="brand" href="/">InfoRadar</Link>
        <Link className="button button-ghost" href="/">返回首页</Link>
      </header>
      <article className="legal-document">
        <span className="legal-kicker">最后更新：2026 年 9 月 1 日</span>
        <h1>服务条款</h1>
        <p className="legal-lead">
          使用 InfoRadar 即表示你同意遵守本条款。公开 Beta 前请由具备相应资质的
          法律顾问结合运营主体、部署地区和实际业务流程完成审阅。
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
