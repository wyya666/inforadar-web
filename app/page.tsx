import { ArrowRight, BellRing, Radar, Search, Sparkles } from "lucide-react";
import Link from "next/link";

const steps = [
  {
    icon: Sparkles,
    title: "描述你的关注",
    description: "用一句自然语言告诉 AI 你真正关心的问题。",
  },
  {
    icon: Search,
    title: "持续扫描公开网页",
    description: "按你设置的频率搜索新内容，并自动去除重复信息。",
  },
  {
    icon: BellRing,
    title: "只接收重要结果",
    description: "AI 判断相关性、生成摘要，每天汇总为一封邮件。",
  },
];

export default function Home() {
  return (
    <main className="landing-shell">
      <nav className="landing-nav" aria-label="主导航">
        <Link className="brand" href="/">
          <span className="brand-mark" aria-hidden="true">
            <Radar size={20} />
          </span>
          <span>InfoRadar</span>
        </Link>
        <div className="nav-actions">
          <Link className="button button-ghost" href="/login">
            登录
          </Link>
          <Link className="button button-dark" href="/register">
            免费开始
          </Link>
        </div>
      </nav>

      <section className="hero-section">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="eyebrow-dot" />
            为长期关注而生的 AI 信息助手
          </div>
          <h1>让重要信息主动找到你</h1>
          <p>
            告诉 InfoRadar 你关心什么。它会持续扫描公开网页，理解内容、过滤噪声，
            只把真正值得关注的变化交给你。
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/register">
              开始创建雷达
              <ArrowRight size={17} />
            </Link>
            <span className="hero-note">自带 DeepSeek API Key · 搜索额度由平台提供</span>
          </div>
        </div>

        <div className="radar-preview" aria-label="雷达运行状态预览">
          <div className="preview-header">
            <div>
              <span className="preview-kicker">正在监控</span>
              <h2>AI Agent 行业进展</h2>
            </div>
            <span className="status-pill">
              <span />运行中
            </span>
          </div>
          <div className="radar-visual" aria-hidden="true">
            <span className="radar-ring radar-ring-one" />
            <span className="radar-ring radar-ring-two" />
            <span className="radar-ring radar-ring-three" />
            <span className="radar-sweep" />
            <span className="radar-blip radar-blip-one" />
            <span className="radar-blip radar-blip-two" />
          </div>
          <div className="preview-stats">
            <div><span>今日扫描</span><strong>4 次</strong></div>
            <div><span>发现候选</span><strong>28 条</strong></div>
            <div><span>值得关注</span><strong>3 条</strong></div>
          </div>
          <div className="preview-result">
            <span className="result-score">92</span>
            <div>
              <strong>新的开源 Agent 框架发布</strong>
              <p>与监控标准高度相关，包含可复现的多智能体协作方案。</p>
            </div>
          </div>
        </div>
      </section>

      <section className="workflow-section" aria-labelledby="workflow-title">
        <div className="section-heading">
          <span>简单，但不是黑盒</span>
          <h2 id="workflow-title">从一句话到长期监控</h2>
        </div>
        <div className="workflow-grid">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <article className="workflow-card" key={step.title}>
                <div className="workflow-icon"><Icon size={20} /></div>
                <span className="workflow-index">0{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <footer className="landing-footer">
        <span>© 2026 InfoRadar</span>
        <span>持续关注，减少错过。</span>
      </footer>
    </main>
  );
}

