"use client"

import { useRef, type ReactNode } from "react"
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react"

/** An original, restrained scroll-zoom treatment; the surrounding copy stays in normal flow. */
export function CoreHeroPreview({ children }: { children: ReactNode }) {
  const target = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target, offset: ["start 70%", "end 10%"] })
  const scale = useTransform(scrollYProgress, [0, 0.65, 1], [0.94, 1, 1.025])
  const y = useTransform(scrollYProgress, [0, 1], [18, -12])
  const rotateX = useTransform(scrollYProgress, [0, 0.65, 1], [5, 0, -1])
  const glowOpacity = useTransform(scrollYProgress, [0, 0.65, 1], [0.35, 0.65, 0.4])

  return <div ref={target} className="relative isolate min-w-0 py-6 [perspective:1400px] sm:py-10">
    <motion.div aria-hidden className="pointer-events-none absolute inset-x-0 top-[12%] bottom-[8%] -z-10 rounded-full bg-[radial-gradient(ellipse_at_center,color-mix(in_oklch,var(--brand)_24%,transparent),transparent_70%)] blur-2xl" style={{ opacity: reduced ? 0.45 : glowOpacity }} />
    <motion.div className="origin-center motion-reduce:transform-none!" style={reduced ? undefined : { scale, y, rotateX }}>
      {children}
    </motion.div>
  </div>
}
