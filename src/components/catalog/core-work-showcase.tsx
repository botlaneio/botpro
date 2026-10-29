import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { ClinicSite } from "./site-showcase"

const NOTES = [
  ["01", "A clear way in.", "The headline explains the service. The navigation keeps the essentials close."],
  ["02", "Services you can understand.", "Treatments are grouped into short, readable introductions, with room to learn more."],
  ["03", "A next step within reach.", "A prominent enquiry action and a simple contact section make the path forward clear."],
]

/** A labelled concept study, using the same clinic design as Core's hero. */
export function CoreWorkShowcase() {
  return <section aria-labelledby="proof-title" className="grid min-w-0 gap-8 border-b border-border/70 py-14 sm:gap-12 sm:py-20">
    <div className="flex flex-wrap items-end justify-between gap-6">
      <div className="grid max-w-xl gap-4"><span className="label-mono">A CLOSER LOOK · CONCEPT STUDY</span><h2 id="proof-title" className="scroll-mt-24 text-3xl font-medium tracking-tight text-balance sm:text-4xl">One business.<br />Considered on every screen.</h2><p className="max-w-lg leading-relaxed text-foreground/75">Juniper Physio is an imagined practice. This example shows how a focused service business can introduce itself, explain its work, and make an enquiry feel straightforward.</p></div>
      <Link href="/examples/core" className="btn-light inline-flex min-h-12 items-center gap-4 px-5 text-sm font-medium">Explore the full example <ArrowUpRight aria-hidden className="size-4" /></Link>
    </div>
    <figure className="min-w-0">
      <div aria-hidden="true" className="relative isolate grid min-w-0 grid-cols-[minmax(0,1fr)_minmax(0,0.38fr)] items-end gap-3 rounded-2xl bg-foreground/[0.025] p-3 sm:gap-6 sm:p-8">
        <div className="min-w-0 overflow-hidden rounded-lg border border-border/70 bg-background shadow-2xl sm:rounded-xl">
          <div className="flex items-center gap-1.5 border-b border-border/60 px-2 py-2 sm:px-4 sm:py-3"><span className="size-1 rounded-full bg-foreground/30" /><span className="size-1 rounded-full bg-foreground/20" /><span className="size-1 rounded-full bg-foreground/10" /><span className="ml-auto truncate font-mono text-[7px] text-muted-foreground sm:text-[10px]">juniper.example · desktop</span></div>
          <div className="aspect-[4/3] overflow-hidden [container-type:inline-size]"><div className="text-[1.6cqw]"><ClinicSite wide /></div></div>
        </div>
        <div className="min-w-0 rounded-[1.2rem] border border-border/80 bg-background p-1 shadow-xl sm:rounded-[2rem] sm:p-2">
          <div className="relative aspect-[9/19] overflow-hidden rounded-[0.9rem] [container-type:inline-size] sm:rounded-[1.5rem]"><div className="text-[4.6cqw]"><ClinicSite /></div><span className="absolute top-1 left-1/2 h-1 w-1/4 -translate-x-1/2 rounded-full bg-black/25 sm:top-2" /></div>
        </div>
      </div>
      <figcaption className="mt-4 flex flex-wrap justify-between gap-2 text-xs leading-relaxed text-muted-foreground"><span>Juniper Physio · Desktop and mobile concept</span><span>Illustrative design, not client work. No patient services are offered.</span></figcaption>
    </figure>
    <ol className="grid gap-6 border-t border-border/60 pt-8 md:grid-cols-3 md:gap-10">{NOTES.map(([number,title,body])=><li key={number} className="grid min-w-0 content-start gap-3"><span className="label-mono text-xs">{number}</span><h3 className="text-lg font-medium tracking-tight">{title}</h3><p className="text-sm leading-relaxed text-foreground/75">{body}</p></li>)}</ol>
  </section>
}
