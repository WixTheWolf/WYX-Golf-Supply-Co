# WYX Optimization Roadmap — Audit + Prioritized Plan (June 11, 2026)

Prompt 1 of 5. Grounded in the actual repo (`WYX-Golf-Supply-Co`, branch `feat/growth-pass-2-hidden-gems`)
and live Storefront API data — not generic e-commerce advice.

## 1. Architecture audit

**Stack:** Next.js 14 App Router on Vercel, headless Shopify Storefront API (cart, products),
Admin API via client-credentials OAuth (ops scripts), plain CSS (no Tailwind/shadcn), ISR
`revalidate: 300` everywhere, 237 static pages.

**Verdict: architecture is healthy. Do not re-platform anything.**

| Area | State | Grade |
|---|---|---|
| Performance | 103 kB First Load JS (home), 118 kB (landing) — under the 150 kB budget; ISR everywhere; images via next/image | A |
| Rendering | Static + 300s revalidate; no client-side catalog fetching on key pages | A |
| Catalog integrity | 125 live core-merch products, real CDN images, availability/media gates in `lib/catalog.ts` + `lib/merchandisingFilters.ts` | A- |
| SEO plumbing | Sitemap, robots, canonicals, Product/FAQ/Breadcrumb/Organization schema, OG/Twitter, 60+ intent landing pages | A- |
| Cart | Drawer + page, free-shipping progress bar ($75), WYX10 promo summary, quick-add on cards, buy-now, full event tracking | B+ |
| PDP | Gallery, trust list, sticky mobile ATC, Pair It With grid, FAQ accordion, gift notes, view tracking | B+ |
| Analytics | GA4/Meta scaffolding in `TrackingScripts` — **env IDs not set in Vercel** | C |
| Email/retention | Inline `EmailCapture` + `/api/marketing/subscribe`; no ESP wired, no abandoned-cart flow live | C |
| Reviews | None (correct for now — zero orders; no fake reviews allowed) | n/a |

## 2. Real conversion bottlenecks (ranked by revenue impact)

1. **Production runs the old site.** The Bag Test relaunch sits unmerged on the branch.
   Nothing else matters until this ships. → merge PR / push main.
2. **No analytics IDs in production.** Conversion work is blind without GA4 + Meta env vars.
3. **No ESP connected.** Email capture stores subscribers but no welcome / abandoned-cart
   automation fires. Klaviyo (or Shopify Email to start) closes the loop.
4. **Cart drawer has no cross-sell.** Highest-intent surface on the site shows zero
   complements. (Implementation in progress — `CartCrossSell`.)
5. **Email capture is inline-only.** No deferred slide-in; most visitors never see it.
   Lead magnet exists in copy (Bag Audit Checklist) but isn't offered as a capture incentive.
6. **PDP lacks a one-tap bundle.** "Pair It With" is browse-only; no combined add
   ("Add both — complete the upgrade") despite `KitAddButton` already existing.
7. **No paid/organic traffic.** CRO multiplies traffic; it doesn't create it.

## 3. AOV levers (legitimacy-checked)

| Lever | Mechanism | Status |
|---|---|---|
| Free-shipping progress bar | $75 threshold, animated bar in drawer + cart page | ✅ exists |
| 5-item kit as core offer | $87.89 anchor, one-click `KitAddButton` | ✅ exists |
| Cart cross-sell row | 2–3 under-$25 complements at the decision moment | 🔨 building (prompt 3) |
| PDP "complete the pair" bundle | product + 1 complement, single add button | 🔨 prompt 2 |
| Tiered gift pages (under $25/$35/$50/$60/$75) | self-selection by budget | ✅ exists |
| WYX10 surfaced everywhere | announcement, PDP, cart, footer | ✅ exists |

**Banned (and why):** fake scarcity timers, invented "low stock" badges, fabricated
recent-purchase tickers, fake visitor counters, fake testimonials/review stars. Store has
zero order history — all of these would be fabricated, violate the integrity rules in
`docs/fable-site-audit.md`, and risk Meta/Google ad account flags. Real versions unlock
post-sales: genuine review collection (Judge.me/Loox), real "X sold this week" once true.

## 4. "Active and premium" features that are honest

- Father's Day countdown strip (real date, already live, June 21)
- "Fresh picks" rotation via existing `wyx-fresh-pick` tags + ISR
- Journal/golf-lifestyle content hub (exists; needs internal-link push to money pages)
- Real-time inventory truth: items drop off automatically when out of stock (gates exist)
- Drop-based merchandising language ("next Bag Test drop") backed by the email list

## 5. Roadmap

**Phase A — Ship & see (today):** merge to main → production · set GA4/Meta env IDs in
Vercel · verify checkout end-to-end with a real card.
**Phase B — Capture & convert (this week):** cart cross-sell row · deferred email slide-in
with Bag Audit Checklist lead magnet · PDP one-tap pair bundle · connect Klaviyo + welcome
flow + abandoned-cart flow (docs/email-and-launch-flows.md has the copy).
**Phase C — Traffic (next 2 weeks):** GSC sitemap submit · $10–15/day Meta test
(docs/meta-ad-creative.md) · 2 new gift-guide posts targeting "golf gifts for dad under $50"
and "golf trip packing list" (prompt 4) · personal-network kit push before Father's Day.
**Phase D — Compound (post-first-10-sales):** real review collection · genuine social
proof · vendor margin upgrades (docs/vendor-sourcing-hit-list.md) · A/B hero copy.
