import type { Metadata } from "next"

import { AudioPlayer } from "@/components/lab/dqnamo/CassettePlayer.demo"
import { DynamicButtonExample } from "@/components/lab/dqnamo/DynamicButton.demo"
import { DeleteAction } from "@/components/lab/dqnamo/HoldToConfirm.demo"
import { IridescentFoilDemo } from "@/components/lab/dqnamo/IridescentFoil.demo"
import { UploadField } from "@/components/lab/dqnamo/MagneticDropZone.demo"
import { PlayingCardsDemo } from "@/components/lab/dqnamo/PlayingCards.demo"
import { CheckoutStatus } from "@/components/lab/dqnamo/ReceiptPrinter.demo"
import { InviteCodeExample } from "@/components/lab/dqnamo/ScrambleText.demo"
import { Example as ScrollFadeExample } from "@/components/lab/dqnamo/ScrollFadeList.demo"
import { MySignature } from "@/components/lab/dqnamo/Signature.demo"
import { StampShowcase } from "@/components/lab/dqnamo/Stamp.demo"
import { TicketShowcase } from "@/components/lab/dqnamo/Ticket.demo"

export const metadata: Metadata = { title: "dqnamo experiments · Lab", robots: { index: false, follow: false } }

const ITEMS: { slug: string; title: string; line: string; demo: React.ReactNode; wide?: boolean }[] = [
  { slug: "iridescent-foil", title: "Iridescent Foil", line: "Layered CSS foil that shifts with scroll and pointer. Shown on a Founding Ten badge.", demo: <IridescentFoilDemo /> },
  { slug: "receipt-printer", title: "Receipt Printer", line: "A checkout state that prints a receipt when payment clears.", demo: <CheckoutStatus /> },
  { slug: "ticket", title: "Ticket", line: "A perforated ticket with composable sections and parallax depth.", demo: <TicketShowcase />, wide: true },
  { slug: "stamp", title: "Stamp", line: "A postage-stamp frame for images and content. Our painted sky inside.", demo: <StampShowcase /> },
  { slug: "signature", title: "Animated Signature", line: "An SVG signature that draws itself.", demo: <MySignature /> },
  { slug: "scramble-text", title: "Scramble Text", line: "Changed text revealed through an encrypted scramble.", demo: <InviteCodeExample /> },
  { slug: "dynamic-button", title: "Dynamic Button", line: "A button that resizes smoothly as its label changes.", demo: <DynamicButtonExample /> },
  { slug: "hold-to-confirm", title: "Hold to Confirm", line: "Fills while held, then offers a timed undo.", demo: <DeleteAction /> },
  { slug: "magnetic-drop-zone", title: "Magnetic Drop Zone", line: "A file target that pulls toward an incoming drag.", demo: <UploadField /> },
  { slug: "scroll-fade-list", title: "Scroll Fade List", line: "A compact list with a soft overflow fade.", demo: <ScrollFadeExample /> },
  { slug: "playing-cards", title: "Playing Cards", line: "A composable card and a fanned hand. Number cards only here.", demo: <PlayingCardsDemo /> },
  { slug: "cassette-player", title: "Cassette Audio Player", line: "Turning reels and cassette controls. No audio loaded here.", demo: <AudioPlayer />, wide: true },
]

/**
 * A white canvas for evaluating dqnamo's experiments (JP, The Interface Company of London), copied from
 * dqnamo.com. Local only, for review: not to be pushed or used on the site until JP confirms the terms.
 */
export default function DqnamoLab() {
  return (
    <main className="min-h-dvh bg-white text-grayscale-12 [color-scheme:light]">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <header className="grid gap-3">
          <span className="font-mono text-[11px] tracking-[0.08em] text-grayscale-10">LAB · EVALUATION ONLY</span>
          <h1 className="text-4xl font-medium tracking-[-0.04em]">dqnamo experiments</h1>
          <p className="max-w-2xl text-grayscale-10">
            Twelve of the fifteen experiments from dqnamo.com, by JP at The Interface Company of London, running in Botlane&apos;s stack. Not for the live site until JP confirms the terms. Tactile Button, Advanced Model Selector and Logo Trace Loader are left out: their source isn&apos;t published in full.
          </p>
        </header>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {ITEMS.map((it) => (
            <section key={it.slug} aria-labelledby={`${it.slug}-t`} className={`grid overflow-hidden rounded-2xl border border-grayscale-4 bg-white ${it.wide ? "md:col-span-2" : ""}`}>
              <div className="flex min-h-80 items-center justify-center bg-grayscale-2 p-8">{it.demo}</div>
              <div className="flex flex-wrap items-baseline justify-between gap-3 border-t border-grayscale-4 px-5 py-4">
                <span className="grid gap-0.5">
                  <h2 id={`${it.slug}-t`} className="text-[15px] font-medium">{it.title}</h2>
                  <span className="text-[13px] text-grayscale-10">{it.line}</span>
                </span>
                <a href={`https://www.dqnamo.com/experiments/${it.slug}`} className="font-mono text-[11px] text-grayscale-10 underline underline-offset-4 hover:text-grayscale-12">Source ↗</a>
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  )
}
