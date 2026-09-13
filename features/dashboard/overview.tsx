"use client";

import { useQuery } from "@tanstack/react-query";
import { CircleDot, Radar } from "lucide-react";
import Link from "next/link";

import { listRadars } from "@/features/radars/api";
import { getResultSummary } from "@/features/results/api";

export function DashboardOverview() {
  const radars = useQuery({ queryKey: ["radars"], queryFn: listRadars });
  const unread = useQuery({ queryKey: ["result-summary"], queryFn: getResultSummary });
  const active = radars.data?.filter((item) => item.status === "active").length;
  return <>
    <section className="overview-grid">
      <Link href="/radars"><Radar /><span>活跃雷达</span><strong>{active ?? "—"} / 3</strong></Link>
      <Link href="/results"><CircleDot /><span>未读结果</span><strong>{unread.data ?? "—"}</strong></Link>
    </section>
    {radars.data?.length ? <section className="dashboard-next"><div><span>最近雷达</span><h2>{radars.data[0].name}</h2><p>{radars.data[0].status === "active" ? `下次扫描：${new Date(radars.data[0].next_scan_at).toLocaleString("zh-CN")}` : "雷达当前已暂停"}</p></div><Link className="button button-dark" href="/results">查看最新结果</Link></section> : null}
  </>;
}
