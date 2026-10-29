import { cn } from "@/lib/utils"

// Beams of blue falling diagonally, as in the site's ambient light but a little brighter, since this stage is
// always dark. Each is [top, height, colour, strength, blur], measured along a band turned 28°.
const BEAMS: [top: string, height: string, colour: string, alpha: number, blur: number][] = [
  ["6%", "10rem", "#12306E", 0.5, 90],
  ["18%", "2.5rem", "#3A64B8", 0.22, 30],
  ["32%", "7rem", "#1B3C80", 0.32, 80],
  ["47%", "1.75rem", "#3A64B8", 0.14, 24],
  ["60%", "12rem", "#061B41", 0.5, 110],
]

/**
 * The contact page's backdrop: near-black, a deep blue pool of light behind the form, beams of blue falling
 * across it, and a fine grain so the gradients don't band. Decorative; the pool drifts slowly, and is still
 * under reduced motion.
 */
export function ContactLight({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute overflow-hidden bg-[#050506]", className)}>
      <div className="contact-pool absolute top-[-20%] left-[10%] h-[95%] w-[80%] rounded-full bg-[radial-gradient(closest-side,rgb(44_87_165/0.55),rgb(6_27_65/0.25)_55%,transparent)] blur-2xl" />
      <div className="absolute -inset-x-1/2 -top-1/3 bottom-0 rotate-[28deg]">
        {BEAMS.map(([top, height, colour, alpha, blur]) => (
          <div
            key={top}
            className="absolute inset-x-0"
            style={{ top, height, background: `linear-gradient(90deg, transparent 8%, ${colour} 38%, ${colour} 62%, transparent 92%)`, opacity: alpha, filter: `blur(${blur}px)` }}
          />
        ))}
      </div>
      <div className="contact-grain absolute inset-0 opacity-[0.07] mix-blend-overlay" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#050506,transparent_14%,transparent_78%,#050506)]" />
    </div>
  )
}
