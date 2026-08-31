"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Clock3, Pause, Play, Plus, Radar as RadarIcon, RefreshCw, Search, Trash2 } from "lucide-react";
import Link from "next/link";

import { deleteRadar, listRadars, runRadarAction, type Radar } from "./api";

const radarKey = ["radars"] as const;

function intervalLabel(minutes: number) {
  if (minutes < 60) return `${minutes} 分钟`;
  return `${minutes / 60} 小时`;
}

export function RadarList() {
  const client = useQueryClient();
  const query = useQuery({ queryKey: radarKey, queryFn: listRadars });
  const action = useMutation({
    mutationFn: ({ id, operation }: { id: string; operation: "pause" | "resume" | "scan" }) => runRadarAction(id, operation),
    onSuccess(updated) { client.setQueryData<Radar[]>(radarKey, (current = []) => current.map((item) => item.id === updated.id ? updated : item)); },
  });
  const remove = useMutation({
    mutationFn: deleteRadar,
    onSuccess(_, id) { client.setQueryData<Radar[]>(radarKey, (current = []) => current.filter((item) => item.id !== id)); },
  });

  if (query.isPending) return <div className="empty-panel"><p>正在加载雷达…</p></div>;
  if (query.isError) return <div className="empty-panel"><p>雷达列表加载失败，请稍后重试。</p></div>;
  if (!query.data.length) return <section className="empty-panel"><div className="empty-radar"><RadarIcon /></div><h2>还没有雷达</h2><p>用一句话描述关注点，AI 会帮你完成搜索方案。</p><Link className="button button-primary" href="/radars/new"><Plus size={17} />创建第一个雷达</Link></section>;

  return <div className="radar-list">
    {query.data.map((item) => <article className="radar-card" key={item.id}>
      <div className="radar-card-head"><div><span className={`radar-state state-${item.status}`}>{item.status === "active" ? "运行中" : "已暂停"}</span><h2>{item.name}</h2></div><div className="radar-actions">
        <button aria-label={item.status === "active" ? "暂停雷达" : "恢复雷达"} disabled={action.isPending} onClick={() => action.mutate({ id: item.id, operation: item.status === "active" ? "pause" : "resume" })} type="button">{item.status === "active" ? <Pause size={16} /> : <Play size={16} />}</button>
        <button aria-label="立即扫描" disabled={action.isPending || item.status !== "active"} onClick={() => action.mutate({ id: item.id, operation: "scan" })} type="button"><RefreshCw size={16} /></button>
        <button aria-label="删除雷达" disabled={remove.isPending} onClick={() => { if (window.confirm("确定删除这个雷达和历史结果吗？")) remove.mutate(item.id); }} type="button"><Trash2 size={16} /></button>
      </div></div>
      <p className="radar-intent">{item.user_intent}</p>
      <div className="radar-query"><Search size={15} /><span>{item.search_query}</span></div>
      <footer><span><Clock3 size={14} />每 {intervalLabel(item.interval_minutes)}</span><span>相关性 ≥ {item.relevance_threshold}</span><span>下次：{item.status === "active" ? new Date(item.next_scan_at).toLocaleString("zh-CN") : "—"}</span></footer>
    </article>)}
    {action.isError ? <p className="form-error">操作失败，手动扫描可能仍在冷却期。</p> : null}
  </div>;
}
