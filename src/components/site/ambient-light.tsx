import { cn } from "@/lib/utils"

// Beams of red light, after Raycast's: broad diagonal bars, blurred, parallel, with darkness between them. The reds
// are sampled from Raycast's own: a deep crimson wash with brighter crimson streaks. Each is [top, height, colour,
// strength, blur], measured along a band turned 28° across the page. Kept low: the light should read as depth in
// the dark, not as a red page.
const BEAMS: [top: string, height: string, colour: string, alpha: number, blur: number][] = [
  ["8%", "9rem", "#7A1114", 0.34, 80],
  ["17%", "2.5rem", "#C8292B", 0.12, 28],
  ["30%", "6rem", "#8A1418", 0.2, 70],
  ["44%", "1.5rem", "#C8292B", 0.08, 20],
  ["55%", "10rem", "#4A090C", 0.38, 100],
]

/**
 * The page's light source in the dark theme: a deep crimson wash and beams of red falling diagonally across the
 * top of the page, behind everything. Glass panels let it through. It fades out down the page, and it
 * renders nothing in the light theme. Pass a className to place it elsewhere, such as the footer.
 */
export function AmbientLight({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-x-0 -z-10 hidden overflow-hidden dark:block", className ?? "top-0 h-[72rem] [mask-image:linear-gradient(180deg,#000_35%,transparent)]")}>
      <div className="absolute -top-1/4 left-1/2 h-[60rem] w-[90rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(80_12_14/0.3),transparent)]" />
      <div className="absolute -inset-x-1/2 -top-1/3 bottom-0 rotate-[28deg]">
        {BEAMS.map(([top, height, colour, alpha, blur]) => (
          <div
            key={top}
            className="absolute inset-x-0"
            style={{
              top,
              height,
              background: `linear-gradient(90deg, transparent 8%, ${colour} 38%, ${colour} 62%, transparent 92%)`,
              opacity: alpha,
              filter: `blur(${blur}px)`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
