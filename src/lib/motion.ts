/**
 * Botlane · motion tokens, for Motion (Framer Motion).
 * Two clocks, the same as the hairline figures:
 *   - a discrete change (which item, open or closed) gets a 700ms ease-out;
 *   - a continuous input (where the pointer is, a scroll position) gets a spring,
 *     because its target moves every frame and a timed ease would always be chasing it.
 * CSS equivalents live in globals.css (--ease-lift, --duration-lift, --stagger).
 */

export const ease = {
  lift: [0.32, 0.72, 0, 1] as const,
  out: [0.5, 0, 0.1, 1] as const,
};

export const duration = {
  fast: 0.15,
  base: 0.26,
  lift: 0.7,
};

/** The pointer and scroll spring: stiffness 100, damping 18, mass 1. */
export const spring = { type: "spring", stiffness: 100, damping: 18, mass: 1 } as const;

/** Discrete change: which tab, which card, open or closed. */
export const lift = { duration: duration.lift, ease: ease.lift } as const;

/** Stagger by distance from the item touched, never by list order: delay = |i − a| × step. */
export const stagger = (i: number, from: number, step = 0.045) => Math.abs(i - from) * step;
