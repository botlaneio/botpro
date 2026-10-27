"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowUpRight, PenLine } from "lucide-react"

import { NAV_ICONS } from "@/components/site/nav-icons"
import type { NavIcon, NavItem } from "@/lib/nav"
import { cn } from "@/lib/utils"

type NodeId = "brief" | NavIcon

interface FlowNode {
  id: NodeId
  href: string
  title: string
  body: string
  price: string
  Icon: React.ComponentType<{ className?: string }>
}

// What leads to what: a brief becomes a website or a web app, and either one goes on into Care. The
// assistant is an add-on to a website, so its line is dashed.
const EDGES: { from: NodeId; to: NodeId; dashed?: boolean }[] = [
  { from: "brief", to: "websites" },
  { from: "brief", to: "apps" },
  { from: "websites", to: "care" },
  { from: "apps", to: "care" },
  { from: "websites", to: "assistant", dashed: true },
]

// Where each step sits on the canvas from lg: the brief on the left, the two builds in the middle, Care on
// the right with the assistant above it. On a phone they stack in the order written below.
const PLACE: Record<NodeId, string> = {
  brief: "lg:col-start-1 lg:row-span-4 lg:row-start-1",
  websites: "lg:col-start-2 lg:row-span-2 lg:row-start-1",
  apps: "lg:col-start-2 lg:row-span-2 lg:row-start-3",
  assistant: "lg:col-start-3 lg:row-start-1 lg:self-start",
  care: "lg:col-start-3 lg:row-span-3 lg:row-start-2",
}
const ORDER: NodeId[] = ["brief", "websites", "apps", "care", "assistant"]

interface Wire { d: string; dashed: boolean; ends: [number, number][] }

/** A curve from one step's right edge to the next one's left edge, eased like a node editor's. */
function measure(canvas: HTMLElement): Wire[] {
  const box = canvas.getBoundingClientRect()
  const rect = (id: NodeId) => canvas.querySelector(`[data-node="${id}"]`)?.getBoundingClientRect()
  return EDGES.flatMap(({ from, to, dashed }) => {
    const a = rect(from), b = rect(to)
    if (!a || !b) return []
    const x1 = a.right - box.left, y1 = a.top + a.height / 2 - box.top
    const x2 = b.left - box.left, y2 = b.top + b.height / 2 - box.top
    const dx = (x2 - x1) / 2
    return [{ d: `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`, dashed: !!dashed, ends: [[x1, y1], [x2, y2]] }]
  })
}

function Node({ node, className }: { node: FlowNode; className?: string }) {
  const end = node.id === "care"
  return (
    <Link
      href={node.href}
      data-node={node.id}
      className={cn(
        "group/n relative z-10 flex w-full max-w-[17rem] items-start gap-3 justify-self-center self-center rounded-2xl border p-3.5 pr-4 outline-none transition-[transform,border-color] duration-300 ease-(--ease-lift) hover:-translate-y-0.5 focus-visible:ring-3 focus-visible:ring-ring/60",
        end
          ? "border-transparent bg-brand text-white shadow-[0_18px_40px_-18px_color-mix(in_oklch,var(--brand)_70%,transparent)]"
          : "border-[rgb(var(--ink)/calc(var(--edge-alpha)+0.04))] bg-[color-mix(in_oklch,var(--card)_82%,transparent)] backdrop-blur-sm hover:border-[rgb(var(--ink)/calc(var(--edge-alpha)+0.12))]",
        node.id === "assistant" && "lg:max-w-[15rem] lg:py-2.5",
        className,
      )}
    >
      <span className={cn("grid size-9 shrink-0 place-items-center rounded-full", end ? "bg-white/20" : "bg-[color-mix(in_oklch,var(--brand)_16%,transparent)] text-(--red-text)")}>
        <node.Icon className="size-4" />
      </span>
      <span className="grid min-w-0 gap-0.5">
        <span className="text-[15px] font-medium">{node.title}</span>
        <span className={cn("text-[13px] leading-snug text-pretty", end ? "text-white/80" : "text-muted-foreground", node.id === "assistant" && "lg:hidden")}>{node.body}</span>
        <span className={cn("label-mono mt-1 text-[11px]", end && "text-white/75")}>{node.price}</span>
      </span>
      <ArrowUpRight aria-hidden className={cn("ml-auto size-4 shrink-0 opacity-50 transition-[opacity,transform] duration-300 group-hover/n:translate-x-0.5 group-hover/n:-translate-y-0.5 group-hover/n:opacity-100", end && "opacity-80")} />
    </Link>
  )
}

/**
 * What we build, drawn as a small automation on a dotted canvas, after the workflow builder shared as a
 * reference: a brief branches into a website or a web app, and both run on into Care. From lg the steps
 * are joined by measured curves, with a dot of light running along each; on a phone they stack, joined
 * by short straight lines.
 */
export function SolutionFlow({ items }: { items: NavItem[] }) {
  const canvas = useRef<HTMLDivElement>(null)
  const [wires, setWires] = useState<Wire[]>([])
  const [still, setStill] = useState(true)

  const nodeFor = (id: NodeId): FlowNode | null => {
    if (id === "brief") return { id, href: "/contact", title: "Your brief", body: "Tell us what you're building.", price: "Start here", Icon: PenLine }
    const item = items.find((i) => i.icon === id)
    return item ? { id, href: item.href, title: item.title, body: item.body, price: item.price, Icon: NAV_ICONS[id] } : null
  }

  useLayoutEffect(() => {
    const el = canvas.current
    if (!el) return
    const update = () => setWires(window.matchMedia("(min-width: 64rem)").matches ? measure(el) : [])
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const sync = () => setStill(mq.matches)
    sync()
    mq.addEventListener("change", sync)
    return () => mq.removeEventListener("change", sync)
  }, [])

  return (
    <div
      ref={canvas}
      className="relative isolate grid gap-0 overflow-hidden rounded-[1.6rem] border border-[rgb(var(--ink)/calc(var(--edge-alpha)+0.02))] bg-card p-5 sm:p-8 lg:grid-cols-[1fr_1.1fr_1fr] lg:grid-rows-[repeat(4,minmax(3.5rem,auto))] lg:gap-x-14 lg:gap-y-4 lg:p-12 xl:gap-x-24"
    >
      {/* The canvas: a dot grid, lit in the accent from the top left and in steel from the bottom right. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(rgb(var(--ink)/0.13)_1px,transparent_1.2px)] [background-size:22px_22px] [mask-image:radial-gradient(120%_100%_at_50%_50%,#000_40%,transparent)]" />
      <div aria-hidden className="pointer-events-none absolute -top-1/3 -left-1/4 -z-10 size-[36rem] rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklch,var(--brand)_18%,transparent),transparent)]" />
      <div aria-hidden className="pointer-events-none absolute -right-1/4 -bottom-1/2 -z-10 size-[40rem] rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklch,var(--neutral-9)_20%,transparent),transparent)]" />

      {wires.length > 0 && (
        <svg aria-hidden className="pointer-events-none absolute inset-0 hidden size-full overflow-visible lg:block">
          {wires.map((w, i) => (
            <g key={i}>
              <path d={w.d} fill="none" strokeWidth={1.5} style={{ stroke: "rgb(var(--ink) / 0.28)" }} strokeDasharray={w.dashed ? "4 5" : undefined} className={cn(w.dashed && !still && "[animation:wire-dash_1.2s_linear_infinite]")} />
              {!w.dashed && !still && (
                <circle r={2.5} style={{ fill: "var(--brand)" }}>
                  <animateMotion dur="3.6s" begin={`${i * 0.9}s`} repeatCount="indefinite" path={w.d} keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines="0.45 0 0.25 1" />
                </circle>
              )}
              {w.ends.map(([x, y], k) => <circle key={k} cx={x} cy={y} r={3.5} strokeWidth={1.5} style={{ fill: "var(--background)", stroke: "rgb(var(--ink) / 0.45)" }} />)}
            </g>
          ))}
        </svg>
      )}

      {ORDER.map((id, i) => {
        const node = nodeFor(id)
        if (!node) return null
        return (
          <div key={id} className="contents">
            {i > 0 && (
              <span aria-hidden className={cn("mx-auto block h-6 w-px lg:hidden", id === "assistant" ? "border-l border-dashed border-[rgb(var(--ink)/0.3)]" : "bg-[rgb(var(--ink)/0.22)]")} />
            )}
            <Node node={node} className={PLACE[id]} />
          </div>
        )
      })}
    </div>
  )
}
