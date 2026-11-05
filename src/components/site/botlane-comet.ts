/**
 * The Botlane comet: one lane of the loop, tapering from a hairline into full weight, with a node travelling just
 * ahead of it. Drawn on a ring of radius 210 centred on 0,0; the view box centres the drawn shape, not the ring.
 *
 * Two optical sizes. `small` (below 24px) starts the tail thicker and leaves a wider gap before the node, so both
 * survive in a browser tab. The paths are computed once, here, and shared by the React mark and the static icons.
 */
export const COMET_VIEWBOX = "-300 -327 600 600"

type Optical = "small" | "regular"

const RING = 210
const SPEC: Record<Optical, { start: number; end: number; hairline: number; node: number; nodeAt: number }> = {
  //            tail from → to (degrees, clockwise from 3 o'clock), tail's thinnest half-width, node radius and angle
  regular: { start: 60, end: 322, hairline: 7, node: 64, nodeAt: -6 },
  small: { start: 70, end: 316, hairline: 18, node: 72, nodeAt: -6 },
}
const FULL = 64 // the tail's half-width right behind the node: the lane's full weight

const at = (deg: number, r: number) => {
  const a = (deg * Math.PI) / 180
  return [r * Math.cos(a), r * Math.sin(a)] as const
}
const n = (v: number) => Number(v.toFixed(1))

function build(optical: Optical) {
  const s = SPEC[optical]
  const steps = 96
  const outer: string[] = []
  const inner: string[] = []
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const deg = s.start + (s.end - s.start) * t
    const half = s.hairline + (FULL - s.hairline) * Math.pow(t, 1.3)
    const [ox, oy] = at(deg, RING + half)
    const [ix, iy] = at(deg, RING - half)
    outer.push(`${n(ox)} ${n(oy)}`)
    inner.push(`${n(ix)} ${n(iy)}`)
  }
  const [cx, cy] = at(s.nodeAt, RING)
  return { tail: `M${outer.join("L")}L${inner.reverse().join("L")}Z`, node: { cx: n(cx), cy: n(cy), r: s.node } }
}

export const COMET = { regular: build("regular"), small: build("small") } as const
export const cometOptical = (size: number): Optical => (size < 24 ? "small" : "regular")

/** The comet as a standalone SVG string, for icons and other files generated outside React. */
export function cometSvg({ size, fill, background, padding = 0 }: { size: number; fill: string; background?: string; padding?: number }) {
  const c = COMET[cometOptical(size)]
  const [x, y, w] = COMET_VIEWBOX.split(" ").map(Number)
  const pad = w * padding
  const vb = `${x - pad} ${y - pad} ${w + pad * 2} ${w + pad * 2}`
  const bg = background ? `<rect x="${x - pad}" y="${y - pad}" width="${w + pad * 2}" height="${w + pad * 2}" fill="${background}"/>` : ""
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="${vb}" role="img" aria-label="Botlane">${bg}<path d="${c.tail}" fill="${fill}"/><circle cx="${c.node.cx}" cy="${c.node.cy}" r="${c.node.r}" fill="${fill}"/></svg>`
}
