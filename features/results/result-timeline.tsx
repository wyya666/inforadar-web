"use client";

import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowUpRight, Check, Clock3, Inbox, Sparkles } from "lucide-react";

import { listResults, markResultRead, type RadarResult } from "./api";

export const resultsKey = ["results"] as const;

export function ResultTimeline() {
  const client = useQueryClient();
  const query = useInfiniteQuery({
    queryKey: resultsKey,
    queryFn: ({ pageParam }) => listResults({ cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.next_cursor,
  });
  const markRead = useMutation({ mutationFn: markResultRead, onSuccess: () => client.invalidateQueries({ queryKey: resultsKey }) });
  const items = query.data?.pages.flatMap((page) => page.items) ?? [];

  if (query.isPending) return <section className="empty-panel"><p>正在加载结果…</p></section>;
  if (query.isError) return <section className="empty-panel"><p>结果加载失败，请稍后重试。</p></section>;
  if (!items.length) return <section className="empty-panel"><div className="empty-radar"><Inbox /></div><h2>还没有命中结果</h2><p>雷达完成扫描后，相关性达到阈值的内容会出现在这里。</p></section>;

  return <section className="result-timeline">
    {items.map((item) => <ResultCard item={item} key={item.id} markRead={() => markRead.mutate(item.id)} />)}
    {query.hasNextPage ? <button className="button button-ghost timeline-more" disabled={query.isFetchingNextPage} onClick={() => query.fetchNextPage()} type="button">{query.isFetchingNextPage ? "加载中…" : "加载更多"}</button> : null}
  </section>;
}

function ResultCard({ item, markRead }: { item: RadarResult; markRead: () => void }) {
  return <article className={`result-card ${item.is_read ? "result-read" : "result-unread"}`}>
    <div className="result-card-score">{item.relevance_score}</div>
    <div className="result-card-main">
      <header><div><span>{item.source || "来源未提供"}</span><h2>{item.title}</h2></div>{!item.is_read ? <button aria-label="标为已读" onClick={markRead} type="button"><Check size={15} /></button> : null}</header>
      <div className="result-meta"><span><Clock3 size={13} />{item.published_at ? new Date(item.published_at).toLocaleString("zh-CN") : "发布时间未知"}</span></div>
      <div className="ai-summary"><strong><Sparkles size={14} />AI 摘要</strong><p>{item.summary}</p></div>
      <p className="relevance-reason"><strong>命中理由：</strong>{item.relevance_reason}</p>
      <a className="source-link" href={item.url} rel="noreferrer noopener" target="_blank">查看原文 <ArrowUpRight size={14} /></a>
    </div>
  </article>;
}
