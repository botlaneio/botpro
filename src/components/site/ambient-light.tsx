import { cn } from "@/lib/utils"

// Beams of red light, after Raycast's: broad diagonal bars, blurred, parallel, with darkness between them.
// Each is [top, height, colour, strength, blur], measured along a band turned 28° across the page.
const BEAMS: [top: string, height: string, colour: string, alpha: number, blur: number][] = [
  ["8%", "9rem", "#8E1B20", 0.7, 70],
  ["17%", "2.5rem", "#FF6363", 0.32, 26],
  ["30%", "6rem", "#B3262B", 0.45, 60],
  ["44%", "1.5rem", "#FF6363", 0.2, 18],
  ["55%", "10rem", "#5A1014", 0.8, 90],
]

/**
 * The page's light source in the dark theme: a deep red wash and beams of red falling diagonally across the
 * top of the page, behind everything. Glass panels let it through. It fades out down the page, and it
 * renders nothing in the light theme. Pass a className to place it elsewhere, such as the footer.
 */
export function AmbientLight({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-x-0 -z-10 hidden overflow-hidden dark:block", className ?? "top-0 h-[72rem] [mask-image:linear-gradient(180deg,#000_35%,transparent)]")}>
      <div className="absolute -top-1/4 left-1/2 h-[60rem] w-[90rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(90_16_20/0.55),transparent)]" />
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
