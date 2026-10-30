import Image from "next/image"
import { ArrowDown, CalendarDays, Check, ClipboardList, FileText, Mail, Sparkles } from "lucide-react"

const label = "font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground"

/** Conceptual examples: the illustrations are not screenshots of Claude Duet. */
export function DuetVisual({ kind }: { kind: "flow" | "morning" | "comparison" }) {
  if (kind === "morning") return (
    <figure className="my-3 grid gap-3">
      <Image src="/images/insights/duet-morning.webp" alt="A sunlit workspace prepared for a small business owner's morning review" width={1672} height={941} className="h-auto w-full rounded-2xl object-cover" />
      <figcaption className="text-sm leading-relaxed text-muted-foreground">A morning review is one possible trial: compare the briefing with your own sources and check what it misses. Illustration, not a product screenshot.</figcaption>
    </figure>
  )
  if (kind === "flow") return (
    <figure className="my-3 overflow-hidden rounded-2xl border border-border bg-foreground/[0.025] p-5 sm:p-7">
      <figcaption className={`${label} mb-5`}>The idea · from scattered information to a review</figcaption>
      <div className="grid gap-3">
        <div className="grid grid-cols-3 gap-2">
          {[[Mail, "Inbox"], [CalendarDays, "Calendar"], [FileText, "Documents"]].map(([Icon, text]) => {
            const Symbol = Icon as typeof Mail
            return <div key={text as string} className="grid justify-items-center gap-2 rounded-xl border border-border/70 bg-background px-2 py-4 text-center text-sm"><Symbol aria-hidden className="size-5 text-(--brand)" /><span>{text as string}</span></div>
          })}
        </div>
        <ArrowDown aria-hidden className="mx-auto size-4 text-muted-foreground" />
        <div className="flex items-center gap-4 rounded-xl border border-border/70 bg-background p-4"><Sparkles aria-hidden className="size-5 shrink-0 text-(--brand)" /><div><p className="font-medium text-foreground">Duet prepares a briefing</p><p className="text-sm text-muted-foreground">Connected sources are checked periodically.</p></div></div>
        <ArrowDown aria-hidden className="mx-auto size-4 text-muted-foreground" />
        <div className="flex items-center gap-4 rounded-xl border border-border/70 bg-background p-4"><Check aria-hidden className="size-5 shrink-0 text-(--brand)" /><div><p className="font-medium text-foreground">You review and decide</p><p className="text-sm text-muted-foreground">Check the sources and any proposed action.</p></div></div>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">A simplified example, not a guarantee of real-time monitoring or accuracy.</p>
    </figure>
  )
  return (
    <figure className="my-3 overflow-hidden rounded-2xl border border-border bg-foreground/[0.025] p-5 sm:p-7">
      <figcaption className={`${label} mb-5`}>Two complementary roles</figcaption>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-border/70 bg-background p-5"><Sparkles aria-hidden className="mb-4 size-5 text-(--brand)" /><p className="font-medium text-foreground">An assistant</p><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Can help surface information and prepare a draft for review.</p><p className="mt-4 border-t border-border pt-3 text-sm">Example: summarize a meeting.</p></div>
        <div className="rounded-xl border border-border/70 bg-background p-5"><ClipboardList aria-hidden className="mb-4 size-5 text-(--brand)" /><p className="font-medium text-foreground">A dedicated workflow</p><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Records state, ownership and what happens when something fails.</p><p className="mt-4 border-t border-border pt-3 text-sm">Example: confirm and record a booking.</p></div>
      </div>
    </figure>
  )
}
