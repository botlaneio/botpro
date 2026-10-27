import { test } from "node:test"
import assert from "node:assert/strict"

import { HONEYPOT, MIN_FILL_MS, checkStep, screen } from "./contact.ts"

const NOW = 1_800_000_000_000
const good = {
  brief: "A booking site for my physiotherapy clinic, with online payments.",
  need: "website",
  name: "Asha",
  email: "asha@example.com",
  company: "",
  started_at: String(NOW - 60_000),
}

test("a complete, human submission passes", () => {
  const r = screen(good, NOW)
  assert.equal(r.kind, "ok")
  if (r.kind === "ok") assert.equal(r.data.need, "website")
})

test("a filled honeypot is spam", () => {
  assert.equal(screen({ ...good, [HONEYPOT]: "http://spam.example" }, NOW).kind, "spam")
})

test("sending faster than a person can type is spam", () => {
  assert.equal(screen({ ...good, started_at: String(NOW - MIN_FILL_MS + 1) }, NOW).kind, "spam")
  assert.equal(screen({ ...good, started_at: "not a time" }, NOW).kind, "spam")
})

test("missing and malformed fields come back as one message per field", () => {
  const r = screen({ ...good, brief: "hi", email: "nope", need: "everything" }, NOW)
  assert.equal(r.kind, "invalid")
  if (r.kind === "invalid") assert.deepEqual(Object.keys(r.errors).sort(), ["brief", "email", "need"])
})

test("each step checks only its own fields", () => {
  assert.deepEqual(checkStep(0, { brief: good.brief }), {})
  assert.ok(checkStep(0, { brief: "short" }).brief)
  assert.ok(checkStep(2, { name: "", email: "x" }).email)
  assert.deepEqual(checkStep(3, {}), {})
})
