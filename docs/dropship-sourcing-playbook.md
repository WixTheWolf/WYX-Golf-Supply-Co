# WYX Dropship Sourcing Playbook

**Goal:** Every live SKU has a real supplier listing, a verified hero image, and a documented fulfillment path.

**Source of truth:** `data/verified-dropship-catalog.json`

---

## Coordination: Grok + Claude Code

| Owner | Responsibility |
|-------|----------------|
| **Grok** | Supplier research, image verification, catalog JSON updates, Shopify Admin scripts |
| **Claude Code** | Site UX, collection pages, product copy polish, Vercel deploys, DSers/Spocket app install |
| **Shared** | `data/verified-dropship-catalog.json` — never edit the same handles concurrently |

### Before either agent touches catalog ops

```bash
npm run audit:product-images      # baseline issues
npm run apply:verified-catalog    # sync tags + images from JSON
```

### Adding a new verified product

1. Find supplier listing (AliExpress item URL, Spocket page, or Collective product)
2. Download hero image → visually confirm it matches the product title
3. Add entry to `data/verified-dropship-catalog.json` with `imageVerified: true`
4. Run `npm run apply:verified-catalog`
5. If `status: "draft"` → stays draft until DSers/wholesale account is connected
6. If `status: "active"` → goes live with inventory script

---

## Supplier stack (priority order)

### Week 1 — Launch these three

| Supplier | Integration | Ship time | Best for |
|----------|-------------|-----------|----------|
| **Spocket** | [Shopify app](https://apps.shopify.com/spocket) | 2–5 days US | Rope caps, putting mats, fast US fulfillment |
| **DSers + AliExpress** | [Shopify app](https://apps.shopify.com/dsers) | 7–12 days | Training aids, markers, towels, accessories |
| **Shopify Collective** | Built-in channel | 3–7 days | Leadbetter Boomerang, Sure-Speed, premium training aids |

### Week 2 — Expand

| Supplier | Integration | Notes |
|----------|-------------|-------|
| **Syncee / Kandy Golf** | Syncee app | Women's apparel, gloves, towels — Canada origin |
| **CJ Dropshipping** | CJ app | Backup catalog for training aids |
| **JP Lann Golf** | Wholesale account | Apply at jplann.com — real brand photos, US ship |
| **TopDawg** | Shopify app | US-warehouse backfill — **filter hard**; sports/outdoor catalog is broad |

### Tier B — wholesale & curated backfill

Parallel lane for legitimate golf inventory and better margins. Full matrix: `docs/vendor-sourcing-hit-list.md`

| Vendor | Role | Integration |
| --- | --- | --- |
| **J&M Golf** | Credibility SKUs — grips, markers, towels, tees | Wholesale (priority) |
| **GT Golf Supply** | Scramble prizes, pro shop accessories | Wholesale |
| **Faire** | Boutique pouches, bag tags, premium markers | Faire Shopify app |
| **Stroke & Distance** | Cap tees, beverage caddies, promo packs | Wholesale |
| **Cullinan Golf** | Dropship apparel + custom mfg | Partner application |
| **Hireko Golf** | Grips, shafts, components | Dealer program |
| **PRG Golf** | Premium custom — future private label | B2B (park until sales) |
| **Golf4Her** | Women's dropship | Parked — future collection |
| **Divots / OMNIXGOLF** | Private-label apparel/bags | Parked — after POD capsule |

Outreach templates: `docs/supplier-outreach-pack.md`

### Skip for now

- **Zendrop** — no golf depth
- **JP Lann without account** — wholesale only, no API

---

## Image rules (non-negotiable)

1. **Never reuse** an AliExpress CDN hash across unrelated handles
2. **Never skip** replacement because an AliExpress URL already exists
3. Blocklist these known-bad IDs (GPS watch images):
   - `S52c568a8afdd471dbaa71255068f83efj`
   - `S3a1c5b8ccbd84fbfa8f7a0647a853422Z`
4. Tag every verified SKU: `supplier-dsers`, `supplier-spocket`, `supplier-collective`, etc.
5. Draft until fulfillment confirmed: `supplier-review`

---

## npm scripts

| Script | Purpose |
|--------|---------|
| `npm run audit:product-images` | Scan all WYX SKUs for image/supplier issues |
| `npm run apply:verified-catalog` | Sync catalog JSON → Shopify |
| `npm run fix:mismatched-images` | Force-fix priority mismatched images |
| `npm run fix:all-images` | Bulk image pass (respects blocklist) |
| `npm run go-live:catalog` | Publish + inventory enable |

---

## Claude Code next steps

1. Install **DSers** and **Spocket** in Shopify admin
2. Map `supplierSku` values in catalog JSON to DSers product imports
3. Enable **Shopify Collective** → connect Leadbetter Swing Aids
4. Apply for **JP Lann wholesale** (template in `docs/supplier-outreach-pack.md`)
5. Run `npm run enable:wyx-inventory` after new products seed

---

## Vercel / live site

- Production: https://wyxgolfsupply.com
- Catalog changes are immediate via Shopify; ISR refreshes in ~5 min
- Deploy frontend: `npx vercel --prod --yes` (only needed for code changes)