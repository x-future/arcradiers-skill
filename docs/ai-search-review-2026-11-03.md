# Google AI search review

## Verified findings

- Live homepage fetched on 2026-11-03 has an empty React root in its initial HTML. Google can render JavaScript, so this is not proof of exclusion, but initial content is dependent on rendering.
- Public robots.txt allows crawling. Existing llms.txt is not a Google AI inclusion mechanism.
- Search Console Settings was read directly on 2026-11-03: Search generative AI is Included; robots.txt reports all files valid; crawl statistics show 1,480 requests over 90 days. No account setting was changed.
- The new planner/store routes previously inherited the homepage canonical and had no generated production HTML. The production server serves real files rather than an SPA fallback.
- Search Console figures read earlier in this session: 45 clicks / 5,604 impressions; core builder query had average position 17.5. These are an earlier session snapshot, not a fresh export.

## Research and limits

Applied ai-seo and agent-reach skills. Agent Reach reports no configured X search backend. Public web search found X posts; a public mirror returned Gagan Ghotra's post text, which points to a Gary Illyes presentation but does not itself establish a ranking recipe. Do not treat engagement or sales claims in tutorial threads as controlled evidence.

- X source: https://x.com/gaganghotra_/status/1947893036496916783
- X workflow discussion: https://x.com/mikefutia/status/2043357536448041327 (search excerpt available; direct fetch returned 403). Its Search Console keyword-gap workflow is useful context, not proof of promised ranking outcomes.
- Google implementation guidance: https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
- Google AI participation setting: https://support.google.com/webmasters/answer/16908024

Google requires indexed, snippet-eligible pages and inclusion through Search Console's Search generative AI control. Special AI files and special schema do not guarantee selection. Related-query retrieval is not a reason to mass-produce keyword-variant pages.

## Implemented

- Build-time rendering of the real homepage and store components into initial HTML, using the same content as the browser experience.
- A planner production entry with a useful static planning reference before the interactive calculator loads.
- Route-specific canonical, metadata and visible-content-aligned WebPage/CollectionPage schema.
- Planner and store entries in the built sitemap.
- Visible skill-tree explanation derived from the planner dataset, useful branch links, official source links and explicit data limitations.
- Build-output checks: node scripts/check-search-pages.mjs.

Build with npm run build. The prerender script requires a fresh Vite output and fails if run twice against already-rendered HTML. This does not serve special bot-only content.

## Deployment validation still required

1. Deploy the built files and server together. Verify /, /planner/, /store/ return 200 and their raw HTML contains content and correct canonical URLs.
2. Search Console Settings > Search generative AI is already Included as checked on 2026-11-03; retain that setting.
3. Inspect homepage and planner URLs in Search Console, including rendered content and selected canonical; request indexing after deployment.
4. Submit the sitemap and record deployment date. Monitor the Generative AI performance report and Web query/page reports at 7, 14 and 28 days; these are checkpoints, not promised ranking timelines.
5. Record query, locale, language, date and cited URLs for arc raiders tree, arc raiders skill tree, arc raiders skill tree builder and related planning questions. A single personalized AI answer is not a complete visibility measurement.

No deployment, indexing submission or AI citation has been verified by this change.
