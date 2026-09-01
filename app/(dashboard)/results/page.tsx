import { ResultTimeline } from "@/features/results/result-timeline";

export default function ResultsPage() {
  return <main className="dashboard-content"><div className="dashboard-title settings-heading"><div><span>监控时间线</span><h1>最新结果</h1></div><p>摘要和命中理由由 AI 根据搜索服务返回的信息生成；原文链接始终保留。</p></div><ResultTimeline /></main>;
}
