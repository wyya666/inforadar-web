import { Gauge } from "lucide-react";

export function estimateMonthlyScans(intervalMinutes: number) {
  const scansPerDay = Math.round((24 * 60 / intervalMinutes) * 10) / 10;
  const scheduledPerMonth = Math.ceil(scansPerDay * 30);
  return { scansPerDay, scheduledPerMonth };
}

export function UsageEstimate({ intervalMinutes }: { intervalMinutes: number }) {
  const estimate = estimateMonthlyScans(intervalMinutes);
  return <div className="usage-estimate"><Gauge size={18} /><div><strong>预计每天扫描 {estimate.scansPerDay} 次</strong><p>30 天约执行 {estimate.scheduledPerMonth} 次搜索，实际可用量和费用由你选择的搜索平台决定。</p></div></div>;
}
