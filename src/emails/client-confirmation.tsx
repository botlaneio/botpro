import { Heading, Text } from "@react-email/components"

import { needLabel, type ContactData } from "@/lib/contact"

import { Answer, Frame, MUTED } from "./parts"

/** To the visitor: we have their brief, here is what happens next, and a copy of what they sent. */
export function ClientConfirmation({ lead }: { lead: ContactData }) {
  return (
    <Frame preview="We've got your brief. Here's what happens next.">
      <Heading as="h1" style={{ margin: "0 0 12px", fontSize: 22, letterSpacing: "-0.02em" }}>Thanks, {lead.name}. We&apos;ve got your brief.</Heading>
      <Text style={{ margin: "0 0 8px", fontSize: 15, lineHeight: "23px" }}>
        We read every brief ourselves. We&apos;ll reply with honest advice on whether we&apos;re the right fit and, if we are, the next step: a short call to understand the project, then a written scope and one fixed price.
      </Text>
      <Text style={{ margin: "0 0 20px", fontSize: 15, lineHeight: "23px" }}>If anything changes in the meantime, just reply to this email.</Text>
      <Text style={{ margin: "0 0 4px", fontSize: 13, color: MUTED }}>What you sent us</Text>
      <Answer label="What you're building" value={lead.brief} />
      <Answer label="What you need" value={needLabel(lead.need)} />
    </Frame>
  )
}
