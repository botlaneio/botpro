"use client"

import { useEffect, useRef } from "react"
import { usePathname, useRouter } from "next/navigation"

import { COMET, COMET_VIEWBOX } from "@/components/site/botlane-comet"
import { LANE_AGENT_ID } from "@/lib/lane"
import { scrollToY } from "@/lib/smooth-scroll"
import { createLaneOrb } from "./engine"

// The comet, white, for the button. Its node is marked so it can pulse with Lane's voice.
const MARK = `<svg viewBox="${COMET_VIEWBOX}" aria-hidden="true"><path d="${COMET.regular.tail}" fill="#fff"/><circle class="node" cx="${COMET.regular.node.cx}" cy="${COMET.regular.node.cy}" r="${COMET.regular.node.r}" fill="#fff"/></svg>`

/**
 * Lane, Botlane's intelligence orchestrator: one voice button in the bottom-right corner, the comet on a
 * soft blue disc. Tap to talk in real time, tap again to end; the comet turns while Lane listens and speaks. Lane answers from the agent's prompt in ElevenLabs, scrolls the homepage to
 * what it is explaining, and opens pages with the router, so the conversation carries on across them.
 * Mounted once in the layout. Stores nothing in the browser (the cookie note promises that), and the
 * ElevenLabs SDK loads only when a visitor taps the button.
 */
export function LaneOrb() {
  const router = useRouter()
  const pathname = usePathname()
  const path = useRef(pathname)

  useEffect(() => {
    path.current = pathname
  }, [pathname])

  useEffect(() => {
    const orb = createLaneOrb({
      agentId: LANE_AGENT_ID,
      loadConversation: () => import("@elevenlabs/client").then((m) => m.Conversation),
      isHome: () => path.current === "/",
      navigate: async (to) => {
        router.push(to)
        await new Promise((resolve) => setTimeout(resolve, 500)) // let the new page render
      },
      sections: { start: () => document.getElementById("cta-title")?.closest("section") },
      headerOffset: 80, // the sections' scroll-mt-20
      scrollTo: scrollToY,
      avoid: ".cookie-note",
      mark: MARK,
    })
    return () => orb.destroy()
  }, [router])

  return null
}
