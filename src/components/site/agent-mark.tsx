"use client"

import { useId } from "react"

import { cn } from "@/lib/utils"

import { CREASE, EYES, SHELL } from "./botlane-mark"

export type AgentState = "idle" | "working" | "done"

/**
 * The Botlane mark as an agent with a state, built on the logo's own geometry.
 *
 *   always   only the edge of light shows; every few seconds a faint band passes and glimpses the whole helmet
 *   idle     the edge of light rests on the right, as in the logo, and the eyes breathe slowly
 *   working  a thin accent ring turns round the helmet and the eyes narrow as it concentrates
 *   done     the eyes flash in the accent and the ring closes once, then it settles back to idle
 *
 * Where it looks is set from outside with three custom properties, so a parent can point it at whatever it is
 * working on without re-rendering: --rim-a (the edge of light's angle, 0deg = right), --look-x and --look-y (how
 * far the eyes move, in the mark's 24-unit space). A parent driving it imperatively can also set data-state on
 * the svg directly. Under reduced motion every state is still.
 */
export function AgentMark({ size = 48, state = "idle", className, label }: { size?: number; state?: AgentState; className?: string; label?: string }) {
  const id = useId().replace(/:/g, "")
  const eyes = EYES[size < 64 ? "small" : "large"]
  return (
    <svg
      width={size} height={size} viewBox="1 1 22 22" data-agent="" data-state={state}
      role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true}
      className={cn("agent shrink-0 overflow-visible", className)}
    >
      <defs>
        <radialGradient id={`${id}-fall`} gradientUnits="userSpaceOnUse" cx="22.2" cy="11.8" r="11">
          <stop offset="0.1" stopColor="#fff" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.5" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id={`${id}-rim`} maskUnits="userSpaceOnUse" x="-4" y="-4" width="32" height="32">
          {/* The light is a gradient pinned to the right edge; turning this square turns the light round the helmet. */}
          <rect className="agent-rim" x="-4" y="-4" width="32" height="32" fill={`url(#${id}-fall)`} />
        </mask>
        <linearGradient id={`${id}-band`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id={`${id}-pass`} maskUnits="userSpaceOnUse" x="-12" y="-12" width="48" height="48">
          <rect className="agent-pass" x="-2" y="-8" width="4" height="40" fill={`url(#${id}-band)`} />
        </mask>
        <linearGradient id={`${id}-eye`} gradientUnits="userSpaceOnUse" x1="0" y1={eyes.y[0]} x2="0" y2={eyes.y[1]}>
          <stop offset="0" style={{ stopColor: "var(--mark-eye-edge)" }} />
          <stop offset="0.42" style={{ stopColor: "var(--mark-eye-core)" }} />
          <stop offset="1" style={{ stopColor: "var(--mark-eye-base)" }} />
        </linearGradient>
        <filter id={`${id}-glow`} filterUnits="userSpaceOnUse" x="-4" y="-4" width="32" height="32">
          <feGaussianBlur stdDeviation={size < 64 ? 0.7 : 0.4} />
        </filter>
      </defs>

      {/* The working ring: a short arc of the accent going round; on done it closes into a full circle. */}
      <circle className="agent-ring-track" cx="12" cy="11.8" r="11.4" fill="none" pathLength={100} />
      <circle className="agent-ring" cx="12" cy="11.8" r="11.4" fill="none" pathLength={100} />

      {/* Every few seconds a faint band of light passes over the helmet and shows its whole outline, then it's dark again. */}
      <g fill="none" strokeLinejoin="round" strokeLinecap="round" className="agent-glimpse" style={{ stroke: "var(--mark-rim)" }} mask={`url(#${id}-pass)`}>
        <path d={CREASE} strokeWidth={1} vectorEffect="non-scaling-stroke" style={{ stroke: "var(--mark-crease)" }} />
        <path d={SHELL} strokeWidth={size < 64 ? 1.25 : 1} vectorEffect="non-scaling-stroke" />
      </g>
      <g fill="none" strokeLinejoin="round" strokeLinecap="round" style={{ stroke: "var(--mark-rim)" }} mask={`url(#${id}-rim)`}>
        <path d={CREASE} strokeWidth={1} vectorEffect="non-scaling-stroke" style={{ stroke: "var(--mark-crease)" }} />
        <path d={SHELL} strokeWidth={size < 64 ? 1.25 : 1} vectorEffect="non-scaling-stroke" />
      </g>

      <g className="agent-eyes">
        <path d={eyes.d} filter={`url(#${id}-glow)`} className="agent-eye-glow" />
        <path d={eyes.d} fill={`url(#${id}-eye)`} />
        <path d={eyes.d} className="agent-eye-flash" />
      </g>
    </svg>
  )
}
