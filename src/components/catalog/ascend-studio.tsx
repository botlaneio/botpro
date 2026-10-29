"use client"

import { useState } from "react"
import { ArrowUpRight, Check, FileText, Globe, Pencil } from "lucide-react"

/** A local demonstration of editing, never a connected CMS or real client site. */
export function AscendStudio() {
  const [title, setTitle] = useState("Good advice. A clearer future.")
  const [draft, setDraft] = useState(title)
  const [published, setPublished] = useState(false)
  return <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4 text-xs"><span className="flex items-center gap-2"><Globe className="size-4" aria-hidden /> NORTHLINE · EXAMPLE COMPANY</span><span className="text-muted-foreground">Interactive concept · try an edit</span></div>
    <div className="grid lg:grid-cols-[15rem_minmax(0,1fr)]">
      <div className="border-b border-border bg-muted/40 p-5 lg:border-r lg:border-b-0">
        <div className="mb-6 flex items-center gap-2 text-sm font-medium"><Pencil className="size-4" aria-hidden /> Content studio</div>
        <div className="mb-7 hidden space-y-3 text-xs text-muted-foreground lg:block">{["Overview", "Pages / Home", "Services", "Insights", "Team"].map((v,i)=><div key={v} className={i===1?"rounded-md bg-foreground/5 p-2 text-foreground":"p-2"}>{v}</div>)}</div>
        <label htmlFor="ascend-headline" className="text-xs text-muted-foreground">Homepage headline</label>
        <textarea id="ascend-headline" maxLength={65} value={draft} onChange={e=>{setDraft(e.target.value);setPublished(false)}} className="mt-2 min-h-24 w-full resize-none rounded-lg border border-border bg-background p-3 text-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground" />
        <button onClick={()=>{setTitle(draft.trim() || "Good advice. A clearer future.");setPublished(true)}} className="btn-light mt-3 flex min-h-11 w-full items-center justify-between px-4 text-sm">Publish demo <ArrowUpRight className="size-4" aria-hidden /></button>
        <p role="status" className="mt-3 min-h-8 text-xs leading-relaxed text-muted-foreground">{published?"Published in this preview. Nothing is saved.":"Edit the headline, then publish to the preview."}</p>
      </div>
      <div className="min-w-0 bg-[#e9edf0] text-[#192c36]">
        <div className="flex items-center justify-between border-b border-[#192c36]/15 px-6 py-5 sm:px-10"><span className="text-sm font-semibold tracking-tight">↗ northline</span><span className="text-[10px] tracking-widest">ADVISORY & ACCOUNTING</span></div>
        <div className="grid gap-8 p-6 sm:p-10 md:grid-cols-[1.2fr_0.8fr]">
          <div><span className="text-[10px] tracking-[0.18em]">BUILT AROUND YOUR AMBITION</span><p className="mt-6 min-h-[3.3em] break-words text-4xl leading-[1.05] tracking-[-0.05em] text-balance sm:text-5xl">{title}</p><p className="mt-6 max-w-xs text-sm leading-relaxed text-[#192c36]/70">The clarity to make your next move. Accounting and advice for businesses moving forward.</p><span className="mt-7 inline-flex items-center gap-6 border-b border-[#192c36]/40 pb-2 text-xs">Meet your next chapter <ArrowUpRight className="size-3" /></span></div>
          <div aria-hidden className="relative flex min-h-48 items-end justify-center overflow-hidden bg-[#cbd4da] p-6"><div className="h-28 w-1/4 bg-[#a3b4be]"/><div className="h-40 w-1/4 bg-[#6e8796]"/><div className="h-52 w-1/4 bg-[#314e60]"/><span className="absolute top-5 left-5 text-[10px] tracking-widest">A BETTER PERSPECTIVE.</span></div>
        </div>
        <div className="grid grid-cols-3 border-t border-[#192c36]/15">{["Business advice","Accounting & tax","Planning ahead"].map(v=><div key={v} className="border-r border-[#192c36]/15 p-4 text-xs last:border-r-0 sm:p-6"><FileText aria-hidden className="mb-3 size-4 opacity-60"/>{v}</div>)}</div>
        <div className="flex items-center gap-2 px-6 py-4 text-[10px] text-[#192c36]/60"><Check className="size-3" aria-hidden /> Fictional company · illustrative design</div>
      </div>
    </div>
  </div>
}
