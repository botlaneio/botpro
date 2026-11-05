/**
 * The Botlane "b": a solid lowercase b whose ascender is broken off into one square, like a slot or a pixel set
 * above the letter. One flat shape in one colour, so it follows the text colour and any tile it sits on.
 *
 * Drawn on a grid where the stem and the square are 84 wide: the bowl is a circle of radius 158 centred at 158,242
 * (so its left edge lines up with the stem), with a round counter of radius 72. The square sits up and to the left,
 * touching the bowl only across a small diagonal gap.
 *
 * Two optical sizes. `small` (below 24px) shrinks the square and opens the counter a touch, so the gap and the hole
 * both survive in a browser tab. The paths are built once, here, and shared by the React mark and the static icons.
 */
type Optical = "small" | "regular"

const STEM = 84 // stem width, and the square's full size
const R = 158 // bowl radius
const CX = 158
const CY = 242 // so the bowl's top (CY - R) sits level with the square's foot

const SPEC: Record<Optical, { square: number; counter: number }> = {
  //        square side (its gap to the bowl grows as it shrinks), counter radius
  regular: { square: 78, counter: 72 },
  small: { square: 68, counter: 78 },
}

const n = (v: number) => Number(v.toFixed(1))

function build(optical: Optical) {
  const s = SPEC[optical]
  const top = CY - R // 84: where the square ends and the bowl begins
  // The letter: up the stem to the notch, across, round the bowl clockwise from the top to its leftmost point.
  const letter = `M0 ${top + STEM}H${STEM}V${top}H${CX}A${R} ${R} 0 1 1 0 ${CY}Z`
  // The counter as its own sub-path; the even-odd rule cuts it out.
  const c = s.counter
  const counter = `M${CX - c} ${CY}a${c} ${c} 0 1 0 ${c * 2} 0a${c} ${c} 0 1 0 ${-c * 2} 0Z`
  const sq = s.square
  const square = `M0 ${n(top - sq)}H${sq}V${top}H0Z`
  return `${square}${letter}${counter}`
}

export const B = { regular: build("regular"), small: build("small") } as const
export const bOptical = (size: number): Optical => (size < 24 ? "small" : "regular")

// The drawing spans 0..316 across and 6..400 down; the square view box centres it with a little air.
export const B_VIEWBOX = "-62 -17 440 440"

/**
 * The b as a standalone SVG string, for icons and other files generated outside React. `optical` overrides the
 * size-based choice, e.g. "small" for a favicon file that browsers draw at 16px.
 */
export function bSvg({ size, fill, background, radius = 0, padding = 0, optical = bOptical(size) }: { size: number; fill: string; background?: string; radius?: number; padding?: number; optical?: Optical }) {
  const [x, y, w] = B_VIEWBOX.split(" ").map(Number)
  const pad = w * padding
  const vb = [x - pad, y - pad, w + pad * 2, w + pad * 2]
  const bg = background ? `<rect x="${vb[0]}" y="${vb[1]}" width="${vb[2]}" height="${vb[3]}" rx="${n(vb[2] * radius)}" fill="${background}"/>` : ""
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="${vb.join(" ")}" role="img" aria-label="Botlane">${bg}<path d="${B[optical]}" fill="${fill}" fill-rule="evenodd"/></svg>`
}
