"use client"

import * as React from "react"

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
          <span data-pressed={down.has(k.code)} className={k.wide ? "key-physical block h-16 w-24" : "key-physical grid size-16 place-items-center text-2xl"}>
            {k.wide ? (
              <>
                <span className="absolute top-2 right-3 text-base leading-none">{k.glyph}</span>
                <span className="absolute bottom-2.5 left-3 text-sm leading-none">{k.label}</span>
              </>
            ) : (
              k.label
            )}
          </span>
        </React.Fragment>
      ))}
    </div>
  )
}
