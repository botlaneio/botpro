import { Body, Container, Head, Html, Img, Preview, Section, Text } from "@react-email/components"

// Email clients ignore stylesheets and most of CSS, so every style here is inline and conservative.
export const INK = "#111216"
export const MUTED = "#6B7079"
export const LINE = "#E7E7E4"

const site = process.env.VERCEL_PROJECT_PRODUCTION_URL
/** The mark on its black tile, as a PNG: Gmail does not show SVG. Left out when the site's address is unknown. */
const ICON = site ? `https://${site}/brand/icon-192.png` : null

/** The frame every Botlane email shares: the mark and wordmark, a white card, a quiet footer. */
export function Frame({ preview, children }: { preview: string; children: React.ReactNode }) {
  return (
    <Html lang="en">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={{ margin: 0, padding: "32px 12px", backgroundColor: "#F4F4F2", fontFamily: "Inter, -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif", color: INK }}>
        <Container style={{ maxWidth: 560, margin: "0 auto" }}>
          <Section style={{ padding: "0 4px 16px" }}>
            {ICON && <Img src={ICON} width="28" height="28" alt="" style={{ display: "inline-block", verticalAlign: "middle", borderRadius: 7 }} />}
            <span style={{ display: "inline-block", verticalAlign: "middle", marginLeft: ICON ? 10 : 0, fontSize: 18, fontWeight: 600, letterSpacing: "-0.03em" }}>botlane</span>
          </Section>
          <Section style={{ backgroundColor: "#FFFFFF", border: `1px solid ${LINE}`, borderRadius: 16, padding: "28px 28px 20px" }}>{children}</Section>
          <Text style={{ margin: "16px 4px 0", fontSize: 12, lineHeight: "18px", color: MUTED }}>Botlane · Websites and web apps, built properly.</Text>
        </Container>
      </Body>
    </Html>
  )
}

/** One labelled answer from the form. */
export function Answer({ label, value }: { label: string; value: string }) {
  return (
    <Section style={{ padding: "10px 0", borderTop: `1px solid ${LINE}` }}>
      <Text style={{ margin: 0, fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: MUTED }}>{label}</Text>
      <Text style={{ margin: "4px 0 0", fontSize: 15, lineHeight: "22px", whiteSpace: "pre-wrap" }}>{value}</Text>
    </Section>
  )
}
