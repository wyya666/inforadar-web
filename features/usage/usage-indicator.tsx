"use client";

import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";

import { getUsage } from "./api";

export const usageKey = ["usage"] as const;

export function UsageIndicator({ detailed = false }: { detailed?: boolean }) {
  const query = useQuery({ queryKey: usageKey, queryFn: getUsage });
  if (query.isPending) return <div className="usage-indicator usage-loading">额度加载中…</div>;
  if (query.isError) return <div className="usage-indicator usage-error">额度暂时不可用</div>;
  const usage = query.data;
  const percentage = Math.max(0, Math.min(100, usage.remaining / usage.monthly_limit * 100));
  return <section className={`usage-indicator ${usage.remaining === 0 ? "usage-exhausted" : ""}`}>
    <div className="usage-indicator-head"><span><Search size={14} />本月搜索额度</span><strong>{usage.remaining} / {usage.monthly_limit}</strong></div>
    <div aria-label="剩余搜索额度" aria-valuemax={usage.monthly_limit} aria-valuemin={0} aria-valuenow={usage.remaining} className="usage-progress" role="progressbar"><span style={{ width: `${percentage}%` }} /></div>
    {detailed ? <p>{usage.remaining > 0 ? `每次成功 Web Search 扣除 1 Credit，${new Date(usage.reset_at).toLocaleDateString("zh-CN")} 重置。` : "本月额度已用完，已有结果仍可阅读。"}</p> : null}
  </section>;
}
