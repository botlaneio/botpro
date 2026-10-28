import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const covers = {
  "Getting found": "orbit",
  Enquiries: "lines",
  "Buying a website": "grid",
  "Automation and AI": "orbit",
}

export function parsePost(raw, slug) {
  const match = raw.replace(/\r\n/g, "\n").match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
  if (!match) throw new Error(`${slug}: missing front matter`)
  const metadata = Object.fromEntries(match[1].split("\n").filter(Boolean).map((line) => {
    const colon = line.indexOf(":")
    if (colon < 1) throw new Error(`${slug}: invalid front matter`)
    return [line.slice(0, colon).trim(), line.slice(colon + 1).trim().replace(/^"(.*)"$/, "$1")]
  }))
  if (metadata.draft === "true") return null
  for (const field of ["title", "description", "date", "category"]) {
    if (!metadata[field]) throw new Error(`${slug}: missing ${field}`)
  }
  if (!Object.hasOwn(covers, metadata.category)) throw new Error(`${slug}: unknown category`)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(metadata.date) || Number.isNaN(Date.parse(metadata.date)) || new Date(metadata.date).toISOString().slice(0, 10) !== metadata.date) {
    throw new Error(`${slug}: invalid publication date`)
  }
  const body = []
  let section = []
  const flush = () => {
    const text = section.join("\n").trim()
    if (text) body.push({ type: "markdown", text })
    section = []
  }
  for (const line of match[2].split("\n")) {
    if (line.startsWith("## ")) {
      flush()
      body.push({ type: "h2", text: line.slice(3).trim() })
    } else section.push(line)
  }
  flush()
  if (!body.length) throw new Error(`${slug}: empty article`)
  return { slug, title: metadata.title, dek: metadata.description, topic: metadata.category, date: metadata.date, cover: covers[metadata.category], body }
}

export function buildPosts(directory) {
  directory = directory instanceof URL ? fileURLToPath(directory) : directory
  return fs.readdirSync(directory).filter((file) => file.endsWith(".md")).sort()
    .map((file) => parsePost(fs.readFileSync(path.join(directory, file), "utf8"), file.slice(0, -3)))
    .filter(Boolean)
}

// Generate static data before Next.js builds. No filesystem reads in the Cloudflare Worker.
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
  const posts = buildPosts(path.join(root, "src/content/blog"))
  fs.writeFileSync(path.join(root, "src/content/imported-insights.json"), `${JSON.stringify(posts, null, 2)}\n`)
  console.log(`Prepared ${posts.length} published articles for Insights.`)
}
