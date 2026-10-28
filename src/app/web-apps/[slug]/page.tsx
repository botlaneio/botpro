import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { OfferPage } from "@/components/catalog/offer-page"
import { findOffer, offersIn } from "@/lib/catalog"

export const dynamicParams = false

export function generateStaticParams() {
  return offersIn("web-apps").map((o) => ({ slug: o.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const offer = findOffer("web-apps", (await params).slug)
  return offer ? { title: `${offer.name} · Botlane`, description: `${offer.headline} ${offer.pain}` } : {}
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const offer = findOffer("web-apps", (await params).slug)
  if (!offer) notFound()
  return <OfferPage offer={offer} />
}
