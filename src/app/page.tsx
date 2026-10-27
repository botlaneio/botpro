import Link from "next/link"

export default function Home() {
  return (
    <main className="mx-auto flex min-h-svh max-w-2xl flex-col justify-center gap-6 px-6 py-24">
      <span className="label-mono">BOTLANE · REBUILD IN PROGRESS</span>
      <h1 className="text-4xl font-medium tracking-tight text-balance">The new botlane.io is being built here.</h1>
      <p className="text-muted-foreground">
        The design tokens and base components are in place. The component lab shows every primitive in the Botlane finishes.
      </p>
      <Link href="/lab" className="btn-light inline-flex h-9 w-fit items-center px-4 text-sm font-medium">
        Open the component lab
      </Link>
    </main>
  )
}
