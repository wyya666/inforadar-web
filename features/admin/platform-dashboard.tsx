"use client";

import { useQuery } from "@tanstack/react-query";
import { KeyRound, ShieldCheck } from "lucide-react";

import { getPlatformStatus, listAuditRecords } from "./api";

export function PlatformDashboard() {
  const platform = useQuery({ queryKey: ["admin", "platform"], queryFn: getPlatformStatus });
  const audit = useQuery({ queryKey: ["admin", "audit"], queryFn: listAuditRecords });
  if (platform.isPending) return <section className="settings-panel">正在加载平台状态…</section>;
  if (platform.isError) return <section className="settings-panel settings-error">平台状态加载失败</section>;
  const value = platform.data;
  return <section className="settings-panel"><div className="settings-panel-title"><div><span>平台状态</span><h2>凭证与审计</h2></div><KeyRound /></div><div className="platform-grid"><article><span><KeyRound size={14} />DeepSeek Key</span><strong>{value.credential_status.valid ?? 0} 个有效</strong><small>无效 {value.credential_status.invalid ?? 0} · 余额不足 {value.credential_status.insufficient_balance ?? 0}</small></article></div><div className="audit-list"><div className="settings-panel-title"><div><span>审计</span><h2>最近管理员操作</h2></div><ShieldCheck /></div>{audit.data?.map((record) => <article key={record.id}><strong>{record.action}</strong><span>{record.target_type} · {record.target_id}</span><time>{new Date(record.created_at).toLocaleString("zh-CN")}</time></article>)}{audit.data?.length === 0 ? <p className="admin-empty">暂无审计记录。</p> : null}</div></section>;
}
