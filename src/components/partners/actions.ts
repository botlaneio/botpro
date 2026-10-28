"use server"

import { Resend } from "resend"

import { PARTNER_HONEYPOT, readApplication, type PartnerApplication, type PartnerErrors } from "@/lib/partners"

export interface PartnerState {
  status: "idle" | "sent" | "error"
  message?: string
  errors?: PartnerErrors
}

const FAILED = "We couldn't send that just now. Your answers are still here: please try again in a minute."

/** Appends the application to the partner Google Sheet through its Apps Script web app. */
async function toSheet(entry: PartnerApplication, url: string, secret: string): Promise<boolean> {
  try {
    // Apps Script answers a POST with a redirect to the result; fetch follows it.
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ secret, source: "botlane.io/#partners", ...entry }),
      redirect: "follow",
      signal: AbortSignal.timeout(10_000),
    })
    const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null
    if (res.ok && data?.ok) return true
    console.error("Partners: the sheet rejected the entry.", res.status, data?.error)
  } catch (err) {
    console.error("Partners: could not reach the sheet.", err)
  }
  return false
}

/** Emails the application to our inbox, with Reply-To set to the applicant. */
async function toInbox(entry: PartnerApplication, key: string, to: string, from: string): Promise<boolean> {
  const lines = [
    `Name: ${entry.name}`,
    `Agency: ${entry.agency}`,
    `Email: ${entry.email}`,
    `Website: ${entry.website || "-"}`,
    `Clients: ${entry.clients}`,
    "",
    entry.message || "(no message)",
  ]
  const sent = await new Resend(key).emails.send({
    from,
    to,
    replyTo: entry.email,
    subject: `Partner application: ${entry.agency}`,
    text: lines.join("\n"),
  })
  if (sent.error) console.error("Partners: the email failed.", sent.error)
  return !sent.error
}

/**
 * Sends a partner application to the Google Sheet (PARTNER_SHEET_WEBHOOK_URL and PARTNER_SHEET_SECRET), and
 * also to our inbox when Resend is set up (RESEND_API_KEY, CONTACT_TO, CONTACT_FROM). Either one reaching us
 * counts as sent, so the programme works with whichever is configured.
 */
export async function applyToPartner(_prev: PartnerState, form: FormData): Promise<PartnerState> {
  const fields = Object.fromEntries(form.entries())
  // Bots get the same answer as people, so they learn nothing from it.
  if (fields[PARTNER_HONEYPOT]) return { status: "sent" }

  const { entry, errors } = readApplication(fields)
  if (Object.keys(errors).length) return { status: "error", message: "A few answers need another look.", errors }

  const { PARTNER_SHEET_WEBHOOK_URL: url, PARTNER_SHEET_SECRET: secret, RESEND_API_KEY: key, CONTACT_TO: to, CONTACT_FROM: from } = process.env
  if (!(url && secret) && !(key && to && from)) {
    console.error("Partners: set PARTNER_SHEET_WEBHOOK_URL and PARTNER_SHEET_SECRET, or the Resend settings.")
    return { status: "error", message: FAILED }
  }

  const results = await Promise.all([
    url && secret ? toSheet(entry, url, secret) : false,
    key && to && from ? toInbox(entry, key, to, from) : false,
  ])
  return results.some(Boolean) ? { status: "sent" } : { status: "error", message: FAILED }
}
