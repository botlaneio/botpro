"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"

const subscribeNever = () => () => {}

/**
 * A two-position switch between light and dark. The knob slides to the active
 * side and carries its icon; the other icon stays faint in the track.
 */
export function ThemeSwitch({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  // The theme is only known in the browser. Until then, render the default (dark) so the markup matches.
  const mounted = React.useSyncExternalStore(subscribeNever, () => true, () => false)
  const dark = !mounted || resolvedTheme === "dark"

  // The phone's browser bar follows the theme, not just the first paint.
  React.useEffect(() => {
    if (!mounted) return
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", dark ? "#0E0809" : "#FCFCFD")
  }, [mounted, dark])

  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label="Dark mode"
      onClick={() => setTheme(dark ? "light" : "dark")}
      className={cn(
        "group relative inline-flex h-7 w-[52px] shrink-0 items-center rounded-full border border-border bg-muted p-0.5",
        "shadow-[inset_0_1px_2px_rgb(0_0_0/0.12)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2",
        className,
      )}
    >
      {/* Faint icons in the track mark the two positions. */}
      <Sun aria-hidden className="absolute left-[7px] size-3 text-muted-foreground/60" />
      <Moon aria-hidden className="absolute right-[7px] size-3 text-muted-foreground/60" />
      <span
        aria-hidden
        className={cn(
          "relative z-10 grid size-[22px] place-items-center rounded-full",
          "bg-[linear-gradient(180deg,var(--raised-top),var(--raised-bottom))] text-foreground",
          "shadow-[inset_0_1px_0_var(--raised-lit),0_0_0_1px_var(--raised-edge),0_1px_3px_rgb(0_0_0/0.18)]",
          "transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
          dark ? "translate-x-6" : "translate-x-0",
        )}
      >
        {dark ? <Moon className="size-3" /> : <Sun className="size-3" />}
      </span>
    </button>
  )
}
