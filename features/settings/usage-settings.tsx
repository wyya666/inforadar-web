import { BarChart3 } from "lucide-react";

import { UsageIndicator } from "@/features/usage/usage-indicator";

export function UsageSettings() {
  return <section className="settings-panel"><div className="settings-panel-title"><div><span>使用量</span><h2>本月搜索额度</h2></div><BarChart3 /></div><UsageIndicator detailed /></section>;
}
