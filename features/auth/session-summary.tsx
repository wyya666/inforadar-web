"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import { getCurrentUser, logout } from "./api";

export function SessionSummary() {
	const router = useRouter();
	const client = useQueryClient();
  const profile = useQuery({ queryKey: ["current-user"], queryFn: getCurrentUser });
	const signOut = useMutation({
		mutationFn: logout,
		onSuccess() {
			client.clear();
			router.push("/");
			router.refresh();
		},
	});
  if (profile.isPending) return <span className="user-chip">正在加载账户…</span>;
  if (profile.isError) return <span className="user-chip user-chip-error">会话已过期</span>;
  return <div className="session-summary"><span className="user-chip">{profile.data.display_name}</span><button aria-label="退出登录" disabled={signOut.isPending} onClick={() => signOut.mutate()} type="button"><LogOut size={14} />退出</button>{signOut.isError ? <small>退出失败</small> : null}</div>;
}
