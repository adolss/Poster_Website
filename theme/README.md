# Norrvyn — Shopify theme

Custom Online Store 2.0 theme for norrvyn.ch, ported from the original
Norrvyn design (same palette, Caprasimo/Figtree type, poster cards,
responsive layout). Cart and checkout are native Shopify.

## Connect via GitHub

In Shopify admin: **Online Store → Themes → Add theme → Connect from GitHub**
→ repository `adolss/Poster_Website` → branch **`shopify`** (theme files are
at the root of that branch). Then **Publish** it (or preview first with
Customize). Edits made in Shopify's theme editor are committed back to the
branch automatically.

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
