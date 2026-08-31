"use client";

import { Sparkles } from "lucide-react";
import { useState, type FormEvent } from "react";

import { ApiError } from "@/features/auth/api";
import { generateRadarPlan, type RadarPlan } from "./api";

export function RadarIntentForm({ onPlan }: { onPlan: (intent: string, plan: RadarPlan) => void }) {
  const [intent, setIntent] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (intent.trim().length < 5) { setError("请更具体地描述关注内容"); return; }
    setPending(true); setError(undefined);
    try { onPlan(intent.trim(), await generateRadarPlan(intent.trim())); }
    catch (caught) { setError(caught instanceof ApiError ? caught.message : "方案生成失败，请稍后重试"); }
    finally { setPending(false); }
  }

  return <form className="intent-form" onSubmit={submit}>
    <label htmlFor="radar-intent">你想长期关注什么？</label>
    <textarea id="radar-intent" value={intent} onChange={(event) => setIntent(event.target.value)} placeholder="例如：持续关注国内 AI Agent 产品的重要发布、融资和开源项目更新" rows={6} />
    <div className="intent-examples"><span>可以包含：</span><button type="button" onClick={() => setIntent("关注低空经济政策的重大变化和商业化进展")}>行业政策</button><button type="button" onClick={() => setIntent("关注 AI Agent 新产品、融资和重要开源项目")}>AI Agent</button></div>
    {error ? <p className="form-error" role="alert">{error}</p> : null}
    <button className="button button-primary intent-submit" disabled={pending} type="submit"><Sparkles size={17} />{pending ? "AI 正在规划…" : "生成雷达方案"}</button>
  </form>;
}
