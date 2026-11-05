# botpro

The rebuild of botlane.io: Botlane's website and app studio, plus its own products (the Lanes), in one Next.js app.

| | |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS v4, shadcn/ui on Radix |
| Theme | next-themes, dark by default |

## Run it

```sh
npm install
npm run dev        # http://localhost:3000, component lab at /lab
npm run lint
npm run build
```

## Environment

Copy `.env.example` to `.env.local` for development. In production every value is a runtime secret on the `botpro` Worker (Cloudflare dashboard: Workers & Pages → botpro → Settings → Variables and Secrets), not a build variable.

| Variable | What it does |
|---|---|
| `RESEND_API_KEY`, `CONTACT_TO`, `CONTACT_FROM` | The contact form: briefs go to `CONTACT_TO` from `CONTACT_FROM`, a sender on botlane.io (verified in Resend). Partner applications also land here. |
| `PARTNER_SHEET_WEBHOOK_URL`, `PARTNER_SHEET_SECRET` | Partner applications go to the Google Sheet through its Apps Script web app. Either this or Resend is enough. |
| `STRIPE_SECRET_KEY` | A restricted key with read access to Coupons: shows how many Founding Ten places are left. Without it the offer shows without a count. |

## Where things are

| Path | What it holds |
|---|---|
| `src/app/globals.css` | Layer 0 tokens: neutral scales, lane colours, status colours, shadcn semantic tokens, radius, motion |
| `src/styles/materials.css` | The finishes as utilities: `surface-glass`, `surface-tinted`, `btn-light`, `btn-lane`, `tile-depth`, `key-physical`, `tip-frosted`, `fade-spotlight`, `fade-sides`, `label-mono` |
| `src/lib/pricing/` | The price book (`plans.ts`), price formatting by region, and the Founding Ten status read from Stripe |
| `src/lib/lanes.ts` | Botlane's own products (Syncc, Scriblane, Flowlane): host, status, colour scope, hairline figure |
| `src/lib/motion.ts` | The two motion clocks: a 700ms lift for discrete changes, a spring for pointer input |
| `src/components/ui/` | shadcn/ui primitives (Layer 1–2) |
| `src/lib/catalog.ts` | The solutions: three categories (websites, web apps, custom solutions) and the offer behind each page |
| `src/lib/products.ts` | What each product does, its comparison and its honest limits |
| `src/lib/insights.ts` | The Insights notes at `/blog` |
| `src/lib/partners.ts` | The partner programme's terms and application rules (the dialog is in `src/components/partners/`) |
| `src/lib/site.ts` | The public address, used for canonical links, the sitemap and robots.txt |
| `src/components/site/lane-orb/` | Lane, the particle orb in the corner: `engine.js` draws the orb and runs the panel and the conversation, `lane-orb.tsx` mounts it in the layout |
| `src/lib/lane.ts` | Lane's ElevenLabs agent ID, and where Lane's knowledge lives |
| `src/app/solutions/` | The Solutions hub; each category and offer has its own route (`/websites`, `/web-apps`, `/custom-solutions`) |
| `src/app/lab/` | The component lab: every primitive in the Botlane finishes. Not indexed, not in the sitemap |
| `design/hairline/` | Sources of the four lane figures, written for the hairline-create skill |

## Rules

- **botlane.io is neutral.** The primary button is near-white on dark (`btn-light`).
- **Electric blue is Botlane's own accent,** used sparingly: the glow behind a page's opening section (`glow-brand`) and the Founding Ten banner. Use `bg-brand` / `text-brand-text`; everything else stays neutral.
- **The logo is the comet beside the botlane wordmark.** The comet (`BotlaneMark`, geometry in `src/components/site/botlane-comet.ts`) is always one colour, the current text colour, and sits to the left of the wordmark, never inside it. In a lockup it is about 1.15 times the wordmark's ascender height, with a gap of half its own height. Give it at least its own width of clear space. Below 24px it switches to its sturdier small drawing by itself. The seal (`BotlaneSeal`) is brand artwork for large, decorative use, not the logo.
- **Product colour lives in a lane scope.** Wrap a product card, section or page in `lane-teal` (Syncc), `lane-violet` (Scriblane) or `lane-orchid` (Flowlane). `bg-lane`, `text-lane-text`, `border-lane-border`, `surface-tinted`, `btn-lane` and a hairline figure's highlight all follow it.
- **Status colours are for mock UI only,** never for lanes.

## Lane

Lane is Botlane's intelligence orchestrator: an ElevenLabs agent (voice "Lane") that visitors type or talk to through the particle orb in the bottom-right corner. Lane scrolls the homepage to what it is explaining (`brief`, `build`, `stack`, `products`, `process`, and the closing section) and opens pages through the router, so the conversation carries on across them.

- **What Lane knows** is the agent's system prompt in ElevenLabs (agent "Lane – botlane.io guide (orb)"), not this repo. Update it when prices or services change.
- **The agent ID** is in `src/lib/lane.ts`. It is public by design; no secret is needed.
- **Limits** are set on the agent: allowed hosts, 5 conversations at once, 150 a day, transcripts kept 30 days.
- **Privacy:** the orb stores nothing in the browser, so the cookie note stays true. The ElevenLabs SDK loads only when a visitor starts a conversation.
- **Renamed a homepage section id?** Update `DEFAULT_SECTIONS` in `engine.js`.

## Deploy

Cloudflare Workers through OpenNext (`npm run deploy`), on botlane.io and www.botlane.io. The workers.dev address is off; branch previews stay on. Old URLs (`/services`, `/pricing`, `/partners`, `/document-processing`) are redirected in `next.config.ts`.

## Open decisions

- Flowlane's orchid is a proposal, not yet on the palette sheet.
- Light-mode lane subtle and border shades are proposals; the sheet gives only light-mode text colours.
