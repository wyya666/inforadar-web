"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Clock3, Pause, Pencil, Play, Plus, Radar as RadarIcon, RefreshCw, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState, type FormEvent } from "react";

import { getUsage } from "@/features/usage/api";
import { usageKey } from "@/features/usage/usage-indicator";
import { deleteRadar, listRadars, runRadarAction, updateRadar, type Radar, type UpdateRadarInput } from "./api";
import { ScanHistory } from "./scan-history";

const radarKey = ["radars"] as const;

function intervalLabel(minutes: number) {
  if (minutes < 60) return `${minutes} 分钟`;
  return `${minutes / 60} 小时`;
}

export function RadarList() {
  const client = useQueryClient();
	const [editingID, setEditingID] = useState<string>();
  const query = useQuery({ queryKey: radarKey, queryFn: listRadars });
  const usage = useQuery({ queryKey: usageKey, queryFn: getUsage });
  const action = useMutation({
    mutationFn: ({ id, operation }: { id: string; operation: "pause" | "resume" | "scan" }) => runRadarAction(id, operation),
    onSuccess(updated) { client.setQueryData<Radar[]>(radarKey, (current = []) => current.map((item) => item.id === updated.id ? updated : item)); },
  });
  const remove = useMutation({
    mutationFn: deleteRadar,
    onSuccess(_, id) { client.setQueryData<Radar[]>(radarKey, (current = []) => current.filter((item) => item.id !== id)); },
  });
	const edit = useMutation({
		mutationFn: ({ id, input }: { id: string; input: UpdateRadarInput }) => updateRadar(id, input),
		onSuccess(updated) {
			client.setQueryData<Radar[]>(radarKey, (current = []) => current.map((item) => item.id === updated.id ? updated : item));
			setEditingID(undefined);
		},
	});

  if (query.isPending) return <div className="empty-panel"><p>正在加载雷达…</p></div>;
  if (query.isError) return <div className="empty-panel"><p>雷达列表加载失败，请稍后重试。</p></div>;
  if (!query.data.length) return <section className="empty-panel"><div className="empty-radar"><RadarIcon /></div><h2>还没有雷达</h2><p>用一句话描述关注点，AI 会帮你完成搜索方案。</p><Link className="button button-primary" href="/radars/new"><Plus size={17} />创建第一个雷达</Link></section>;

  return <div className="radar-list">
    {query.data.map((item) => <article className="radar-card" key={item.id}>
      <div className="radar-card-head"><div><span className={`radar-state state-${item.status}`}>{item.status === "active" ? "运行中" : "已暂停"}</span><h2>{item.name}</h2></div><div className="radar-actions">
		<button aria-label="编辑雷达" disabled={edit.isPending} onClick={() => setEditingID(item.id)} type="button"><Pencil size={16} /></button>
        <button aria-label={item.status === "active" ? "暂停雷达" : "恢复雷达"} disabled={action.isPending} onClick={() => action.mutate({ id: item.id, operation: item.status === "active" ? "pause" : "resume" })} type="button">{item.status === "active" ? <Pause size={16} /> : <Play size={16} />}</button>
        <button aria-label="立即扫描" disabled={action.isPending || item.status !== "active" || usage.data?.remaining === 0} onClick={() => action.mutate({ id: item.id, operation: "scan" })} title={usage.data?.remaining === 0 ? "本月额度已用完" : undefined} type="button"><RefreshCw size={16} /></button>
        <button aria-label="删除雷达" disabled={remove.isPending} onClick={() => { if (window.confirm("确定删除这个雷达和历史结果吗？")) remove.mutate(item.id); }} type="button"><Trash2 size={16} /></button>
      </div></div>
		{editingID === item.id ? <RadarEditForm item={item} pending={edit.isPending} onCancel={() => setEditingID(undefined)} onSave={(input) => edit.mutate({ id: item.id, input })} /> : <>
			<p className="radar-intent">{item.user_intent}</p>
			<div className="radar-query"><Search size={15} /><span>{item.search_query}</span></div>
			<footer><span><Clock3 size={14} />每 {intervalLabel(item.interval_minutes)}</span><span>相关性 ≥ {item.relevance_threshold}</span><span>下次：{item.status === "active" ? new Date(item.next_scan_at).toLocaleString("zh-CN") : "—"}</span></footer>
		</>}
      <ScanHistory radarID={item.id} />
    </article>)}
    {action.isError ? <p className="form-error">操作失败，手动扫描可能仍在冷却期。</p> : null}
    {usage.data?.remaining === 0 ? <p className="form-error">本月搜索额度已用完，自动和手动扫描已暂停。</p> : null}
  </div>;
}

function RadarEditForm({ item, pending, onCancel, onSave }: { item: Radar; pending: boolean; onCancel: () => void; onSave: (input: UpdateRadarInput) => void }) {
	const [name, setName] = useState(item.name);
	const [query, setQuery] = useState(item.search_query);
	const [criteria, setCriteria] = useState(item.relevance_criteria);
	const [interval, setInterval] = useState(String(item.interval_minutes));
	const [threshold, setThreshold] = useState(String(item.relevance_threshold));
	function submit(event: FormEvent) {
		event.preventDefault();
		onSave({ name, search_query: query, relevance_criteria: criteria, interval_minutes: Number(interval) as UpdateRadarInput["interval_minutes"], relevance_threshold: Number(threshold) });
	}
	return <form className="radar-edit-form" onSubmit={submit}>
		<label><span>雷达名称</span><input maxLength={120} required value={name} onChange={(event) => setName(event.target.value)} /></label>
		<label><span>搜索查询</span><input maxLength={500} required value={query} onChange={(event) => setQuery(event.target.value)} /></label>
		<label className="radar-edit-wide"><span>相关性标准</span><textarea maxLength={2000} required rows={3} value={criteria} onChange={(event) => setCriteria(event.target.value)} /></label>
		<label><span>扫描频率</span><select value={interval} onChange={(event) => setInterval(event.target.value)}>{[30, 60, 180, 360, 720, 1440].map((minutes) => <option key={minutes} value={minutes}>{intervalLabel(minutes)}</option>)}</select></label>
		<label><span>相关性阈值</span><input max={100} min={0} required type="number" value={threshold} onChange={(event) => setThreshold(event.target.value)} /></label>
		<div className="radar-edit-actions"><button className="button button-ghost" onClick={onCancel} type="button">取消</button><button className="button button-dark" disabled={pending} type="submit">保存雷达</button></div>
	</form>;
}
