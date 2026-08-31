import { RadarCreationFlow } from "@/features/radars/radar-creation-flow";

export default function NewRadarPage() {
  return <main className="dashboard-content"><div className="dashboard-title settings-heading"><div><span>新建雷达</span><h1>描述你的关注点</h1></div><p>AI 会把自然语言转换为一个搜索查询和一套可检查的相关性标准。</p></div><RadarCreationFlow /></main>;
}
