/**
 * Lane, the guide on botlane.io: an ElevenLabs agent (voice "Lane") shown as the particle orb in the
 * bottom-right corner (src/components/site/lane-orb). The agent ID is public by design: the browser needs
 * it to start a conversation. Abuse is limited in ElevenLabs, not here: allowed hosts (botlane.io), at
 * most 5 conversations at once and 150 a day. What Lane knows (services, prices, process) is the agent's
 * system prompt in ElevenLabs, so update it there when the price book in src/lib/pricing changes.
 */
export const LANE_AGENT_ID = "agent_7301m6k3hy5bfrmbtnbnr8q64760"
