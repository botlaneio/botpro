/**
 * The partner programme: the terms shown in the footer dialog, and the rules for an application. Pure, so the
 * dialog (to check as people type) and the server action (to check again) share it, and it can be tested.
 */

/** The referral fee: a share of what a referred client pays us, for their first months with us. */
export const REFERRAL = { share: 0.15, months: 12 } as const

export const PARTNER_TERMS = [
  `${REFERRAL.share * 100}% of everything a client you refer pays us in their first ${REFERRAL.months} months: projects, Care and products.`,
  "Paid each month, after the client has paid us.",
  "You stay the relationship owner. We do the build and keep you in the loop.",
] as const

/** How many clients a partner works with, to size the conversation. */
export const CLIENT_RANGES = ["1-5 clients", "6-15 clients", "16-35 clients", "36+ clients"] as const

export const PARTNER_HONEYPOT = "company_url"

export interface PartnerApplication {
  name: string
  agency: string
  email: string
  website: string
  clients: string
  message: string
}

export type PartnerField = "name" | "agency" | "email" | "clients"
export type PartnerErrors = Partial<Record<PartnerField, string>>

const text = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "")

/** Reads an application from submitted fields, with the first problem for each field. */
export function readApplication(fields: Record<string, unknown>): { entry: PartnerApplication; errors: PartnerErrors } {
  const entry: PartnerApplication = {
    name: text(fields.name, 120),
    agency: text(fields.agency, 160),
    email: text(fields.email, 200),
    website: text(fields.website, 200),
    clients: text(fields.clients, 20),
    message: text(fields.message, 1500),
  }
  const errors: PartnerErrors = {}
  if (!entry.name) errors.name = "What should we call you?"
  if (!entry.agency) errors.agency = "Add your agency or business name."
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(entry.email)) errors.email = "That email doesn't look right."
  if (!(CLIENT_RANGES as readonly string[]).includes(entry.clients)) errors.clients = "Choose the closest range."
  return { entry, errors }
}
