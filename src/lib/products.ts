/**
 * What each Lane product does, for the product cards: three short reasons each. Every line is taken from
 * the product's own code and docs (the syncc, scriblane and flow repositories); nothing is a plan or a promise.
 */
import type { LaneId } from "./lanes.ts"

/** Counts quoted on the site, checked against the product repositories: 742 community pieces in flow; 14 accepted file types in scriblane. */
export const PRODUCT_NUMBERS = { flowlaneIntegrations: 700, scriblaneFileTypes: 14 }

export const PRODUCT_FEATURES: Record<LaneId, string[]> = {
  syncc: [
    "Your booking page on your own domain",
    "Google Calendar sync, with Meet or Zoom links",
    "One flat price per page, never per seat",
  ],
  scriblane: [
    "Invoice fields with a confidence score each",
    "Checks line items, subtotal, tax and total",
    "PDFs, scans, photos and Office files",
  ],
  flowlane: [
    "700+ app integrations, from Gmail to HubSpot",
    "A visual builder with branches and loops",
    "AI agent steps you brief in plain language",
  ],
}
