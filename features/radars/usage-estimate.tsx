import { Gauge } from "lucide-react";

export function estimateMonthlyScans(intervalMinutes: number, availableCredits = 100) {
  const scansPerDay = Math.round((24 * 60 / intervalMinutes) * 10) / 10;
  const scheduledPerMonth = Math.ceil(scansPerDay * 30);
  return { scansPerDay, scheduledPerMonth, usableCredits: Math.min(scheduledPerMonth, availableCredits) };
}

export function UsageEstimate({ intervalMinutes }: { intervalMinutes: number }) {
  const estimate = estimateMonthlyScans(intervalMinutes);
  return <div className="usage-estimate"><Gauge size={18} /><div><strong>预计每天扫描 {estimate.scansPerDay} 次</strong><p>30 天约计划 {estimate.scheduledPerMonth} 次；当前免费额度最多支持 {estimate.usableCredits} 次成功搜索。失败搜索不扣额度。</p></div></div>;
}
