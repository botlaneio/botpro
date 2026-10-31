/**
 * Client-side checks for the account preview. Nothing here is sent or stored.
 * Sign-up stays incomplete until every field passes, so the primary button can stay pale.
 * Sign-in only asks for a work email and a password; length is not judged, because this
 * preview has no account store to compare against.
 */

export const PASSWORD_MIN = 8

export type AccountMode = "signin" | "signup"

export type AccountFields = {
  email: string
  password: string
  firstName: string
  lastName: string
}

export type AccountField = keyof AccountFields
export type AccountErrors = Partial<Record<AccountField, string>>

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const emptyAccountFields = (): AccountFields => ({
  email: "",
  password: "",
  firstName: "",
  lastName: "",
})

export function accountErrors(mode: AccountMode, fields: AccountFields): AccountErrors {
  const errors: AccountErrors = {}
  const email = fields.email.trim()
  if (!email) errors.email = "Enter your work email."
  else if (!EMAIL.test(email)) errors.email = "Enter a valid work email."

  if (mode === "signup") {
    if (!fields.firstName.trim()) errors.firstName = "Enter your first name."
    if (!fields.lastName.trim()) errors.lastName = "Enter your last name."
    if (fields.password.length < PASSWORD_MIN) errors.password = `Use at least ${PASSWORD_MIN} characters.`
  } else if (!fields.password) {
    errors.password = "Enter your password."
  }

  return errors
}

export function accountReady(mode: AccountMode, fields: AccountFields) {
  return Object.keys(accountErrors(mode, fields)).length === 0
}

/** The first field a failed attempt should move focus to, in visual order. */
export function firstAccountError(mode: AccountMode, errors: AccountErrors): AccountField | null {
  const order: AccountField[] = mode === "signup"
    ? ["email", "firstName", "lastName", "password"]
    : ["email", "password"]
  return order.find((key) => errors[key]) ?? null
}
