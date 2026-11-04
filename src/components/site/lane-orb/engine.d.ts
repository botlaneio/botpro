/** Types for engine.js, the framework-free Lane orb. */
export interface LaneOrbOptions {
  agentId: string
  /** Resolves to the ElevenLabs `Conversation` class. Loaded on first use, so the SDK stays out of the page bundle. */
  loadConversation: () => Promise<unknown>
  /** Opens another page while the conversation continues. A returned string is passed back to Lane. */
  navigate?: (path: string) => Promise<string | void> | string | void
  isHome?: () => boolean
  isDark?: () => boolean
  /** Homepage sections Lane can show, by name. Defaults match the ids on botlane.io's homepage. */
  sections?: Record<string, () => Element | null | undefined>
  headerOffset?: number
  scrollTo?: (y: number) => void
  /** Milliseconds before the one-time greeting appears; -1 turns it off. */
  hintDelay?: number
  /** sessionStorage prefix for the greeting. null keeps it in memory, so nothing is stored. */
  storageKey?: string | null
  toastOnNavigate?: boolean
  fallbackLink?: { text: string; label: string; href: string } | null
  /** CSS selector of an element the orb should sit above when it covers the bottom-right corner. */
  avoid?: string | null
}
export interface LaneOrb {
  open(): void
  close(): void
  end(): Promise<void>
  ask(text: string): void
  note(text: string): void
  destroy(): void
}
export function createLaneOrb(options: LaneOrbOptions): LaneOrb
