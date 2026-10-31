import { test } from "node:test"
import assert from "node:assert/strict"

import { accountErrors, accountReady, emptyAccountFields, firstAccountError, PASSWORD_MIN } from "./account-form.ts"

const filled = {
  email: "ada@studio.test",
  password: "a".repeat(PASSWORD_MIN),
  firstName: "Ada",
  lastName: "Lovelace",
}

test("an empty sign-up names every missing field", () => {
  const errors = accountErrors("signup", emptyAccountFields())
  assert.equal(errors.email, "Enter your work email.")
  assert.equal(errors.firstName, "Enter your first name.")
  assert.equal(errors.lastName, "Enter your last name.")
  assert.match(errors.password ?? "", new RegExp(String(PASSWORD_MIN)))
  assert.equal(accountReady("signup", emptyAccountFields()), false)
  assert.equal(firstAccountError("signup", errors), "email")
})

test("a complete sign-up is ready", () => {
  assert.deepEqual(accountErrors("signup", filled), {})
  assert.equal(accountReady("signup", filled), true)
})

test("sign-up rejects a short password and a malformed email", () => {
  const errors = accountErrors("signup", { ...filled, email: "ada@studio", password: "short" })
  assert.equal(errors.email, "Enter a valid work email.")
  assert.match(errors.password ?? "", /8/)
  assert.equal(errors.firstName, undefined)
})

test("sign-up trims the email and the names", () => {
  assert.deepEqual(accountErrors("signup", { ...filled, email: "  ada@studio.test  ", firstName: " Ada ", lastName: " Lovelace " }), {})
})

test("sign-in ignores names and accepts any non-empty password", () => {
  const fields = { ...emptyAccountFields(), email: "ada@studio.test", password: "x" }
  assert.deepEqual(accountErrors("signin", fields), {})
  assert.equal(accountReady("signin", fields), true)
  const empty = accountErrors("signin", emptyAccountFields())
  assert.equal(empty.firstName, undefined)
  assert.equal(empty.lastName, undefined)
  assert.equal(firstAccountError("signin", empty), "email")
})
