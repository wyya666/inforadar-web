import { ArrowRight, Radar } from "lucide-react";
import Link from "next/link";

import { DashboardOverview } from "@/features/dashboard/overview";

export default function DashboardPage() {
  return (
    <main className="dashboard-content">
      <div className="dashboard-title"><div><span>今日概览</span><h1>你的信息雷达</h1></div><p>配置 DeepSeek Key 后，就可以创建第一个长期监控任务。</p></div>
      <DashboardOverview />
      <section className="empty-panel">
        <div className="empty-radar"><Radar size={34} /></div>
        <h2>从一个关注点开始</h2>
        <p>例如：“持续关注国内 AI Agent 产品的重要发布和融资消息”。</p>
        <Link className="button button-primary" href="/settings">先配置 DeepSeek Key <ArrowRight size={17} /></Link>
      </section>
    </main>
  );
}
