# Revenue & Trust Audit

This audit covers the two things that determine whether WYX converts a first-time visitor into a paying, returning customer: **how the site makes money** (revenue architecture) and **why a stranger should believe it** (trust signals). It complements [product-integrity-audit.md](product-integrity-audit.md) (catalog quality), [conversion-audit.md](conversion-audit.md) (technical funnel), and [product-merchandising-audit.md](product-merchandising-audit.md) (assortment).

## 1. Revenue Architecture — Current State

### Primary offer
- **The Weekend Golfer's Bag Upgrade Kit** (`/weekend-golfer-bag-upgrade-kit`) is the flagship offer: 4 confirmed-in-stock products totaling **$79.88**, built entirely from real Shopify inventory with verified images. This is the right anchor — a single, specific, believable bundle beats a wall of unrelated SKUs.
- The kit page carries **The Bag Test Promise** (30-day "arrives damaged, incorrect, or doesn't match" guarantee) — honest, specific, and doesn't promise performance outcomes.

### Discount mechanism
- **WYX10** (10% off) is used consistently as the single sitewide incentive across the homepage, kit page, cart, and ~30+ landing pages. One code, one consistent value — good. Confirm in Shopify Admin that `WYX10` is live, uncapped (or capped sensibly), and not set to expire silently — a dead discount code referenced sitewide would be a trust failure on first checkout.

### AOV mechanics
- **Free-shipping goal at $75**, surfaced via `CartProgress` in both `CartPage.tsx` and `CartProvider.tsx` (duplicated logic, same copy — see Phase 9 note below). Framed correctly as a "goal" with "shipping options confirm at checkout," not a hard promise — this avoids the "no overpromised shipping" trap while still nudging basket size.
- The $79.88 kit price sits just above the $75 threshold, which is a reasonable AOV anchor but means the kit alone doesn't visibly demonstrate the free-shipping goal — a single-kit buyer won't feel the "almost there" pull. Not a blocker, just a missed nudge.

### Email capture
- `EmailCapture` component is wired into nearly every landing page with page-specific `source`/`campaign` props (e.g. `golf-gifts-for-beginners` / `beginner_golf_gifts`). This is good infrastructure for list-building, **but** it's only revenue-generating once Phase 10 (email/launch flows) defines what these subscribers actually receive. Right now the capture exists without a confirmed downstream flow — leads collected with no follow-up are a wasted asset, not a liability, but they're not revenue yet either.

### Bonuses
- "The Gift-Giver's Cheat Sheet," "The Bag Audit Checklist," and "Optional Gift Reminder" are framed without fabricated dollar values — consistent with the no-fake-bonus-value constraint. These work as **retention/differentiation** levers (reasons to buy from WYX vs. a generic Shopify search result), not as primary revenue drivers. Their value depends entirely on Phase 10 delivering them via a real flow.

## 2. Trust Signal Inventory

| Signal | Status | Notes |
|---|---|---|
| Reviews / star ratings | **Absent (correct)** | No fake reviews anywhere — confirmed via Phase 8 sweep. This is the right call given WYX has no real review volume yet, but it does mean product pages lean entirely on copy + photos to build confidence. |
| Guarantee | **Present, honest** | The Bag Test Promise (30-day damaged/incorrect/mismatch policy) is specific and deliverable. |
| Shipping & Returns policy | **Present, hedged correctly** | `/shipping-returns` previously read "Most items ship through trusted golf product partners" — internal fulfillment-model language exposed to customers, bordering on the banned "fulfillment partner" phrasing. **Fixed this session** to "Timing can vary by item and destination, and the latest estimate is shown at checkout before you place your order." |
| Per-page shipping estimates | **Mostly consistent** | "Ships in 1-3 days" appears on ~30 landing pages; two product-specific pages (`golf-bag-rain-cover`, `golf-impact-tape`) say "ships in 3-5 business days," and `/faq` says "1-2 business days to ship, 3-5 business days standard delivery." These are *more conservative* than the dominant claim, not overpromises, and the canonical `/shipping-returns` page now hedges with "timing can vary by item" — so the variance is defensible as item-specific rather than inconsistent. No further action needed. |
| Discount code framing | **Compliant** | "Use WYX10 at checkout for 10% off" — accurate, no false "automatic" claims found. |
| Scarcity / urgency | **Absent (correct)** | No fake countdown timers or "only X left" language found in the pages reviewed this session. |
| Support contact | **Present** | `support@wyxgolfsupply.com` surfaced on `/faq` and `/shipping-returns` via `lib/support.ts`. |
| Pricing claims (bonus "$X value") | **Compliant** | No "$47 value"-style fabricated bonus pricing found. |
| Performance claims | **Largely cleaned (Phase 7)** | Removed "restores spin," "extends wedge life 2-3 seasons," fabricated studies/statistics across 9 files. Residual instances remain in `lib/journal.ts` / `lib/journalExtra.ts` blog content (flagged as Phase 16 follow-up). |

## 3. Findings This Session

1. **CRITICAL (fixed)**: `/shipping-returns` exposed dropship/fulfillment-model language ("trusted golf product partners") directly to customers — replaced with neutral, accurate timing language. This was the single highest-risk trust leak found this session because it's a policy page customers check specifically to decide whether to trust checkout.
2. **Minor (no action needed)**: Shipping-time language varies by page (1-3 days vs. 1-2/3-5 business days) but is internally consistent with the hedged canonical policy — item-specific variance is normal and not an overpromise.
3. **DRY note (low priority)**: `freeShippingThreshold = 75` and the `CartProgress` copy/logic are duplicated between `components/CartPage.tsx` and `components/CartProvider.tsx`. Not a trust issue today (both say the same thing), but a future copy change to one without the other would create an inconsistency. Worth consolidating into a shared constant/component when next touching cart code.

## 4. Revenue Risks / Open Questions (require business-side confirmation, not code)

- **WYX10 validity**: Confirm the code is active in Shopify and won't 404/error at checkout — a broken promo code on a site whose homepage and ~30 pages all promise it would be a severe first-impression failure.
- **Email flow gap**: `EmailCapture` is everywhere but Phase 10 (welcome series, bonus delivery, abandoned-cart) doesn't exist yet. Until it does, captured emails are not generating revenue.
- **Catalog depth vs. believability**: Per `product-integrity-audit.md`, only ~53 products are genuinely sellable out of 169. Revenue ceiling is currently bounded by SKU count and AOV (~$80 kit + add-ons), not by traffic. More landing pages won't fix a thin catalog — Phase 12's product pipeline work matters more than additional SEO pages at this stage.
- **Free-shipping threshold tension**: $75 threshold vs. $79.88 kit price means most single-kit orders clear it without the customer noticing the nudge. Consider whether a slightly-under-$75 kit price (with the nudge driving a $4-15 add-on) would lift AOV more than a flat $79.88 — a merchandising/pricing decision, not a copy fix.

## 5. Net Assessment

The revenue mechanics that exist (kit, WYX10, free-shipping goal, guarantee) are coherent, honest, and consistent with the binding constraints — there is nothing fake propping up the funnel. The biggest **trust** gap found this session (supplier-language leak on the shipping policy page) is now fixed. The biggest **revenue** gap is not on this page at all — it's catalog depth (Phase 2/12) and the missing email flow (Phase 10), both already tracked as open phases.
