/**
 * The spotLane "p": the Botlane "b" (botlane-b.ts) turned upside down, so the bowl sits on top and the square drops
 * below it as the p's descender. The square is the "spot", in spotLane's violet. With the dotLane "d" the family
 * reads b, d, p: one letter, three ways round.
 *
 * Same grid as the b, flipped about its middle (y' = 406 - y): stem 84 wide, bowl radius 158 centred at 158,164,
 * counter radius 72. It shares the b's view box, so a b, a d and a p of the same size line up.
 *
 * Two optical sizes, as for the b: `small` (below 24px) shrinks the square and opens the counter so the gap and the
 * hole survive in a browser tab.
 */
type Optical = "small" | "regular"

const STEM = 84
const R = 158
const CX = 158
const CY = 164 // the b's 242, flipped
const FOOT = CY + R // 322: the bowl's foot, where the square begins

const SPEC: Record<Optical, { square: number; counter: number }> = {
  regular: { square: 78, counter: 72 },
  small: { square: 68, counter: 78 },
}

function build(optical: Optical) {
  const s = SPEC[optical]
  // Down the stem from the bowl's middle to the notch, across, then round the bowl anticlockwise from its foot to its leftmost point.
  const letter = `M0 ${FOOT - STEM}H${STEM}V${FOOT}H${CX}A${R} ${R} 0 1 0 0 ${CY}Z`
  const c = s.counter
  const counter = `M${CX - c} ${CY}a${c} ${c} 0 1 0 ${c * 2} 0a${c} ${c} 0 1 0 ${-c * 2} 0Z`
  const sq = s.square
  const square = `M0 ${FOOT}H${sq}V${FOOT + sq}H0Z`
  return { letter: letter + counter, square }
}

export const P = { regular: build("regular"), small: build("small") } as const
export const pOptical = (size: number): Optical => (size < 24 ? "small" : "regular")

export const P_VIEWBOX = "-62 -17 440 440"
export const VIOLET = "#8B7CFF"

/** The p as a standalone SVG string, for icons and other files generated outside React. */
export function pSvg({ size, fill, spot = VIOLET, background, radius = 0, padding = 0, optical = pOptical(size) }: { size: number; fill: string; spot?: string; background?: string; radius?: number; padding?: number; optical?: Optical }) {
  const p = P[optical]
  const [x, y, w] = P_VIEWBOX.split(" ").map(Number)
  const pad = w * padding
  const vb = [x - pad, y - pad, w + pad * 2, w + pad * 2]
  const bg = background ? `<rect x="${vb[0]}" y="${vb[1]}" width="${vb[2]}" height="${vb[3]}" rx="${Number((vb[2] * radius).toFixed(1))}" fill="${background}"/>` : ""
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="${vb.join(" ")}" role="img" aria-label="spotLane">${bg}<path d="${p.letter}" fill="${fill}" fill-rule="evenodd"/><path d="${p.square}" fill="${spot}"/></svg>`
}
