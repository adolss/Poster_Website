# Blickli SEO implementation plan

**Goal:** Implement the focused SEO scope approved by the user on 29 September 2026 and prepare a PR for the unpublished development theme.

**Architecture:** One `snippets/seo.liquid` snippet owns titles, descriptions, canonical and JSON-LD metadata. `layout/theme.liquid` renders it in the head. Shopify catalog data remains the source for product structured data. No layout, product data, robots or sitemap changes.

**Tech stack:** Shopify Liquid; local LiquidJS rendering checks and Shopify Theme Check.

- [x] Verify the existing title/description defects with a rendered metadata check. Cover homepage defaults and merchant overrides, product defaults and overrides, collection description fallbacks, pagination, escaping, and canonical preservation.
- [x] Create `snippets/seo.liquid`. Start with `page_title` and `page_description`; only derive defaults when missing or when the page title equals the ordinary shop/product/collection title. Append the brand once, ignoring case, and distinguish paginated titles.
- [x] Render homepage WebSite and Organization JSON-LD with JSON-encoded brand/URL values, escaping `<` inside scripts. Use `{{ product | structured_data }}` on product pages.
- [x] Replace the existing metadata block in `layout/theme.liquid` with `{% render 'seo' %}`. Preserve `content_for_header` and all visual assets.
- [x] Run local Liquid rendering checks and Shopify Theme Check. Compare diagnostics against the unchanged base to separate pre-existing issues.
- [x] Review the diff and document Search Console setup and preview requirements for a PR into `shopify-dev`. Do not merge or promote to `blickli-live`.

The development and live branches were identical at `5f3dfeb` when work started. Search Console inspection and live Shopify rendering remain separate checks requiring access; local rendering does not establish Google indexing or Shopify's native product-schema output.
