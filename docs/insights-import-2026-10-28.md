# Insights import · 28 October 2026

Source: `botlaneio/neural_substrate`, commit `74c83b5207c98bcdad767bdb632aced369b19591`, `src/content/blog/`.

All seven articles were imported at the owner's request. The four previously published posts retain their publication dates and `/blog/<slug>` URLs. The owner explicitly requested publication of the three drafts as well; their publication date is 28 October 2026. The two existing Botlane studio posts remain in place.

Markdown content is kept in `src/content/blog/`. `npm run prebuild` generates `src/content/imported-insights.json` for static use in the Cloudflare Worker. When changing Markdown, run `node scripts/build-insights.mjs` and commit the generated JSON too. Future files with `draft: true` remain excluded. Use `npm run test:insights` to verify the migration and draft handling.

## Content adjustments

- Updated the old `/syncc/` service references to the relevant current scheduling product, AI assistant, or workflow automation page.
- Updated the website-budget draft's retired Starter/Business/Pro packages to Core/Ascend/Apex, removed the unsupported included month of Care and old Syncc service purchase models, and linked current services and pricing.
- Changed unsupported statements about content exclusions and ownership promises into explicit proposal questions.
- Preserved the rest of each article, including external sources, examples, lists, tables, and related-post links.

Insights topic filters, reading time, table of contents, metadata, structured article data, static routes, and the sitemap include the imported posts. The source repository was not modified.
