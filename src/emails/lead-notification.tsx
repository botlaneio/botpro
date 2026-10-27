import { Heading, Text } from "@react-email/components"

import { needLabel, type ContactData } from "@/lib/contact"

import { Answer, Frame, MUTED } from "./parts"

/** To us: a new brief from the contact form. Replying goes straight to the visitor. */
export function LeadNotification({ lead }: { lead: ContactData }) {
  return (
    <Frame preview={`${lead.name}: ${lead.brief.slice(0, 90)}`}>
      <Heading as="h1" style={{ margin: "0 0 4px", fontSize: 22, letterSpacing: "-0.02em" }}>New brief from {lead.name}</Heading>
      <Text style={{ margin: "0 0 16px", fontSize: 14, color: MUTED }}>Reply to this email to answer them directly.</Text>
      <Answer label="What they're building" value={lead.brief} />
      <Answer label="What they need" value={needLabel(lead.need)} />
      <Answer label="Name" value={lead.name} />
      <Answer label="Email" value={lead.email} />
      {lead.company && <Answer label="Company" value={lead.company} />}
    </Frame>
  )
}
