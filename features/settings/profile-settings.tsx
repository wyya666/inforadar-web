"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { KeyRound, Save, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { getCurrentUser } from "@/features/auth/api";
import { changePassword, deleteAccount, updateProfile } from "./api";

export function ProfileSettings() {
  const profile = useQuery({ queryKey: ["current-user"], queryFn: getCurrentUser });
  if (profile.isPending) return <div className="settings-panel">正在加载账户资料…</div>;
  if (profile.isError) return <div className="settings-panel settings-error">无法读取账户资料，请重新登录。</div>;
  return <ProfileForm key={profile.data.id} user={profile.data} />;
}

function ProfileForm({ user }: { user: Awaited<ReturnType<typeof getCurrentUser>> }) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [displayName, setDisplayName] = useState(user.display_name);
  const [digestEnabled, setDigestEnabled] = useState(user.digest_enabled);
  const [saved, setSaved] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [securityMessage, setSecurityMessage] = useState<string>();

  const profileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess(updated) {
      queryClient.setQueryData(["current-user"], updated);
      setSaved(true);
    },
  });

  async function submitProfile(event: FormEvent) {
    event.preventDefault();
    setSaved(false);
    profileMutation.mutate({ display_name: displayName, digest_enabled: digestEnabled });
  }

  async function submitPassword(event: FormEvent) {
    event.preventDefault();
    setSecurityMessage(undefined);
    try {
      await changePassword(currentPassword, newPassword);
      setSecurityMessage("密码已更新，请重新登录");
      setCurrentPassword(""); setNewPassword("");
    } catch { setSecurityMessage("密码更新失败，请检查当前密码"); }
  }

  async function removeAccount() {
    if (!window.confirm("确定永久删除账户及全部数据吗？此操作无法撤销。")) return;
    await deleteAccount();
    router.push("/");
    router.refresh();
  }

  return <div className="settings-stack">
    <section className="settings-panel">
      <div className="settings-panel-title"><div><span>个人资料</span><h2>账户信息</h2></div><p>{user.email}</p></div>
      <form className="settings-form" onSubmit={submitProfile}>
        <label><span>昵称</span><input value={displayName} onChange={(event) => setDisplayName(event.target.value)} /></label>
        <label className="toggle-row"><input aria-label="接收每日摘要" type="checkbox" checked={digestEnabled} onChange={(event) => setDigestEnabled(event.target.checked)} /><span><strong>接收每日摘要</strong><small>每天北京时间 09:00 汇总新的命中结果；没有新命中则不发送。</small></span></label>
        <div className="digest-rules"><span>每封最多 20 条</span><span>同一结果只汇总一次</span><span>验证与安全邮件始终开启</span></div>
        {profileMutation.isError ? <p className="form-error">资料保存失败</p> : null}
        {saved ? <p className="form-success" role="status">资料已保存</p> : null}
        <button className="button button-dark settings-action" disabled={profileMutation.isPending} type="submit"><Save size={16} />保存资料</button>
      </form>
    </section>
    <section className="settings-panel">
      <div className="settings-panel-title"><div><span>账户安全</span><h2>更改密码</h2></div><KeyRound /></div>
      <form className="settings-form settings-form-grid" onSubmit={submitPassword}>
        <label><span>当前密码</span><input type="password" autoComplete="current-password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} required /></label>
        <label><span>新密码</span><input type="password" autoComplete="new-password" minLength={12} value={newPassword} onChange={(event) => setNewPassword(event.target.value)} required /></label>
        {securityMessage ? <p className="form-success" role="status">{securityMessage}</p> : null}
        <button className="button button-dark settings-action" type="submit">更新密码</button>
      </form>
    </section>
    <section className="settings-panel danger-panel">
      <div><span>危险操作</span><h2>删除账户</h2><p>将永久删除雷达、结果、凭证和所有会话。</p></div>
      <button className="button danger-button" type="button" onClick={() => void removeAccount()}><Trash2 size={16} />删除账户</button>
    </section>
  </div>;
}
