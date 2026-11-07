# Light theme homepage: analysis notes

Notes taken from `src/app/page.tsx` and everything it pulls in, to use as the pattern when building a similar
light-theme page. The site defaults to dark (`theme-provider.tsx`: `defaultTheme="dark"`, `enableSystem={false}`).
Light is the `:root` token set, and `.dark` on `<html>` overrides it.

## 1. How light mode is wired

| Mechanism | Where | Notes |
|---|---|---|
| Token switch | `src/app/globals.css` | `:root` = light, `.dark` = dark. Dark-only variant: `@custom-variant dark (&:is(.dark *))`. |
| Material switch | `src/styles/materials.css` top | Each finish reads its own variables (`--primary-top`, `--raised-*`, `--shadow-*`, `--glass-*`, `--ink`…), tuned separately for each theme rather than inverted. |
| Light-only CSS | `:root:not(.dark) …` selectors | Used for overrides that only make sense by day (frost, scene dial, product worlds). |
| Light-only markup | `dark:hidden` / `hidden dark:block` | Swaps whole components: `ProductWorlds` (light) vs `ProductCards` (dark), the `ArtPanel` sky behind the orbit. |
| Page-scoped light tweaks | `.daylight-home` on `<main>` | Lets the homepage restyle shared pieces (hero scene, ambient light) without touching other pages. Uses `body:has(.daylight-home)` to reach the global ambient layer. |
| Browser bar | `theme-switch.tsx` | Sets `<meta name="theme-color">` to `#FCFCFD` in light. |

**Key idea: `--ink`.** Edges and hairlines are written as `rgb(var(--ink) / α)`. `--ink` is `0 0 0` in light and
`255 255 255` in dark, so one rule draws a black hairline by day and a white one by night. Use it for every edge.

## 2. The light palette

- **Page:** `--background: #F2F3F5`, a soft cool grey. It is not white, so white cards stand out against it by contrast as well as shadow.
- **Surfaces:** `--card` / `--popover` `#FFFFFF`.
- **Text:** `--foreground` neutral-12 `#16181C`, muted neutral-10 `#6B717C`.
- **Borders:** neutral-6 `#D6D9DE`. Material hairlines use `--edge-alpha: 0.08` on `--ink`.
- **Primary is neutral:** near-black in light (`--primary-top #30333A → --primary-bottom #16181C`), white in dark. The main button (`btn-light`) is a dark bevelled button in light mode, despite the name.
- **Accent:** electric blue `--brand #2F55F0`, text `#1E3FC8`. Used sparingly: the `glow-brand` wash, stat suffixes, the stat-card arc, the hero path.
- **Lane colours** appear only inside `.lane-teal|violet|orchid` scopes, and light mode uses darker `-text` shades for contrast.
- **Shadows** (light): small and cool-tinted: `--shadow-soft`, `--shadow-lift` built on `rgb(16 24 40 / …)`. Dark mode uses deep black ones instead.
- **Radius:** `--radius 0.7rem`, cards 1.4× (≈16px), prompt 1.8×.
- **Type:** Inter (variable, self-hosted), JetBrains Mono for `label-mono` eyebrows (12.5px, muted).

## 3. Page-wide light layers (behind everything)

1. **Ambient light** (`ambient-light.tsx`, `.ambient-day`): a pale azure radial wash plus five blurred diagonal
   "beams" (rotated 28°, `#8FB4F2`, `#C5D8EE`…), masked to fade out by ~72rem down. The homepage turns it down
   to `opacity: 0.28` (`product-worlds.css`) so the artwork carries the colour.
2. **Page rails** (`.page-rails` in `layout.tsx` + materials): two 1px hairlines at `ink/0.07` down the
   72rem content edges, the full height of the page. Light only, lg+ only.
3. **Dot field** (`.dots-field`): an 18px grid of 1px dots at `ink/0.085`, radially masked. Used on the
   `#brief` and `#process` sections so empty space looks deliberate. Light only.
4. **Section dividers:** every section has `border-t border-border/60` and `py-14 sm:py-20`.

Together these give the light page its "drafting table" structure: grey paper, rails, dots and hairlines. Dark
mode relies on light and depth instead and hides all three.

## 4. Section by section

Container: `main.daylight-home mx-auto max-w-6xl px-4 sm:px-6`.

| # | Section | Component | Light-mode treatment |
|---|---|---|---|
| 1 | Hero | `HeroScene` inside `header.glow-brand` | Full-height (`100svh - --header-h`, 660–920px) SVG/HTML scene in three acts (Build/Launch/Care) driven by one clock. Its pieces are tokenised: `scene-*` classes use `--card`, `--ink`, `--brand`. Daylight overrides: frosted site card turns near-opaque white with a cool shadow, the dial changes from solid foreground to a **white disc with a teal arc**, and the todo/done/live chips become soft amber/teal/green pastels. `glow-brand` adds an 11% blue radial wash from the top. |
| 2 | Brief | `HeroPrompt` in `.dots-field` | Centred "What do you have in mind?" + `surface-prompt`: solid white→neutral-1 field with a slowly rotating conic graphite border (`--mark-eye-*`), typed placeholder examples, radio chips, round `btn-light` submit. It is a plain GET form to `/contact`, so it works without JS. |
| 3 | What we build | `ServiceBlocks` | Two columns: copy + `btn-light` CTA on the left, a 2×2 grid of hairline cards (`card` at 70%) on the right. **One card is always "lit"**, filled with the primary gradient (near-black in light), and the lit card follows hover/focus. Icons sit in solid foreground circles. |
| 4 | Stack | `StackOrbit` over `ArtPanel sky="dawn"` | Light mode adds a painted "dawn" canvas (domain-warped noise, pale blues + a blush) behind the orbit as a rounded panel; `dark:hidden`. |
| 5 | Products | `ProductWorlds` (light) / `ProductCards` (dark) | The richest light-only piece; see §5. Followed by `StatCards`: `surface-stat` hairline cards with a blue arc running round the border, count-up numbers, blue suffix. |
| 6 | Process | `ProcessWheel` in `.dots-field` | Token-driven, so it needs no light-specific code. |
| 7 | CTA | `PetalReveal` + `surface-frosted` | Stays **black in both themes** (X-ray flower artwork). The frosted panel takes the page colour at 76% with a 28px blur, so in light it is a frosted grey card on black. This is the page's one high-contrast moment. |

Header/footer: `SiteHeader` pill nav (`surface-pill`: popover at 90% + blur), `SiteFooter` reuses `AmbientLight`.

## 5. Product Worlds (the daylight showcase)

Spec: `docs/daylight-product-worlds.md`. Pattern: **rich, bounded artwork with crisp white live UI on top.**

- Shell: white card, 18px radius, `ink/0.09` border, `--shadow-lift`, local tokens `--world-ink #192629`,
  `--world-muted #667477`, `--world-line #e5ebeb`.
- Tabs (`role="tablist"`, manual activation, arrow-key navigation, roving `tabIndex`, no autoplay): the selected
  tab takes the lane's `--lane-subtle`/`--lane-text`.
- Landscape stage: one shared illustration `public/images/daylight/glacial-inlet.webp` (143 KB) at `center 57% / cover`,
  with a per-lane gradient overlay in `:before`, a mono topline/bottomline in pale text, and a 420px-min body.
- Inside: real React UI per product (a booking calendar with selectable times, invoice extraction, a flow builder).
  Records are illustrative, entry animation is `world-enter` 320ms, and reduced motion is respected.
- Below: a three-column description (icon + name, headline + copy, features + dark CTA), then a `#f8fafa` footer strip.
- Breakpoint at 900px collapses the aside and tightens padding.

## 6. Reusable recipe for a similar light page

1. Start on `--background` grey with white `--card` surfaces, and keep colour out of the chrome.
2. Add structure: `page-rails` (global), `dots-field` on open/centred sections, `border-t border-border/60` between sections.
3. Open with `glow-brand` on the first section, and keep the ambient wash low if the page has its own artwork.
4. Each section: `label-mono` eyebrow → `text-3xl sm:text-4xl font-medium tracking-tight text-balance` heading → `text-lg text-muted-foreground` intro.
5. Use `btn-light` for the primary action and a muted text link with an `ArrowRight` that nudges on hover for the secondary one.
6. Put colour in **bounded artwork panels** (ArtPanel skies, a landscape image) with white UI floating on them, rather than in page washes.
7. Draw edges with `rgb(var(--ink)/α)`, and take shadows from `--shadow-soft`/`--shadow-lift`, so both themes come for free.
8. If a component must differ by theme, prefer variables in `:root`/`.dark`. Use `:root:not(.dark) .page-scope …` for page-only daylight tweaks, and `dark:hidden` swaps only for whole components.
9. Motion: `--ease-lift` (700ms) for discrete changes, `--ease-soft` for colour/opacity, `data-reveal` for scroll reveal, and everything must honour reduced motion.
10. Accessibility: real tablists, ≥44px hit targets (`min-h-11`), forms that work without JS.

## 7. Issues found while reading (worth fixing or avoiding)

- **Bug: spotLane and dotLane landscape tints never apply.** The CSS targets `.world-scriblane:before` and
  `.world-flowlane:before` (`product-worlds.css:94,102`), but the markup emits `world-${active}`, i.e.
  `world-spotlane` / `world-dotlane`, since the rename in #125. All three tabs currently show the slotLane teal
  overlay. Fix: rename the selectors.
- **Hard-coded colours in Product Worlds.** About 30 literal hexes (`#192629`, `#fff`, `#f8fafa`, `#a393ac`…) bypass
  the token system. They are fine while it is light-only, but a new page should use tokens.
- **Very small type.** 25 rules in `product-worlds.css` set 8–9px text (tab "SOON", mono labels, scene captions).
  This is below a comfortable reading size. Use ≥11px in new work.
- **README is out of date.** It still names Syncc/Scriblane/Flowlane and `lane-orchid (Flowlane)`, while the code uses
  slotLane/spotLane/dotLane.
- **`btn-light` is dark in light mode.** The name describes the dark theme. Keep this in mind when reading class names.
