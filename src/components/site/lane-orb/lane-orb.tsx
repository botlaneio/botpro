"use client"

import { useEffect, useRef } from "react"
import { usePathname, useRouter } from "next/navigation"

import { LANE_AGENT_ID } from "@/lib/lane"
import { scrollToY } from "@/lib/smooth-scroll"
import { createLaneOrb } from "./engine"

/**
 * Lane, Botlane's intelligence orchestrator: a particle orb in the bottom-right corner that visitors can
 * type or talk to. Lane answers from the agent's prompt in ElevenLabs, scrolls the homepage to what it is
 * explaining, and opens pages with the router, so the conversation carries on across them. Mounted once
 * in the layout. Stores nothing in the browser (the cookie note promises that), and the ElevenLabs SDK
 * loads only when a visitor starts a conversation.
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
      storageKey: null,
      avoid: ".cookie-note",
    })
    return () => orb.destroy()
  }, [router])

  return null
}
