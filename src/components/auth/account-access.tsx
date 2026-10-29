"use client"

import { useState } from "react"
import { SignInPage } from "@/components/ui/sign-in"
import "@/components/ui/sign-in.css"

export default function AccountAccess() {
  const [mode, setMode] = useState<"signin" | "signup">("signup")
  const [notice, setNotice] = useState("Preview only. Account access is not connected yet; use sample details.")
  const switchMode = (next: "signin" | "signup") => {
    setMode(next)
    setNotice("Preview only. Account access is not connected yet; use sample details.")
  }
  return <SignInPage
    mode={mode}
    heroImageSrc="/images/daylight/glacial-inlet.webp"
    onSignIn={(event) => {
      event.preventDefault()
      setNotice("Account access is not connected yet. Your details were not sent or saved.")
    }}
    onResetPassword={() => setNotice("Password reset will be available when account access is connected.")}
    onCreateAccount={() => switchMode("signup")}
    onSwitchToSignIn={() => switchMode("signin")}
    notice={notice}
  />
}
