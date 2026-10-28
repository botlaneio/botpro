import { ViewTransition } from "react"

/**
 * A template re-mounts on every navigation, unlike the layout, so its view transition sees each page
 * leave and arrive: the old page fades out and the new one fades in (styles in globals.css). The
 * header is named `site-header` and held still.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter="page-in" exit="page-out" default="none">
      {children}
    </ViewTransition>
  )
}
