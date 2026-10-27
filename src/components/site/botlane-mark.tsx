import { cn } from "@/lib/utils"

// The Botlane mark: a visor helmet whose shell shows only where light catches its right edge, with two dashes for eyes.
// Geometry from the final logo files (public/brand). Colours come from the --mark-* tokens, so it follows the theme.
export const SHELL = "M4.8 7.2L4.89 6.22L5.16 5.42L5.6 4.8L6.22 4.36L7.02 4.09L8 4L16 4L16.98 4.09L17.78 4.36L18.4 4.8L18.84 5.42L19.11 6.22L19.2 7.2L19.2 14.5L19.05 16.18L18.59 17.56L17.83 18.63L16.76 19.39L15.38 19.85L13.7 20L10.3 20L8.62 19.85L7.24 19.39L6.18 18.63L5.41 17.56L4.95 16.18L4.8 14.5Z M2.1 9.1L2.13 8.82L2.2 8.6L2.33 8.43L2.5 8.3L2.73 8.23L3 8.2L3 8.2L3.28 8.23L3.5 8.3L3.68 8.42L3.8 8.6L3.88 8.82L3.9 9.1L3.9 13.3L3.88 13.58L3.8 13.8L3.68 13.97L3.5 14.1L3.28 14.18L3 14.2L3 14.2L2.73 14.18L2.5 14.1L2.33 13.97L2.2 13.8L2.13 13.58L2.1 13.3Z M20.1 9.1L20.13 8.82L20.2 8.6L20.33 8.42L20.5 8.3L20.73 8.23L21 8.2L21 8.2L21.28 8.23L21.5 8.3L21.67 8.42L21.8 8.6L21.88 8.82L21.9 9.1L21.9 13.3L21.88 13.58L21.8 13.8L21.67 13.98L21.5 14.1L21.28 14.18L21 14.2L21 14.2L20.73 14.18L20.5 14.1L20.33 13.97L20.2 13.8L20.13 13.58L20.1 13.3Z"
export const CREASE = "M5.85 7.62L5.92 6.83L6.14 6.19L6.49 5.69L6.99 5.34L7.63 5.12L8.42 5.05L15.58 5.05L16.37 5.12L17.01 5.34L17.51 5.69L17.86 6.19L18.08 6.83L18.15 7.62L18.15 14.08L18.01 15.57L17.61 16.79L16.93 17.73L15.99 18.41L14.77 18.81L13.28 18.95L10.72 18.95L9.23 18.81L8.01 18.41L7.07 17.73L6.39 16.79L5.99 15.57L5.85 14.08Z"
export const EYES = {
  // Optical sizes: at header and icon sizes the eyes are thicker so they survive.
  small: { d: "M8.25 10.15h1.1a0.65 0.65 0 0 1 0 1.3h-1.1a0.65 0.65 0 0 1 0 -1.3Z M14.65 10.15h1.1a0.65 0.65 0 0 1 0 1.3h-1.1a0.65 0.65 0 0 1 0 -1.3Z", y: [10.15, 11.45] },
  large: { d: "M7.9 10.5h1.8a0.3 0.3 0 0 1 0 0.6h-1.8a0.3 0.3 0 0 1 0 -0.6Z M14.3 10.5h1.8a0.3 0.3 0 0 1 0 0.6h-1.8a0.3 0.3 0 0 1 0 -0.6Z", y: [10.5, 11.1] },
} as const

/** The mark on its own. Use `size` in pixels; below 64px it switches to the small optical size. */
export function BotlaneMark({ size = 24, id = "botlane-mark", className }: { size?: number; id?: string; className?: string }) {
  const small = size < 64
  const eyes = EYES[small ? "small" : "large"]
  return (
    <svg width={size} height={size} viewBox="1 1 22 22" aria-hidden className={cn("shrink-0", className)}>
      <defs>
        <radialGradient id={`${id}-fall`} gradientUnits="userSpaceOnUse" cx="22.2" cy="11.8" r="11">
          <stop offset="0.1" stopColor="#fff" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.5" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id={`${id}-rim`} maskUnits="userSpaceOnUse" x="-2" y="-2" width="28" height="28">
          <rect x="-2" y="-2" width="28" height="28" fill={`url(#${id}-fall)`} />
        </mask>
        <linearGradient id={`${id}-eye`} gradientUnits="userSpaceOnUse" x1="0" y1={eyes.y[0]} x2="0" y2={eyes.y[1]}>
          <stop offset="0" style={{ stopColor: "var(--mark-eye-edge)" }} />
          <stop offset="0.42" style={{ stopColor: "var(--mark-eye-core)" }} />
          <stop offset="1" style={{ stopColor: "var(--mark-eye-base)" }} />
        </linearGradient>
        <filter id={`${id}-glow`} filterUnits="userSpaceOnUse" x="-2" y="-2" width="28" height="28">
          <feGaussianBlur stdDeviation={small ? 0.7 : 0.36} />
        </filter>
      </defs>
      <g fill="none" strokeLinejoin="round" strokeLinecap="round" style={{ stroke: "var(--mark-rim)" }}>
        <g mask={`url(#${id}-rim)`}>
          {!small && <path d={CREASE} strokeWidth={1} vectorEffect="non-scaling-stroke" style={{ stroke: "var(--mark-crease)" }} />}
          <path d={SHELL} strokeWidth={small ? 1.25 : 1} vectorEffect="non-scaling-stroke" />
        </g>
      </g>
      <path d={eyes.d} filter={`url(#${id}-glow)`} style={{ fill: "var(--mark-eye-edge)", opacity: "var(--mark-glow)" }} />
      <path d={eyes.d} fill={`url(#${id}-eye)`} />
    </svg>
  )
}
