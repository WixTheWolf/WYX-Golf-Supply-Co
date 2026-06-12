# External Product Sourcing Board

WYX can scout products outside Shopify, but Shopify remains the commerce source of truth. External products should be brought into Shopify first, then surfaced on the Vercel storefront through the existing Storefront API flow.

## Publishing Rules

- Active products must have a confirmed fulfillment path: Shopify Collective, supplier dropship account, wholesale terms with manual fulfillment, POD account, or owned inventory.
- Supplier leads without confirmed fulfillment stay as drafts tagged `supplier-review`.
- Customer-facing product pages should never link buyers to supplier sites. Supplier URLs belong in internal sourcing notes, Shopify metafields, or repo docs.
- Product photos must come from the supplier/manufacturer catalog or approved brand assets.
- Under-$75 accessories get priority because they fit the current WYX conversion path and impulse-gift positioning.

## Supplier Shortlist

### J&M Golf (priority)

- URL: https://jandmgolf.com/
- Apply: https://jandmgolf.com/create-an-account/
- Fit: 6,000+ legitimate golf accessories — grips (Golf Pride, SuperStroke), markers, divot tools, towels, tees, brushes, bag tags. Same-day shipping claim.
- Status: wholesale priority lead.
- Contact: 800-821-0282.
- WYX action: apply for wholesale account; confirm dropship/blind-ship terms. See `docs/supplier-outreach-pack.md` §1.

### Faire (boutique discovery)

- URL: https://www.faire.com/discover/golf-equipment
- Fit: premium small-batch goods — valuables pouches, bag tags, scorecard holders, boutique markers.
- Status: retailer account lead. Net-60 terms; you hold inventory.
- WYX action: open retailer account; shortlist 3 pouch/marker brands. Faire Shopify app for sync.

### TopDawg (curated backfill)

- URL: https://topdawg.com/dropshipping/wholesale-products/sports-outdoor-recreation-products
- Fit: US-warehouse dropship for cart gear, training aids, trip accessories.
- Status: Shopify app integration available.
- WYX action: free account + golf subcatalog audit. Filter hard — not bulk import.

### Stroke & Distance

- URL: https://strokeanddistance.com/pages/wholesale-golf-accessories
- Fit: wholesale custom cap tees, beverage caddies, promotional gift packs.
- Status: wholesale lead.
- WYX action: inquiry for trip/event gift bundles and scramble add-ons.

### PRG Golf

- URL: https://prg-golf.com/
- Fit: premium/custom golf accessories trusted by courses and resorts.
- Status: B2B custom lead — park until sales justify MOQ.
- WYX action: request stock catalog + MOQ sheet for future WYX-branded items.

### Hireko Golf

- URL: https://www.hirekogolf.com/become-reseller
- Fit: grips, shafts, components, regrip kits.
- Status: dealer program lead. Less gift-focused, more utility.
- WYX action: dealer account if grip/club-care lane stays in assortment.

### Divots / OMNIXGOLF (parked)

- URL: https://www.divots.com/
- Fit: private-label golf apparel and bags.
- Status: parked — better for branded merch later, not immediate dropship.
- WYX action: revisit after POD capsule and first sales.

### JP Lann Golf

- URL: https://jplann.com/pages/wholesale-acct
- Fit: under-$75 golf accessories, ball retrievers, tees, divot tools, markers, novelty balls, umbrellas.
- Status: wholesale/account lead. Their wholesale page encourages ecommerce stores, golf shops, country clubs, and brick-and-mortar stores to apply.
- Contact: `info@jplann.com`, 800-332-7377, Royal Oak, MI.
- WYX action: apply for wholesale account before activating products. Draft candidates are acceptable.

Top product targets:

- Compact Stainless 6'7" Golf Ball Retriever, source: https://jplann.com/products/compact-stainless-67-golf-ball-retriever
- Divot Tool w/ Removable Ball Marker, source: https://jplann.com/products/divot-tool-w-removable-ball-marker
- Player Supreme Golf Ball Markers, source: https://jplann.com/products/player-supreme-golf-ball-markers-multicolor
- 2-IN-1 Golf Bag Umbrella & Ball Retriever, source: https://jplann.com/products/2-in-1-golf-bag-umbrella-ball-retriever
- 3 Pack Novelty Golf Balls, source: https://jplann.com/products/3-pack-golf-balls

### GT Golf Supply

- URL: https://www.ggolf.com/
- Fit: pro shop supplies, retail accessories, grips, club repair, towels, ball retrievers, umbrellas, training aids, tournament gifts.
- Status: wholesale/account lead.
- Contact: 800-757-7453.
- WYX action: apply or request account pricing. Strong candidate for utility products and replenishable accessories.

Top categories to source:

- Golf Pride, Lamkin, Winn, and SuperStroke grip programs.
- Retail towels and packaged tees.
- Divot repair tools, hat clips, and ball markers.
- Ball retrievers, umbrellas, range finders, and practice/training accessories.

### Bear Grips Pro Shops

- URL: https://shops.beargrips.com/products/
- Fit: WYX-branded apparel and headwear without inventory risk.
- Status: POD lead.
- WYX action: create a WYX apparel capsule once brand artwork is ready. Start with 3 free-plan products or use VIP if margins justify it.

Top product targets:

- Embroidered rope hat or snapback.
- Men's performance polo.
- Women's performance polo.
- Quarter-zip pullover.
- Moisture-wicking range tee.

### Cullinan Golf

- URL: https://www.cullinan-golf.com/dropshipping-golf-products
- Fit: golf dropshipping products and custom golf manufacturing (apparel, accessories).
- Status: dropship partner lead — worth contacting.
- WYX action: apply as dropshipping partner, confirm U.S. shipping geography, production timing, wholesale/dropship pricing, branding options, and Shopify order workflow before activating.

Top product targets:

- WYX-branded performance polo.
- Lightweight quarter-zip.
- Women's golf apparel capsule.
- Tournament/teamwear capsule.

## Next Import Strategy

1. Apply to **J&M Golf** and **GT Golf Supply** wholesale (credibility + scramble prize SKUs).
2. Open **Faire** retailer account; shortlist valuables-pouch and premium-marker brands.
3. Create Shopify drafts for the best JP Lann accessory candidates tagged `supplier-review`, `jp-lann`, and `under-75`.
4. Add internal source URLs to product notes/metafields, not buyer-facing descriptions.
5. Audit **TopDawg** golf subcatalog with heavy curation (Shopify app backfill).
6. Set up a POD supplier for WYX-branded hats/polos once artwork is ready.
7. Only flip products to active when fulfillment terms, margin, shipping timing, and returns are known.

Full vendor matrix: `docs/vendor-sourcing-hit-list.md`

