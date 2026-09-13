"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, KeyRound, Search, Trash2 } from "lucide-react";
import { useState, type FormEvent } from "react";

import { ApiError } from "@/features/auth/api";
import {
  deleteSearchCredential,
  getSearchSettings,
  selectSearchProvider,
  setSearchCredential,
  type SearchProvider,
  type SearchSettings as SearchSettingsValue,
} from "./api";

export const searchSettingsKey = ["search-settings"] as const;

const providers: Array<{ id: SearchProvider; name: string; hint: string; placeholder: string }> = [
  { id: "zhipu", name: "智谱搜索", hint: "默认使用 search_std", placeholder: "输入智谱 API Key" },
  { id: "tavily", name: "Tavily", hint: "使用 Basic Search", placeholder: "tvly-..." },
  { id: "baidu", name: "百度搜索", hint: "千帆 AI 搜索", placeholder: "bce-v3/ALTAK-..." },
];

function errorMessage(error: unknown) {
  if (!(error instanceof ApiError)) return "保存失败，请稍后重试";
  if (error.code === "invalid_search_key") return "Key 无效，请检查后重试";
  if (error.code === "search_quota_exhausted") return "该平台额度已耗尽，请充值或更换 Key";
  if (error.code === "search_provider_unavailable") return "搜索平台暂不可用，请稍后重试";
  if (error.code === "search_credential_required") return "请先保存一个有效的搜索 Key";
  return error.message;
}

function statusLabel(status: "valid" | "invalid" | "insufficient_balance") {
  if (status === "valid") return "可用";
  if (status === "invalid") return "无效";
  return "额度不足";
}

export function hasActiveSearchCredential(settings?: SearchSettingsValue) {
  if (!settings?.active_provider) return false;
  return settings.credentials[settings.active_provider]?.status === "valid";
}

export function SearchSettings() {
  const client = useQueryClient();
  const [keys, setKeys] = useState<Record<SearchProvider, string>>({ zhipu: "", tavily: "", baidu: "" });
  const [message, setMessage] = useState<string>();
  const settings = useQuery({ queryKey: searchSettingsKey, queryFn: getSearchSettings, retry: false });
  const updateCache = (value: SearchSettingsValue) => client.setQueryData(searchSettingsKey, value);
  const save = useMutation({
    mutationFn: ({ provider, apiKey }: { provider: SearchProvider; apiKey: string }) => setSearchCredential(provider, apiKey),
    onSuccess(value, variables) {
      updateCache(value);
      setKeys((current) => ({ ...current, [variables.provider]: "" }));
      setMessage(`${providers.find((item) => item.id === variables.provider)?.name} Key 已验证并加密保存`);
    },
  });
  const remove = useMutation({
    mutationFn: deleteSearchCredential,
    onSuccess(value) { updateCache(value); setMessage("搜索 Key 已删除"); },
  });
  const select = useMutation({
    mutationFn: selectSearchProvider,
    onSuccess(value) { updateCache(value); setMessage("当前搜索服务已切换"); },
  });

  function submit(event: FormEvent, provider: SearchProvider) {
    event.preventDefault();
    setMessage(undefined);
    save.mutate({ provider, apiKey: keys[provider] });
  }

  const mutationError = save.error ?? remove.error ?? select.error;
  return <section className="settings-panel search-settings-panel">
    <div className="settings-panel-title"><div><span>搜索服务</span><h2>自带搜索 API Key</h2></div><Search /></div>
    <p className="settings-help">智谱、Tavily 与百度的 Key 会分别加密保存。验证 Key 会执行一次真实搜索并消耗一次平台调用，扫描只使用你选择的当前平台，不会自动回退。</p>
    {settings.isPending ? <p className="settings-help">正在读取搜索配置…</p> : null}
    {settings.isError ? <p className="form-error" role="alert">搜索配置加载失败，请稍后刷新。</p> : null}
    <div className="search-provider-grid">
      {providers.map((provider) => {
        const credential = settings.data?.credentials[provider.id];
        const active = settings.data?.active_provider === provider.id;
        const busy = (save.isPending && save.variables?.provider === provider.id) || (remove.isPending && remove.variables === provider.id) || (select.isPending && select.variables === provider.id);
        return <article className={`search-provider-card ${active ? "is-active" : ""}`} key={provider.id}>
          <header><div><span>{provider.hint}</span><h3>{provider.name}</h3></div>{active ? <strong className="provider-current"><CheckCircle2 size={14} />当前平台</strong> : null}</header>
          {credential ? <div className="search-credential-meta"><div><span>凭证</span><strong>{credential.masked_key}</strong></div><div><span>状态</span><strong>{statusLabel(credential.status)}</strong></div><div><span>验证时间</span><strong>{new Date(credential.last_validated_at).toLocaleString("zh-CN")}</strong></div></div> : <p className="search-provider-empty">尚未配置 Key</p>}
          <form className="search-provider-form" onSubmit={(event) => submit(event, provider.id)}>
            <label><span>{provider.name} API Key</span><input aria-label={`${provider.name} API Key`} autoComplete="off" onChange={(event) => setKeys((current) => ({ ...current, [provider.id]: event.target.value }))} placeholder={credential ? "输入新 Key 以替换" : provider.placeholder} required type="password" value={keys[provider.id]} /></label>
            <button className="button button-dark" disabled={busy} type="submit"><KeyRound size={15} />{save.isPending && save.variables?.provider === provider.id ? "正在验证…" : credential ? "验证并替换" : "验证并保存"}</button>
          </form>
          {credential ? <div className="search-provider-actions">
            {!active ? <button className="button button-ghost" disabled={busy || credential.status !== "valid"} onClick={() => { setMessage(undefined); select.mutate(provider.id); }} type="button">设为当前平台</button> : null}
            <button aria-label={`删除 ${provider.name} Key`} className="button button-ghost search-delete" disabled={busy} onClick={() => { if (window.confirm(`确定删除 ${provider.name} Key 吗？`)) { setMessage(undefined); remove.mutate(provider.id); } }} type="button"><Trash2 size={15} />删除 Key</button>
          </div> : null}
        </article>;
      })}
    </div>
    {mutationError ? <p className="form-error" role="alert">{errorMessage(mutationError)}</p> : null}
    {message ? <p className="form-success" role="status">{message}</p> : null}
  </section>;
}
