import { test } from "node:test"
import assert from "node:assert/strict"

import { readApplication } from "./partners.ts"

test("a complete application has no errors", () => {
  const { errors, entry } = readApplication({ name: " Asha ", agency: "Northlight", email: "asha@northlight.in", clients: "6-15 clients" })
  assert.deepEqual(errors, {})
  assert.equal(entry.name, "Asha")
})

test("an application needs a name, agency, real email and a client range", () => {
  const { errors } = readApplication({ email: "nope", clients: "lots" })
  assert.deepEqual(Object.keys(errors).sort(), ["agency", "clients", "email", "name"])
})
