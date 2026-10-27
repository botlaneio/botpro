/**
 * Botlane · lanes
 * The one place that says which products exist, where they live and what
 * colour they carry. Pages, nav, emails and the subdomain router read this.
 * Colours themselves live in globals.css; this file only names the scope.
 */

export type LaneId = "buildlane" | "syncc" | "scriblane" | "flowlane";

export interface Lane {
  id: LaneId;
  name: string;
  kind: "service" | "product";
  status: "live" | "soon";
  /** The class that scopes the lane's colour: wrap its cards, sections and pages in it. */
  scope: "lane-ember" | "lane-teal" | "lane-violet" | "lane-orchid";
  /** Where it lives. Services stay on botlane.io; products get a subdomain. */
  host: string;
  tagline: string;
  /** The hairline figure that represents it. */
  figure: "sections" | "pegboard" | "reader" | "dominoes";
}

export const LANES: readonly Lane[] = [
  {
    id: "buildlane",
    name: "Buildlane",
    kind: "service",
    status: "live",
    scope: "lane-ember",
    host: "botlane.io",
    tagline: "Ultra-premium websites and web apps, designed and built end to end.",
    figure: "sections",
  },
  {
    id: "syncc",
    name: "Syncc",
    kind: "product",
    status: "live",
    scope: "lane-teal",
    host: "syncc.botlane.io",
    tagline: "Share one link. People pick a time, and it lands in your calendar.",
    figure: "pegboard",
  },
  {
    id: "scriblane",
    name: "Scriblane",
    kind: "product",
    status: "live",
    scope: "lane-violet",
    host: "scriblane.botlane.io",
    tagline: "Turn contracts, notices and statements into clean data your firm can search.",
    figure: "reader",
  },
  {
    id: "flowlane",
    name: "Flowlane",
    kind: "product",
    status: "soon",
    scope: "lane-orchid",
    host: "flowlane.botlane.io",
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
  LANES.find((l) => l.kind === "product" && host.split(":")[0] === l.host) ?? null;
