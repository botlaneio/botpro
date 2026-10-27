"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

const subscribeNever = () => () => {}

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  // false on the server, true once hydrated: the theme is only known in the browser
  const mounted = React.useSyncExternalStore(subscribeNever, () => true, () => false)
  const dark = !mounted || resolvedTheme === "dark"

  return (
    <Button variant="outline" size="sm" onClick={() => setTheme(dark ? "light" : "dark")}>
      {dark ? <Sun /> : <Moon />}
      {dark ? "Light" : "Dark"}
    </Button>
  )
}

const KEYS = [
  { code: "AltLeft", glyph: "⌥", label: "option", wide: true },
  { code: "KeyA", glyph: "", label: "A", wide: false },
]

/** Keycaps that press down with the reader's own keyboard. */
export function Keycaps() {
  const [down, setDown] = React.useState<Set<string>>(new Set())

  React.useEffect(() => {
    const set = (code: string, on: boolean) =>
      setDown((prev) => {
        const next = new Set(prev)
        if (on) next.add(code)
        else next.delete(code)
        return next
      })
    const press = (e: KeyboardEvent) => set(e.code === "AltRight" ? "AltLeft" : e.code, true)
    const release = (e: KeyboardEvent) => set(e.code === "AltRight" ? "AltLeft" : e.code, false)
    const clear = () => setDown(new Set())
    window.addEventListener("keydown", press)
    window.addEventListener("keyup", release)
    window.addEventListener("blur", clear)
    return () => {
      window.removeEventListener("keydown", press)
      window.removeEventListener("keyup", release)
      window.removeEventListener("blur", clear)
    }
  }, [])

  return (
    <div className="flex items-center gap-3" aria-label="Option plus A">
      {KEYS.map((k, i) => (
        <React.Fragment key={k.code}>
          {i > 0 && <span className="text-muted-foreground">+</span>}
          <span
            data-pressed={down.has(k.code)}
            className={
              k.wide
                ? "key-physical relative h-16 w-20 place-items-end-start p-2.5 text-sm"
                : "key-physical size-16 text-2xl"
            }
          >
            {k.glyph && <span className="absolute top-2 right-2.5 text-base">{k.glyph}</span>}
            {k.label}
          </span>
        </React.Fragment>
      ))}
    </div>
  )
}
