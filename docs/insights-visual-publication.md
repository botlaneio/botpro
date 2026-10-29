# Insights visual publication

Build target: the supplied card-feed reference, adapted to Botlane's current homepage and tokens.

| Decision | Source | Role |
| --- | --- | --- |
| Graphite surfaces, Inter, fine borders, blue light | Existing Botlane homepage and globals.css | Preserve the site's identity in both themes |
| Title-first article cards with visual covers | User-supplied feed screenshot | Make the full archive discoverable |
| Compact masthead, three/two/one columns | Approved implementation plan | Put articles near the first screen |
| Distinct diagrams, no fictional metrics | Actual nine article subjects | Illustrative covers, never product evidence |
| Foil on the selected feature, Stamp for the studio note | dqnamo source already in this repo | Bounded editorial details |
| Dynamic Button for copy feedback | dqnamo DynamicButton | A real local interaction with success/error states |

The owner confirmed on 29 October 2026 that JP gave permission to reuse the dqnamo components. This records the owner's confirmation, not additional or inferred licensing terms. Preserve attribution to JP / The Interface Company of London and original source links.

Article URLs, content, import generation, canonical metadata, sitemap, and structured data remain in place. Search/topic state uses URL parameters; the unfiltered archive and article links render on the server. No tracking counters, account system, or invented integration results.

## Light-theme material polish

Follow-up requested after #108 was merged. The homepage's shared `--background`
remains `#F2F3F5`; its ambient light is reused. Publication cards now use the same
`--glass-top` / `--glass-bottom`, `--raised-lit`, `--shadow-lift`, and `--shadow-soft`
material tokens. White cards sit above grey illustration trays; the small papers,
calendar and intake rows receive soft shadows. Light illustration strokes and
secondary text have more contrast. All overrides are scoped to `:root:not(.dark)`
and the publication components. No shared palette, article data or dark finish is
changed.
