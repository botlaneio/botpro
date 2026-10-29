"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Search, X } from "lucide-react";
import { IridescentFoil } from "@/components/lab/dqnamo/IridescentFoil";
import type { Post } from "@/lib/insights";
import { ArticleArt } from "./article-art";
import { ArticleShare } from "./article-share";

export interface PostSummary {
  slug: string;
  title: string;
  dek: string;
  topic: string;
  date: string;
  minutes: number;
  cover: Post["cover"];
}

const FILTER_EVENT = "insights-filter-change";
function subscribe(callback: () => void) {
  window.addEventListener("popstate", callback);
  window.addEventListener(FILTER_EVENT, callback);
  return () => {
    window.removeEventListener("popstate", callback);
    window.removeEventListener(FILTER_EVENT, callback);
  };
}
const snapshot = () => window.location.search;
const serverSnapshot = () => "";

function ArticleCard({
  post,
  featured,
}: {
  post: PostSummary;
  featured: boolean;
}) {
  return (
    <article className={`insight-card ${featured ? "insight-feature" : ""}`}>
      <div className="insight-card-top">
        <span className="insight-topic">
          {featured && <i aria-hidden="true" />}
          {featured ? "THE STUDIO PICK" : post.topic}
        </span>
        <ArrowUpRight size={17} aria-hidden="true" />
      </div>
      <Link href={`/blog/${post.slug}`} className="insight-main-link">
        <div className="insight-card-copy">
          <h2>{post.title}</h2>
          <p>{post.dek}</p>
        </div>
        <div className="insight-art-slot">
          {featured ? (
            <IridescentFoil className="insight-feature-foil">
              <ArticleArt slug={post.slug} />
            </IridescentFoil>
          ) : (
            <ArticleArt slug={post.slug} />
          )}
        </div>
      </Link>
      <div className="insight-card-meta">
        <span>
          {post.date}
          <span aria-hidden="true"> · </span>
          {post.minutes} min read
        </span>
        <ArticleShare slug={post.slug} title={post.title} />
      </div>
      <div className="insight-card-foot">
        <Link href={`/blog/${post.slug}`} aria-label={`Read ${post.title}`}>
          Read the note <ArrowRight size={15} aria-hidden="true" />
        </Link>
        <span>{featured ? post.topic : "BOTLANE / INSIGHTS"}</span>
      </div>
    </article>
  );
}

export function InsightsIndex({ posts }: { posts: PostSummary[] }) {
  const locationSearch = useSyncExternalStore(
    subscribe,
    snapshot,
    serverSnapshot,
  );
  const params = new URLSearchParams(locationSearch);
  const topic = params.get("topic") ?? "";
  const query = params.get("q") ?? "";
  const search = query.trim().toLowerCase();
  const topics = [...new Set(posts.map((p) => p.topic))];
  const shown = posts.filter(
    (p) =>
      (!topic || p.topic === topic) &&
      (!search ||
        `${p.title} ${p.dek} ${p.topic}`.toLowerCase().includes(search)),
  );
  function update(key: string, value: string, push = false) {
    const url = new URL(window.location.href);
    if (value) url.searchParams.set(key, value);
    else url.searchParams.delete(key);
    window.history[push ? "pushState" : "replaceState"](null, "", url);
    window.dispatchEvent(new Event(FILTER_EVENT));
  }
  function reset() {
    const url = new URL(window.location.href);
    url.searchParams.delete("q");
    url.searchParams.delete("topic");
    window.history.pushState(null, "", url);
    window.dispatchEvent(new Event(FILTER_EVENT));
  }
  return (
    <div className="insights-publication">
      <div className="insight-toolbar">
        <div className="insight-tabs" role="group" aria-label="Filter by topic">
          {["", ...topics].map((t) => (
            <button
              type="button"
              aria-pressed={topic === t}
              key={t}
              onClick={() => update("topic", t, true)}
            >
              {t || "All notes"}
              <span>
                {t ? posts.filter((p) => p.topic === t).length : posts.length}
              </span>
            </button>
          ))}
        </div>
        <div className="insight-search">
          <Search size={16} aria-hidden="true" />
          <input
            type="search"
            aria-label="Search articles"
            placeholder="Find something useful…"
            value={query}
            onChange={(e) => update("q", e.target.value)}
          />
          {query && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => update("q", "")}
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>
      <div className="insight-results">
        <span role="status" aria-live="polite">
          {shown.length} {shown.length === 1 ? "note" : "notes"}
          {topic ? ` / ${topic}` : " / Ideas put into practice"}
        </span>
        <span className="insight-edition">THE BOTLANE JOURNAL</span>
      </div>
      <div className="insight-feed">
        {shown.map((post, i) => (
          <ArticleCard
            key={post.slug}
            post={post}
            featured={i === 0 && !topic && !search}
          />
        ))}
        {!topic && !search && (
          <aside className="insight-invite">
            <span className="insight-topic">FROM READING TO BUILDING</span>
            <h2>
              Good questions.
              <br />
              Better starting points.
            </h2>
            <p>
              Have a project in mind? Tell us what you want to make possible.
            </p>
            <Link href="/contact">
              Talk to the studio <ArrowUpRight size={18} />
            </Link>
            <span className="invite-orbit" aria-hidden="true" />
          </aside>
        )}
      </div>
      {!shown.length && (
        <div className="insight-empty">
          <Search size={28} aria-hidden="true" />
          <h2>No notes found.</h2>
          <p>Try another phrase or explore the full journal.</p>
          <button type="button" onClick={reset}>
            Show all notes <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
