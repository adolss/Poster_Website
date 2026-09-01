# Norrvyn — Shopify theme

Custom Online Store 2.0 theme for norrvyn.ch, ported from the original
Norrvyn design (same palette, Caprasimo/Figtree type, poster cards,
responsive layout). Cart and checkout are native Shopify.

## Live and dev themes

Two themes, two branches — so work in progress never lands on the live shop.

| Theme in Shopify | Branch | State |
| --- | --- | --- |
| **Norrvyn (live)** | `shopify` | Published — serves norrvyn.ch |
| **Norrvyn (dev)** | `shopify-dev` | Unpublished — preview link only |

Connect each one in **Online Store → Themes → Add theme → Connect from
GitHub** → repo `adolss/Poster_Website` → pick the branch (theme files are at
the branch root). Publish only the live one; leave the dev theme unpublished
and open it with **Preview**.

### Day-to-day workflow

1. All changes — code or theme-editor tweaks — go to the **dev** theme.
   Shopify commits editor changes back to `shopify-dev` automatically.
2. Check the dev theme's preview link.
3. When it looks right, promote to live by merging the branch:
   `git push origin origin/shopify-dev:shopify` (fast-forward), or open a PR
   `shopify-dev` → `shopify` on GitHub if you want the diff in front of you.
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
   `www` CNAME at `shops.myshopify.com`; then add norrvyn.ch as a domain in
   Shopify (Settings → Domains) and set it primary.

## Files

- `layout/theme.liquid` — document shell, fonts, color tokens from settings
- `assets/norrvyn.css` — full design system + responsive layer
- `assets/norrvyn.js` — AJAX add-to-cart + live cart count
- `sections/` — hero, featured collection, value props, product, cart, etc.
- `templates/*.json` — OS 2.0 templates wiring sections to pages
