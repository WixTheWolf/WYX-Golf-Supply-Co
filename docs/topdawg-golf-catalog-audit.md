# TopDawg Golf Catalog Audit — WYX Scorecard

Generated: 2026-06-12

## Method

- Source: TopDawg public catalog (`Sports & Outdoors` department, golf-focused search terms)
- Raw hits scraped: **105** unique SKUs
- Golf-relevant after filter: **33** SKUs
- Scoring: 10 dimensions × 1–10 (docs/sourcing-targets.md). **Publish ≥75**, **Sample 68–74**, **No <68**
- TopDawg supplier reliability baseline: **7** (US ship, aggregator catalog — filter hard)

## Summary

| Tier | Count | Action |
| --- | ---: | --- |
| **Publish (≥75)** | 10 | Import to Shopify as `supplier-review` drafts; sample before ads |
| **Sample (68–74)** | 4 | Order 1 unit; promote if photos + ship time pass Bag Test |
| **Reject (<68)** | 19 | Skip — off-strategy or weak margin/gift fit |

## Top picks — Publish tier

| Product | Brand | MSRP | Cost | Margin | Score | WYX fit |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| SelfieTotem Ball Marker  | Selfie Golf | $29.99 | $18.00 | 40% | **85** | Gift/scramble |
| SelfieTotem Classic Ball Markers | Selfie Golf | $24.99 | $15.00 | 40% | **85** | Gift/scramble |
| SelfieGolf - The Ultimate Cell Phone Clip System | Selfie Golf | $34.99 | $21.00 | 40% | **83** | Kit component |
| SelfieTotem Head Cover Leash  | Selfie Golf | $29.99 | $18.00 | 40% | **83** | Kit component |
| SelfieSpinner | Selfie Golf | $24.99 | $15.00 | 40% | **81** | Gift/scramble |
| Golf Chipping Dart Game Mat Set | Linx Group | $68.73 | $36.49 | 47% | **80** | Kit component |
| Golf Game Set Golf Game Training Mat  | Linx Group | $65.52 | $35.70 | 46% | **80** | Kit component |
| 3 In 1 Golf Club Cleaning Kit  | Linx Group | $40.59 | $20.60 | 49% | **80** | Kit component |
| SelfieGOLF - Bag Clip | Selfie Golf | $9.99 | $6.00 | 40% | **77** | Kit component |
| Golf Net Golf Training Aids Practice Nets Driving Hitti | Linx Group | $62.40 | $35.24 | 44% | **76** | Kit component |

## Sample tier (worth 1-unit QA)

| Product | Brand | MSRP | Score | Notes |
| --- | --- | ---: | ---: | --- |
| Designer Genuine Teak Toothbrush Holder | HomeRoots | $129.99 | 76 | soft-reject category; MSRP above WYX gift ceiling |
| Men's Weekend Golf Forcast T-Shirt | Dream Team Designs | $27.99 | 76 | soft-reject category |
| Casual Golf Game Set  | Linx Group | $64.41 | 69 | — |
| Toddler Golf Set  | Linx Group | $53.06 | 69 | soft-reject category |

## Reject patterns (why 72% of raw hits fail)

- **False positives**: "marker", "tee", "cart" match wine markers, toddler tees, pet carts
- **Home decor**: prints, door mats, pen holders — not bag-test products
- **Apparel**: sizing/return risk; WYX POD/wholesale lanes are better
- **MSRP >$75**: breaks gift-flow positioning

## Recommended import shortlist (8 SKUs)

1. **SelfieTotem Ball Marker ** (Selfie Golf) — MSRP $29.99, cost $18.00, score 85
   - SKU: `1077-STBM-SLBL` | TDID: `661074`
   - Catalog: https://topdawg.com/sports-outdoors-supplies
2. **SelfieTotem Classic Ball Markers** (Selfie Golf) — MSRP $24.99, cost $15.00, score 85
   - SKU: `1077-STBM-GDBK` | TDID: `661076`
   - Catalog: https://topdawg.com/sports-outdoors-supplies
3. **SelfieGolf - The Ultimate Cell Phone Clip System** (Selfie Golf) — MSRP $34.99, cost $21.00, score 83
   - SKU: `1077-SGP-USA` | TDID: `661068`
   - Catalog: https://topdawg.com/sports-outdoors-supplies
4. **SelfieTotem Head Cover Leash ** (Selfie Golf) — MSRP $29.99, cost $18.00, score 83
   - SKU: `1077-SGT-GD` | TDID: `661080`
   - Catalog: https://topdawg.com/sports-outdoors-supplies
5. **SelfieSpinner** (Selfie Golf) — MSRP $24.99, cost $15.00, score 81
   - SKU: `1077-SGS-SLB` | TDID: `661070`
   - Catalog: https://topdawg.com/sports-outdoors-supplies
6. **Golf Chipping Dart Game Mat Set** (Linx Group) — MSRP $68.73, cost $36.49, score 80
   - SKU: `3239-HG_GolfChippingGameMatSet_GPCT4764` | TDID: `1688799`
   - Catalog: https://topdawg.com/sports-outdoors-supplies
7. **Golf Game Set Golf Game Training Mat ** (Linx Group) — MSRP $65.52, cost $35.70, score 80
   - SKU: `3239-HG_GolfGameSet_GPCT4497` | TDID: `1687976`
   - Catalog: https://topdawg.com/sports-outdoors-supplies
8. **3 In 1 Golf Club Cleaning Kit ** (Linx Group) — MSRP $40.59, cost $20.60, score 80
   - SKU: `3239-SP_GolfClubCleaner_GPCT5419` | TDID: `1690092`
   - Catalog: https://topdawg.com/sports-outdoors-supplies

## Next steps

1. `npm run setup:topdawg` — account signup URLs + Shopify app check
2. `npm run seed:topdawg-drafts` — import 8 SKUs as DRAFT (`data/topdawg-shortlist.json`)
3. Sample order manifest: `data/topdawg-sample-order.json` (3 SKUs, ~$53.60 cost)
4. Do **not** publish drafts until sample QA passes; ball markers defer to J&M / GT Golf when wholesale live
