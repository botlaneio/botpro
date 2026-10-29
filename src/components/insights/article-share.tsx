"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy, RotateCcw } from "lucide-react";
import { DynamicButton } from "@/components/lab/dqnamo/DynamicButton";

export function ArticleShare({ slug, title }: { slug: string; title: string }) {
  const [state, setState] = useState<"idle" | "copied" | "error">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  async function copy() {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/blog/${slug}`,
      );
      setState("copied");
    } catch {
      setState("error");
    }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setState("idle"), 2500);
  }
  const label =
    state === "copied"
      ? "Copied"
      : state === "error"
        ? "Try again"
        : "Copy link";
  return (
    <span className="article-share">
      <DynamicButton
        onClick={copy}
        aria-label={`${label}: ${title}`}
        icon={
          state === "copied" ? (
            <Check size={14} />
          ) : state === "error" ? (
            <RotateCcw size={14} />
          ) : (
            <Copy size={14} />
          )
        }
        variant="secondary"
        className="insight-copy"
      >
        {label}
      </DynamicButton>
      <span className="sr-only" role="status">
        {state === "copied"
          ? "Article link copied"
          : state === "error"
            ? "Could not copy the link. You can open the article and copy its address."
            : ""}
      </span>
    </span>
  );
}
