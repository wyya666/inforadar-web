"use client";

import { useState } from "react";

import { type RadarPlan } from "./api";
import { RadarIntentForm } from "./radar-intent-form";
import { RadarPlanEditor } from "./radar-plan-editor";

export function RadarCreationFlow() {
  const [proposal, setProposal] = useState<{ intent: string; plan: RadarPlan }>();

  return <div className="creation-grid">
    <section className="creation-main">
      {!proposal ? <RadarIntentForm onPlan={(intent, plan) => setProposal({ intent, plan })} /> : <RadarPlanEditor intent={proposal.intent} plan={proposal.plan} onBack={() => setProposal(undefined)} />}
    </section>
    <aside className="creation-aside"><span>创建流程</span><ol><li className={!proposal ? "active" : "done"}>描述关注点</li><li className={proposal ? "active" : ""}>确认 AI 方案</li><li>选择扫描频率</li></ol><p>AI 只生成方案，不会在你确认前开始扫描。</p></aside>
  </div>;
}
