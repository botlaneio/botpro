import type { NavIcon, NavItem } from "./nav"
import type { LaneId } from "./lanes"

// Homepage copy stays separate from the navigation and product detail pages.
export const HOME_SERVICE_COPY: Record<NavIcon, Pick<NavItem, "body">> = {
  websites: { body: "A considered first impression. A clear next step. Custom-designed around your business." },
  apps: { body: "From a first working version to a full product. Planned and priced in stages." },
  care: { body: "Hosting, security updates, and small edits. The everyday upkeep, taken care of." },
  assistant: { body: "Help visitors find answers, with an assistant trained on your business." },
}

export interface HomeProductCopy {
  headline: string
  description: string
  features: string[]
}

export const HOME_PRODUCTS: Record<LaneId, HomeProductCopy> = {
  syncc: {
    headline: "A time that works. Without the back-and-forth.",
    description: "Share your link. Let people choose a time. Find the meeting in your calendar.",
    features: ["A booking page on your own domain", "Google Calendar, with Meet or Zoom links", "Flat pricing per page"],
  },
  scriblane: {
    headline: "From documents to usable data.",
    description: "Extract information from invoices, scans, and Office files, with checks that help you review the results.",
    features: ["Confidence scores for extracted fields", "Checks for invoice totals and line items", "Support for PDFs, images, and Office files"],
  },
  flowlane: {
    headline: "Less moving information. More moving forward.",
    description: "Connect your apps and automate the steps between an enquiry, a task, and the next thing that needs to happen.",
    features: ["A visual workflow builder", "Branches and loops", "AI steps described in plain language"],
  },
}

export const HOME_PROCESS = [
  { title: "Start with a brief", body: "Tell us what you need and what you want to achieve. We’ll review it and work through the questions with you.", tags: ["Goals", "Requirements", "Fit"] },
  { title: "Agree on the plan", body: "A written scope, a timeline, and a fixed quote. You know what’s included before we begin.", tags: ["Scope", "Timeline", "Price"] },
  { title: "See the design", body: "Your content. Your brand. A design you can review and refine before we build.", tags: ["Content", "Design", "Feedback"] },
  { title: "Follow the build", body: "See the progress as your project comes together, with testing and opportunities to review along the way.", tags: ["Development", "Updates", "Testing"] },
  { title: "Make it live", body: "Launch, handover, and the information you need to take ownership. Add Care for ongoing upkeep.", tags: ["Launch", "Handover", "Support"] },
]
