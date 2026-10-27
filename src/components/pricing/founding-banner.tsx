import { OFFERS } from "@/lib/pricing"
import { offerStatus, type OfferStatus } from "@/lib/pricing/offer-status"

const founding = OFFERS.find((o) => o.id === "founding-ten")!

const ENDS = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })
  .format(new Date(`${founding.endsOn}T00:00:00Z`))

/**
 * The Founding Ten announcement: a small glass pill, neutral apart from one red dot and the
 * offer's name. Reads the live count from Stripe; renders nothing once the offer has closed.
 */
export async function FoundingBanner({ status }: { status?: OfferStatus }) {
  const s = status ?? (await offerStatus(founding))
  if (!s.open) return null

  return (
    <aside
      aria-label="Founding Ten offer"
      className="surface-glass inline-flex w-fit max-w-full flex-wrap items-center gap-x-2.5 gap-y-1 rounded-full! py-1.5 pr-4 pl-3 text-sm"
    >
      <span aria-hidden className="size-2 shrink-0 rounded-full bg-brand shadow-[0_0_10px_var(--brand)]" />
      <span className="font-medium text-brand-text">Founding Ten</span>
      <span className="text-muted-foreground">
        {Math.round(founding.discount * 100)}% off for our first {founding.places} clients, until {ENDS}
      </span>
      {s.placesLeft !== null && (
        <span className="label-mono rounded-full border border-border px-2 py-0.5 tabular-nums">
          {s.placesLeft} of {founding.places} left
        </span>
      )}
    </aside>
  )
}
