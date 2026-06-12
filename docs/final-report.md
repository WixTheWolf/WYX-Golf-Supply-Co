# WYX Golf Supply Co. Rebuild — Final Report

Branch: `wyx-golf-supply` · Live: https://wyxgolfsupply.com · Staging: https://wyx-golf-supply-co.vercel.app/

This report closes out the 16-phase rebuild centered on **The Bag Test**: *"A product only belongs on WYX if it is useful enough to earn a spot in a real weekend golfer's bag."* It is written to be read by the operator before deciding to merge and launch — it is deliberately blunt about what's strong, what's thin, and what's still operational work rather than code.

---

## 1. Executive Summary

The storefront code is done and `tsc`/build-clean. The brand voice, offer structure, and trust-signal cleanup are in good shape. **The catalog is the weakest link** — 31 products genuinely earn a spot under the Bag Test standard, and the site (95 landing pages + ~117 journal posts) is sized for a much larger catalog than that. Nothing in this rebuild makes the catalog bigger or smaller; it makes the site honest about what it actually has. The remaining blockers before traffic should hit this branch are **operational, not code**: archive phantom products, verify the WYX10 discount code is real, wire up tracking pixels, and do a final manual checkout pass.

## 2. Positioning & Brand Voice — "The Bag Test"

- Tagline "Practical golf gear that earns a spot in the bag" and the Bag Test framing are now the spine of the homepage, the kit page, and `/the-bag-test`.
- Tone across rebuilt pages is practical/confident/lightly funny, not corny-luxury or AI-pattern hype. The one known residual issue is the older journal content (Section 12).
- This positioning is a genuine differentiator *if* the catalog backs it up — see Section 3.

## 3. Catalog Reality Check (Brutally Honest)

Per [product-integrity-audit.md](product-integrity-audit.md):

- **31 products** are in stock, have correct real photos, and are priced ≤$60 — these are the only products that should be in homepage hero slots, kits, or gift collections.
- **22 products** are collection-only (lower priority, niche, or higher price).
- **~116 products** (including 67 zero-inventory WYX-branded phantom listings) should be hidden or archived entirely.

That's roughly **31 products carrying the entire "Bag Test approved" promise**, two of which (GolfBays Bungee Cords, SYB Phone Pouch) pass the automated checks but were judged off-brand and excluded from featured placement (Section 9, [product-scoring-report.md](product-scoring-report.md)).

**This is thin.** It's enough for a focused, believable launch — but it is not enough to support 95 distinct landing pages without those pages overlapping heavily on the same handful of products. The rebuild does not paper over this; it's the reason Phase 11 recommends consolidation over expansion. If the operator's plan is to grow the catalog post-launch, that's fine — but the site as currently scoped should not be judged "small" by traffic-to-page-count standards. It should be judged on whether the 31 products it leads with are genuinely good, and they are.

## 4. Homepage

Rebuilt around the Bag Test positioning, the Weekend Golfer's Bag Upgrade Kit as the primary offer, and the FEATURE-tier product pool only. No fake reviews, no inflated claims, no premium bags in gift-flow slots.

## 5. Weekend Golfer's Bag Upgrade Kit (`/weekend-golfer-bag-upgrade-kit`)

4 confirmed-available, confirmed-correct-image products totaling **$79.88**. This is the cleanest, most defensible page on the site — every claim on it is checkable against live Shopify data.

## 6. Collection & SEO Landing Pages

~95 intent pages exist. Phases 6 and 11 cleaned up copy and produced a triage (Tier 1 keep/strengthen, Tier 2 merge/canonicalize, Tier 3 reassess) — see [seo-content-plan.md](seo-content-plan.md). No new pages were added this rebuild, consistent with "don't make the site bigger to look bigger."

## 7. Product Page Copy

Cleaned of unsupported performance claims ("restores spin," "lowers scores," etc.) and supplier/dropship language across reviewed pages.

## 8. Social Proof

Fake testimonials, star ratings, and review widgets removed/never added. Trust now rests on the Bag Test Promise (Section 10) and accurate shipping/returns copy rather than manufactured social proof.

## 9. Cart & Checkout Confidence Copy

The single highest-risk fix found in this rebuild was on `/shipping-returns`: the live copy described WYX's order handling via "trusted golf product partners," which is dropship/fulfillment-model language bordering on a banned phrase, sitting on the exact page a skeptical first-time buyer checks before trusting checkout. **Fixed this session** — see [revenue-and-trust-audit.md](revenue-and-trust-audit.md), Finding 1. Cart and buy-now flows were otherwise already clean from prior phases, and Shopify checkout itself was not touched.

## 10. Guarantee, Discount & Pricing Integrity

- **The Bag Test Promise**: 30-day "arrives damaged, incorrect, or doesn't match what you expected" guarantee — implemented as real policy copy, not a marketing flourish with no backing.
- **WYX10**: 10% off first order. **Not verified live this session** — see Section 16, this is a launch blocker if the code doesn't exist or is expired.
- No fake "$X value" bonus framing, no fake "54% off," no fake scarcity anywhere in rebuilt copy.

## 11. Email Capture & Launch Flows

Infrastructure (Shopify Customer create + Klaviyo dual-write + metaobject fallback, with `wyx-source`/`wyx-campaign` tagging) was already built and required no code changes. [email-and-launch-flows.md](email-and-launch-flows.md) maps the three named bonuses ("The Gift-Giver's Cheat Sheet," "The Bag Audit Checklist," "Optional Gift Reminder") to a concrete welcome-series sequence. **What's missing is account-level**: a Klaviyo API key (or a decision to use Shopify Email instead) and the actual email copy.

## 12. Shopify Automation & Tagging (Phase 12 — Not Done)

This is the largest **incomplete** item from the original 16-phase brief:

- The 67 zero-inventory WYX phantom products are not yet archived.
- The `bag-test-approved`/`needs-review`/`hide-from-featured`/etc. tags from [product-scoring-report.md](product-scoring-report.md) and `lib/bagTestScore.ts` have not yet been applied to live Shopify products.

This was deliberately **not executed** in this session because it requires live write operations against the production Shopify catalog (archiving products, bulk tag mutations via Admin API) — a hard-to-reverse, shared-system change that should be run deliberately by the operator (or by Claude with explicit sign-off), not bundled into an autonomous code-rebuild session. The tooling to do it (`scoreCatalog()`) is ready.

## 13. SEO Content Plan

[seo-content-plan.md](seo-content-plan.md) recommends consolidation (hub-and-spoke linking across the gift-occasion and price-tier page clusters) over adding new pages, and ties SEO quality directly to Section 12's journal-content cleanup.

## 14. Analytics & Tracking Readiness

[tracking-setup.md](tracking-setup.md) documents the existing `lib/analytics.ts` event mapping (GA4/Meta/TikTok) and what's fired from where. **Pixel IDs are not set in Vercel Production** and Shopify-side purchase tracking is not connected — both are Section 16 blockers.

## 15. Product Scoring & Merchandising Tags

`lib/bagTestScore.ts` (new this session) implements a 0-100 score, four placement tiers, and an 11-tag taxonomy, with a worked report in [product-scoring-report.md](product-scoring-report.md) covering the 31 FEATURE products and the two manual exceptions. This is the input Phase 12 needs.

## 16. Final QA

- `npx tsc --noEmit -p tsconfig.json` — **clean**.
- `next build` — **succeeds**, full sitemap of ~95 intent pages, ~117 journal posts, and product/kit/collection pages all build without error.
- Manual browser QA against staging and a real checkout test were **not performed** in this session (no browser tooling used) — see [launch-readiness-checklist.md](launch-readiness-checklist.md) for the manual pass still needed.

## 17. Launch Readiness Score: 6/10

**Why not lower**: the brand positioning is sharp and genuinely differentiated, the flagship offer ($79.88 kit) is fully real, the worst trust-leak (shipping-returns supplier language) is fixed, and the code is clean and builds.

**Why not higher**: three things that materially affect first-week revenue are unverified or undone — (1) whether WYX10 actually works, (2) Phase 12's catalog cleanup (67 phantom products still live, no merchandising tags applied), and (3) tracking pixels aren't connected, so the launch would fly blind on conversion data. None of these are big engineering lifts, but all three are the kind of thing that quietly kills a launch week if missed.

## 18. Top 10 Next Actions (Priority Order)

1. **Verify WYX10 exists and works in Shopify Admin.** If it doesn't, create it or remove every on-site reference before launch.
2. **Run Phase 12**: archive the 67 zero-inventory WYX phantom products and apply the `bagTestScore`/`merchandisingTags` output to live Shopify products.
3. **Connect GA4, Meta, and TikTok pixels** in Vercel Production env vars, and wire up Shopify-side purchase tracking.
4. **Place one real test order** end-to-end (cart and buy-now) and confirm checkout still works and all tracking events fire.
5. **Sweep `lib/journal.ts`/`lib/journalExtra.ts`** for the residual "highest-ROI"/unsupported-superlative language flagged since Phase 7 — highest-leverage remaining content fix.
6. Set up Klaviyo (or confirm Shopify Email) and write the 3-4 welcome-series emails mapped in [email-and-launch-flows.md](email-and-launch-flows.md).
7. Manual browser QA pass on homepage, kit page, `/the-bag-test`, a product page, cart, and `/shipping-returns` across mobile/desktop.
8. Build hub-and-spoke internal linking across the Tier 2 gift-occasion/price-tier page clusters per [seo-content-plan.md](seo-content-plan.md).
9. Re-confirm the kit's 4 component products are still in stock immediately before flipping traffic — inventory shifts daily on these vendor-supplied items.
10. After Phase 12 lands, revisit the Tier 3 single-product SEO pages for redirect/repurposing.

## Closing Note

This rebuild's job was not to make WYX look bigger — it's to make it believable. The site now tells a true story about a 31-product core catalog wrapped in a clear "earns its spot in the bag" promise, with the worst trust leaks removed. The gap between that story and the ~95-page site that surrounds it is real, and Phase 11/Section 13 names it directly rather than hiding it. Closing that gap — through catalog growth, content consolidation, or both — is the next phase of work, not a defect in this one.
