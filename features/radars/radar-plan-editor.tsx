"use client";

import { ArrowLeft, Play, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { ApiError } from "@/features/auth/api";
import { createRadar, type RadarPlan } from "./api";

type Interval = 30 | 60 | 180 | 360 | 720 | 1440;
const intervals: Array<{ value: Interval; label: string }> = [
  { value: 30, label: "每 30 分钟" }, { value: 60, label: "每 1 小时" },
  { value: 180, label: "每 3 小时" }, { value: 360, label: "每 6 小时" },
  { value: 720, label: "每 12 小时" }, { value: 1440, label: "每 24 小时" },
];

export function RadarPlanEditor({ intent, plan, onBack }: { intent: string; plan: RadarPlan; onBack: () => void }) {
  const router = useRouter();
  const [name, setName] = useState(plan.name);
  const [searchQuery, setSearchQuery] = useState(plan.search_query);
  const [criteria, setCriteria] = useState(plan.relevance_criteria);
  const [interval, setInterval] = useState<Interval>(180);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();

  async function submit(event: FormEvent) {
    event.preventDefault(); setPending(true); setError(undefined);
    try {
      await createRadar({ name: name.trim(), user_intent: intent, search_query: searchQuery.trim(), relevance_criteria: criteria.trim(), interval_minutes: interval });
      router.push("/radars"); router.refresh();
    } catch (caught) { setError(caught instanceof ApiError ? caught.message : "雷达创建失败"); }
    finally { setPending(false); }
  }

  return <form className="plan-editor" onSubmit={submit}>
    <span className="plan-ready">AI 方案已生成，可在启动前修改</span>
    <label><span>雷达名称</span><input value={name} onChange={(event) => setName(event.target.value)} maxLength={120} required /></label>
    <label><span><Search size={15} />搜索查询</span><input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} maxLength={500} required /></label>
    <label><span>相关性标准</span><textarea value={criteria} onChange={(event) => setCriteria(event.target.value)} rows={5} maxLength={2000} required /></label>
    <label><span>扫描频率</span><select value={interval} onChange={(event) => setInterval(Number(event.target.value) as Interval)}>{intervals.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
    {error ? <p className="form-error" role="alert">{error}</p> : null}
    <div className="plan-actions"><button className="button button-ghost" onClick={onBack} type="button"><ArrowLeft size={16} />重新描述</button><button className="button button-primary" disabled={pending} type="submit"><Play size={16} />{pending ? "正在启动…" : "确认并启动雷达"}</button></div>
  </form>;
}
