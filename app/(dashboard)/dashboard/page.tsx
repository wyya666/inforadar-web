import { ArrowRight, CircleDot, Radar, Search } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="dashboard-content">
      <div className="dashboard-title"><div><span>今日概览</span><h1>你的信息雷达</h1></div><p>配置 DeepSeek Key 后，就可以创建第一个长期监控任务。</p></div>
      <section className="overview-grid">
        <article><Radar /><span>活跃雷达</span><strong>0 / 3</strong></article>
        <article><CircleDot /><span>未读结果</span><strong>0</strong></article>
        <article><Search /><span>本月搜索额度</span><strong>100</strong></article>
      </section>
      <section className="empty-panel">
        <div className="empty-radar"><Radar size={34} /></div>
        <h2>从一个关注点开始</h2>
        <p>例如：“持续关注国内 AI Agent 产品的重要发布和融资消息”。</p>
        <Link className="button button-primary" href="/settings">先配置 DeepSeek Key <ArrowRight size={17} /></Link>
      </section>
    </main>
  );
}
