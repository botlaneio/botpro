/**
 * The contact form's rules, shared by the form (to check each step) and the server action (to check
 * everything again). Pure: no sending here, so it can be tested.
 */
import { z } from "zod"

/** What a visitor can say they need. The labels are the visitor's words, not our plan names. */
export const NEEDS = [
  { id: "website", label: "A website" },
  { id: "web-app", label: "A web app" },
  { id: "care", label: "Care for a site I already have" },
  { id: "assistant", label: "An AI assistant for my site" },
  { id: "custom", label: "A custom AI or automation solution" },
  { id: "not-sure", label: "Not sure yet" },
] as const

export type NeedId = (typeof NEEDS)[number]["id"]

export const needLabel = (id: NeedId) => NEEDS.find((n) => n.id === id)!.label

/** The need a plan belongs to, for "Start a project" links on its card. */
export const needForPlan = (planId: string): NeedId =>
  planId.startsWith("website-") ? "website" : planId.startsWith("app-") ? "web-app" : planId === "ai-assistant" ? "assistant" : planId.startsWith("care") ? "care" : "not-sure"

export const contactSchema = z.object({
  brief: z
    .string()
    .trim()
    .min(20, "A sentence or two, please: what is it, and who is it for?")
    .max(4000, "That's a lot. Keep it under 4,000 characters; we can go deeper on a call."),
  need: z.enum(NEEDS.map((n) => n.id) as [NeedId, ...NeedId[]], { error: "Choose the closest one. \"Not sure yet\" is fine." }),
  name: z.string().trim().min(1, "What should we call you?").max(80, "That name is a little long."),
  email: z.email("That email doesn't look right.").trim().max(200),
  company: z.string().trim().max(120).optional().default(""),
})

export type ContactData = z.infer<typeof contactSchema>
export type ContactField = keyof ContactData

/** The form's steps, in order, and the fields each one asks for. The last step reviews and sends. */
export const STEPS: { title: string; fields: ContactField[] }[] = [
  { title: "What are you building?", fields: ["brief"] },
  { title: "What do you need from us?", fields: ["need"] },
  { title: "Who should we reply to?", fields: ["name", "email", "company"] },
  { title: "Check it, then send.", fields: [] },
]

/** Bots fill the hidden field, or send faster than anyone can type. Both are dropped without telling them. */
export const HONEYPOT = "website_url"
export const MIN_FILL_MS = 3000

export type FieldErrors = Partial<Record<ContactField, string>>

export const firstErrors = (issues: z.core.$ZodIssue[]): FieldErrors => {
  const out: FieldErrors = {}
  for (const i of issues) {
    const f = i.path[0] as ContactField
    if (!out[f]) out[f] = i.message
  }
  return out
}

/** Checks one step's fields, for the form. */
export function checkStep(step: number, values: Partial<Record<ContactField, string>>): FieldErrors {
  const fields = STEPS[step]?.fields ?? []
  if (!fields.length) return {}
  const pick = Object.fromEntries(fields.map((f) => [f, true])) as Partial<Record<ContactField, true>>
  const r = contactSchema.pick(pick).safeParse(values)
  return r.success ? {} : firstErrors(r.error.issues)
}

export type Screened =
  | { kind: "spam" }
  | { kind: "invalid"; errors: FieldErrors }
  | { kind: "ok"; data: ContactData }

/** Everything the server needs to decide about a submission, before anything is sent. */
export function screen(fields: Record<string, string>, now: number): Screened {
  if (fields[HONEYPOT]) return { kind: "spam" }
  const started = Number(fields.started_at)
  if (!Number.isFinite(started) || now - started < MIN_FILL_MS) return { kind: "spam" }
  const r = contactSchema.safeParse(fields)
  return r.success ? { kind: "ok", data: r.data } : { kind: "invalid", errors: firstErrors(r.error.issues) }
}
