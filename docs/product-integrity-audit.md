# Product Integrity Audit

Generated against a full Shopify Admin export of 169 products (138 active, 31 draft), pulled via `scripts/_tmp-list-all-products.ts`. Classification follows The Bag Test: **FEATURE** (homepage/kit-eligible), **COLLECTION ONLY** (real, in-stock, but not a first-sale lead), **HIDE UNTIL FIXED** (real product, but media or data needs fixing first), **HIDE COMPLETELY** (no inventory, mismatched, or otherwise not sellable right now).

## Summary

| Bucket | Count |
|---|---:|
| FEATURE | 31 |
| COLLECTION ONLY | 22 |
| HIDE UNTIL FIXED | 6 |
| HIDE COMPLETELY | 110 (79 ACTIVE + 31 DRAFT) |

**Headline finding:** of the 138 ACTIVE products in Shopify, only 53 (31 FEATURE + 22 COLLECTION ONLY) are real, in-stock, sellable products a customer should ever see. The other 85 ACTIVE+DRAFT products are either out of stock, drafts, or have a confirmed image/data problem. This is the gap between "looks like a big catalog" and "is actually a believable shop" — and it's the reason the site must lead with a small, sharp set of products rather than the full count.

## Critical Fixes Applied This Session

1. **`bamboo-performance-golf-tees-50-pack` — confirmed image/product mismatch.** The featured image shows alignment training sticks, not golf tees. This product was in the draft Bag Upgrade Kit lineup; it has been removed from the kit and is now excluded sitewide via a new `hasKnownImageMismatch()` check in [`lib/productReadiness.ts`](../lib/productReadiness.ts).
2. **Tag-based placeholder-image exclusion.** Six WYX-vendor products carry the existing `wyx-auto-paused:placeholder-image` tag (set by prior automation): `groove-sharpener-cleaner-tool`, `magnetic-golf-club-brush-cleaner`, `premium-cabretta-leather-golf-glove`, `coastal-green-driver-headcover`, `alignment-putting-mirror`, `12-foot-golf-ball-retriever`. Previously, WYX-vendor ("curated") products bypassed all media-quality checks in `availableProducts()`. That bypass has been narrowed: any product carrying a `placeholder-image` tag is now excluded from `availableProducts()` regardless of vendor. See [`lib/catalog.ts`](../lib/catalog.ts) and [`lib/productReadiness.ts`](../lib/productReadiness.ts).
3. **Bag Upgrade Kit recomposed.** Because the groove sharpener carries the placeholder-image tag, it was swapped out of the kit for **Pulse Golf Overgrip Tape** ($17.99, VukGripz — image visually confirmed to show grips, real product photography). New kit: Tri-Fold Microfiber Golf Towel ($16.99) + Three Rail Ball Marker ($19.95) + Pulse Golf Overgrip Tape ($17.99) + Glove & Accessory Caddie - Gray ($24.95) = **$79.88**, within a dollar of the brief's $79 target. The fifth "tee supply" slot is shown as an honest "being sourced" card with a waitlist link rather than a faked product.

## FEATURE — Homepage / Kit Eligible (31)

These are in stock, have real images, and are priced at or under $60. This is the pool the homepage, Bag Upgrade Kit, and gift collections should draw from.

| Product | Vendor | Price | Inventory |
|---|---|---:|---:|
| Tri-Fold Microfiber Golf Towel | WYX Golf Supply Co. | $16.99 | 84 |
| Three Rail Ball Marker | OnPointGolf.us | $19.95 | 856 |
| Glove & Accessory Caddie - Gray | Pins and Aces | $24.95 | 156 |
| Glove & Accessory Caddie - Black | Pins and Aces | $24.95 | 20 |
| Magnet Caddie | Pins and Aces | $25.00 | 20 |
| Pulse Golf Overgrip Tape | VukGripz | $17.99 | 1,578 |
| Stick Grips Golf Camo Golf Grip | Stick Grips | $13.49 | 8,991 |
| Blue Ridge Golf Co. Golf Towels | Blue Ridge Golf Co. | $19.99 | 49 |
| Two-Sided Metal Golf Ball Marker – 5 Color Combo Pack | Blue Ridge Golf Co. | $34.99 | 9 |
| Carolina Blue Two-Sided Golf Ball Marker - 2 Pack | Blue Ridge Golf Co. | $14.99 | 25 |
| Blue Ridge Golf Ball Markers - Set Of 2 | Blue Ridge Golf Co. | $9.99 | 25 |
| Topographic Carolina Blue Driver Headcover | Blue Ridge Golf Co. | $59.99 | 12 |
| Topographic Edition - Pure White / Embroidered Carolina Blue | Blue Ridge Golf Co. | $49.99 | 8 |
| Classic Leather Edition - Walnut Brown / Midnight Black | Blue Ridge Golf Co. | $44.99 | 12 |
| Park Paisley Women's Gold Golf Glove | VivanTee Golf | $30.00 | 58 |
| Dartee Golf Glove | Dartee Golf | $24.95 | 183 |
| SHOCK'D Golf Balls | SHOCK'D Golf Balls | $19.99 | 150,199 |
| SHOCK'D Golf Balls - Patriot Edition | SHOCK'D Golf Balls | $19.99 | 401 |
| The Bolt - Ball Marker | SHOCK'D Golf Balls | $7.00 | 93 |
| GOT 'EM Ball Marker – Limited Edition | SHOCK'D Golf Balls | $7.00 | 25 |
| BUY 3 GET 1 FREE BUNDLE - SHOCK'D Golf Balls | SHOCK'D Golf Balls | $59.99 | 26,057 |
| Mafia Mallet Putter Cover | Guerrilla Golf | $45.00 | 48 |
| Dude Abides v2 Mallet Putter Cover | Guerrilla Golf | $45.00 | 95 |
| Pimento Waffle | Guerrilla Golf | $59.99 | 35 |
| Hello Friends T-Shirt | Guerrilla Golf | $25.00 | 47 |
| Evil Ape | Guerrilla Golf | $55.00 | 21 |
| Guerrilla Chief Driver Cover | Guerrilla Golf | $55.00 | 45 |
| Pimento Drip Blade | Guerrilla Golf | $40.00 | 5 |
| Augusta Bear Hat | Guerrilla Golf | $35.00 | 21 |
| GolfBays Bungee Cords | GolfbaysUSA | $24.99 | 212 |
| SYB Phone Pouch | Shield Your Body | $25.48 | 2,317 |

Note: "GolfBays Bungee Cords" and "SYB Phone Pouch" pass the automated checks (in stock, real image, under $60) but are weak fits for the Bag Test positioning — bungee cords and an EMF phone pouch are not "things a weekend golfer reaches for." Recommend tagging both `needs-review` in Phase 3 rather than actively featuring them; leave them in `/products` and category grids where relevant, but do not use them in homepage hero slots, kits, or gift collections.

## HIDE UNTIL FIXED (6)

All six are WYX-vendor products carrying the `wyx-auto-paused:placeholder-image` tag from prior automation. They are in stock and otherwise viable, but should stay out of `availableProducts()` (now enforced in code) until each gets a confirmed, correct product photo.

| Product | Price | Inventory | Fix Needed |
|---|---:|---:|---|
| Groove Sharpener and Cleaner Tool | $14.99 | 90 | New product photo confirmed to match this exact item |
| Magnetic Golf Club Brush Cleaner | $18.99 | 72 | New product photo |
| Premium Cabretta Leather Golf Glove | $24.99 | 64 | New product photo |
| Coastal Green Driver Headcover | $39.99 | 38 | New product photo |
| Alignment Putting Mirror | $29.99 | 45 | New product photo |
| 12-Foot Golf Ball Retriever | $34.99 | 32 | New product photo |

Once any of these gets a confirmed real photo, removing the `wyx-auto-paused:placeholder-image` tag in Shopify will make it eligible again automatically — no code change needed.

## COLLECTION ONLY (22)

In stock, real products, priced over $60 — fine for category pages and dedicated collections, not for first-sale homepage slots or the Bag Upgrade Kit.

- **SHOCK'D MEGA PACK (4 Red + 4 White)** — $120, prank balls. Good fit for `/scramble-prizes`, `/bachelor-party-golf-gifts`.
- **Golf or Die Game Set** — $63, golf trip game set. Good fit for `/golf-trip-gear`, `/bachelor-party-golf-gifts`.
- **14 Dartee Golf belts** ($69.99–$99.99, "Golf Belt" product type, names like Bayou Brown Gator, Charcoal Mirage, Sea Swell Blue) — real leather/exotic-pattern belts. Fine for `/golf-apparel` or a dedicated belts collection; too taste-specific and too expensive for gift/kit pages.
- **3 GolfbaysUSA storage/display items** ($139.99–$199.99: Rubber Ball Tray, Single Bag Display Storage Organiser, Club Display Rack) — home storage/display equipment, not "weekend bag" gear. Two of three (Rubber Ball Tray, Club Display Rack) are already excluded from `availableProducts()` by the existing `weakPublicTerms` filter. Recommend extending that filter to also catch "display storage organiser" so all three are consistently excluded from public gift/kit collections, or confirm a `/golf-storage` or similar dedicated page if these should be sold at all.

## HIDE COMPLETELY (110)

- **31 DRAFT products** — never published, no action needed beyond leaving as drafts.
- **79 ACTIVE products with no available inventory**, of which:
  - 1 is the confirmed image-mismatch (`bamboo-performance-golf-tees-50-pack`).
  - 11 are GolfbaysUSA simulator/enclosure/mat/case products — far outside the Bag Test positioning even if restocked.
  - **67 are WYX Golf Supply Co.-branded products** (rangefinders, GPS watches, polos, hoodies, putting mats, alignment sticks, umbrellas, divot tools, headcovers, etc.) that are ACTIVE in Shopify but have zero available inventory.

These 67 phantom WYX products are not currently exposed to customers — `app/products/[handle]/page.tsx` already calls `notFound()` for any product that is not `availableForSale`, and the sitemap only includes `availableProducts()`. So there is no live customer-facing trust issue today. However, this is a large amount of dead weight sitting in the Shopify catalog under the WYX brand name with zero stock, which:

- Risks future regressions if anyone changes the availability gate without realizing how much is behind it.
- Suggests these were bulk-imported as placeholders for a catalog that was never built out.

**Recommendation for Phase 12:** archive (set status to `ARCHIVED`) the 67 zero-inventory WYX-vendor ACTIVE products in Shopify Admin, or tag them `wyx-auto-paused:no-inventory` consistently (some already aren't tagged) so future automation can identify and clean them up in bulk. This is a Shopify Admin data change, not a code change — flagging here for a deliberate, confirmed cleanup pass rather than doing it inline.

## Net Effect on "Believable Catalog" Positioning

The real, sellable WYX storefront is **53 products** (31 FEATURE + 22 COLLECTION ONLY), spread across towels, markers, caddies, grips, gloves, balls, headcovers, belts, and personality pieces (Guerrilla Golf). That is a small, focused catalog — exactly the size The Bag Test should be proud of. The site should not present itself as having "138 products" or "169 products" anywhere; the homepage `proofStats` already avoid this (Phase 4), and no other page should surface raw catalog counts either.
