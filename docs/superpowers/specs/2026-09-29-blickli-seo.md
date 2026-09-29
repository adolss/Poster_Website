# Blickli SEO audit and proposed fix

Checked 29 September 2026 against https://blickli.ch and the `blickli-live` branch of `adolss/Poster_Website`.

## Finding

No general crawl or indexing block was found on the sampled public pages. The homepage, Engadin product and Posters collection return HTTP 200, with no `noindex` meta tag or X-Robots-Tag. The homepage is also accessible with a Googlebot user agent (this does not establish what Google's real crawler sees). The sitemap includes the homepage and all six products. The canonical URLs point to blickli.ch. www redirects to the primary domain, HTTP resolves to HTTPS, and an invented URL returns 404.

A search for `site:blickli.ch` returned no results through the available search tool. This is not a definitive Google index-status check. Search Console URL Inspection is needed to establish whether Google has discovered, crawled or excluded the homepage and why.

## Confirmed theme issues

- Homepage title is `Places worth keeping.— BLICKLI`. `layout/theme.liquid` hard-codes the slogan instead of using Shopify's homepage SEO title.
- Homepage and Posters collection have no meta description.
- Product title is `Engadin— BLICKLI`; it does not identify the product as a poster.
- No JSON-LD structured data exists on the homepage, sampled product or collection. No corresponding implementation exists in the live theme.
- The current canonical tags and crawlable product links are present and correct.

Missing descriptions and structured data are improvements to relevance and presentation, not proof of the cause of non-indexing.

## Recommended scope

Prepare a focused GitHub pull request, review it in the unpublished development theme, and promote only after review. The repository README identifies `shopify-dev` as the development branch and `blickli-live` as the published branch; pushing the latter changes the live store.

1. Replace the hard-coded homepage title with a Shopify-aware title. Use `BLICKLI — Swiss Travel Posters & Art Prints` when no meaningful custom homepage title is configured; honor a custom Shopify SEO title.
2. Preserve explicit Shopify page descriptions. Where missing, provide relevant homepage and collection fallbacks. Suggested homepage description: `Discover BLICKLI Swiss travel posters inspired by Engadin, Caumasee, Bernina, Bern, Langstrasse and Stoosbahn. Explore art prints of places worth keeping.`
3. Add `poster` to default product titles only when no custom SEO title is present and the title does not already identify a poster. Preserve custom titles and escape metadata.
4. Add homepage WebSite and Organization JSON-LD using the configured brand and canonical site URL. Add product JSON-LD using Shopify's native `structured_data` filter so prices, currency and availability come from the actual catalog.
5. Validate generated metadata, custom-title behavior, blank-description behavior, JSON escaping, pagination and unchanged canonical URLs. Run Shopify Theme Check and inspect a rendered development-theme preview where access is available.

This scope preserves the visual design and commerce behavior. No custom robots.txt or manually maintained sitemap is needed.

## Alternatives

- Search Console only: fastest way to diagnose and request indexing, but leaves the confirmed metadata problems in place.
- Focused theme fixes plus Search Console: recommended; improves metadata while obtaining Google's actual indexing diagnosis.
- Broader content and localization project: could help generic Swiss poster searches later, but requires decisions about target languages and content and is unnecessary for the initial branded-search investigation.

## Search Console actions

1. Open or verify the property for `https://blickli.ch/` (or the domain property `blickli.ch`). Existing DNS verification may already exist; absence of a verification meta tag does not establish otherwise.
2. Inspect the homepage and an example product URL. Record the indexing state, last crawl, chosen canonical and exclusion reason. Use Test Live URL when appropriate.
3. Submit `https://blickli.ch/sitemap.xml` if not already submitted.
4. Once the live URL is eligible, request indexing for the homepage. Monitor the reported status. Crawling can take days to weeks and inclusion is not guaranteed.

The old nordlys.app address still returns a separate Shopify storefront rather than redirecting. If Blickli replaces that store, decide separately whether to redirect the former site's equivalent URLs; do not change another store's domain settings as part of a theme patch.

## References

- Shopify metadata guidance: https://shopify.dev/docs/storefronts/themes/seo
- Shopify product structured data: https://shopify.dev/docs/api/liquid/filters/structured_data
- Shopify sitemap and verification: https://help.shopify.com/en/manual/promoting-marketing/seo/find-site-map
- Google indexing requests: https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl
- Google site names: https://developers.google.com/search/docs/appearance/site-names

## Work status

The user approved the focused implementation scope on 29 September 2026. Changes are prepared on `codex/blickli-seo` for a PR into `shopify-dev`. Development and live started at the same commit (`5f3dfeb`). The live theme has not been changed. Search Console and Shopify-native preview validation remain outstanding.
