/**
 * Botlane · lanes
 * Botlane itself is a studio: its services live on botlane.io and stay neutral.
 * Lanes are its own products. This is the one place that says which exist, where they live and what
 * colour they carry. Pages, nav, emails and the subdomain router read this.
 * Colours themselves live in globals.css; this file only names the scope.
 */

export type LaneId = "slotlane" | "spotlane" | "dotlane";

export interface Lane {
  id: LaneId;
  name: string;
  status: "live" | "soon";
  /** The class that scopes the lane's colour: wrap its cards, sections and pages in it. */
  scope: "lane-ember" | "lane-teal" | "lane-violet" | "lane-orchid";
  /** Each product's own domain (all three are coming soon there). */
  host: string;
  tagline: string;
  /** The hairline figure that represents it. */
  figure: "pegboard" | "reader" | "dominoes";
}

export const LANES: readonly Lane[] = [
  {
    id: "slotlane",
    name: "slotLane",
    status: "soon",
    scope: "lane-teal",
    host: "slotlane.cloud",
    tagline: "Share one link. People pick a time, and it lands in your calendar.",
    figure: "pegboard",
  },
  {
    id: "spotlane",
    name: "spotLane",
    status: "soon",
    scope: "lane-violet",
    host: "spotlane.cloud",
    tagline: "Invoices, scans and Office files in. Clean, checked data out.",
    figure: "reader",
  },
  {
    id: "dotlane",
    name: "dotLane",
    status: "soon",
    scope: "lane-orchid",
    host: "dotlane.cloud",
    tagline: "Automate the busywork between your tools, your team and your clients.",
    figure: "dominoes",
  },
] as const;

export const laneById = (id: LaneId): Lane => {
  const lane = LANES.find((l) => l.id === id);
  if (!lane) throw new Error(`Unknown lane: ${id}`);
  return lane;
};

/** The lane a request's host belongs to, or null for botlane.io itself. */
export const laneForHost = (host: string): Lane | null =>
  LANES.find((l) => host.split(":")[0] === l.host) ?? null;
