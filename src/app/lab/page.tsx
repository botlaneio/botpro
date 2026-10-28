import type { Metadata } from "next"
import { ArrowUpRight, CalendarDays, ChevronRight, FileText, Pause, RotateCcw, Search, Workflow } from "lucide-react"

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
import { ContactForm } from "@/components/contact/contact-form"
import { HeroPrompt } from "@/components/home/hero-prompt"
import { HeroStory } from "@/components/home/hero-story"
import { ProductCards } from "@/components/home/product-cards"
import { PetalReveal } from "@/components/home/petal-reveal"
import { SiteShowcase } from "@/components/catalog/site-showcase"
import { SolutionFlow } from "@/components/home/solution-flow"
import { StackOrbit } from "@/components/home/stack-orbit"
import { ServicesFaq } from "@/components/services/services-faq"
import { StatCards } from "@/components/home/stat-cards"
import { PricingSection } from "@/components/pricing/pricing-section"
import { ProcessWheel } from "@/components/process/process-wheel"
import { BotlaneMark } from "@/components/site/botlane-mark"
import { HeroMark } from "@/components/site/hero-mark"
import { NEED_OPTIONS } from "@/lib/contact-options"
import { SOLUTIONS } from "@/lib/nav"
import { LANES, type Lane } from "@/lib/lanes"
import { ThemeSwitch } from "@/components/site/theme-switch"
import { Keycaps } from "./lab-controls"

export const metadata: Metadata = { title: "Component lab · Botlane" }

const ICONS: Record<Lane["id"], React.ComponentType<{ className?: string }>> = {
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
  return (
    <main className="mx-auto max-w-6xl px-6 pb-24">
      <header className="flex flex-wrap items-end justify-between gap-6 py-14">
        <div className="grid max-w-2xl gap-3">
          <span className="label-mono">BOTLANE · COMPONENT LAB · LAYER 1–2</span>
          <h1 className="text-4xl font-medium tracking-tight text-balance sm:text-5xl">Every primitive, in the Botlane finishes.</h1>
          <p className="text-muted-foreground">
            shadcn/ui components themed by the Layer 0 tokens. botlane.io stays neutral; colour appears only inside a lane.
          </p>
        </div>
        <ThemeSwitch />
      </header>

      <Section id="buttons" title="Buttons" note="The near-white primary is the site's main action.">
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
      </Section>

      <Section id="badges" title="Badges and keys" note="Status pills and keyboard shortcuts.">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>New</Badge>
          <Badge variant="secondary">Beta</Badge>
          <Badge variant="outline">3 open</Badge>
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
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
            {[["Discovery call", "Syncc · 30 min"], ["Lease_Agreement_Acme.pdf", "Scriblane · 24 pages"], ["Northwind redesign", "Website · week 5 of 7"]].map(([t, s], i) => (
              <li key={t} className={`flex items-center gap-3 rounded-md px-2.5 py-2 ${i === 0 ? "bg-foreground/[0.06]" : ""}`}>
                <span>{t}</span><span className="truncate text-muted-foreground">{s}</span>
                {i === 0 && <Kbd className="ml-auto">↵</Kbd>}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section id="pricing" title="Pricing" note="Every price below is read from src/lib/pricing/plans.ts.">
        <PricingSection />
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
              <Select defaultValue="website">
                <SelectTrigger id="lab-lane" className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="website">A website</SelectItem>
                  <SelectItem value="app">A web app</SelectItem>
                  <SelectItem value="care">Care for an existing site</SelectItem>
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

      <Section id="mark" title="The mark" note="The Visor: a helmet seen only where light catches its right edge. Below 64px it switches to heavier eyes for small sizes.">
        <div className="flex flex-wrap items-end gap-10">
          <BotlaneMark size={26} id="lab-mark-s" />
          <BotlaneMark size={64} id="lab-mark-m" />
          <BotlaneMark size={120} id="lab-mark-l" />
        </div>
        <div className="grid justify-items-start gap-2">
          <HeroMark size={140} />
          <p className="text-sm text-muted-foreground">The homepage mark: the light follows the pointer, the eyes look at it, and a line of light passes every few seconds.</p>
        </div>
      </Section>

      <Section id="prompt" title="Prompt bar" note="The homepage hero. A plain GET form to /contact: the brief and chip fill the contact form's first two steps.">
        <HeroPrompt />
      </Section>

      <Section id="story" title="Hero story" note="Build, Launch, Care as a silent film in hairlines either side of the homepage prompt, on a 20-second loop. Wide screens only on the homepage; pauses off screen; one still frame under reduced motion.">
        <div className="relative aspect-[16/9] overflow-hidden rounded-[1.6rem] border border-border/60">
          <HeroStory className="absolute inset-0 size-full" />
        </div>
      </Section>

      <Section id="flow" title="Solution flow" note="What we build, as a small automation on a dotted canvas: a brief branches into a website or a web app, and both run on into Care. Curves are measured from lg, with a dot of light running each; stacked on phones; still under reduced motion.">
        <SolutionFlow items={SOLUTIONS.flatMap((g) => g.items)} />
      </Section>

      <Section id="stack" title="Stack orbit" note="The apps our work connects to, real ones only. A glass capsule holds the mark above a slot; the apps travel an arc of hairlines and one at a time land in the slot, lighting the capsule's edge. A step every 1.8 seconds; pauses off screen; still under reduced motion.">
        <StackOrbit />
      </Section>

      <Section id="showcase" title="Site showcase" note="An offer page's hero: an example site in a browser window, with a phone in front, both gliding to the foot of the page and back. The business is made up, sits at example.com and has no quotes, so it can't pass for client work. Hover pauses it; still under reduced motion.">
        <SiteShowcase />
      </Section>

      <Section id="reveal" title="Petal reveal" note="The homepage's closing panel. Washed-out petals with boxes opening onto full colour in turn; now and then the whole picture floods. A CURSOR box follows a mouse. Three boxes stay open, still, under reduced motion.">
        <PetalReveal className="grid aspect-[16/9] place-items-center rounded-[1.6rem] p-6">
          <span className="surface-frosted px-4 py-2 text-sm">Content floats here</span>
        </PetalReveal>
      </Section>

      <Section id="faq" title="Split FAQ" note="The questions as one dark card. Opening one splits it into its own card and the rest regroup around it on a spring. Dark on light; a flat raised tone on dark.">
        <ServicesFaq className="max-w-2xl" />
      </Section>

      <Section id="stats" title="Number cards" note="True numbers only. Each counts up once as it scrolls into view; a short arc of the accent runs round each edge, offset card to card.">
        <StatCards stats={[{ value: 3, label: "products built and run in-house" }, { value: 700, suffix: "+", label: "app integrations in Flowlane" }, { value: 14, label: "file types Scriblane can read" }, { value: 20, suffix: "%", label: "off for our first 10 clients" }]} />
      </Section>

      <Section id="products" title="Product cards" note="The Lane products in a fan: one upright in the middle, the others fanned behind. Cards trading places melt as they pass. Buttons, arrow keys, swipe, or tap a side card.">
        <ProductCards />
      </Section>

      <Section id="process" title="Process dial" note="How we work. Pins while the page scrolls through it; the arc turns a step per screen, and the cluster of tools beside it swaps to the step's own, rippling out from the centre. A list on phones and under reduced motion.">
        <ProcessWheel />
      </Section>

      <Section id="contact" title="Contact form" note="Four steps on glass. Sending needs RESEND_API_KEY, CONTACT_TO and CONTACT_FROM; without them it shows an error.">
        <div className="max-w-xl"><ContactForm needs={NEED_OPTIONS} initial={{}} /></div>
      </Section>

      <Section id="disclosure" title="Tabs, accordion and overlays" note="Pricing toggles, FAQs, the mobile menu and dialogs.">
        <Tabs defaultValue="monthly" className="max-w-md">
          <TabsList><TabsTrigger value="monthly">Monthly</TabsTrigger><TabsTrigger value="yearly">Yearly</TabsTrigger></TabsList>
          <TabsContent value="monthly" className="text-sm text-muted-foreground">Billed every month. Cancel any time.</TabsContent>
          <TabsContent value="yearly" className="text-sm text-muted-foreground">Billed once a year, two months free.</TabsContent>
        </Tabs>
        <Accordion type="single" collapsible className="max-w-xl">
          <AccordionItem value="a"><AccordionTrigger>How long does a website take?</AccordionTrigger><AccordionContent>Most sites ship in six to eight weeks.</AccordionContent></AccordionItem>
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
