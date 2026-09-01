import { Plus } from "lucide-react";
import Link from "next/link";

import { RadarList } from "@/features/radars/radar-list";
import { UsageIndicator } from "@/features/usage/usage-indicator";

export default function RadarsPage() {
  return <main className="dashboard-content"><div className="dashboard-title settings-heading"><div><span>监控任务</span><h1>我的雷达</h1></div><Link className="button button-dark" href="/radars/new"><Plus size={16} />创建雷达</Link></div><UsageIndicator detailed /><RadarList /></main>;
}
