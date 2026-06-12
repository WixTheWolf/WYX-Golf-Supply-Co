# WYX Product Scorecard — June 11, 2026

Scored from live Storefront API data (125 core-merch products of 152 total in Shopify; 27 already
filtered out by availability/media/public-catalog gates).

## Scoring method

Base: internal productQualityScore (media quality, copy quality, merchandising tags, inventory),
normalized to 0-100, then adjusted per the Bag Test brief: +8 if priced ≤$60 (giftability),
-10 if >$60 (gift-flow risk). Dimensions covered by the base score: Bag Test fit, golf relevance,
visual quality, inventory status, copy quality, uniqueness, bundle fit.

## Tier rules

- 85-100 HOMEPAGE eligible
- 70-84 COLLECTION only
- 50-69 IMPROVE (de-emphasize until copy/media improved)
- <50 HIDE from featured surfaces

## Tier counts

- HOMEPAGE: 12
- COLLECTION: 53
- IMPROVE: 39
- HIDE: 21

## Notes

- The 10 Dartee Golf belts ($89.99-$99.99, cryptic names) score lowest: real vendor, real fulfillment,
  but generic marketplace feel + over $60 → collection-only, excluded from homepage and gift flows.
- No product exceeds $250. No placeholder-image or no-inventory product passes the gates.
- Homepage surfaces additionally filter through isHomepageProduct() at render time.

## Full scorecard

| Product | Category | Price | Score | Tier |
|---|---|---|---|---|
| Golf Hat Clip Ball Marker Set — 3 Markers | Accessories | $16.00 | 99 | HOMEPAGE |
| Golf Tee Holder Bag Clip — 10-Tee Capacity | Accessories | $10.00 | 91 | HOMEPAGE |
| Golf Practice Ball Set — 12 Foam Airflow Balls | Golf Balls | $16.00 | 88 | HOMEPAGE |
| Golf Ball Identification Stamp Set | Accessories | $18.00 | 88 | HOMEPAGE |
| Blue Ridge Golf Ball Markers - Set Of 2 | Accessories | $9.99 | 88 | HOMEPAGE |
| Performance Snapback Golf Hat — Clean Mark | Headwear | $30.00 | 85 | HOMEPAGE |
| Unstructured Dad Golf Cap — Soft Crown | Headwear | $28.00 | 85 | HOMEPAGE |
| Classic Rope Golf Hat — Coastal Trim | Headwear | $32.00 | 85 | HOMEPAGE |
| Golf Putting Gate Set — 2 Precision Gates | Training Aids | $22.00 | 85 | HOMEPAGE |
| Wide Brim Sun Hat — UPF 50+ Golf Sun Hat | Headwear | $32.00 | 85 | HOMEPAGE |
| Stretch Performance Golf Hat — Low Crown, Structured Fi | Headwear | $34.00 | 85 | HOMEPAGE |
| Augusta Bear Hat | Headwear | $35.00 | 85 | HOMEPAGE |
| Stance Alignment Towel — Dual-Line Towel | Training Aids | $38.00 | 82 | COLLECTION |
| Divot Board Swing Path Trainer | Training Aids | $49.00 | 82 | COLLECTION |
| Golf Alignment Board — Foot & Ball Position Trainer | Training Aids | $38.00 | 82 | COLLECTION |
| Hello Friends T-Shirt | Apparel | $25.00 | 82 | COLLECTION |
| Tri-Fold Microfiber Golf Towel | Towels | $16.99 | 79 | COLLECTION |
| Extendable Golf Ball Retriever — 15ft | Accessories | $24.00 | 79 | COLLECTION |
| Golf Personalized Ball Stamp — Custom Initial Stamp | Accessories | $18.00 | 79 | COLLECTION |
| Golf Groove Sharpener & Club Face Pick | Club Care | $14.00 | 79 | COLLECTION |
| Wet Weather Golf Rain Gloves — 1 Pair | Gloves | $28.00 | 79 | COLLECTION |
| Golf Ball Line Marker Kit — 3 Stencils + Marker Pen | Accessories | $12.00 | 79 | COLLECTION |
| Golf Glove Holder & Dryer — Ventilated Clip | Accessories | $12.00 | 79 | COLLECTION |
| Golf Shoe Cleaning Kit — Brush, Spray & Bag | Accessories | $22.00 | 79 | COLLECTION |
| Putter Grip — Pistol Jumbo Oversize | Grips | $28.00 | 79 | COLLECTION |
| Golf Ball Retriever — 21-Foot Telescoping | Accessories | $32.00 | 79 | COLLECTION |
| Waterproof Golf Towel — 16x24" Waffle Weave | Towels | $22.00 | 79 | COLLECTION |
| Switchblade Fork Divot Tool — One-Click Deploy | Accessories | $14.00 | 79 | COLLECTION |
| Magnetic Golf Divot Tool — Combo with Ball Marker | Accessories | $18.00 | 79 | COLLECTION |
| Golf Rain Glove Pair — Wet Weather Grip | Gloves | $34.00 | 79 | COLLECTION |
| Premium Golf Ball Mix Pack — 12 Urethane Tour Balls | Golf Balls | $34.00 | 79 | COLLECTION |
| Cabretta Leather Golf Glove 3-Pack — Men's ML | Gloves | $32.00 | 79 | COLLECTION |
| Golf Compression Sock Set — 3 Pairs | Apparel | $28.00 | 79 | COLLECTION |
| Dartee Golf Glove | Gloves | $24.95 | 79 | COLLECTION |
| SHOCK'D Golf Balls - Patriot Edition | Golf Balls | $19.99 | 79 | COLLECTION |
| GOT ‘EM Ball Marker – Limited Edition | Accessories | $7.00 | 79 | COLLECTION |
| The Bolt - Ball Marker | Accessories | $7.00 | 79 | COLLECTION |
| Magnet Caddie | Accessories | $25.00 | 79 | COLLECTION |
| Glove & Accessory Caddie - Black | Accessories | $24.95 | 79 | COLLECTION |
| Carolina Blue Two-Sided Golf Ball Marker - 2 Pack | Accessories | $14.99 | 79 | COLLECTION |
| Groove Sharpener and Cleaner Tool | Club Care | $14.99 | 79 | COLLECTION |
| 12-Foot Golf Ball Retriever | Accessories | $34.99 | 79 | COLLECTION |
| Premium Cabretta Leather Golf Glove | Gloves | $24.99 | 79 | COLLECTION |
| Bamboo Performance Golf Tees - 50 Pack | Accessories | $8.99 | 79 | COLLECTION |
| Magnetic Golf Club Brush Cleaner | Club Care | $18.99 | 79 | COLLECTION |
| Blue Ridge Golf Co. Golf Towels | Towels | $19.99 | 79 | COLLECTION |
| Two-Sided Metal Golf Ball Marker – 5 Color Combo Pack | Accessories | $34.99 | 79 | COLLECTION |
| Stick Grips Golf Camo Golf Grip | Grips | $13.49 | 79 | COLLECTION |
| Glove & Accessory Caddie - Gray | Accessories | $24.95 | 79 | COLLECTION |
| Three Rail Ball Marker | Accessories | $19.95 | 79 | COLLECTION |
| Pulse Golf Overgrip Tape | Grips | $17.99 | 79 | COLLECTION |
| Park Paisley - Women's Gold Golf Glove | Gloves | $30.00 | 79 | COLLECTION |
| SHOCK'D Golf Balls | Golf Balls | $19.99 | 79 | COLLECTION |
| Golf Rangefinder Carrying Case — Magnetic Clip | Accessories | $18.00 | 77 | COLLECTION |
| Golf Alignment Sticks 2-Pack — Fiberglass 48" | Training Aids | $24.00 | 77 | COLLECTION |
| Night Golf Glow Ball Set — 12 LED-Core Light-Up Golf Ba | Golf Balls | $42.00 | 77 | COLLECTION |
| Putting Alignment Mirror — Folding, Tour-Standard | Training Aids | $32.00 | 77 | COLLECTION |
| Portable Putting Cup — Regulation Diameter | Training Aids | $26.00 | 77 | COLLECTION |
| BUY 3 GET 1 FREE BUNDLE - SHOCK'D Golf Balls | Golf Balls | $59.99 | 77 | COLLECTION |
| Alignment Putting Mirror | Training Aids | $29.99 | 77 | COLLECTION |
| Golf Visor — Performance Stretch Fit | Headwear | $22.00 | 74 | COLLECTION |
| Golf Warm-Up Resistance Bands — 3-Band Set | Training Aids | $22.00 | 71 | COLLECTION |
| Golf Scorecard Pencil Set — 12 Pencils with Eraser | Accessories | $12.00 | 71 | COLLECTION |
| Performance Golf Polo — Moisture-Wicking Stretch | Apparel | $44.00 | 71 | COLLECTION |
| UV Sun Gaiter for Golf — UPF 50+ | Apparel | $16.00 | 71 | COLLECTION |
| Stainless Steel Golf Flask — 8oz Hip Flask with Ball Ma | Accessories | $36.00 | 68 | IMPROVE |
| Portable Putting Arc — Stroke Path Guide | Training Aids | $46.00 | 65 | IMPROVE |
| Pop-Up Chipping Net — 3-Target Backyard | Training Aids | $42.00 | 65 | IMPROVE |
| Indoor Golf Putting Mat — 9-Foot Real-Feel Surface | Training Aids | $48.00 | 65 | IMPROVE |
| Collapsible Golf Chipping Net — Backyard Practice Targe | Training Aids | $38.00 | 65 | IMPROVE |
| Golf Swing Speed Trainer — Weighted Stick | Training Aids | $36.00 | 65 | IMPROVE |
| Golf Putting Mat — 9-Foot Velvet Surface with Alignment | Training Aids | $54.00 | 65 | IMPROVE |
| Backyard Chipping Net — 4-Target Folding Frame | Training Aids | $44.00 | 65 | IMPROVE |
| Windproof Cart Umbrella Holder — Universal | Accessories | $29.00 | 62 | IMPROVE |
| Silicone Cart Beverage Holder — 2-Pack | Accessories | $22.00 | 62 | IMPROVE |
| Magnetic Cart Phone Mount — Universal Clamp | Golf Tech | $34.00 | 62 | IMPROVE |
| Golf Cart Side Organizer Bag — 6-Pocket Hang Panel | Accessories | $32.00 | 62 | IMPROVE |
| Golf Shoe Bag — Drawstring Travel Bag | Accessories | $14.00 | 62 | IMPROVE |
| Mallet Putter Headcover — Tour Knit | Accessories | $26.00 | 62 | IMPROVE |
| Insulated Golf Cart Cup Holder — Universal Clamp | Accessories | $18.00 | 62 | IMPROVE |
| Clip-On Yardage Book Holder — Scorecard Sleeve | Accessories | $14.00 | 62 | IMPROVE |
| Golf Impact Tape — Face Impact Labels 50-Pack | Training Aids | $14.00 | 62 | IMPROVE |
| Blade Putter Headcover — Quilted Leather-Look | Accessories | $24.00 | 62 | IMPROVE |
| Driver Head Cover — Knit Pom Pom, Vintage Style | Accessories | $28.00 | 62 | IMPROVE |
| Golf Arm Sleeve UV Protection — Pair | Accessories | $22.00 | 62 | IMPROVE |
| Golf Shoe Travel Bag — Ventilated with Divider | Accessories | $28.00 | 62 | IMPROVE |
| Golf Spike Wrench + Cleat Kit (20 Cleats) | Club Care | $16.00 | 62 | IMPROVE |
| Stroke Counter Wristband | Accessories | $14.00 | 62 | IMPROVE |
| Golf Quarter-Zip Pullover — Thermal Stretch | Apparel | $58.00 | 59 | IMPROVE |
| Iron Head Cover Set — 4-Piece Neoprene | Accessories | $36.00 | 59 | IMPROVE |
| Golf Umbrella — 62-Inch Double Canopy Windproof | Accessories | $42.00 | 51 | IMPROVE |
| Golf Sunglasses Polarized Sport Wrap | Golf Tech | $42.00 | 51 | IMPROVE |
| Leather Golf Scorecard Holder — Full-Grain with Pencil  | Accessories | $38.00 | 51 | IMPROVE |
| Golf Umbrella — 62" Auto-Open Wind-Vent | Accessories | $44.00 | 51 | IMPROVE |
| Pimento Drip Blade | Accessories | $40.00 | 51 | IMPROVE |
| Guerrilla Chief Driver Cover | Accessories | $55.00 | 51 | IMPROVE |
| Evil Ape | Accessories | $55.00 | 51 | IMPROVE |
| Pimento Waffle | Accessories | $59.99 | 51 | IMPROVE |
| Dude Abides v2 Mallet Putter Cover | Accessories | $45.00 | 51 | IMPROVE |
| Mafia Mallet Putter Cover | Accessories | $45.00 | 51 | IMPROVE |
| Topographic Carolina Blue Driver Headcover | Accessories | $59.99 | 51 | IMPROVE |
| Coastal Green Driver Headcover | Accessories | $39.99 | 51 | IMPROVE |
| Classic Leather Edition - Walnut Brown / Midnight Black | Accessories | $49.99 | 51 | IMPROVE |
| Topographic Edition - Pure White / Embroidered Carolina | Accessories | $59.99 | 51 | IMPROVE |
| Golf or Die Game Set | Accessories | $63.00 | 21 | HIDE |
| MEGA PACK (4 Red + 4 White) - SHOCK'D Golf Balls | Golf Balls | $120.00 | 16 | HIDE |
| Golf GPS Watch — 40,000+ Courses, 18-Hole Battery | Golf Tech | $149.00 | 13 | HIDE |
| Golf Laser Rangefinder — 800 Yard Slope-Compensating | Golf Tech | $119.00 | 13 | HIDE |
| Desert Storm Tan | Accessories | $69.99 | 13 | HIDE |
| Shadow Storm Black | Accessories | $69.99 | 13 | HIDE |
| Twister Grey | Accessories | $69.99 | 13 | HIDE |
| Sea Swell Blue | Accessories | $69.99 | 13 | HIDE |
| Sahara Sunset | Accessories | $99.99 | 7 | HIDE |
| Volcanic Ash | Accessories | $99.99 | -1 | HIDE |
| Golden Albatross | Accessories | $89.99 | -1 | HIDE |
| Brown Braid | Accessories | $89.99 | -1 | HIDE |
| Albino Gator | Accessories | $89.99 | -1 | HIDE |
| Black Birdie | Accessories | $89.99 | -1 | HIDE |
| Crimson Dune | Accessories | $99.99 | -1 | HIDE |
| Mossy Condor | Accessories | $89.99 | -1 | HIDE |
| Bone Dry | Accessories | $99.99 | -1 | HIDE |
| Black Braid | Accessories | $89.99 | -1 | HIDE |
| Gray Eyed Gator | Accessories | $89.99 | -1 | HIDE |
| Charcoal Mirage | Accessories | $99.99 | -1 | HIDE |
| Bayou Brown Gator | Accessories | $89.99 | -1 | HIDE |
