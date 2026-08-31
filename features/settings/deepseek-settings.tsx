"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, KeyRound, ShieldCheck, Trash2 } from "lucide-react";
import { useState, type FormEvent } from "react";

import { deleteDeepSeekCredential, getDeepSeekCredential, setDeepSeekCredential } from "./api";

const credentialKey = ["credential", "deepseek"] as const;

export function DeepSeekSettings() {
  const queryClient = useQueryClient();
  const [apiKey, setApiKey] = useState("");
  const [message, setMessage] = useState<string>();
  const credential = useQuery({ queryKey: credentialKey, queryFn: getDeepSeekCredential, retry: false });
  const save = useMutation({
    mutationFn: setDeepSeekCredential,
    onSuccess(metadata) {
      queryClient.setQueryData(credentialKey, metadata);
      setApiKey("");
      setMessage("Key 已验证并加密保存");
    },
  });
  const remove = useMutation({
    mutationFn: deleteDeepSeekCredential,
    onSuccess() {
      queryClient.setQueryData(credentialKey, null);
      setMessage("DeepSeek Key 已删除");
    },
  });

  function submit(event: FormEvent) {
    event.preventDefault();
    setMessage(undefined);
    save.mutate(apiKey);
  }

  return <section className="settings-panel credential-panel">
    <div className="settings-panel-title"><div><span>模型凭证</span><h2>DeepSeek API Key</h2></div><ShieldCheck /></div>
    <p className="settings-help">保存前会调用 DeepSeek 余额接口验证。Key 使用 AES-256-GCM 加密，之后只显示末四位。</p>
    {credential.isPending ? <p className="settings-help">正在读取配置…</p> : null}
    {credential.data ? <div className="credential-summary">
      <div className="credential-icon"><CheckCircle2 /></div>
      <div><span>当前凭证</span><strong>{credential.data.masked_key}</strong></div>
      <div><span>状态</span><strong>{credential.data.status === "valid" ? "可用" : "余额不足"}</strong></div>
      <div><span>余额</span><strong>{credential.data.total_balance ? `${credential.data.total_balance} ${credential.data.currency ?? ""}` : "—"}</strong></div>
      <button aria-label="删除 DeepSeek Key" className="icon-button" disabled={remove.isPending} onClick={() => remove.mutate()} type="button"><Trash2 size={17} /></button>
    </div> : null}
    <form className="settings-form credential-form" onSubmit={submit}>
      <label><span>DeepSeek API Key</span><input type="password" autoComplete="off" value={apiKey} onChange={(event) => setApiKey(event.target.value)} placeholder={credential.data ? "输入新 Key 以替换" : "sk-..."} required /></label>
      {save.isError ? <p className="form-error" role="alert">Key 验证失败，请确认 Key 与账户余额</p> : null}
      {message ? <p className="form-success" role="status">{message}</p> : null}
      <button className="button button-dark settings-action" disabled={save.isPending} type="submit"><KeyRound size={16} />{save.isPending ? "正在验证…" : "验证并保存"}</button>
    </form>
  </section>;
}
