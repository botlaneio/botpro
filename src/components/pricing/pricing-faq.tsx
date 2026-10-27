"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { OFFERS, plan } from "@/lib/pricing"
import { ChargeText } from "./region"

const founding = OFFERS.find((o) => o.id === "founding-ten")!

/** Pricing questions, answered only from what the price book says. */
export function PricingFaq() {
  return (
    <Accordion type="single" collapsible className="max-w-3xl">
      <AccordionItem value="one-time">
        <AccordionTrigger>Are website prices one-time or monthly?</AccordionTrigger>
        <AccordionContent>
          One-time. You pay once for the build. Care plans are separate monthly add-ons.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="apps">
        <AccordionTrigger>How is a web app priced?</AccordionTrigger>
        <AccordionContent>
          App builds are priced after scoping. A scoping sprint is <ChargeText charge={plan("app-scoping").charges[0]} />, and a
          full build starts at <ChargeText charge={plan("app-full").charges[0]} />.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="founding">
        <AccordionTrigger>What is the Founding Ten?</AccordionTrigger>
        <AccordionContent>
          We&apos;re a new company, so our first {founding.places} clients get {Math.round(founding.discount * 100)}% off website and app
          builds. The offer ends on 31 March 2027, or sooner if all ten places are taken.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="self-hosted">
        <AccordionTrigger>What does a self-hosted Syncc licence include?</AccordionTrigger>
        <AccordionContent>
          Twelve months of updates and email support. After the first year, renewing updates is optional.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
