/**
 * Checks the price book against itself and against the published numbers.
 * Run with `npm test`.
 */
import { test } from "node:test"
import assert from "node:assert/strict"

import { chargeLabel, discounted, money, OFFERINGS, OFFERS, offerOpen, perMonth, plan, regionFor } from "./index.ts"

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

test("the Syncc app and the AI intake service are separate offerings", () => {
  const app = OFFERINGS.find((o) => o.id === "syncc")!, intake = OFFERINGS.find((o) => o.id === "ai-intake")!
  assert.notEqual(app.name, intake.name)
  assert.equal(app.kind, "product")
  assert.equal(intake.kind, "service")
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

test("Founding Ten covers Buildlane builds only, at 20% off, until 31 March 2027", () => {
  const ft = OFFERS.find((o) => o.id === "founding-ten")!
  const buildlane = OFFERINGS.filter((o) => o.lane === "buildlane" && o.kind === "service").flatMap((o) => o.plans.map((p) => p.id))
  assert.deepEqual([...ft.appliesTo].sort(), [...buildlane].sort())
  assert.equal(discounted(plan("website-business").charges[0].amounts.US, ft), 3920)
  assert.ok(offerOpen(ft, "2027-03-31"))
  assert.ok(!offerOpen(ft, "2027-04-01"))
})
