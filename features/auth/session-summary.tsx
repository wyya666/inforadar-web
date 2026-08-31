"use client";

import { useQuery } from "@tanstack/react-query";

import { getCurrentUser } from "./api";

export function SessionSummary() {
  const profile = useQuery({ queryKey: ["current-user"], queryFn: getCurrentUser });
  if (profile.isPending) return <span className="user-chip">正在加载账户…</span>;
  if (profile.isError) return <span className="user-chip user-chip-error">会话已过期</span>;
  return <span className="user-chip">{profile.data.display_name}</span>;
}
