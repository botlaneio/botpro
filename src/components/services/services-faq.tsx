"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { OFFERS, plan } from "@/lib/pricing"
import { ChargeText } from "@/components/pricing/region"

const founding = OFFERS.find((o) => o.id === "founding-ten")!

/** Questions about working with Botlane, answered from the price book. */
export function ServicesFaq() {
  return (
    <Accordion type="single" collapsible className="max-w-3xl">
      <AccordionItem value="new">
        <AccordionTrigger>You&apos;re new. Why should we trust you with our site?</AccordionTrigger>
        <AccordionContent>
          We are new, and we won&apos;t pretend otherwise. What we can show you is the software we&apos;ve built for ourselves, this
          website, and a fixed scope and price before any work starts. Our first {founding.places} clients also get{" "}
          {Math.round(founding.discount * 100)}% off.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="one-time">
        <AccordionTrigger>Are website prices one-time or monthly?</AccordionTrigger>
        <AccordionContent>One-time. You pay once for the build. Care plans are separate and optional.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="sprint">
        <AccordionTrigger>Does the scoping sprint cost extra if we go ahead with the app?</AccordionTrigger>
        <AccordionContent>
          No. The sprint fee of <ChargeText charge={plan("app-scoping").charges[0]} /> is credited towards your build if you go ahead.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="care">
        <AccordionTrigger>What happens after launch?</AccordionTrigger>
        <AccordionContent>
          The site is yours. If you&apos;d like us to look after it, Care covers hosting, updates, monitoring, backups and an hour of
          small edits a month. Care Plus adds more hours, faster replies, a monthly report and a quarterly design review.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="ai">
        <AccordionTrigger>What is the AI Assistant trained on?</AccordionTrigger>
        <AccordionContent>
          Your website and your business: your services, prices, policies and common questions. It answers visitors and hands the
          conversation to you when a person is needed.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="tax">
        <AccordionTrigger>Do the prices include tax?</AccordionTrigger>
        <AccordionContent>Prices in rupees exclude 18% GST.</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
