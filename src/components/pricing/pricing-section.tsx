import { OFFERS } from "@/lib/pricing"
import { offerStatus } from "@/lib/pricing/offer-status"
import { Comparison } from "./comparison"
import { FoundingBanner } from "./founding-banner"
import { PlanCard } from "./plan-card"
import { PriceList } from "./price-list"
import { PricingFaq } from "./pricing-faq"
import { SynccPlans } from "./syncc-plans"

const founding = OFFERS.find((o) => o.id === "founding-ten")!

function Group({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-xl font-medium tracking-tight">{title}</h3>
        {note && <p className="label-mono">{note}</p>}
      </div>
      {children}
    </div>
  )
}

/** Every price on the site, read from the price book. */
export async function PricingSection() {
  const status = await offerStatus(founding)
  const offerFor = (id: string) => (status.open && founding.appliesTo.includes(id) ? founding : null)

  return (
    <>
      <div className="grid gap-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="grid max-w-2xl gap-2">
            <span className="label-mono">PRICING</span>
            <h2 className="text-3xl font-medium tracking-tight text-balance">Clear, fixed prices.</h2>
          </div>
        </div>

        <FoundingBanner status={status} />

        <div className="grid gap-12">
          <Group title="Websites" note="one-time">
            <div className="grid gap-5 md:grid-cols-3">
              <PlanCard planId="website-core" offer={offerFor("website-core")} cta="Start a project" />
              <PlanCard planId="website-ascend" offer={offerFor("website-ascend")} featured cta="Start a project" />
              <PlanCard planId="website-apex" offer={offerFor("website-apex")} cta="Start a project" />
            </div>
          </Group>
          <Group title="Web apps" note="plan, prove, build">
            <div className="grid gap-5 md:grid-cols-3">
              <PlanCard planId="app-scoping" offer={offerFor("app-scoping")} cta="Book a sprint" />
              <PlanCard planId="app-prototype" offer={offerFor("app-prototype")} cta="Talk to us" />
              <PlanCard planId="app-full" offer={offerFor("app-full")} cta="Talk to us" />
            </div>
          </Group>
          <Group title="Care and add-ons">
            <PriceList offeringId="care" />
          </Group>
        </div>

        <div className="lane-teal">
          <Group title="Syncc" note="scheduling">
            <SynccPlans />
          </Group>
        </div>

        <div className="lane-violet">
          <Group title="Scriblane" note="document processing">
            <div className="grid gap-5 md:grid-cols-2">
              <PlanCard planId="scriblane-starter" cta="Start with Starter" />
              <PlanCard planId="scriblane-growth" featured cta="Start with Growth" />
            </div>
            <Comparison planIds={["scriblane-starter", "scriblane-growth"]} caption="Scriblane plans compared" />
          </Group>
        </div>

        <Group title="Questions">
          <PricingFaq />
        </Group>

      </div>
    </>
  )
}
