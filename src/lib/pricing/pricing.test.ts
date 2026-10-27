/**
 * Checks the price book against itself and against the published numbers.
 * Run with `npm test`.
 */
import { test } from "node:test"
import assert from "node:assert/strict"

import { chargeLabel, discounted, isPlaceholder, money, OFFERINGS, OFFERS, offerOpen, perMonth, plan, purchasable, regionFor } from "./index.ts"

test("every plan id is unique", () => {
  const ids = OFFERINGS.flatMap((o) => o.plans.map((p) => p.id))
  assert.equal(new Set(ids).size, ids.length)
})

test("every charge has a positive whole amount in both regions", () => {
  for (const o of OFFERINGS) for (const p of o.plans) for (const c of p.charges) {
    for (const r of ["US", "IN"] as const) {
      assert.ok(Number.isInteger(c.amounts[r]) && c.amounts[r] > 0, `${p.id} ${r}`)
    }
  }
})

test("Syncc yearly works out to the advertised monthly price", () => {
  const yearly = plan("syncc-cloud-annual").charges[0]
  assert.equal(perMonth(yearly, "US"), 7)
  assert.equal(perMonth(yearly, "IN"), 499)
  assert.equal(yearly.amounts.US, 7 * 12)
  assert.equal(yearly.amounts.IN, 499 * 12)
})

test("yearly billing is cheaper than monthly", () => {
  const yearly = plan("syncc-cloud-annual").charges[0], monthly = plan("syncc-cloud-monthly").charges[0]
  for (const r of ["US", "IN"] as const) assert.ok(perMonth(yearly, r) < monthly.amounts[r])
})

test("prices format the way the price book writes them", () => {
  assert.equal(money(2490, "US"), "$2,490")
  assert.equal(money(110000, "IN"), "₹1,10,000")
  assert.equal(chargeLabel(plan("app-full").charges[0], "IN"), "From ₹4,00,000 one-time")
  assert.equal(chargeLabel(plan("scriblane-growth").charges[0], "US"), "$449/month")
  assert.equal(chargeLabel(plan("extra-work").charges[0], "IN"), "₹2,500/hour")
})

test("India is priced in rupees, everyone else in dollars", () => {
  assert.equal(regionFor("IN"), "IN")
  assert.equal(regionFor("in"), "IN")
  assert.equal(regionFor("US"), "US")
  assert.equal(regionFor("DE"), "US")
  assert.equal(regionFor(null), "US")
})

test("Founding Ten covers website and app builds only, at 20% off, until 31 March 2027", () => {
  const ft = OFFERS.find((o) => o.id === "founding-ten")!
  const builds = OFFERINGS.filter((o) => o.lane === "botlane" && o.kind === "service").flatMap((o) => o.plans.map((p) => p.id))
  assert.deepEqual([...ft.appliesTo].sort(), [...builds].sort())
  assert.equal(discounted(plan("website-business").charges[0].amounts.US, ft), 3920)
  assert.ok(offerOpen(ft, "2027-03-31"))
  assert.ok(!offerOpen(ft, "2027-04-01"))
})

test("Syncc prices are marked as placeholders and can't be bought", () => {
  for (const o of OFFERINGS.filter((x) => x.lane === "syncc")) {
    assert.equal(o.placeholder, true, o.id)
    for (const p of o.plans) {
      assert.ok(isPlaceholder(p.id), p.id)
      assert.ok(!purchasable(p.id, "US") && !purchasable(p.id, "IN"), p.id)
    }
  }
  assert.ok(!isPlaceholder("website-starter"))
  assert.ok(!isPlaceholder("scriblane-growth"))
})

test("final prices can't be bought until Stripe knows them", () => {
  assert.ok(!purchasable("scriblane-starter", "US"))
})

test("Founding Ten places come from its Stripe coupon", async () => {
  const { statusFrom, todayInIndia } = await import("./offer-status.ts")
  const ft = OFFERS.find((o) => o.id === "founding-ten")!
  assert.equal(ft.stripeCouponId, "FOUNDING10")
  const coupon = (used: number, valid = true) => ({ valid, max_redemptions: 10, times_redeemed: used })

  assert.deepEqual(statusFrom(ft, coupon(3), "2026-11-01"), { open: true, placesLeft: 7 })
  assert.deepEqual(statusFrom(ft, coupon(10, false), "2026-11-01"), { open: false, placesLeft: 0 })
  assert.deepEqual(statusFrom(ft, coupon(3), "2027-04-01"), { open: false, placesLeft: 7 })
  // Stripe unreachable or not set up yet: show the offer by date, without a count.
  assert.deepEqual(statusFrom(ft, null, "2026-11-01"), { open: true, placesLeft: null })
  // The end date is India's: 31 March 2027 ends at midnight IST, which is 18:30 UTC.
  assert.equal(todayInIndia(new Date("2027-03-31T18:29:00Z")), "2027-03-31")
  assert.equal(todayInIndia(new Date("2027-03-31T18:31:00Z")), "2027-04-01")
})

test("every service plan says who it's for, and the scoping sprint is credited", () => {
  for (const o of OFFERINGS.filter((x) => x.lane === "botlane")) for (const p of o.plans) assert.ok(p.bestFor, p.id)
  assert.match(plan("app-scoping").terms ?? "", /credited/i)
})
