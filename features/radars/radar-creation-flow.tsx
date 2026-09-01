"use client";

import { useQuery } from "@tanstack/react-query";
import { CircleAlert } from "lucide-react";
import { useState } from "react";

import { getUsage } from "@/features/usage/api";
import { usageKey } from "@/features/usage/usage-indicator";
import { type RadarPlan } from "./api";
import { RadarIntentForm } from "./radar-intent-form";
import { RadarPlanEditor } from "./radar-plan-editor";

export function RadarCreationFlow() {
  const [proposal, setProposal] = useState<{ intent: string; plan: RadarPlan }>();
  const usage = useQuery({ queryKey: usageKey, queryFn: getUsage });

  if (usage.data?.remaining === 0) return <section className="quota-empty"><CircleAlert size={28} /><div><h2>本月搜索额度已用完</h2><p>额度重置后可以继续创建雷达；已有结果和扫描历史仍然可以查看。</p></div></section>;

  return <div className="creation-grid">
    <section className="creation-main">
      {!proposal ? <RadarIntentForm onPlan={(intent, plan) => setProposal({ intent, plan })} /> : <RadarPlanEditor intent={proposal.intent} plan={proposal.plan} onBack={() => setProposal(undefined)} />}
    </section>
    <aside className="creation-aside"><span>创建流程</span><ol><li className={!proposal ? "active" : "done"}>描述关注点</li><li className={proposal ? "active" : ""}>确认 AI 方案</li><li>选择扫描频率</li></ol><p>AI 只生成方案，不会在你确认前开始扫描。</p></aside>
  </div>;
}
