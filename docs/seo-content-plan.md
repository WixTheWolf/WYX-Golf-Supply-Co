# SEO Content Plan

## Starting Point: The Site Is Already Large

Before adding anything, it's worth being honest about scale. `app/sitemap.ts` currently includes:

- **~95 intent/landing pages** (`/golf-gifts-for-*`, `/golf-*` category pages, kits, occasion pages)
- **~117 journal posts** across `lib/journal.ts`, `lib/journalExtra.ts`, and `lib/journalPhase3.ts`
- **53 real sellable products** (per `product-integrity-audit.md`)

That's roughly **4 content pages for every 1 sellable product**. This is the opposite of the brief's core instruction — *"don't make site bigger to look bigger"* — and it creates real SEO risk: a large volume of landing pages targeting overlapping long-tail keywords ("golf gifts for boyfriend" vs "golf gifts for husband" vs "golf gifts for men") with a shared, thin pool of underlying products reads to Google (and to a skeptical visitor clicking through from search) as **programmatic, low-substance content** — the exact "dropshippy" impression the brief explicitly wants to avoid.

**The highest-leverage SEO move available right now is not "create more content" — it's making sure the content that exists earns its place.** This plan is therefore a consolidation-and-focus plan, not an expansion plan.

## 1. Page Inventory Triage

Group the ~95 intent pages into three tiers:

### Tier 1 — Keep & Strengthen (high-intent, maps to real inventory)
Pages built around products that are actually FEATURE-tier in the integrity audit: `/golf-gifts-for-dad`, `/golf-club-care`, `/golf-grips`, `/golf-training-aids`, `/golf-gloves`, `/golf-towels`, `/bag-essentials`, `/weekend-golfer-bag-upgrade-kit`, `/the-bag-test`. These should get the most internal links, the most journal cross-links, and any future content investment.

### Tier 2 — Merge or Canonicalize (overlapping audiences, same underlying products)
The relationship/occasion gift pages are heavily duplicated: `/golf-gifts-for-wife`, `/golf-gifts-for-girlfriend`, `/golf-gifts-for-mom`, `/golf-gifts-for-women` all draw from the same ~6-10 products with minor copy variation, as do `/golf-gifts-for-husband`, `/golf-gifts-for-boyfriend`, `/golf-gifts-for-men`. Similarly, the price-tier pages (`/golf-gifts-under-25`, `-35`, `-50`, `-60`, `-75`, `-150`) slice the same ~50 products six different ways.

**Recommendation**: Don't delete these (they capture real long-tail search volume and removing live, indexed pages has its own SEO cost). Instead:
- Pick one **canonical hub per cluster** (e.g. `/golf-gifts-for-women` as the hub, with `/golf-gifts-for-wife`, `/golf-gifts-for-girlfriend`, `/golf-gifts-for-mom` as supporting pages that each link back to the hub and to each other — proper hub-and-spoke internal linking, which most of these pages currently lack beyond a "More Gift Guides" footer block).
- For the price-tier pages, ensure each has at least one or two products *not* found on the others, so they're not byte-for-byte content duplicates with a different H1.

### Tier 3 — Reassess (low search intent or thin justification)
Pages like `/golf-arm-sleeves`, `/golf-compression-socks`, `/golf-impact-tape`, `/golf-bag-rain-cover` map to single low-inventory or COLLECTION_ONLY products per the integrity audit. If these products get archived in Phase 12, these pages should either be redirected to a relevant Tier 1 hub or repurposed around a product that's actually in stock — a live page for an unavailable product is worse for SEO than no page.

## 2. Journal Content — Cleanup Before Expansion

`lib/journal.ts` and `lib/journalExtra.ts` (1,500+ lines combined) contain the residual "highest-ROI" / fabricated-statistic language flagged in Phase 7 as an explicit follow-up. From an SEO standpoint this matters beyond brand voice: Google's helpful-content systems specifically devalue content with unsupported claims and AI-pattern superlatives ("the highest-ROI upgrade available," "90% of beginners," "studies show"). **Before writing any new journal posts, the existing 117 should be swept for the same banned-phrase patterns already fixed in the product pages** (`grep -rn "highest-ROI\|studies show\|research shows\|guarantee" lib/journal*.ts`). This is a content-quality fix that directly serves SEO, not just brand tone.

## 3. Internal Linking Strategy

- Every Tier 1 page should link to `/weekend-golfer-bag-upgrade-kit` and `/the-bag-test` — these are the pages that should accumulate the most internal link equity, since they're the actual offer.
- Journal posts should link to the specific product pages and Tier 1 category pages they reference, not just to `/journal` or the homepage.
- The footer/nav should make `/the-bag-test` (the positioning explainer) discoverable from every page — it's the page that explains *why* WYX is different, which matters for both SEO dwell time and conversion.

## 4. Technical SEO Checklist

- [x] `app/sitemap.ts` includes all pages, products, collections, and journal posts.
- [x] Canonical URLs set via `alternates.canonical` on landing pages (confirmed on pages reviewed in Phases 7/9).
- [x] FAQ and CollectionPage JSON-LD schema present on intent pages.
- [ ] Confirm `robots.txt` doesn't block any Tier 1 pages and correctly excludes `/cart`, `/api/*`.
- [ ] Once Phase 12 archives the ~67 phantom WYX products, remove their product URLs from the sitemap (handled automatically since `sitemap.ts` derives from `availableProducts()` — verify after archiving).
- [ ] Submit updated sitemap to Google Search Console after launch and monitor for "Discovered – currently not indexed" on Tier 3 pages, which would confirm the thin-content concern above.

## 5. Net Recommendation

Do not add new landing pages or journal posts as part of this launch. Instead:
1. Sweep `lib/journal.ts`/`lib/journalExtra.ts` for the same unsupported-claims patterns fixed in Phase 7 (highest single content-quality win available).
2. Build out hub-and-spoke internal linking among the Tier 2 clusters so the existing pages reinforce each other instead of competing.
3. Revisit Tier 3 pages once Phase 12's catalog cleanup lands — some may need to be redirected.
4. Treat any *future* page or post as conditional on a corresponding real, in-stock product — content should follow inventory, not the other way around.
