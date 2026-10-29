import type { Offer } from "@/lib/catalog"

import { PackageDetail, type PackageContent } from "./package/package-detail"
import { BudgetVisual, LanguagesVisual, MotionVisual, SeoVisual, StructureVisual } from "./package/visuals"

const APEX: PackageContent = {
  planId: "website-apex",
  kicker: "APEX · THE FLAGSHIP",
  title: ["The website", "as the experience."],
  intro: "For launches, premium brands and flagship companies, where the site isn't a brochure for the product but part of it. Signature motion, structured content, and engineering held to a performance budget.",
  cta: "Start with Apex",
  example: "launch",
  notes: [["SIGNATURE MOTION", "Designed, not borrowed"], ["PERFORMANCE", "Held to an agreed budget"]],
  stats: [["3", "Structured content types"], ["Any", "Languages your audience needs"], ["4", "Rounds of design revisions"], ["5–8", "Weeks to launch"]],
  addsTitle: "The craft of a launch, the discipline of a system.",
  addsIntro: "Apex is everything in Ascend, taken to the standard of the brands that set it: a motion language of your own, content that's built to scale, and a site that's found and fast everywhere.",
  features: [
    { title: "Signature motion", body: "A motion language designed around your brand: how things enter, respond and move on. Felt on the first second, consistent on every page.", visual: <MotionVisual />, wide: true },
    { title: "Held to a performance budget", body: "Limits on page weight and load time, agreed up front and built against, so richness never costs the visit.", visual: <BudgetVisual />, wide: true },
    { title: "Structured content", body: "Case studies, docs and a changelog, each with fields of its own, so the site stays coherent as the work grows.", visual: <StructureVisual /> },
    { title: "Advanced SEO", body: "Structured data, search-ready architecture and content modelled for discovery, beyond the basics.", visual: <SeoVisual /> },
    { title: "In every language you need", body: "One site, many audiences, with the language scope and publishing workflow agreed before we build.", visual: <LanguagesVisual /> },
  ],
  builds: { name: "Ascend", items: ["A design system", "Content editor and blog", "Booking, CRM and newsletter", "Custom design", "Every screen"] },
  faq: [
    ["Who is Apex for?", "Brands where the website is part of the product experience: a product launch, a premium brand, or a flagship company site that has to carry a lot of story and still feel effortless."],
    ["How many pages does Apex include?", "As many as the story needs. We scope the pages, content types and languages together, and agree them in writing before the build."],
    ["What does a performance budget mean in practice?", "We set limits on page weight and load time at the start, check every design and build decision against them, and verify them across devices before launch."],
    ["Can we see the motion before it's built?", "Yes. Motion studies are part of the design phase, so you review how the site moves, not just how it looks, before we build it."],
  ],
  close: ["You've built something remarkable.", "Let's make it felt."],
  closeBody: "Tell us what you're putting into the world. We'll build the experience it deserves.",
}

/** Apex's page: the shared package layout, with the launch example and its own words. */
export function ApexPage({ offer }: { offer: Offer }) {
  return <PackageDetail offer={offer} c={APEX} />
}
