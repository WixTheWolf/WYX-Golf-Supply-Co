# WYX Growth Playbook — June 11, 2026

Prompt 5 of 5. The operating manual for turning the deployed site into sales volume.
Companion docs: `optimization-roadmap.md` (audit), `tracking-setup.md` (event specs),
`email-and-launch-flows.md` (copy), `meta-ad-creative.md` (ads), `vendor-sourcing-hit-list.md` (margin).

## 1. CRO — shipped this session (code on branch)

| Lever | Where | Why it converts |
|---|---|---|
| Cart cross-sell "Round Out The Bag" | `components/CartCrossSell.tsx` + `/api/cross-sell` | 3 under-$25 complements at peak intent; category-diversified; one-tap add |
| PDP "Complete The Pair" bundle | `app/products/[handle]/page.tsx` | product + cheapest cross-category complement ≤$25, single Add Both button via `KitAddButton` |
| Deferred email slide-in | `components/EmailSlideIn.tsx` (in layout) | Bag Audit Checklist lead magnet; 14s/35%-scroll trigger, 7-day snooze, suppressed on /cart, reduced-motion safe |
| Free-shipping progress bar | cart drawer + page (pre-existing) | $75 threshold pulls 1-item carts to 2 |
| Sticky mobile ATC | PDP (pre-existing) | thumb-reachable purchase on the majority device |
| Quick-add on cards | `ProductCard` (pre-existing) | removes one click from every collection page |

Already tracked events: `AddToCart`, `InitiateCheckout`, `Lead`, product views (`ProductViewTracker`).

## 2. Analytics — exact activation steps

1. **Vercel env vars** (Production): `NEXT_PUBLIC_GA4_ID`, `NEXT_PUBLIC_META_PIXEL_ID`
   (consumed by `components/TrackingScripts.tsx`; event spec in `docs/tracking-setup.md`).
2. **Shopify checkout conversion**: add the GA4 + Meta integrations inside Shopify admin
   (Settings → Customer events) so purchases on checkout.shopify.com attribute back.
3. **Vercel Analytics**: enable in the Vercel dashboard (zero-code) — or `@vercel/analytics`
   if web-vitals-per-route is wanted later. Dashboard toggle first; no dependency until needed.
4. **Microsoft Clarity** (free heatmaps/session replay): one script tag via `TrackingScripts`
   once an ID exists. Choose Clarity over Hotjar/PostHog at this stage — $0 and zero config.
5. **Search Console**: submit `https://wyxgolfsupply.com/sitemap.xml` after deploy.

KPIs to watch weekly: sessions → product views → ATC rate (target 6–9%) → checkout rate →
purchase rate (target 1.5–2.5% overall) · AOV (target $55+ via kit/bundles) · email capture
rate (target 2–4% of sessions with the slide-in).

## 3. "Busy site" features — honest versions only

| Feels-active feature | Honest implementation | Status |
|---|---|---|
| Countdown urgency | Father's Day strip (real date, June 21) | live |
| Fresh inventory motion | `wyx-fresh-pick` tag rotation + 300s ISR | live |
| Drop culture | "Get the next Bag Test drop" email framing everywhere | live |
| Editorial pulse | 22+ journal posts, 2 new buyer-intent guides | live |
| Social proof | **Deferred until real**: Judge.me/Loox review collection after first orders; real UGC from Father's Day buyers | post-sales |

Explicitly rejected: fake recent-purchase tickers, fake visitor counters, invented stock
scarcity, fabricated testimonials. Zero order history = all fabricated = brand + ad-account risk.

## 4. Traffic plan (effort-ranked)

**Week 1 (Father's Day window, ends June 21):**
- Personal network email/text with kit link + WYX10 (highest-converting channel any new store has)
- $10–15/day Meta: 2 ad sets (golf-interest dads / gift-buyers), creative from `docs/meta-ad-creative.md`, land on `/fathers-day-golf-gifts` and the kit page
- Reddit/Facebook golf groups where promo is allowed: lead with the Bag Test story, not the link

**Weeks 2–4:**
- GSC indexing sweep; fix any crawl gaps
- 2 posts/week from `docs/seo-content-plan.md` queue (target: "golf trip packing list", "scramble prize ideas" variants)
- TikTok/IG Reels: 30-second "does it pass the Bag Test?" product tests — native, repeatable, zero ad spend
- Klaviyo: wire `/api/marketing/subscribe` list → welcome flow (WYX10) + abandoned-cart flow (copy exists in `email-and-launch-flows.md`)

**Month 2+:** Google Shopping via the existing product feed (`/api/feeds/products`) ·
affiliate/creator seeding (send kits to 5 mid-size golf creators) · referral hook in
post-purchase email ("give your foursome 10%").

## 5. A/B testing queue (after ~500 sessions/week)

1. Hero CTA: "Shop The Bag Upgrade Kit" vs "Build His Bag — $87.89"
2. Slide-in trigger: 14s vs 30s (watch bounce impact)
3. Cross-sell price cap: $25 vs $35
4. Kit page: 5-item default vs "pick 3" configurator
Tooling: start with GA4 segment comparison on Vercel preview deploys; add a real A/B tool
only when traffic justifies it. Do not install an A/B SDK at current traffic — it's bundle
weight with no statistical power.

## 6. Iteration loop

Weekly: KPI review → one CRO change → one content piece → one vendor/margin step.
Monthly: re-run `docs/product-scorecard.md` script, prune <50 scores, promote 85+.
