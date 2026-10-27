# botpro

The rebuild of botlane.io and the Lane products, in one Next.js app.

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

## Where things are

| Path | What it holds |
|---|---|
| `src/app/globals.css` | Layer 0 tokens: neutral scales, lane colours, status colours, shadcn semantic tokens, radius, motion |
| `src/styles/materials.css` | The finishes as utilities: `surface-glass`, `surface-tinted`, `btn-light`, `btn-lane`, `tile-depth`, `key-physical`, `tip-frosted`, `fade-spotlight`, `fade-sides`, `label-mono` |
| `src/lib/lanes.ts` | Buildlane, Syncc, Scriblane and Flowlane: host, status, colour scope, hairline figure |
| `src/lib/motion.ts` | The two motion clocks: a 700ms lift for discrete changes, a spring for pointer input |
| `src/components/ui/` | shadcn/ui primitives (Layer 1–2) |
| `src/app/lab/` | The component lab: every primitive in the Botlane finishes |
| `design/hairline/` | Sources of the four lane figures, written for the hairline-create skill |

## Rules

- **botlane.io is neutral.** The primary button is near-white on dark (`btn-light`).
- **Colour lives in a lane scope.** Wrap a product card, section or page in `lane-ember` (Buildlane), `lane-teal` (Syncc), `lane-violet` (Scriblane) or `lane-orchid` (Flowlane). `bg-lane`, `text-lane-text`, `border-lane-border`, `surface-tinted`, `btn-lane` and a hairline figure's highlight all follow it.
- **Status colours are for mock UI only,** never for lanes.

## Open decisions

- Flowlane's orchid is a proposal, not yet on the palette sheet.
- Light-mode lane subtle and border shades are proposals; the sheet gives only light-mode text colours.
