# Product Scoring & Merchandising Tags

This phase formalizes the ad-hoc FEATURE / COLLECTION_ONLY / HIDE classification from [product-integrity-audit.md](product-integrity-audit.md) into a reusable 0-100 score and a tag taxonomy, implemented in [`lib/bagTestScore.ts`](../lib/bagTestScore.ts).

## Scoring Formula

`bagTestScore(product)` returns 0-100, built from the existing `productQualityScore` (price, category, keyword fit) normalized to a 0-70 base, plus pass/fail adjustments:

- **Hard caps** (regardless of base score):
  - Not available for sale, or no purchasable variant → capped at 20
  - Known image/product mismatch (`hasKnownImageMismatch`) → capped at 30
- **Penalties**: misleading product media (`-15`), premium golf bag (`-10`)
- **Bonuses**: passes `isBuyTodayProduct` (`+20`), has a featured image (`+5`)

## Placement Tiers

| Score | Tier | Where it can appear |
|---|---|---|
| 85-100 | `homepage` | Homepage, kits, gift collections, campaign pages |
| 70-84 | `collection-only` | Category/collection pages and `/products`, but not homepage hero or kits |
| 50-69 | `hidden-needs-improvement` | Hidden from customer-facing pages until photo/copy/inventory is fixed |
| <50 | `hidden` | Hidden completely |

## Tag Taxonomy

`merchandisingTags(product)` derives these tags automatically:

| Tag | Meaning | Trigger |
|---|---|---|
| `bag-test-approved` | Cleared for homepage/kit placement | `placementTier === 'homepage'` |
| `needs-review` | Score is borderline (50-69) | `placementTier === 'hidden-needs-improvement'` |
| `hide-from-featured` | Score too low to feature anywhere | `placementTier === 'hidden'` |
| `premium` | Premium golf bag | `isPremiumGolfBag` |
| `giftable` | Under $60, passes buy-today check | price ≤ 60 and `isBuyTodayProduct` |
| `under-60` | Under $60 | price ≤ 60 |
| `dad-gift`, `trip-gear` | Practical small accessory under $75 | title/type matches marker/towel/glove/grip/ball/tee/divot/brush/groove/caddie/headcover/hat/cap/belt |
| `scramble-prize` | Cheap, fun, group-friendly | matches marker/ball/game/prize/bundle, price ≤ 50 |
| `bag-upgrade` | Core bag-improvement category, buy-today | category in Golf Balls/Gloves/Grips/Towels/Accessories/Club Care/Headwear/Apparel |
| `kit-eligible` | Eligible for inclusion in a kit (Bag Upgrade Kit, etc.) | buy-today, score ≥ 50, price ≤ 35 |

## Applying This to the Phase 2 Catalog

Per `product-integrity-audit.md`, the 31 FEATURE products are all in stock, real-photo, ≤$60 — they will score in the 85-100 `homepage` band under this formula and should receive `bag-test-approved` plus the relevant `giftable`/`under-60`/`dad-gift`/`trip-gear`/`bag-upgrade`/`kit-eligible` tags based on category and price.

**Two exceptions called out in Phase 2** pass the automated checks (in stock, real image, ≤$60) but are weak fits for "things a weekend golfer reaches for":

- **GolfBays Bungee Cords** ($24.99) — automated score lands in `homepage` range, but should be manually tagged `needs-review` instead of `bag-test-approved` and excluded from homepage/kit/gift placements. Bungee cords are a bag-organization accessory with no clear "Bag Test" story.
- **SYB Phone Pouch** ($25.48) — same situation. An EMF-blocking phone pouch is off-positioning for a golf gear brand and already excluded from core storefront grids per `lib/merchandisingFilters.ts`.

This is the one place where the automated score and the editorial judgment diverge — the formula optimizes for "in stock, cheap, real photo," but doesn't know whether a product *fits the brand story*. **Recommendation**: treat `bagTestScore() >= 85` as necessary but not sufficient for `bag-test-approved` — these two handles should be added to a small manual exclusion list (similar to `homepageBlockedHandles` in `lib/merchandisingFilters.ts`) alongside the automated tagging.

The 22 COLLECTION_ONLY products (SHOCK'D Mega Pack, Golf or Die Game Set, Dartee belts, GolfBays storage items) will score in the 70-84 `collection-only` band — no `bag-test-approved` tag, but visible in category grids.

The 6 HIDE_UNTIL_FIXED WYX products and the ~110 HIDE_COMPLETELY products will score below 50 (unavailable, draft, or otherwise gated) and receive `hide-from-featured`.

## Phase 12 Handoff

`scoreCatalog(products)` in `lib/bagTestScore.ts` takes the live product list (from `getProducts()`) and returns `{ handle, title, score, tier, tags }[]` sorted by score — ready to drive a Shopify tag-sync script. Phase 12 should:

1. Run `scoreCatalog()` against the live catalog.
2. Apply the manual exclusion list (GolfBays Bungee Cords, SYB Phone Pouch, and any future "passes the formula but wrong brand fit" cases) before tagging.
3. Push the resulting tags to each product via the Admin API (`tagsAdd`/`tagsRemove` mutations), so collection filters and future automation can read merchandising state directly from Shopify tags instead of recomputing scores at request time.
