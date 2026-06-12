# WYX Site Audit — Production vs Working Branch (June 11, 2026)

## Base Decision

**Base chosen: local branch `feat/growth-pass-2-hidden-gems`** (8 commits ahead of `main`).

Production (wyxgolfsupply.com) deploys from `main` and serves the **old broad-catalog site**:
hero "Golf gear, curated.", department IA (Hats / Apparel / Tech / Practice / Swing), no Bag Test,
no kit offer, no gift positioning. It is clean but has no sales path.

The working branch contains the full Bag Test rebuild (commit `3162368` onward): kit page,
/the-bag-test, /the-roo, all situational gift pages, email capture, tracking scripts, and a
much larger verified catalog (125 live core-merch products with real Shopify CDN images).

**However**, a later commit on this branch (`24c0909` "Apple-store redesign") overwrote the Bag
Test homepage with a department-store homepage — silently reverting the positioning. That
regression is now fixed (see below).

## Audit Findings (and what was done)

| # | Finding | Severity | Action |
|---|---------|----------|--------|
| 1 | Homepage reverted to broad-catalog "Golf gear, curated." by the Apple-store redesign commit | CRITICAL | Restored the Bag Test homepage from `3162368` with brief-spec copy (hero, trust row, situations, under-$60 grid) |
| 2 | Header nav was Hats/Apparel/Tech/Practice/Swing (broad catalog IA) | HIGH | Replaced with The Kit / Golf Gifts / Trip Gear / Under $60 / The Bag Test / Shop All |
| 3 | Footer brand line + nav repeated broad-catalog positioning | HIGH | Footer now: "Practical golf gear that earns a spot in the bag." + sales-path nav |
| 4 | Site-wide default metadata (title/description/OG/Twitter/manifest) said "hats, apparel, tech, practice gear" | HIGH | All rewritten around practical gifts / Bag Test positioning |
| 5 | Kit was 4 items; "Tee Supply being sourced" note was stale — tee holders are now live in stock | HIGH | Kit upgraded to the ideal 5 items (towel, marker, tee holder, groove brush, glove caddie = $87.89, ~$79 with WYX10); sourcing note removed |
| 6 | "from most suppliers" public copy on /last-minute-fathers-day-golf-gifts FAQ | MEDIUM | Reworded — no supplier language |
| 7 | /short-list and /launch-marketing-kit are internal ops pages served publicly | MEDIUM | Already `robots: noindex` — verified; left in place (not linked from nav) |
| 8 | 10 Dartee Golf belts at $89.99–$99.99 with cryptic titles ("Black Birdie", "Gray Eyed Gator") | MEDIUM | Real Shopify Collective vendor; over-$60, generic feel → lowest quality scores already exclude them from homepage/gift flows; collection-only. No fake data involved. Documented in product-scorecard.md |
| 9 | Club Care category had only 2 products due to a categoryFor() ordering bug | MEDIUM | Fixed earlier this session (lib/catalog.ts) — Club Care now 4; every category ≥3 |
| 10 | Cart copy | — | Already matches spec exactly ("Your bag is empty. Let's fix that before the next tee time." / WYX10 reminder / plain "Checkout" button) |
| 11 | Fake proof scan (testimonials, star ratings, scarcity, "Boys Weekend", "real supplier photos") | — | None found anywhere in app/ or components/ |
| 12 | All 9 required SEO pages exist (/golf-gifts, /golf-gifts-for-dad, /golf-gifts-under-60, /golf-trip-gear, /bachelor-party-golf-gifts, /scramble-prizes, /bag-upgrades, /the-bag-test, /the-roo) with canonicals | — | Verified present |

## Verification

- `tsc --noEmit`: clean
- `next build`: ✓ Compiled, 237/237 static pages
- All 5 kit handles resolve live via Storefront API with available variants

## Launch blocker

These changes exist only on `feat/growth-pass-2-hidden-gems`. **Production will keep serving
the old broad-catalog site until this branch is merged to `main`** (Vercel deploys main).
That merge/push is the single highest-leverage remaining action.

## Addendum — Image integrity audit (June 12, 2026)

A catalog-wide duplicate-image sweep found 17 supplier images shared across ~45
unrelated products (fallout from an automated image-fix run). All 36 affected
handles with provably wrong photos are hidden via `knownImageMismatchHandles`
in `lib/productReadiness.ts` (each with the verified reason inline).

**Restore-from-seed was evaluated and rejected:** spot-verification showed the
original seed images were Unsplash keyword guesses that frequently do not
depict the product at all (the polo's "original" is a cat-graphic t-shirt; the
iron headcover set's is a landscape photo). The verified-dropship catalog
covers only 1 of the 36 handles. 

**The only honest recovery path is real product photos** — upload via Shopify
admin (or attach from actual supplier listings) for any handle in
`knownImageMismatchHandles`, then remove that handle from the list to un-hide.
Until then the storefront serves 91 products whose featured images were each
visually verified against their titles.

Categories temporarily below the 3-item bar as a result: Apparel (1),
Club Care (2), Grips (2).
