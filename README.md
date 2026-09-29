# BLICKLI — Shopify theme

Custom Online Store 2.0 theme for blickli.ch (originally ported from the
Norrvyn poster site design, since rebranded to BLICKLI). Cart and checkout are native Shopify.

## Live and dev themes

Two themes, two branches — so work in progress never lands on the live shop.

| Theme in Shopify | Branch | State |
| --- | --- | --- |
| **BLICKLI (live)** | `blickli-live` | Published — serves blickli.ch |
| **Poster_Website/shopify-dev** | `shopify-dev` | Unpublished — preview link only |

Connect each one in **Online Store → Themes → Add theme → Connect from
GitHub** → repo `adolss/Poster_Website` → pick the branch (theme files are at
the branch root). Publish only the live one; leave the dev theme unpublished
and open it with **Preview**.

### Day-to-day workflow

1. All changes — code or theme-editor tweaks — go to the **dev** theme.
   Shopify commits editor changes back to `shopify-dev` automatically.
2. Check the dev theme's preview link.
3. When it looks right, promote to live by merging the branch:
   `git push origin origin/shopify-dev:blickli-live` (fast-forward), or open a PR
   `shopify-dev` → `blickli-live` on GitHub if you want the diff in front of you.
   Shopify syncs the live theme within a minute.

### Two things to know

- **Same store data.** An unpublished theme previews the *live* products,
  prices and orders — it is a safe sandbox for design and code, not for
  product data. For a fully separate playground (own products, test orders),
  create a free **development store** in Shopify Partners and connect the
  `shopify-dev` branch there instead.
- **`config/settings_data.json` is written by the theme editor** on both
  themes, so it is the one file that can conflict when merging. If git flags
  it, keep the version from whichever theme you last styled deliberately
  (usually dev) rather than hand-merging it.

## Store setup checklist

1. **Products** — one per poster, price €70, one variant, upload the PNG from
   `posters/` on the `main` branch. Set:
   - a tag for the chip shown on cards: `Mountains`, `Lakes`, `City`, `Wildlife`…
   - description = the short poster blurb
   - optional metafield `custom.subtitle` (single line text) for the
     sub-line, e.g. "Wallis · Schweiz"
   - "coming soon" posters: create the product without an image and tag it
     `coming-soon` — cards render the striped placeholder, and if you also
     untick "Track quantity"/set it unavailable the buy button disables.
2. **Collection** — create "Posters" containing all of them (or rely on the
   automatic *All* collection). Pick it in the theme editor: Header,
   Hero (collage pulls its three images from the collection's first
   products) and Featured collection sections.
3. **Page** — create page "Our story" with template `page.our-story`
   (the copy is pre-seeded; anything you type in the page body replaces it).
   Select it in the Header section so the nav link appears.
4. **Payments** — activate Shopify Payments (TWINT, cards, Apple/Google Pay).
5. **Shipping** — set a free-shipping rate for your zones to match the
   "free EU shipping" promise, or edit the texts in the theme editor.
6. **Domain** — when ready to go live: in GoDaddy replace the four GitHub
   Pages A records with Shopify's A record `23.227.38.65` and point the
   `www` CNAME at `shops.myshopify.com`; then add blickli.ch as a domain in
   Shopify (Settings → Domains) and set it primary.

## Files

- `layout/theme.liquid` — document shell, fonts, color tokens from settings
- `assets/blickli.css` — full design system + responsive layer
- `assets/blickli.js` — AJAX add-to-cart + live cart count
- `sections/` — hero, featured collection, value props, product, cart, etc.
- `templates/*.json` — OS 2.0 templates wiring sections to pages

## SEO

`snippets/seo.liquid` renders page titles, descriptions, canonical URLs and
structured data. Custom SEO titles and descriptions in Shopify take precedence;
the homepage gets a Swiss travel poster title when its title is only the store
name. Product titles get “Poster” only when using the default product title.
Shopify supplies product structured data from the catalog.

After previewing and publishing the theme changes, inspect `https://blickli.ch/`
in Google Search Console, submit `https://blickli.ch/sitemap.xml` if needed, and
request indexing. Shopify already maintains the sitemap and robots.txt. Metadata
changes do not guarantee indexing; use Search Console's reported indexing reason
to diagnose any remaining exclusion.

Run the metadata rendering checks with `npm ci --prefix tests` followed by
`npm test --prefix tests`. They use LiquidJS with Shopify globals and a fixture
for the native `structured_data` filter. Before publishing, inspect homepage,
collection and product page source in the Shopify development-theme preview,
confirm custom SEO overrides, and validate the real product JSON-LD with Google's
[Rich Results Test](https://search.google.com/test/rich-results).
