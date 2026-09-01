"use client";

import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, ChevronDown, ChevronUp, CircleAlert, LoaderCircle } from "lucide-react";
import { useState } from "react";

import { listScanRuns } from "./api";

const statusLabel = { queued: "排队中", running: "扫描中", succeeded: "成功", failed: "失败" } as const;

export function ScanHistory({ radarID }: { radarID: string }) {
  const [open, setOpen] = useState(false);
  const query = useQuery({ queryKey: ["scan-runs", radarID], queryFn: () => listScanRuns(radarID), enabled: open, refetchInterval: open ? 15_000 : false });
  return <section className="scan-history">
    <button aria-expanded={open} aria-label={open ? "收起扫描历史" : "查看扫描历史"} className="scan-history-toggle" onClick={() => setOpen((value) => !value)} type="button">
      最近扫描 {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
    </button>
    {open ? <div className="scan-history-body">
      {query.isPending ? <p><LoaderCircle className="spin" size={15} />正在加载…</p> : null}
      {query.isError ? <p className="settings-error">扫描历史加载失败</p> : null}
      {query.data?.length === 0 ? <p>尚无扫描记录，创建后首次扫描会自动执行。</p> : null}
      {query.data?.map((run) => <article className={`scan-run scan-run-${run.status}`} key={run.id}>
        {run.status === "failed" ? <CircleAlert size={16} /> : <CheckCircle2 size={16} />}
        <div><strong>{statusLabel[run.status]}</strong><span>{new Date(run.created_at).toLocaleString("zh-CN")}</span></div>
        <div><strong>命中 {run.matched_count} / {run.search_count}</strong><span>第 {run.attempt} 次尝试</span></div>
        {run.error_message ? <small>{run.error_message}</small> : null}
      </article>)}
    </div> : null}
  </section>;
}
