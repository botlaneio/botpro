import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ApexPage } from "@/components/catalog/apex-page"
import { AscendPage } from "@/components/catalog/ascend-page"
import { CorePage } from "@/components/catalog/core-page"
import { OfferPage } from "@/components/catalog/offer-page"
import { findOffer, offersIn } from "@/lib/catalog"

export const dynamicParams = false

export function generateStaticParams() {
  return offersIn("websites").map((o) => ({ slug: o.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const offer = findOffer("websites", (await params).slug)
  return offer ? { title: `${offer.slug === "business-sites" ? "Core" : offer.slug === "company-sites" ? "Ascend" : offer.slug === "brand-sites" ? "Apex" : offer.name} · Botlane`, description: `${offer.headline} ${offer.pain}` } : {}
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const offer = findOffer("websites", (await params).slug)
  if (!offer) notFound()
  return offer.slug === "business-sites" ? <CorePage offer={offer} /> : offer.slug === "company-sites" ? <AscendPage offer={offer} /> : offer.slug === "brand-sites" ? <ApexPage offer={offer} /> : <OfferPage offer={offer} />
}
