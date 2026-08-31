"use client";

import { Check, Search } from "lucide-react";
import { useState } from "react";

import { type RadarPlan } from "./api";
import { RadarIntentForm } from "./radar-intent-form";

export function RadarCreationFlow() {
  const [proposal, setProposal] = useState<{ intent: string; plan: RadarPlan }>();

  return <div className="creation-grid">
    <section className="creation-main">
      {!proposal ? <RadarIntentForm onPlan={(intent, plan) => setProposal({ intent, plan })} /> : <div className="plan-preview">
        <span className="plan-ready"><Check size={15} />AI 方案已生成</span>
        <h2>{proposal.plan.name}</h2>
        <div><span><Search size={15} />搜索查询</span><p>{proposal.plan.search_query}</p></div>
        <div><span>相关性标准</span><p>{proposal.plan.relevance_criteria}</p></div>
        <button className="button button-ghost" type="button" onClick={() => setProposal(undefined)}>重新描述</button>
      </div>}
    </section>
    <aside className="creation-aside"><span>创建流程</span><ol><li className={!proposal ? "active" : "done"}>描述关注点</li><li className={proposal ? "active" : ""}>确认 AI 方案</li><li>选择扫描频率</li></ol><p>AI 只生成方案，不会在你确认前开始扫描。</p></aside>
  </div>;
}
