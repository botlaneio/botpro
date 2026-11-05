/**
 * The dotLane "d": the Botlane "b" (botlane-b.ts) mirrored, so the stem stands on the right, with the square above it
 * turned into a round dot in dotLane's orchid. Parent and product read as a pair: b and d.
 *
 * Same grid as the b: stem 84 wide, bowl radius 158 centred at 158,242, counter radius 72; the drawing spans 0..316
 * across, so it shares the b's view box. The dot sits over the stem with a small gap.
 *
 * Two optical sizes, as for the b: `small` (below 24px) shrinks the dot and opens the counter so the gap and the
 * hole survive in a browser tab.
 */
type Optical = "small" | "regular"

const STEM = 84
const R = 158
const CX = 158
const CY = 242
const W = CX + R // 316: the right edge, where the stem stands

const SPEC: Record<Optical, { dot: { cx: number; cy: number; r: number }; counter: number }> = {
  regular: { dot: { cx: 276, cy: 42, r: 38 }, counter: 72 },
  small: { dot: { cx: 279, cy: 46, r: 32 }, counter: 78 },
}

function build(optical: Optical) {
  const s = SPEC[optical]
  const top = CY - R // 84: the bowl's top, level with the stem's notch
  // Up the stem from the notch, across to the bowl's top, then round the bowl anticlockwise to its rightmost point.
  const letter = `M${W} ${top + STEM}H${W - STEM}V${top}H${CX}A${R} ${R} 0 1 0 ${W} ${CY}Z`
  const c = s.counter
  const counter = `M${CX - c} ${CY}a${c} ${c} 0 1 0 ${c * 2} 0a${c} ${c} 0 1 0 ${-c * 2} 0Z`
  return { letter: letter + counter, dot: s.dot }
}

export const D = { regular: build("regular"), small: build("small") } as const
export const dOptical = (size: number): Optical => (size < 24 ? "small" : "regular")

// Shared with the b, so a b and a d of the same size line up.
export const D_VIEWBOX = "-62 -17 440 440"
export const ORCHID = "#E36BD3"

/** The d as a standalone SVG string, for icons and other files generated outside React. */
export function dSvg({ size, fill, dot = ORCHID, background, radius = 0, padding = 0, optical = dOptical(size) }: { size: number; fill: string; dot?: string; background?: string; radius?: number; padding?: number; optical?: Optical }) {
  const d = D[optical]
  const [x, y, w] = D_VIEWBOX.split(" ").map(Number)
  const pad = w * padding
  const vb = [x - pad, y - pad, w + pad * 2, w + pad * 2]
  const bg = background ? `<rect x="${vb[0]}" y="${vb[1]}" width="${vb[2]}" height="${vb[3]}" rx="${Number((vb[2] * radius).toFixed(1))}" fill="${background}"/>` : ""
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="${vb.join(" ")}" role="img" aria-label="dotLane">${bg}<path d="${d.letter}" fill="${fill}" fill-rule="evenodd"/><circle cx="${d.dot.cx}" cy="${d.dot.cy}" r="${d.dot.r}" fill="${dot}"/></svg>`
}
