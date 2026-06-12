# Launch Readiness Checklist

This checklist consolidates the findings from Phases 1-13 into a single pre-launch punch list. Items are grouped by whether they **block launch** (must be done before sending traffic to the rebuilt site) or are **post-launch follow-ups** (don't block, but should happen soon after).

## Blocking — Do Before Launch

### Catalog & Trust
- [x] Remove "trusted golf product partners" / dropship-model language from `/shipping-returns` (done — see [revenue-and-trust-audit.md](revenue-and-trust-audit.md), Finding 1).
- [x] Confirm no fake testimonials, star ratings, inflated bonus values, or fake scarcity anywhere on rebuilt pages (done in Phases 4-8).
- [ ] **Archive the 67 zero-inventory WYX phantom products** identified in [product-integrity-audit.md](product-integrity-audit.md) (Phase 12). Until this happens, those handles remain technically reachable via direct URL and Shopify search, even though they're excluded from the rebuilt storefront's grids/sitemap.
- [ ] Apply the `bag-test-approved` / `needs-review` / `hide-from-featured` tags from [product-scoring-report.md](product-scoring-report.md) to live Shopify products (Phase 12), including the manual exclusions for GolfBays Bungee Cords and SYB Phone Pouch.

### Discount & Offer Validity
- [ ] **Verify WYX10 is an active, working Shopify discount code** before launch. If it's expired or doesn't exist, either create it or remove every on-site reference to it — a dead discount code is one of the fastest ways to lose first-time-buyer trust.
- [ ] Confirm the Weekend Golfer's Bag Upgrade Kit's 4 component products are all still in stock and priced as documented ($79.88 total) — re-check immediately before launch since inventory can shift daily.

### Tracking
- [ ] Set `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_META_PIXEL_ID`, `NEXT_PUBLIC_TIKTOK_PIXEL_ID` in Vercel Production env vars (see [tracking-setup.md](tracking-setup.md)).
- [ ] Connect GA4/Meta/TikTok purchase tracking inside Shopify Admin (Settings → Customer events), since `Purchase` cannot fire from the Vercel storefront.
- [ ] Place one low-value test order end-to-end and confirm `ViewContent` → `AddToCart` → `InitiateCheckout` → `Purchase` all land in their respective platforms.

### Final QA (Phase 15)
- [ ] `npx tsc --noEmit -p tsconfig.json` passes clean (last verified this session — re-run after any further edits).
- [ ] Production build succeeds (`next build` or equivalent) with no new warnings.
- [ ] Manual pass on: homepage, `/weekend-golfer-bag-upgrade-kit`, `/the-bag-test`, one product page, `/cart`, `/shipping-returns`, one gift-intent page (e.g. `/golf-gifts-for-dad`).
- [ ] Confirm Shopify checkout still completes from both single-product "Buy Now" and cart flows — no regressions from the cart/checkout copy changes (Phase 9).

## Post-Launch Follow-Ups (Don't Block, But Track)

### Email & CRM (Phase 10)
- [ ] Set up Klaviyo (or commit to Shopify Email) and configure `KLAVIYO_PRIVATE_API_KEY` / `KLAVIYO_LIST_ID`.
- [ ] Write the 3-4 welcome-series emails delivering "The Bag Audit Checklist," "The Gift-Giver's Cheat Sheet," and the kit pitch, segmented by `wyx-source`/`wyx-campaign` tags.
- [ ] Configure Shopify's native abandoned-cart and order-confirmation emails with WYX branding.

### SEO / Content (Phase 11)
- [ ] Sweep `lib/journal.ts` and `lib/journalExtra.ts` for the residual "highest-ROI" / unsupported-superlative language flagged in Phase 7 — this is the single highest-leverage content fix remaining and applies to ~108 of the ~117 journal posts.
- [ ] Build hub-and-spoke internal linking across the Tier 2 gift-occasion and price-tier page clusters.
- [ ] After Phase 12's catalog cleanup, revisit the Tier 3 single-product pages (`/golf-arm-sleeves`, `/golf-compression-socks`, `/golf-impact-tape`, `/golf-bag-rain-cover`) for redirect or repurposing.

### Catalog (Phase 12, ongoing)
- [ ] Re-run `scoreCatalog()` periodically (e.g. monthly) as inventory changes, and update Shopify tags accordingly so featured placement stays accurate without manual review of the full catalog each time.

## Open Business Questions (Not Code — Need an Answer From the Operator)

Carried over from [revenue-and-trust-audit.md](revenue-and-trust-audit.md):

- Is the free-shipping threshold (if any) compatible with the $79.88 kit price and the typical $10-35 single-item gift purchase, or does it create a "just $X more" upsell tension that's currently unaddressed?
- Is the 31-product FEATURE pool (see [product-integrity-audit.md](product-integrity-audit.md)) considered sufficient for launch, or is there a plan to add genuinely new, vetted products before/shortly after launch? The honest answer should inform how aggressively Phase 11's content consolidation proceeds.

## Net Assessment

The code-side work for this rebuild (Phases 1, 4-11, 13) is complete and `tsc`-clean. What remains before traffic should hit this branch is almost entirely **operational**, not code: archiving phantom products and applying merchandising tags in Shopify Admin (Phase 12), verifying the WYX10 discount code is live, wiring up the three tracking pixels and Shopify's purchase-event integrations, and a final manual QA pass through checkout. None of these require further storefront code changes — they're configuration and verification steps that should be run from Shopify Admin, Vercel's dashboard, and a real browser session against the staging URL.
