/**
 * The slotLane "slot through the ring" mark. Geometry matches slotLane's src/brand/logo-parts.js
 * and the supplied SVG, with a 158/72-radius even-odd ring and a 236-by-62 teal pill.
 */
export const CAL_VIEWBOX = "-20 5 396 396"
export const CAL = {
  ring: "M0 203a158 158 0 1 0 316 0a158 158 0 1 0 -316 0ZM86 203a72 72 0 1 0 144 0a72 72 0 1 0 -144 0Z",
  slot: { x: 120, y: 172, width: 236, height: 62, rx: 31 },
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
  const s = CAL.slot
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="${vb.join(" ")}" role="img" aria-label="slotLane">${bg}<path d="${CAL.ring}" fill="${ink}" fill-rule="evenodd"/><rect x="${s.x}" y="${s.y}" width="${s.width}" height="${s.height}" rx="${s.rx}" fill="${slot}"/></svg>`
}
