import { test } from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { CAL, CAL_VIEWBOX, SLOT_DARK, SLOT_LIGHT, calSvg } from "./slotlane-cal.ts"

test("slotLane uses the supplied even-odd ring and centred pill", () => {
  assert.equal(CAL_VIEWBOX, "-20 5 396 396")
  assert.equal(CAL.ring, "M0 203a158 158 0 1 0 316 0a158 158 0 1 0 -316 0ZM86 203a72 72 0 1 0 144 0a72 72 0 1 0 -144 0Z")
  assert.deepEqual(CAL.slot, { x: 120, y: 172, width: 236, height: 62, rx: 31 })
  for (const size of [16, 32, 128]) {
    const svg = calSvg({ size, ink: "#171717" })
    assert.ok(svg.includes(`width="${size}" height="${size}"`))
    assert.ok(svg.includes(`d="${CAL.ring}" fill="#171717" fill-rule="evenodd"`))
    assert.ok(svg.includes(`x="120" y="172" width="236" height="62" rx="31" fill="${SLOT_LIGHT}"`))
  }
})

test("the generated public SVGs keep the same ring, slot and theme colours", () => {
  for (const [file, ink, slot] of [
    ["slotlane-mark-on-white.svg", "#171717", SLOT_LIGHT],
    ["slotlane-mark-on-black.svg", "#ffffff", SLOT_DARK],
    ["slotlane-icon.svg", "#ffffff", SLOT_DARK],
  ]) {
    const svg = readFileSync(new URL(`../../../public/brand/${file}`, import.meta.url), "utf8")
    assert.ok(svg.includes(`d="${CAL.ring}" fill="${ink}" fill-rule="evenodd"`), file)
    assert.ok(svg.includes(`x="120" y="172" width="236" height="62" rx="31" fill="${slot}"`), file)
    assert.doesNotMatch(svg, /stroke-width=/)
  }
})
