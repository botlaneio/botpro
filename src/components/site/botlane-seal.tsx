import { useId } from "react"

import { cn } from "@/lib/utils"

// The Botlane seal: a dark glass disc holding the circuit bolt, with rings of broken arcs round it. Light falls from
// above and short arcs of light travel round the edge, as on surface-apex. All coordinates share one space
// with the disc's centre at 0,0, so the beams can turn about the origin. The rings read --neutral-12 and the lane colours
// read their own tokens, so the seal follows the theme; the disc stays dark in both themes, like a button that keeps its own material.
const R = 376
const REACH = 512   // half the canvas with the rings on
// Half the canvas with the rings off. The rim's stroke stays at least 1.25px however small the seal gets, so the padding
// grows as the size falls: enough for that stroke and 1px clear on every side.
const neat = (size: number) => Math.ceil(Math.max(R + 26, (R - 2.5) / (1 - ((size < 24 ? 1.75 : 1.25) + 2) / size)))
const LINE = 18.92     // the bolt's line width
const ICON = "M-1.7 -199.3L-1.7 -145.1L36.5 -107.3L-17.2 -41.9L14.6 -17.8L-39.1 47.5L-0.9 85.3L-0.9 139.5M-0.9 196.3L-0.9 259.1M-1.7 -145.1L-118.2 -29.9L-198.6 -29.9M-0.9 85.3L115.7 -29.9L196.1 -29.9M-118.2 -29.9L-71.8 14.8L-152.2 100.8M115.7 -29.9L69.2 -74.6L149.6 -160.6M-215.0 -161.0L-143.2 -161.0L-64.5 -82.3M212.4 101.3L140.6 101.3L61.9 22.6M-30.1 -227.7a28.4 28.4 0 1 0 56.8 0a28.4 28.4 0 1 0 -56.8 0ZM-29.2 167.9a28.4 28.4 0 1 0 56.8 0a28.4 28.4 0 1 0 -56.8 0ZM-255.4 -29.9a28.4 28.4 0 1 0 56.8 0a28.4 28.4 0 1 0 -56.8 0ZM196.1 -29.9a28.4 28.4 0 1 0 56.8 0a28.4 28.4 0 1 0 -56.8 0ZM-227.5 133.5a44.7 44.7 0 1 0 89.4 0a44.7 44.7 0 1 0 -89.4 0ZM135.4 -193.3a44.7 44.7 0 1 0 89.4 0a44.7 44.7 0 1 0 -89.4 0Z"
const BOLT = "M-1.7 -145.1L36.5 -107.3L-17.2 -41.9L14.6 -17.8L-39.1 47.5L-0.9 85.3"  // the spine's zigzag alone, for the tiny size
const TRACES = "M105.3 -297.8L70.9 -263.4L70.9 -179.5L51.6 -160.2L51.6 -133.1M283.8 -99.1L182.7 -99.1L159.1 -77.6L111.8 -77.6M283.8 53.5L167.7 53.5L144.0 31.2L111.8 31.2M-105.3 297.8L-77.4 272.0L-77.4 149.4L-43.9 115.9L-43.9 95.7M101.9 297.8L74.0 272.0L74.0 149.4L48.2 125.8L48.2 84.9"
const RINGS = "M-388.9 75.4C-389.9 68.0 -393.7 45.8 -394.9 30.8C-396.0 15.9 -396.4 0.8 -395.8 -14.2C-395.3 -29.1 -393.9 -44.2 -391.6 -59.0C-389.4 -73.8 -386.3 -88.5 -382.4 -103.0C-378.5 -117.5 -373.8 -131.8 -368.2 -145.7C-362.7 -159.6 -356.4 -173.3 -349.3 -186.5C-342.3 -199.7 -334.5 -212.6 -326.0 -225.0C-317.5 -237.3 -308.2 -249.2 -298.4 -260.5C-288.5 -271.8 -278.8 -282.0 -266.9 -292.7C-255.0 -303.4 -233.6 -319.3 -227.0 -324.6M-189.7 346.9C-198.2 341.5 -225.4 325.8 -240.9 314.2C-256.4 302.5 -269.7 290.3 -282.7 277.1C-295.7 263.8 -307.9 249.4 -318.9 234.4C-329.9 219.4 -343.9 195.0 -348.9 187.2M-317.9 -320.9C-310.3 -327.6 -287.8 -349.1 -272.2 -361.1C-256.7 -373.1 -241.1 -383.4 -224.7 -393.0C-208.2 -402.6 -182.0 -414.4 -173.5 -418.7M276.0 -297.2C282.4 -290.3 302.9 -269.7 314.2 -255.9C325.5 -242.2 334.8 -229.0 343.7 -214.6C352.7 -200.3 363.8 -177.4 367.8 -169.9M16.4 -443.1C22.8 -442.6 43.2 -441.5 55.1 -440.2C67.0 -438.9 77.0 -437.3 87.9 -435.2C98.7 -433.1 114.8 -428.9 120.2 -427.7M395.6 -1.2C395.4 4.6 395.0 23.0 394.2 33.8C393.3 44.7 392.1 53.7 390.5 63.6C388.9 73.4 385.6 88.1 384.7 93.0M-471.5 -16.9C-471.3 -20.4 -470.9 -30.7 -470.4 -37.6C-469.8 -44.4 -469.2 -50.8 -468.4 -58.1C-467.5 -65.5 -465.7 -77.6 -465.1 -81.5M255.6 -403.3C262.2 -398.7 282.4 -385.5 295.1 -375.6C307.7 -365.8 320.0 -355.2 331.6 -344.1C343.2 -333.0 354.2 -321.2 364.6 -309.0C375.0 -296.8 384.9 -283.9 394.0 -270.7C403.1 -257.5 411.6 -243.7 419.3 -229.6C427.0 -215.5 434.0 -201.0 440.3 -186.2C446.5 -171.4 452.0 -156.2 456.7 -140.8C461.4 -125.5 465.4 -109.8 468.5 -94.0C471.6 -78.3 473.9 -62.3 475.4 -46.3C476.9 -30.3 477.6 -14.2 477.5 1.8C477.4 17.9 476.4 34.0 474.7 49.9C473.0 65.9 470.4 81.8 467.0 97.5C463.7 113.2 459.5 128.8 454.6 144.0C449.7 159.2 443.9 174.3 437.5 189.0C431.1 203.6 423.9 218.1 416.0 232.0C408.1 245.9 399.5 259.5 390.2 272.6C381.0 285.6 371.0 298.3 360.5 310.3C350.0 322.4 338.9 333.9 327.2 344.8C315.5 355.8 303.3 366.1 290.6 375.8C277.9 385.5 264.6 394.6 251.0 402.9C237.4 411.3 223.3 418.9 209.0 425.9C194.6 432.8 179.9 439.0 164.9 444.5C149.9 449.9 134.6 454.6 119.2 458.5C103.7 462.4 88.0 465.5 72.3 467.9C56.5 470.2 40.6 471.7 24.7 472.5C8.9 473.2 -7.1 473.1 -23.0 472.3C-38.9 471.4 -54.8 469.7 -70.5 467.3C-86.1 464.8 -101.8 461.6 -117.1 457.6C-132.5 453.6 -147.7 448.7 -162.6 443.2C-177.5 437.7 -192.1 431.4 -206.3 424.4C-220.6 417.4 -234.5 409.7 -248.0 401.3C-261.4 392.9 -274.5 383.8 -287.1 374.1C-299.6 364.4 -311.8 354.1 -323.3 343.2C-334.8 332.3 -345.8 320.8 -356.2 308.8C-366.5 296.8 -376.3 284.3 -385.5 271.3C-394.6 258.4 -403.1 244.9 -410.9 231.1C-418.6 217.3 -425.7 203.0 -432.1 188.5C-438.5 174.0 -446.2 151.5 -449.0 144.0M-401.4 202.1C-405.1 193.5 -417.4 168.0 -423.7 150.3C-430.0 132.7 -435.2 114.5 -439.2 96.2C-443.3 77.9 -446.2 59.2 -447.9 40.5C-449.6 21.9 -450.2 2.9 -449.6 -15.8C-449.0 -34.5 -445.2 -62.6 -444.3 -71.9"
const WORD = "M357 12Q301.2 12 259.4 -12.1Q217.6 -36.2 194.6 -79.2L191.6 0H70.4V-710H198.4V-458.4Q219.6 -494.6 260.8 -520.3Q302 -546 357 -546Q425.8 -546 476.2 -511.6Q526.6 -477.2 554.2 -414.6Q581.8 -352 581.8 -267Q581.8 -182 554.2 -119.4Q526.6 -56.8 476.2 -22.4Q425.8 12 357 12ZM327.6 -91.6Q383 -91.6 416.2 -138.2Q449.4 -184.8 449.4 -267Q449.4 -349.8 416.6 -396.1Q383.8 -442.4 328.8 -442.4Q287.8 -442.4 258.4 -421.7Q229 -401 213.7 -361.8Q198.4 -322.6 198.4 -267Q198.4 -213 213.7 -173.5Q229 -134 258.1 -112.8Q287.2 -91.6 327.6 -91.6ZM877.8 12Q798.8 12 739.6 -22.4Q680.4 -56.8 647.8 -119.7Q615.2 -182.6 615.2 -267Q615.2 -352 647.8 -414.4Q680.4 -476.8 739.6 -511.4Q798.8 -546 877.8 -546Q956.8 -546 1015.7 -511.4Q1074.6 -476.8 1107.2 -414.4Q1139.8 -352 1139.8 -267Q1139.8 -182.6 1107.2 -119.7Q1074.6 -56.8 1015.7 -22.4Q956.8 12 877.8 12ZM877.8 -91.6Q939.6 -91.6 973.5 -137.9Q1007.4 -184.2 1007.4 -267Q1007.4 -349.4 973.5 -395.9Q939.6 -442.4 877.8 -442.4Q816 -442.4 781.8 -395.9Q747.6 -349.4 747.6 -267Q747.6 -184.2 781.8 -137.9Q816 -91.6 877.8 -91.6ZM1417.6 0Q1338 0 1300.5 -36.8Q1263 -73.6 1263 -152.8V-659.2H1391V-165.2Q1391 -127.6 1407.2 -113.4Q1423.4 -99.2 1456.8 -99.2H1532V0ZM1179.4 -434.8V-534H1532V-434.8ZM1714.4 0Q1655.6 0 1621 -30Q1586.4 -60 1586.4 -126.4V-710H1714.4V-139.4Q1714.4 -118.6 1724.7 -108.9Q1735 -99.2 1754.2 -99.2H1793.4V0ZM1992.6 12Q1909.4 12 1858.3 -26.4Q1807.2 -64.8 1807.2 -133.6Q1807.2 -203.2 1850.2 -242Q1893.2 -280.8 1980.6 -298L2158.2 -332.6Q2158.2 -389.6 2132.1 -418.2Q2106 -446.8 2055.4 -446.8Q2008.8 -446.8 1982.2 -425.5Q1955.6 -404.2 1946.4 -363.8L1816.2 -370.4Q1831.6 -454.6 1893.7 -500.3Q1955.8 -546 2055.4 -546Q2169.4 -546 2227.8 -488.7Q2286.2 -431.4 2286.2 -324.4V-129.8Q2286.2 -108.6 2293.5 -100.9Q2300.8 -93.2 2315.8 -93.2H2332.8V0Q2326.8 1.8 2313.4 3.1Q2300 4.4 2286.4 4.4Q2253.2 4.4 2227.3 -6.5Q2201.4 -17.4 2187 -43.5Q2172.6 -69.6 2172.6 -115.6L2184.2 -108Q2175.6 -72.8 2149.4 -45.5Q2123.2 -18.2 2083 -3.1Q2042.8 12 1992.6 12ZM2019 -81.2Q2061.6 -81.2 2092.7 -97.9Q2123.8 -114.6 2141 -144.9Q2158.2 -175.2 2158.2 -215.6V-245.6L2019.8 -217.6Q1977.4 -209.2 1958.5 -191.5Q1939.6 -173.8 1939.6 -145.6Q1939.6 -115 1960.3 -98.1Q1981 -81.2 2019 -81.2ZM2373.4 0V-534H2489.2L2494.2 -384.2L2478.6 -390.4Q2487 -446.2 2511.8 -480.3Q2536.6 -514.4 2572.9 -530.2Q2609.2 -546 2652.2 -546Q2711.2 -546 2751.5 -520.2Q2791.8 -494.4 2812.7 -448.9Q2833.6 -403.4 2833.6 -343.4V0H2705.6V-302.2Q2705.6 -347.2 2696.9 -378.3Q2688.2 -409.4 2667.8 -425.7Q2647.4 -442 2613 -442Q2561.6 -442 2531.5 -406.1Q2501.4 -370.2 2501.4 -302.2V0ZM3159.6 12Q3079.8 12 3021.1 -22.4Q2962.4 -56.8 2930.3 -119.7Q2898.2 -182.6 2898.2 -267Q2898.2 -351.4 2930.3 -413.8Q2962.4 -476.2 3020.5 -511.1Q3078.6 -546 3157.2 -546Q3233.4 -546 3290.6 -511.9Q3347.8 -477.8 3379.1 -413.8Q3410.4 -349.8 3410.4 -260V-231.4H3031Q3034.8 -160.8 3069.3 -125.6Q3103.8 -90.4 3161.2 -90.4Q3204 -90.4 3232.3 -109.5Q3260.6 -128.6 3272 -163.8L3402.8 -155.6Q3381.4 -78.2 3316.7 -33.1Q3252 12 3159.6 12ZM3031 -317.4H3277.6Q3273.6 -382.4 3240.9 -413.8Q3208.2 -445.2 3157.2 -445.2Q3105.8 -445.2 3072.3 -412.3Q3038.8 -379.4 3031 -317.4Z"
const WORD_WIDTH = 3450
const WORD_XHEIGHT = 534
const UNITS = 1000
const NODES = [[1.4, -443.7, 15], [-329.1, -311, 15], [-216.1, -331.8, 13], [266.8, -306.3, 13], [395.6, -14.2, 13], [-463.3, -96.4, 15], [-178.1, 352.8, 13]] as const
// Three arcs of the rings, spaced about a third of a turn apart, that can each carry a lane. Each runs out to its own node.
const SLOTS = [
  { arc: "M-237.8 -410.8C-230.7 -414.5 -209.7 -426.4 -195.2 -433.1C-180.6 -439.8 -166.2 -445.7 -150.5 -451.0C-134.8 -456.3 -109.3 -462.8 -101.1 -465.1", node: [-86.4, -468.2, 15], tail: [-237.8, -410.8] },
  { arc: "M385.3 218.9C379.1 228.0 361.3 257.1 348.0 274.0C334.7 290.9 320.6 305.9 305.3 320.3C290.1 334.6 273.6 348.0 256.5 360.0C239.4 372.0 211.5 386.8 202.5 392.2", node: [392, 205.4, 15], tail: [202.5, 392.2] },
  { arc: "M77.5 433.7C69.2 434.6 44.2 438.3 27.6 439.2C10.9 440.2 -6.0 440.1 -22.7 439.1C-39.3 438.2 -56.1 436.2 -72.5 433.4C-89.0 430.5 -105.3 426.7 -121.3 422.0C-137.4 417.3 -153.2 411.7 -168.6 405.2C-183.9 398.7 -199.0 391.4 -213.5 383.2C-228.1 375.0 -242.2 366.0 -255.7 356.2C-269.2 346.5 -282.3 335.9 -294.6 324.7C-306.9 313.5 -317.9 302.7 -329.6 289.0C-341.3 275.2 -359.1 250.1 -364.9 242.4", node: [-372.9, 229.6, 15], tail: [77.5, 433.7] },
] as const
const TRACE_ENDS = [[51.6, -133.1], [111.8, -77.6], [111.8, 31.2], [-43.9, 95.7], [48.2, 84.9]] as const
const TRACE_PADS = [[283.8, -99.1], [283.8, 53.5]] as const
const TICKS = Array.from({ length: 120 }, (_, i) => {
  const a = (i * Math.PI) / 60, c = Math.cos(a), s = Math.sin(a), to = R - (i % 10 === 0 ? 30 : 22), from = R - 15
  return `M${(c * from).toFixed(1)} ${(s * from).toFixed(1)}L${(c * to).toFixed(1)} ${(s * to).toFixed(1)}`
}).join("")

// Botlane's blue and the three product lanes. `live` leans toward the page's text colour, so the rings stay strong on
// white as well as on black; the disc stays dark in both
// themes, so the beams use the dark values directly.
const LANE = {
  brand: { live: "var(--brand, #4F7BFF)", solid: "#4F7BFF", lit: "#9DB5FF" },
  teal: { live: "color-mix(in srgb, var(--teal-solid, #2DD4BF), var(--neutral-12, #EDEEF0) 24%)", solid: "#2DD4BF", lit: "#99EDE1" },
  violet: { live: "color-mix(in srgb, var(--violet-solid, #8B7CFF), var(--neutral-12, #EDEEF0) 24%)", solid: "#8B7CFF", lit: "#C4BCFF" },
  orchid: { live: "color-mix(in srgb, var(--orchid-solid, #E36BD3), var(--neutral-12, #EDEEF0) 24%)", solid: "#E36BD3", lit: "#F4B9EC" },
} as const
export type SealLane = keyof typeof LANE
const BOTLANE: readonly SealLane[] = ["brand"]

// Beams share the edge evenly: the first head sits here, in degrees clockwise from the right, and each beam is shorter the more there are.
const BEAM_HEAD = -48, BEAM_LENGTH = { 1: 104, 2: 80, 3: 62 } as const
const EDGE = R - 2.5
const at = (deg: number) => [+(EDGE * Math.cos((deg * Math.PI) / 180)).toFixed(1), +(EDGE * Math.sin((deg * Math.PI) / 180)).toFixed(1)] as const
const beam = (index: number, count: 1 | 2 | 3) => {
  const head = BEAM_HEAD + (index * 360) / count
  const [x1, y1] = at(head - BEAM_LENGTH[count]), [x2, y2] = at(head)
  return { x1, y1, x2, y2, d: `M${x1} ${y1}A${EDGE} ${EDGE} 0 0 1 ${x2} ${y2}` }
}

const MOTION = `@keyframes seal-turn { to { transform: rotate(360deg) } }
[data-seal-beam] { transform-box: view-box; transform-origin: 0 0; animation: seal-turn 7s linear infinite }
@media (prefers-reduced-motion: reduce) { [data-seal-beam] { animation: none } }`

export type SealTone = "theme" | "white"
export type SealOptical = "tiny" | "small" | "medium" | "large"

/** Which drawing suits a disc this many pixels across: fine detail only appears where there are pixels to hold it. */
const opticalFor = (disc: number): SealOptical => (disc < 24 ? "tiny" : disc < 48 ? "small" : disc < 120 ? "medium" : "large")

/**
 * The seal. `size` is in pixels. Below 160px the rings are left off unless `rings` asks for them, because they turn to
 * dust; the disc then fills the size, less a small padding. The drawing follows the disc's real width on screen:
 *
 *   tiny    under 24px   the zigzag alone, heavy and still, on the disc
 *   small   24 to 47px   heavy circuit, no traces or ticks, and a still beam
 *   medium  48 to 119px  bolt with a hard contour, plus 1px traces
 *   large   120px up     full metal bevel, traces and the tick ring
 *
 * Hairlines use non-scaling strokes, so they stay exact device-pixel lines at any size.
 *
 * `lanes` picks the colours, one to three, in order: by default Botlane's blue alone, which is the logo. Each
 * lane lights one arc of the rings and one beam on the disc's edge, so `lanes={["teal"]}` is the seal for Syncc alone,
 * for use inside that product's own scope. The beams turn once every 7 seconds and stop under reduced motion;
 * pass `animated={false}` for a still seal. `tone="white"` is the one-colour version for dark backgrounds and photos:
 * all white, no lanes, no glass fill and no motion.
 */
export function BotlaneSeal({ size = 64, rings, animated = true, optical, lanes = BOTLANE, tone = "theme", className, label }: { size?: number; rings?: boolean; animated?: boolean; optical?: SealOptical; lanes?: readonly SealLane[]; tone?: SealTone; className?: string; label?: string }) {
  const id = useId().replace(/:/g, "")
  const showRings = rings ?? size >= 160
  const half = showRings ? REACH : neat(size)
  const px = size / (half * 2)   // pixels per unit
  const look = optical ?? opticalFor(showRings ? R * 2 * px : size)
  const tiny = look === "tiny", small = tiny || look === "small", large = look === "large"
  const line = LINE * (tiny ? 3.4 : small ? 1.75 : large ? 1 : 1.3)
  const art = tiny ? BOLT : ICON
  const lit = (lanes.length ? lanes.slice(0, 3) : ["brand" as const]) as readonly SealLane[]
  const count = lit.length as 1 | 2 | 3
  const lift = (w: number) => Math.max(tiny ? 1.75 : 1.25, w * px)
  const white = tone === "white"
  const moving = animated && !small && !white
  const paint = (lane: SealLane) => (white ? "#fff" : LANE[lane].live)
  const ink = white ? "#fff" : "var(--neutral-12, #EDEEF0)"
  return (
    <svg
      width={size} height={size} viewBox={`${-half} ${-half} ${half * 2} ${half * 2}`} shapeRendering="geometricPrecision"
      role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true} className={cn("shrink-0", className)}
    >
      {moving && <style>{MOTION}</style>}
      <defs>
        <linearGradient id={`${id}-ring`} gradientUnits="userSpaceOnUse" x1="0" y1="-540" x2="0" y2="540">
          <stop offset="0" style={{ stopColor: ink }} />
          <stop offset="1" stopOpacity={white ? 1 : 0.62} style={{ stopColor: ink }} />
        </linearGradient>
        {lit.map((lane, i) => (
          <linearGradient key={lane} id={`${id}-arc${i}`} gradientUnits="userSpaceOnUse" x1={SLOTS[i].tail[0]} y1={SLOTS[i].tail[1]} x2={SLOTS[i].node[0]} y2={SLOTS[i].node[1]}>
            <stop offset="0" stopOpacity="0.5" style={{ stopColor: paint(lane) }} />
            <stop offset="1" style={{ stopColor: paint(lane) }} />
          </linearGradient>
        ))}
        <linearGradient id={`${id}-glass`} gradientUnits="userSpaceOnUse" x1="0" y1={-R} x2="0" y2={R}>
          <stop offset="0" stopColor="#121417" />
          <stop offset="0.5" stopColor="#0A0B0D" />
          <stop offset="1" stopColor="#060708" />
        </linearGradient>
        <radialGradient id={`${id}-fall`} gradientUnits="userSpaceOnUse" cx="0" cy="0" r="1" gradientTransform={`translate(0 ${-R}) scale(${R * 1.15} ${R * 0.83})`}>
          <stop offset="0" stopColor="#4F7BFF" stopOpacity="0.2" />
          <stop offset="0.55" stopColor="#4F7BFF" stopOpacity="0.045" />
          <stop offset="1" stopColor="#4F7BFF" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-edge`} gradientUnits="userSpaceOnUse" x1="0" y1={-R} x2="0" y2={R}>
          <stop offset="0" stopColor="#fff" />
          <stop offset="0.35" stopColor="#B6BAC2" stopOpacity="0.75" />
          <stop offset="0.8" stopColor="#6C727E" stopOpacity="0.7" />
          <stop offset="1" stopColor="#C7CBD1" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id={`${id}-metal`} gradientUnits="userSpaceOnUse" x1="0" y1="-310" x2="0" y2="310">
          <stop offset="0" stopColor={large ? "#E8E9EC" : "#FCFCFD"} />
          <stop offset="0.55" stopColor={large ? "#C7CBD1" : "#E0E2E6"} />
          <stop offset="1" stopColor={large ? "#868C97" : "#AEB3BB"} />
        </linearGradient>
        {lit.map((lane, i) => {
          const b = beam(i, count)
          return (
            <linearGradient key={lane} id={`${id}-beam${i}`} gradientUnits="userSpaceOnUse" x1={b.x1} y1={b.y1} x2={b.x2} y2={b.y2}>
              <stop offset="0" stopColor={LANE[lane].solid} stopOpacity="0" />
              <stop offset="0.4" stopColor={LANE[lane].solid} />
              <stop offset="0.86" stopColor={LANE[lane].solid} />
              <stop offset="1" stopColor={LANE[lane].lit} />
            </linearGradient>
          )
        })}
        <filter id={`${id}-blur`} filterUnits="userSpaceOnUse" x={-half} y={-half} width={half * 2} height={half * 2}><feGaussianBlur stdDeviation="5" /></filter>
        <filter id={`${id}-soft`} filterUnits="userSpaceOnUse" x={-R} y={-R} width={R * 2} height={R * 2}><feGaussianBlur stdDeviation="3" /></filter>
        <clipPath id={`${id}-in`}><circle r={R - 1} /></clipPath>
        {large && (
          <mask id={`${id}-inner`} maskUnits="userSpaceOnUse" x={-R} y={-R} width={R * 2} height={R * 2}>
            <path d={art} fill="none" stroke="#fff" strokeWidth={line - 3} strokeLinecap="round" strokeLinejoin="round" />
          </mask>
        )}
      </defs>

      {showRings && (
        <g fill="none" strokeLinecap="round">
          <g stroke={`url(#${id}-ring)`}>
            <path d={RINGS} strokeWidth={Math.max(1, 4.6 * px)} vectorEffect="non-scaling-stroke" />
            {NODES.map(([cx, cy, r]) => <circle key={`${cx},${cy}`} cx={cx} cy={cy} r={r} strokeWidth={Math.max(1, 4.6 * px)} vectorEffect="non-scaling-stroke" />)}
          </g>
          <g fill={`url(#${id}-ring)`}>{NODES.map(([cx, cy, r]) => <circle key={`${cx},${cy}`} cx={cx} cy={cy} r={r * 0.36} />)}</g>
          {SLOTS.map((slot, i) => {
            const lane = white ? undefined : lit[i], [cx, cy, r] = slot.node
            const width = lane ? lift(5) : Math.max(1, 4.6 * px)
            return (
              <g key={i}>
                <path d={slot.arc} stroke={`url(#${id}-${lane ? `arc${i}` : "ring"})`} strokeWidth={width} vectorEffect="non-scaling-stroke" />
                <circle cx={cx} cy={cy} r={r} strokeWidth={width} vectorEffect="non-scaling-stroke" style={{ stroke: lane ? paint(lane) : `url(#${id}-ring)` }} />
                <circle cx={cx} cy={cy} r={lane ? 10 : r * 0.36} style={{ fill: lane ? paint(lane) : `url(#${id}-ring)` }} />
              </g>
            )
          })}
        </g>
      )}

      {!white && (
        <>
          <circle r={R} fill={`url(#${id}-glass)`} />
          <circle r={R} fill={`url(#${id}-fall)`} />
        </>
      )}
      <g clipPath={`url(#${id}-in)`} fill="none" strokeLinecap="round" strokeLinejoin="round">
        {large && !white && (
          <>
            <path d={TICKS} stroke="#fff" strokeOpacity="0.2" strokeWidth="1" strokeLinecap="butt" vectorEffect="non-scaling-stroke" />
            <circle r={R - 36} stroke="#fff" strokeOpacity="0.1" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          </>
        )}
        {!small && (
          <>
            <path d={TRACES} stroke={white ? "#fff" : "#8B919C"} strokeWidth={Math.max(1, 4 * px)} vectorEffect="non-scaling-stroke" />
            <g fill={white ? "#fff" : "#8B919C"} stroke="none">
              {TRACE_ENDS.map(([cx, cy]) => <circle key={`${cx},${cy}`} cx={cx} cy={cy} r="6" />)}
              {TRACE_PADS.map(([x, y]) => <rect key={`${x},${y}`} x={x - 6} y={y - 6} width="12" height="12" rx="2" />)}
            </g>
          </>
        )}
        {!white && <path d={art} stroke="#000" strokeOpacity="0.75" strokeWidth={line} transform="translate(0 6)" filter={`url(#${id}-soft)`} />}
        {!white && <path d={art} stroke="#050607" strokeWidth={line + 5} />}
        <path d={art} stroke={white ? "#fff" : `url(#${id}-metal)`} strokeWidth={line} />
        {large && !white && (
          <g mask={`url(#${id}-inner)`}>
            <path d={art} stroke="#fff" strokeWidth={line * 0.26} strokeLinecap="butt" transform={`translate(0 ${-line * 0.2})`} />
          </g>
        )}
      </g>
      <circle r={R - 2.5} fill="none" stroke={white ? "#fff" : `url(#${id}-edge)`} strokeWidth={Math.max(1, 5 * px)} vectorEffect="non-scaling-stroke" />
      {!white && <g data-seal-beam={moving ? "" : undefined} fill="none" strokeLinecap="round">
        {lit.map((lane, i) => {
          const { d } = beam(i, count)
          return (
            <g key={lane}>
              <path d={d} stroke={LANE[lane].solid} strokeOpacity="0.8" strokeWidth="11" filter={`url(#${id}-blur)`} />
              <path d={d} stroke={`url(#${id}-beam${i})`} strokeWidth={lift(7)} vectorEffect="non-scaling-stroke" />
            </g>
          )
        })}
      </g>}
    </svg>
  )
}

/** The seal beside the wordmark, for the nav, footer and documents. `height` is the seal's size; the word follows the text colour. */
export function BotlaneLockup({ height = 32, animated = false, lanes, tone, className, label = "Botlane" }: { height?: number; animated?: boolean; lanes?: readonly SealLane[]; tone?: SealTone; className?: string; label?: string }) {
  const type = height * 0.72, width = (WORD_WIDTH / UNITS) * type, xHeight = (WORD_XHEIGHT / UNITS) * type
  return (
    <span role="img" aria-label={label} className={cn("inline-flex items-center", className)} style={{ gap: height * 0.3, color: tone === "white" ? "#fff" : undefined }}>
      <BotlaneSeal size={height} rings={false} animated={animated} lanes={lanes} tone={tone} />
      <svg width={width} height={height} viewBox={`0 0 ${WORD_WIDTH} ${(height / type) * UNITS}`} aria-hidden className="shrink-0" fill="currentColor">
        <path d={WORD} transform={`translate(0 ${((height / type) * UNITS) / 2 + (xHeight / type) * UNITS / 2})`} />
      </svg>
    </span>
  )
}
