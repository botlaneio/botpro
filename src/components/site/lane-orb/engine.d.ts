/** Types for engine.js: Lane as one voice button in the corner. */
export interface LaneOrbOptions {
  agentId: string
  /** Resolves to the ElevenLabs `Conversation` class. Loaded on first tap, so the SDK stays out of the page bundle. */
  loadConversation: () => Promise<unknown>
  /** Opens another page while the conversation continues. A returned string is passed back to Lane. */
  navigate?: (path: string) => Promise<string | void> | string | void
  isHome?: () => boolean
  isDark?: () => boolean
  /** Homepage sections Lane can show, by name. Defaults match the ids on botlane.io's homepage. */
  sections?: Record<string, () => Element | null | undefined>
  headerOffset?: number
  scrollTo?: (y: number) => void
  /** Milliseconds before the one-time "Talk to Lane" label appears; -1 turns it off. */
  hintDelay?: number
  /** CSS selector of an element the button should sit above when it covers the bottom-right corner. */
  avoid?: string | null
}
export interface LaneOrb {
  start(): Promise<void>
  end(): Promise<void>
  destroy(): void
}
export function createLaneOrb(options: LaneOrbOptions): LaneOrb
