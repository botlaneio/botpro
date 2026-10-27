import type { Metadata } from "next"
import { headers } from "next/headers"
import { ArrowUpRight, CalendarDays, ChevronRight, FileText, Globe, Pause, RotateCcw, Search, Workflow } from "lucide-react"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { PricingSection } from "@/components/pricing/pricing-section"
import { LANES, type Lane } from "@/lib/lanes"
import { regionFor } from "@/lib/pricing"
import { Keycaps, ThemeToggle } from "./lab-controls"

export const metadata: Metadata = { title: "Component lab · Botlane" }

const ICONS: Record<Lane["id"], React.ComponentType<{ className?: string }>> = {
  buildlane: Globe,
  syncc: CalendarDays,
  scriblane: FileText,
  flowlane: Workflow,
}

function Section({ id, title, note, children }: { id: string; title: string; note: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="grid gap-5 border-t border-border py-10">
      <div className="grid gap-1">
        <h2 id={id} className="text-lg font-medium tracking-tight">{title}</h2>
        <p className="max-w-prose text-sm text-muted-foreground">{note}</p>
      </div>
      {children}
    </section>
  )
}

export default async function Lab() {
  // Vercel and Cloudflare report the visitor's country; India sees rupees first.
  const h = await headers()
  const region = regionFor(h.get("x-vercel-ip-country") ?? h.get("cf-ipcountry"))

  return (
    <main className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
      <header className="flex flex-wrap items-end justify-between gap-6 py-14">
        <div className="grid max-w-2xl gap-3">
          <span className="label-mono">BOTLANE · COMPONENT LAB · LAYER 1–2</span>
          <h1 className="text-4xl font-medium tracking-tight text-balance sm:text-5xl">Every primitive, in the Botlane finishes.</h1>
          <p className="text-muted-foreground">
            shadcn/ui components themed by the Layer 0 tokens. botlane.io stays neutral; colour appears only inside a lane.
          </p>
        </div>
        <ThemeToggle />
      </header>

      <Section id="buttons" title="Buttons" note="The near-white primary is the site's main action. Lane buttons appear only on product pages.">
        <div className="flex flex-wrap items-center gap-3">
          <Button className="btn-light h-9 px-4">Start a project</Button>
          <Button variant="outline" className="h-9 px-4">Book a call</Button>
          <Button variant="ghost" className="h-9 px-3">See our work</Button>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon-lg" aria-label="Reset"><RotateCcw /></Button>
            </TooltipTrigger>
            <TooltipContent>Reset</TooltipContent>
          </Tooltip>
          <Button variant="link" className="h-9 px-1">Read the docs <ArrowUpRight /></Button>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {LANES.map((l) => (
            <span key={l.id} className={l.scope}>
              <Button className="btn-lane h-9 px-4 text-lane-ink">Try {l.name}</Button>
            </span>
          ))}
        </div>
      </Section>

      <Section id="badges" title="Badges and keys" note="Status pills use the lane's subtle shades. Shortcuts use the mono face.">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>New</Badge>
          <Badge variant="secondary">Beta</Badge>
          <Badge variant="outline">3 open</Badge>
          {LANES.map((l) => (
            <Badge key={l.id} className={`${l.scope} border-lane-border bg-lane-subtle text-lane-text`}>
              <span className="size-1.5 rounded-full bg-lane" aria-hidden />
              {l.name}{l.status === "soon" ? " · soon" : ""}
            </Badge>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <KbdGroup><Kbd>⌘</Kbd><Kbd>K</Kbd></KbdGroup>
          <span className="tip-frosted inline-flex items-center gap-3 px-3 py-1.5 text-sm">
            <Pause className="size-4" /> Pause agent <span className="text-muted-foreground">⌘P</span>
          </span>
          <Keycaps />
        </div>
      </Section>

      <Section id="cards" title="Lane cards" note="Product cards use the tinted surface in their lane colour. Neutral panels use glass.">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {LANES.map((l) => {
            const Icon = ICONS[l.id]
            return (
              <article key={l.id} className={`${l.scope} surface-tinted flex flex-col gap-4 p-5`}>
                <div className="flex items-center gap-3">
                  <span className="tile-depth size-10"><Icon className="size-[18px]" /></span>
                  <h3 className="font-normal">{l.name}</h3>
                  <span className="ml-auto grid size-8 place-items-center rounded-md border border-lane-border/60 text-foreground"><ChevronRight className="size-4" /></span>
                </div>
                <p className="text-sm text-foreground/85">{l.tagline}</p>
                <div className="h-px bg-foreground/10" />
                <p className="label-mono truncate">{l.host}{l.status === "soon" ? " · soon" : ""}</p>
              </article>
            )
          })}
        </div>
        <div className="surface-glass flex flex-col gap-0 overflow-hidden">
          <div className="flex items-center gap-3 border-b border-foreground/10 px-4 py-3.5">
            <Search className="size-4 text-muted-foreground" />
            <span>book a call</span>
            <Kbd className="ml-auto">esc</Kbd>
          </div>
          <ul className="grid gap-0.5 p-2 text-sm">
            {[["Discovery call", "Syncc · 30 min"], ["Lease_Agreement_Acme.pdf", "Scriblane · 24 pages"], ["Northwind redesign", "Buildlane · week 5 of 7"]].map(([t, s], i) => (
              <li key={t} className={`flex items-center gap-3 rounded-md px-2.5 py-2 ${i === 0 ? "bg-foreground/[0.06]" : ""}`}>
                <span>{t}</span><span className="truncate text-muted-foreground">{s}</span>
                {i === 0 && <Kbd className="ml-auto">↵</Kbd>}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section id="pricing" title="Pricing" note="Every price below is read from src/lib/pricing/plans.ts. Switch currency to see rupee prices.">
        <PricingSection region={region} />
      </Section>

      <Section id="forms" title="Forms" note="The contact and signup forms are built from these.">
        <form className="surface-hairline grid max-w-xl gap-6 p-6">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="lab-name">Name</FieldLabel>
              <Input id="lab-name" placeholder="Dana Reyes" />
            </Field>
            <Field>
              <FieldLabel htmlFor="lab-lane">Interested in</FieldLabel>
              <Select defaultValue="buildlane">
                <SelectTrigger id="lab-lane" className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {LANES.map((l) => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="lab-brief">Project brief</FieldLabel>
              <Textarea id="lab-brief" placeholder="What are you building?" />
              <FieldDescription>Two or three sentences is plenty.</FieldDescription>
            </Field>
            <RadioGroup defaultValue="monthly" className="flex gap-6">
              <div className="flex items-center gap-2"><RadioGroupItem value="monthly" id="lab-monthly" /><Label htmlFor="lab-monthly">Monthly</Label></div>
              <div className="flex items-center gap-2"><RadioGroupItem value="yearly" id="lab-yearly" /><Label htmlFor="lab-yearly">Yearly</Label></div>
            </RadioGroup>
            <div className="flex items-center gap-2"><Checkbox id="lab-terms" /><Label htmlFor="lab-terms">I agree to the terms</Label></div>
            <div className="flex items-center gap-2"><Switch id="lab-news" defaultChecked /><Label htmlFor="lab-news">Send me product updates</Label></div>
          </FieldGroup>
          <Button type="button" className="btn-light h-9 w-fit px-4">Send</Button>
        </form>
      </Section>

      <Section id="disclosure" title="Tabs, accordion and overlays" note="Pricing toggles, FAQs, the mobile menu and dialogs.">
        <Tabs defaultValue="monthly" className="max-w-md">
          <TabsList><TabsTrigger value="monthly">Monthly</TabsTrigger><TabsTrigger value="yearly">Yearly</TabsTrigger></TabsList>
          <TabsContent value="monthly" className="text-sm text-muted-foreground">Billed every month. Cancel any time.</TabsContent>
          <TabsContent value="yearly" className="text-sm text-muted-foreground">Billed once a year, two months free.</TabsContent>
        </Tabs>
        <Accordion type="single" collapsible className="max-w-xl">
          <AccordionItem value="a"><AccordionTrigger>How long does a Buildlane project take?</AccordionTrigger><AccordionContent>Most sites ship in six to eight weeks.</AccordionContent></AccordionItem>
          <AccordionItem value="b"><AccordionTrigger>Can I use Syncc and Scriblane together?</AccordionTrigger><AccordionContent>Yes. One account covers every Lane product.</AccordionContent></AccordionItem>
        </Accordion>
        <div className="flex flex-wrap gap-3">
          <Dialog>
            <DialogTrigger asChild><Button variant="outline">Open dialog</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Book a discovery call</DialogTitle><DialogDescription>Pick a time and we&apos;ll send a calendar invite.</DialogDescription></DialogHeader>
              <DialogFooter><Button className="btn-light">Continue</Button></DialogFooter>
            </DialogContent>
          </Dialog>
          <Sheet>
            <SheetTrigger asChild><Button variant="outline">Open mobile menu</Button></SheetTrigger>
            <SheetContent>
              <SheetHeader><SheetTitle>Menu</SheetTitle><SheetDescription>Work, Lanes, Pricing, Contact</SheetDescription></SheetHeader>
            </SheetContent>
          </Sheet>
        </div>
        <Separator />
        <p className="label-mono">FIG_LAB · tokens in src/app/globals.css · finishes in src/styles/materials.css</p>
      </Section>
    </main>
  )
}
