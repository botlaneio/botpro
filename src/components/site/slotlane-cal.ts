/**
 * The slotLane mark: a calendar page with its two rings, and one booked slot across it in teal. The same geometry as
 * the slotLane app's own logo (slotlane repo, src/brand/logo-parts.js), on its 64 grid.
 *
 * The app draws it in a 0 0 64 64 box with room around it. Here the box is cropped to the drawing (6..58 across,
 * 7..58 down), so at the same size it fills its square as fully as the b, the d and the p beside it.
 */
export const CAL_VIEWBOX = "4 4.5 56 56"
export const CAL = {
  frame: { x: 8.5, y: 14.5, width: 47, height: 41, rx: 10.5, strokeWidth: 5 },
  rings: [
    { x: 18.5, y: 7, width: 5, height: 13, rx: 2.5 },
    { x: 40.5, y: 7, width: 5, height: 13, rx: 2.5 },
  ],
  slot: { x: 16, y: 29.5, width: 32, height: 12, rx: 6 },
} as const
/** The slot's teal: deeper on light backgrounds, brighter on dark (the app's own two shades). */
export const SLOT_LIGHT = "#0D9488"
export const SLOT_DARK = "#2DD4BF"

/** The mark as a standalone SVG string, for icons and other files generated outside React. */
export function calSvg({ size, ink, slot = SLOT_LIGHT, background, radius = 0, padding = 0 }: { size: number; ink: string; slot?: string; background?: string; radius?: number; padding?: number }) {
  const [x, y, w] = CAL_VIEWBOX.split(" ").map(Number)
  const pad = w * padding
  const vb = [x - pad, y - pad, w + pad * 2, w + pad * 2]
  const bg = background ? `<rect x="${vb[0]}" y="${vb[1]}" width="${vb[2]}" height="${vb[3]}" rx="${Number((vb[2] * radius).toFixed(2))}" fill="${background}"/>` : ""
  const f = CAL.frame, s = CAL.slot
  const rings = CAL.rings.map((r) => `<rect x="${r.x}" y="${r.y}" width="${r.width}" height="${r.height}" rx="${r.rx}" fill="${ink}"/>`).join("")
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="${vb.join(" ")}" role="img" aria-label="slotLane">${bg}<rect x="${f.x}" y="${f.y}" width="${f.width}" height="${f.height}" rx="${f.rx}" fill="none" stroke="${ink}" stroke-width="${f.strokeWidth}"/>${rings}<rect x="${s.x}" y="${s.y}" width="${s.width}" height="${s.height}" rx="${s.rx}" fill="${slot}"/></svg>`
}
