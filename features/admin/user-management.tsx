"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";

import { adjustAdminUserCredits, listAdminUsers, setAdminUserStatus, type AdminUser } from "./api";

const adminUsersKey = ["admin", "users"] as const;

export function UserManagement() {
  const query = useQuery({ queryKey: adminUsersKey, queryFn: listAdminUsers });
  if (query.isPending) return <section className="settings-panel">正在加载用户…</section>;
  if (query.isError) return <section className="settings-panel settings-error">无法读取用户，请确认管理员权限。</section>;
  return <section className="settings-panel"><div className="settings-panel-title"><div><span>用户管理</span><h2>账户与额度</h2></div><p>{query.data.length} 个账户</p></div><div className="admin-user-list">{query.data.map((value) => <AdminUserRow key={value.id} value={value} />)}</div></section>;
}

function AdminUserRow({ value }: { value: AdminUser }) {
  const client = useQueryClient();
  const [delta, setDelta] = useState(10);
  const status = useMutation({ mutationFn: () => setAdminUserStatus(value.id, value.status === "active" ? "suspended" : "active"), onSuccess: () => client.invalidateQueries({ queryKey: adminUsersKey }) });
  const credits = useMutation({ mutationFn: () => adjustAdminUserCredits(value.id, delta) });
  function submit(event: FormEvent) { event.preventDefault(); credits.mutate(); }
  return <article className="admin-user-row"><div><strong>{value.display_name}</strong><span>{value.email}</span></div><span className={`radar-state state-${value.status === "active" ? "active" : "paused"}`}>{value.status === "active" ? "正常" : "已封禁"}</span><button className="button button-ghost" disabled={status.isPending || value.role === "admin"} onClick={() => status.mutate()} type="button">{value.status === "active" ? "封禁" : "解封"}</button><form onSubmit={submit}><input aria-label={`${value.email} 额度调整`} onChange={(event) => setDelta(Number(event.target.value))} type="number" value={delta} /><button className="button button-dark" disabled={credits.isPending} type="submit">调整额度</button></form>{credits.data !== undefined ? <small>新余额：{credits.data}</small> : null}</article>;
}
