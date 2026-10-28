import assert from "node:assert/strict"
import test from "node:test"
import fs from "node:fs"
import { buildPosts, parsePost } from "./build-insights.mjs"

const directory = new URL("../src/content/blog", import.meta.url)

test("imports all seven articles with preserved URLs and true publication dates", () => {
  const posts = buildPosts(directory)
  assert.deepEqual(posts.map((p) => [p.slug, p.date]), [
    ["after-hours-enquiries", "2026-10-23"],
    ["ai-appointment-booking-implementation", "2026-10-28"],
    ["ai-chatbot-vs-booking-form", "2026-10-24"],
    ["fixed-scope-explained", "2026-10-21"],
    ["google-business-profile-checklist", "2026-10-18"],
    ["service-business-intake-requirements", "2026-10-28"],
    ["small-business-website-cost", "2026-10-28"],
  ])
  assert.equal(new Set(posts.map((p) => p.slug)).size, posts.length)
})

test("preserves complete Markdown bodies, including tables, links and formatting", () => {
  for (const post of buildPosts(directory)) {
    const source = fs.readFileSync(new URL(`${post.slug}.md`, directory.href + "/"), "utf8").split(/\n---\n/)[1].trim()
    const reconstructed = post.body.map((b) => b.type === "h2" ? `## ${b.text}` : b.text).join("\n\n")
    assert.equal(reconstructed, source)
  }
})

test("still excludes any future article explicitly marked as a draft", () => {
  for (const slug of ["ai-appointment-booking-implementation", "service-business-intake-requirements", "small-business-website-cost"]) {
    assert.equal(parsePost(fs.readFileSync(new URL(`${slug}.md`, directory.href + "/"), "utf8").replace("category:", "draft: true\ncategory:"), slug), null)
  }
})

test("rejects invalid publication metadata", () => {
  const source = fs.readFileSync(new URL("after-hours-enquiries.md", directory.href + "/"), "utf8")
  assert.throws(() => parsePost(source.replace("2026-10-23", "2026-02-30"), "invalid"), /invalid publication date/)
  assert.throws(() => parsePost(source.replace("category: Enquiries", "category: Unknown"), "invalid"), /unknown category/)
})
