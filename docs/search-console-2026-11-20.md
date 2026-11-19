# Search Console review — 2026-11-20

Property: sc-domain:browserfiletools.net
Search type: Web. Report preset: last 28 days.
Actual reporting dates shown: 2026-10-21 through 2026-11-17.

## Observed results
- 27 impressions, 2 clicks, 7.4% CTR, average position 40.3.
- Homepage: 19 impressions, 1 click (page CTR 5.3%).
- About: 2 impressions, 1 click.
- How it works: 9 impressions, 0 clicks.
- Korean homepage: 3 impressions, 0 clicks.
- Image Toolkit: 2 impressions, 0 clicks.
- Visible query rows: file merger (3 impressions), file merge online (2), what is a local file (2), file merge (1), merge files online free (1), file merger free (1). All displayed query rows have zero clicks.
- Page rows and property totals use different aggregation and must not be summed as equivalent totals. Some queries are omitted for privacy. The 2 clicks cannot be attributed to the visible query rows.
- Index report updated 2026-11-16: 15 indexed, 25 excluded. 21 discovered/not indexed, 4 redirect URLs. Redirect exclusions alone do not establish a defect.

## Interpretation
The sample is too small to diagnose CTR reliably or demonstrate statistical improvements. Broader discovery and indexing of useful tool pages is the immediate opportunity. The Search Console report does not establish why Google has deferred indexing those pages.

## Applied changes
- Clarified the English homepage title and main heading around online PDF merging.
- Expanded existing below-tool navigation to include merge, compression, and image tools, with reciprocal links from image tools and compression.
- Corrected sitemap modification dates for pages changed in this release. Preserved older dates for untouched pages and used identical logic in Flask and the static exporter.
- Kept English/Korean canonical and hreflang relationships intact.

## Validation
- Locale and search-copy tests pass (15 tests).
- Static export validates 44 HTML files.
- Verified both languages expose tool navigation and updated sitemap dates.
- Search Console website settings and index requests were not changed. Google controls indexing and rankings.
- Recheck a subsequent complete 28-day period against this baseline after recrawling.

Sources:
https://developers.google.com/search/docs/crawling-indexing/links-crawlable
https://developers.google.com/search/docs/appearance/title-link
https://support.google.com/webmasters/answer/9012289
