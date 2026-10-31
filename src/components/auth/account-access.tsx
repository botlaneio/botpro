"use client"

import { useState } from "react"
import type { FormEvent } from "react"
import { usePathname } from "next/navigation"

import { SignInPage } from "@/components/ui/sign-in"
import type { AccountMode } from "@/lib/account-form"

const PREVIEW = "Preview only. Account access is not connected yet; use sample details."

/**
 * The account preview. Sign-up and sign-in stay in the browser: submitting does not create a session,
 * and password reset only explains that it is not connected. `initialMode` comes from `?mode=signin`.
 */
export default function AccountAccess({ initialMode = "signup" }: { initialMode?: AccountMode }) {
  const pathname = usePathname()
  const [mode, setMode] = useState<AccountMode>(initialMode)
  const [notice, setNotice] = useState(PREVIEW)

  const switchMode = (next: AccountMode) => {
    setMode(next)
    setNotice(PREVIEW)
    if (pathname === "/account") {
      const url = next === "signin" ? "/account?mode=signin" : "/account"
      window.history.replaceState(null, "", url)
    }
  }

  const onSignIn = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setNotice("Account access is not connected yet. Your details were not sent or saved.")
  }

  return (
    <SignInPage
      mode={mode}
      onSignIn={onSignIn}
      onResetPassword={() => setNotice("Password reset will be available when account access is connected.")}
      onCreateAccount={() => switchMode("signup")}
      onSwitchToSignIn={() => switchMode("signin")}
      notice={notice}
    />
  )
}
