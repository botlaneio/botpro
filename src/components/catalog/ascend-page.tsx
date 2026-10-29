import type { Offer } from "@/lib/catalog"

import { PackageDetail, type PackageContent } from "./package/package-detail"
import { EditorVisual, IntegrationsVisual, PagesVisual, SeoVisual, SystemVisual } from "./package/visuals"

const ASCEND: PackageContent = {
  planId: "website-ascend",
  kicker: "ASCEND · THE COMPANY SITE",
  title: ["Room to grow.", "Yours to run."],
  intro: "A complete company website on a design system of its own, with an editor your team actually enjoys using. Up to twelve pages, connected to the tools you already work in.",
  cta: "Start with Ascend",
  example: "firm",
  notes: [["DESIGN SYSTEM", "One look, every page"], ["CONTENT EDITOR", "Edited by your team"]],
  stats: [["12", "Pages, planned around you"], ["1", "Design system across all of them"], ["You", "Publish without waiting on us"], ["3–5", "Weeks to launch"]],
  addsTitle: "Everything a growing company needs from its website.",
  addsIntro: "Ascend takes the craft of Core and gives it the structure, the reach and the independence a company outgrows a small site for.",
  features: [
    { title: "A design system of your own", body: "Type, colour, spacing and components, defined once and used everywhere, so page twelve feels as considered as the homepage.", visual: <SystemVisual />, wide: true },
    { title: "An editor your team will use", body: "Change a headline, publish an article, add a new hire. Your pages and blog are yours to update, the same afternoon.", visual: <EditorVisual />, wide: true },
    { title: "Up to twelve pages", body: "Services, team, insights, careers: the whole company, mapped out in the scope before design begins.", visual: <PagesVisual /> },
    { title: "Connected to how you work", body: "Booking, CRM and newsletter, wired in, so every enquiry and sign-up lands where your team already looks.", visual: <IntegrationsVisual /> },
    { title: "Built for search, from day one", body: "Clean structure, fast pages and the essentials of SEO in place before launch, so you're found for what you do.", visual: <SeoVisual query="accounting firm for growing businesses" site="northline.example › advisory" title="Northline — advice for what comes next" line="Accounting, tax and planning for companies on the move." links={["Services", "Team", "Insights"]} /> },
  ],
  builds: { name: "Core", items: ["Custom design, no templates", "Right on every screen", "Fast-loading", "Contact form", "Analytics"] },
  faq: [
    ["How is Ascend different from Core?", "Core is a focused site of up to five pages that we keep updated for you. Ascend grows to twelve pages, adds a design system and an editor so your team can publish themselves, and connects booking, CRM and newsletter tools."],
    ["Can we bring our existing content?", "Yes. We review what you have during scoping and agree what to keep, rework or write fresh before the build begins."],
    ["Which booking, CRM and newsletter tools do you connect?", "Most of the common ones, such as Calendly, HubSpot and Mailchimp. We confirm the exact tools, and any subscriptions they need, in your scope."],
    ["What happens after launch?", "We hand over everything and walk your team through the editor. Hosting, security updates and ongoing edits are available through Care if you'd like us to stay on."],
  ],
  close: ["Your company has grown.", "Let your website catch up."],
  closeBody: "Tell us where the business is heading. We'll shape the site that takes it there.",
}

/** Ascend's page: the shared package layout, with the company-site example and its own words. */
export function AscendPage({ offer }: { offer: Offer }) {
  return <PackageDetail offer={offer} c={ASCEND} />
}
