/**
 * What each Lane product does, for the product cards. Every line here is taken from the product's own code
 * and docs (the syncc, scriblane and flow repositories, October 2026); nothing is a plan or a promise.
 * Each product also states one honest limit, so the cards never oversell.
 */
import type { LaneId } from "./lanes.ts"

export interface ProductDetail {
  /** Short reasons to choose it, in a visitor's words. */
  features: string[]
  /** An optional side-by-side with the product people compare it to, and where the comparison came from. */
  compare?: { against: string; rows: [label: string, ours: string, theirs: string][]; source: string }
  /** What it doesn't do yet. */
  limit: string
}

export const PRODUCT_DETAILS: Record<LaneId, ProductDetail> = {
  syncc: {
    features: [
      "Your booking page on your own domain, with no vendor branding on any plan",
      "One flat price per booking page, never per seat",
      "Google Calendar sync, with Meet or Zoom links made for every booking",
      "Paid bookings by UPI, card or netbanking through Razorpay",
      "WhatsApp confirmations and reminders",
      "Double booking is impossible, even when two people click at once",
      "Move over from Calendly in one import: event types and weekly hours",
    ],
    compare: {
      against: "Calendly",
      rows: [
        ["Where your page lives", "Your own domain", "A calendly.com link"],
        ["Remove their branding", "Every plan", "Standard plan and up"],
        ["How it's priced", "Flat, per page", "Per seat, per month"],
      ],
      source: "Calendly details from calendly.com/pricing, checked 24 October 2026.",
    },
    limit: "Built for one owner's calendar: teams and round-robin aren't supported yet.",
  },
  scriblane: {
    features: [
      "Invoice fields, each with a confidence score and the page it came from",
      "Checks the maths: line items, subtotal, tax and total",
      "A review queue for anything that doesn't add up, with the reasons",
      "PDFs, scans, photos, Word, Excel, PowerPoint and more: 14 file types",
      "No third-party AI: extraction is deterministic and runs offline",
      "Download JSON or Markdown, or send documents through the API",
      "Reads dates the way your firm writes them, day or month first",
    ],
    limit: "Tuned for English invoice layouts today; other documents come out as key-value pairs and tables.",
  },
  flowlane: {
    features: [
      "700+ app integrations, from Gmail, Slack and Stripe to HubSpot and Notion",
      "A visual builder: triggers, steps, branches and loops",
      "AI agent steps you brief in plain language",
      "A built-in MCP server, so AI assistants can build and run your flows",
      "Tables to keep data between runs, and webhooks in and out",
      "Can run on your own server, so your data stays with you",
    ],
    limit: "Opening soon: it's being prepared for clients now.",
  },
}
