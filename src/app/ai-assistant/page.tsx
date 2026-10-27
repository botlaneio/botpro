import type { Metadata } from "next"

import { ServiceCard } from "@/components/services/service-card"
import { PageSection, PageShell } from "@/components/site/page-shell"

export const metadata: Metadata = {
  title: "AI Assistant · Botlane",
  description: "An assistant on your website that answers visitors' questions, trained on your business, and hands enquiries to you when a person is needed.",
}

export default function AiAssistant() {
  return (
    <PageShell
      current="/ai-assistant"
      eyebrow="ADD-ON · ONE-TIME"
      title="An assistant that knows your business."
      intro="It answers visitors' questions on your website, day and night, from what you've told it, and hands the enquiry to you when a person is needed."
    >
      <PageSection id="plan" eyebrow="THE PLAN" title="One price, set up once.">
        <div className="max-w-md">
          <ServiceCard planId="ai-assistant" cta="Add the assistant" />
        </div>
      </PageSection>
    </PageShell>
  )
}
