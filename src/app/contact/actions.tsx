"use server"

import { Resend } from "resend"

import { ClientConfirmation } from "@/emails/client-confirmation"
import { LeadNotification } from "@/emails/lead-notification"
import { screen, type FieldErrors } from "@/lib/contact"

export interface ContactState {
  status: "idle" | "sent" | "error"
  message?: string
  errors?: FieldErrors
  name?: string
  email?: string
}

const FAILED = "We couldn't send that just now. Your answers are still here: please try again in a minute."

/**
 * Sends a brief from the contact form: to us, with Reply-To set to the visitor, then a confirmation to them.
 * Needs RESEND_API_KEY, CONTACT_TO (our inbox) and CONTACT_FROM (a sender on a domain verified in Resend).
 */
export async function sendBrief(_prev: ContactState, form: FormData): Promise<ContactState> {
  const fields = Object.fromEntries([...form.entries()].map(([k, v]) => [k, typeof v === "string" ? v : ""]))
  const r = screen(fields, Date.now())

  // Bots get the same answer as people, so they learn nothing from it.
  if (r.kind === "spam") return { status: "sent" }
  if (r.kind === "invalid") return { status: "error", message: "A few answers need another look.", errors: r.errors }

  const { RESEND_API_KEY: key, CONTACT_TO: to, CONTACT_FROM: from } = process.env
  if (!key || !to || !from) {
    console.error("Contact form is not configured: set RESEND_API_KEY, CONTACT_TO and CONTACT_FROM.")
    return { status: "error", message: FAILED }
  }

  const lead = r.data
  const resend = new Resend(key)
  const sent = await resend.emails.send({
    from,
    to,
    replyTo: lead.email,
    subject: `New brief: ${lead.name}${lead.company ? `, ${lead.company}` : ""}`,
    react: <LeadNotification lead={lead} />,
  })
  if (sent.error) {
    console.error("Contact form: the lead email failed.", sent.error)
    return { status: "error", message: FAILED }
  }

  // The lead has reached us; a failed confirmation is logged, not shown.
  const confirmed = await resend.emails.send({
    from,
    to: lead.email,
    replyTo: to,
    subject: "We've got your brief",
    react: <ClientConfirmation lead={lead} />,
  })
  if (confirmed.error) console.error("Contact form: the confirmation email failed.", confirmed.error)

  return { status: "sent", name: lead.name, email: lead.email }
}
