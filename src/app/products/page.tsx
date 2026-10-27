import type { Metadata } from "next"

import { ProductCards } from "@/components/home/product-cards"
import { StatCards, type Stat } from "@/components/home/stat-cards"
import { PageSection, PageShell } from "@/components/site/page-shell"
import { LANES } from "@/lib/lanes"
import { OFFERS } from "@/lib/pricing"
import { PRODUCT_NUMBERS } from "@/lib/products"

export const metadata: Metadata = {
  title: "Our products · Botlane",
  description: "Syncc, Scriblane and Flowlane: software we build and run ourselves, to the same standard as client work.",
}

const founding = OFFERS.find((o) => o.id === "founding-ten")!
const STATS: Stat[] = [
  { value: LANES.length, label: "products built and run in-house" },
  { value: PRODUCT_NUMBERS.flowlaneIntegrations, suffix: "+", label: "app integrations in Flowlane" },
  { value: PRODUCT_NUMBERS.scriblaneFileTypes, label: "file types Scriblane can read" },
  { value: Math.round(founding.discount * 100), suffix: "%", label: `off for our first ${founding.places} clients` },
]

export default function Products() {
  return (
    <PageShell
      eyebrow="OUR OWN PRODUCTS"
      title="We build software for ourselves, too."
      intro="We're a new studio, so there's no client work to show yet. Instead, here is what we've built and run ourselves, to the same standard."
    >
      <PageSection id="lanes" eyebrow="THE LANES" title="Three products, each on its own site.">
        <ProductCards />
        <StatCards stats={STATS} />
      </PageSection>
    </PageShell>
  )
}
