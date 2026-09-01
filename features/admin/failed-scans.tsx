"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RotateCcw } from "lucide-react";

import { listFailedScans, retryFailedScan } from "./api";

const failedScansKey = ["admin", "failed-scans"] as const;

export function FailedScans() {
  const client = useQueryClient();
  const query = useQuery({ queryKey: failedScansKey, queryFn: listFailedScans });
  const retry = useMutation({ mutationFn: retryFailedScan, onSuccess: () => client.invalidateQueries({ queryKey: failedScansKey }) });
  return <section className="settings-panel"><div className="settings-panel-title"><div><span>扫描运维</span><h2>失败任务</h2></div><p>重试会创建新的幂等任务</p></div>{query.isPending ? <p>正在加载…</p> : null}{query.isError ? <p className="settings-error">失败任务加载失败</p> : null}{query.data?.length === 0 ? <p className="admin-empty">当前没有失败任务。</p> : null}<div className="failed-run-list">{query.data?.map((run) => <article key={run.id}><div><strong>{run.error_code || "unknown_failure"}</strong><span>{run.error_message || "未记录错误详情"}</span></div><div><span>雷达 {run.radar_id}</span><span>尝试 {run.attempt} 次</span></div><button aria-label="重试" className="button button-ghost" disabled={retry.isPending} onClick={() => retry.mutate(run.id)} type="button"><RotateCcw size={14} />重试</button></article>)}</div></section>;
}
