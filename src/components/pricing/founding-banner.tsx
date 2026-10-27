import { OFFERS } from "@/lib/pricing"
import { offerStatus, type OfferStatus } from "@/lib/pricing/offer-status"

const founding = OFFERS.find((o) => o.id === "founding-ten")!

const ENDS = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })
  .format(new Date(`${founding.endsOn}T00:00:00Z`))

/** The Founding Ten strip. Reads the live count from Stripe; renders nothing once the offer has closed. */
export async function FoundingBanner({ status }: { status?: OfferStatus }) {
  const s = status ?? (await offerStatus(founding))
  if (!s.open) return null

  return (
    <aside aria-label="Founding Ten offer" className="lane-ember surface-tinted flex flex-wrap items-center gap-x-6 gap-y-3 px-5 py-4">
      <span className="label-mono text-lane-text">FOUNDING TEN</span>
      <p className="min-w-0 flex-1 text-sm">
        We&apos;re launching. Our first {founding.places} clients get {Math.round(founding.discount * 100)}% off Buildlane website and app
        builds, until {ENDS} or until the places are taken.
      </p>
      {s.placesLeft !== null && (
        <p className="label-mono text-foreground tabular-nums">
          {s.placesLeft} of {founding.places} places left
        </p>
      )}
    </aside>
  )
}
