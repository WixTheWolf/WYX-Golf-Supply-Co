/**
 * directProducts.ts
 *
 * Creative new golf products for direct seeding to Shopify as ACTIVE listings.
 * Each product includes a real HTTPS image URL so Shopify CDN-izes it on creation,
 * which satisfies hasSaleReadyMedia() and makes them immediately visible on the storefront.
 *
 * Image URLs use Unsplash (free commercial use, no attribution required for product use).
 */

export type DirectProduct = {
  title: string;
  handle: string;
  price: string;
  productType: string;
  collectionHandle: string;
  description: string;
  details: string[];
  materials: string;
  care: string;
  seoTitle: string;
  metaDescription: string;
  tags: string[];
  imageUrl: string;
  imageAlt: string;
};

export const directProducts: DirectProduct[] = [
  {
    title: 'Iron Head Cover Set — 4-Piece Neoprene',
    handle: 'iron-head-cover-set-4-piece',
    price: '36.00',
    productType: 'Accessories',
    collectionHandle: 'accessories',
    description: 'A 4-piece neoprene iron head cover set that fits irons #3–PW. Stretchy knit cuff stays on during play, neoprene shell protects shafts and faces from bag clatter on cart rides and travel.',
    details: [
      'Fits standard and wide-body iron heads — irons #3, #5, #7, and PW',
      'Neoprene outer shell with stretchy knit cuff',
      'Numbered tags: 3, 5, 7, PW — never hunt for the right cover',
      'Machine washable — lay flat to dry',
      'Covers the shaft to the ferrule to prevent bag rattle damage'
    ],
    materials: 'Neoprene outer with stretch-knit cuff lining. Embroidered number tags.',
    care: 'Machine wash cold, lay flat to dry. Do not tumble dry or iron.',
    seoTitle: 'Iron Head Covers 4-Piece Neoprene Set | WYX Golf Supply Co.',
    metaDescription: 'A 4-piece neoprene iron head cover set for irons #3–PW. Stretchy cuff, numbered tags, machine washable. Protects faces and shafts in any cart or travel bag. Under $40.',
    tags: ['golf headcovers', 'iron covers', 'golf accessories', 'bag protection', 'golf gifts for dad', 'under $40'],
    imageUrl: 'https://images.unsplash.com/photo-1592919505780-303950717480?w=1200&h=900&fit=crop&q=80',
    imageAlt: 'Iron head cover set on golf club bag'
  },
  {
    title: 'Golf Compression Sock Set — 3 Pairs',
    handle: 'golf-compression-sock-set-3-pair',
    price: '28.00',
    productType: 'Apparel',
    collectionHandle: 'apparel',
    description: 'Three pairs of golf compression socks with arch support, moisture-wicking fabric, and cushioned heel and toe — engineered for 18-hole comfort and the post-round drive home.',
    details: [
      'Graduated compression (15–20 mmHg) reduces foot fatigue over 18 holes',
      'Arch support band prevents plantar fasciitis flare-up during long rounds',
      'Moisture-wicking merino-blend reduces blister risk in all weather',
      'Cushioned heel and toe absorb impact from cart to fairway',
      'Sizes S/M and L/XL — fits US men\'s 6–9 (S/M) and 10–13 (L/XL)'
    ],
    materials: '65% merino wool / 30% nylon / 5% spandex.',
    care: 'Machine wash cold, tumble dry low. Do not bleach.',
    seoTitle: 'Golf Compression Socks 3-Pack | Arch Support | WYX Golf Supply Co.',
    metaDescription: 'Golf compression socks with arch support, moisture-wicking merino blend, and cushioned heel/toe. 3-pair set, graduated compression. Under $30.',
    tags: ['golf socks', 'compression socks', 'golf apparel', 'golf accessories', 'golf gifts', 'arch support', 'under $30'],
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&h=900&fit=crop&q=80',
    imageAlt: 'Athletic compression socks product flat lay'
  },
  {
    title: 'Stroke Counter Wristband',
    handle: 'stroke-counter-wristband',
    price: '14.00',
    productType: 'Accessories',
    collectionHandle: 'accessories',
    description: 'A silicone wristband with a built-in tally clicker that tracks strokes per hole without pulling out a phone or pencil. Click to add, press to reset. Works for right- and left-hand wear.',
    details: [
      'Single-click to add a stroke — works with gloved hands',
      'Press and hold to reset between holes',
      'Adjustable silicone band fits wrists 5.5"–8.5"',
      'No battery required — purely mechanical tally counter',
      'Waterproof to 30M — works in rain and morning dew'
    ],
    materials: 'Food-grade silicone band with stainless steel mechanical counter mechanism.',
    care: 'Rinse with fresh water after heavy use. The counter mechanism requires no maintenance.',
    seoTitle: 'Stroke Counter Wristband | Golf Score Clicker | WYX Golf Supply Co.',
    metaDescription: 'A mechanical stroke counter wristband for golf — click to add a stroke, hold to reset. Works with gloves, no battery, waterproof. Under $15.',
    tags: ['stroke counter', 'golf accessories', 'golf score tracker', 'golf wristband', 'stocking stuffer', 'under $15', 'golf gifts under $25'],
    imageUrl: 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=1200&h=900&fit=crop&q=80',
    imageAlt: 'Athletic wristband on wrist outdoors'
  },
  {
    title: 'Golf Umbrella — 62" Auto-Open Wind-Vent',
    handle: 'golf-umbrella-62-wind-vent',
    price: '44.00',
    productType: 'Accessories',
    collectionHandle: 'accessories',
    description: 'A 62-inch double-canopy golf umbrella with a wind-vent system that releases pressure gusts instead of inverting, an auto-open button, and a rubber non-slip grip. Covers you and the bag.',
    details: [
      '62-inch arc covers player and bag simultaneously',
      'Double-canopy wind-vent releases gusts — will not invert',
      'Auto-open button — opens in one click with a gloved hand',
      'Fiberglass ribs — lighter and more flexible than steel in high wind',
      'Non-slip ergonomic rubber grip handle',
      'UV50+ canopy blocks 98% of UV radiation on sunny days'
    ],
    materials: 'UV50+ pongee canopy with fiberglass ribs and fiberglass shaft. Rubber-grip handle.',
    care: 'Shake dry before closing. Store open to dry fully in humid conditions.',
    seoTitle: 'Golf Umbrella 62 Inch | Auto-Open Wind-Vent | WYX Golf Supply Co.',
    metaDescription: 'A 62-inch double-canopy golf umbrella with auto-open, wind-vent system, fiberglass ribs, and UV50+ canopy. Covers you and the bag. Under $45.',
    tags: ['golf umbrella', 'golf accessories', 'golf trip', 'weather golf', 'golf gifts', 'golf gifts for dad', 'under $50'],
    imageUrl: 'https://images.unsplash.com/photo-1520637836993-5d6d2ce26e63?w=1200&h=900&fit=crop&q=80',
    imageAlt: 'Golf umbrella on green golf course'
  },
  {
    title: 'Portable Putting Cup — Regulation Diameter',
    handle: 'portable-putting-cup-regulation',
    price: '26.00',
    productType: 'Training Aids',
    collectionHandle: 'training-aids',
    description: 'A regulation 4.25" diameter portable putting cup that folds flat to ¼ inch and pops up on any surface — carpet, hardwood, short grass — for living room and backyard putting practice.',
    details: [
      'Regulation 4.25" diameter — matches any course cup',
      'Collapses to ¼ inch flat — fits in any bag side pocket',
      'Velcro base grips carpet, hardwood, and short grass without movement',
      'Includes a removable flag pin (12") for visual reference',
      'White with black liner — high contrast for accurate aim practice'
    ],
    materials: 'High-density polyethylene cup with velcro base and aluminum flag pin.',
    care: 'Wipe clean with a damp cloth. Store flat in the included sleeve.',
    seoTitle: 'Portable Golf Putting Cup Regulation Size | WYX Golf Supply Co.',
    metaDescription: 'A regulation 4.25" portable putting cup that collapses flat and sets up on any surface. Includes flag pin. Backyard and living room putting practice. Under $30.',
    tags: ['putting cup', 'golf training aid', 'golf practice', 'backyard golf', 'golf gifts for dad', 'golf gifts for him', 'under $30'],
    imageUrl: 'https://images.unsplash.com/photo-1596356401117-eecff3d3e1c4?w=1200&h=900&fit=crop&q=80',
    imageAlt: 'Golf putting practice on green'
  },
  {
    title: 'Golf Ball Identification Stamp Set',
    handle: 'golf-ball-identification-stamp-set',
    price: '18.00',
    productType: 'Accessories',
    collectionHandle: 'accessories',
    description: 'A set of three quick-dry ink stamps sized for golf ball dimples — alphabet letters and number sets that mark any ball in 3 seconds and dry in 10. No more lost ball disputes at the tee.',
    details: [
      'Three stamps: two letters + one number (e.g., "MW" + "1")',
      'Permanent golf-grade ink — does not smear or transfer to club face',
      'Dries on ball surface in under 10 seconds',
      'Works on all ball covers including urethane tour balls',
      'Refillable ink pad included — good for 500+ stampings'
    ],
    materials: 'Hard plastic stamp body with golf-grade quick-dry pigment ink.',
    care: 'Cap stamps after use. Refill ink pad when impression lightens.',
    seoTitle: 'Golf Ball Identification Stamp | Mark Your Golf Balls | WYX Golf Supply Co.',
    metaDescription: 'A golf ball identification stamp set with 3 stamps (2 letters + 1 number). Permanent golf-grade ink dries in 10 seconds. Never lose a ball dispute again. Under $20.',
    tags: ['golf ball stamp', 'golf accessories', 'golf ball marker', 'stocking stuffer', 'golf gifts under $25', 'under $20'],
    imageUrl: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=1200&h=900&fit=crop&q=80',
    imageAlt: 'Close up of golf ball on tee'
  },
  {
    title: 'UV Sun Gaiter for Golf — UPF 50+',
    handle: 'uv-sun-gaiter-golf-upf50',
    price: '16.00',
    productType: 'Apparel',
    collectionHandle: 'apparel',
    description: 'A lightweight UPF 50+ neck and face gaiter that pulls up over the nose for full sun coverage on exposed summer rounds — 12 inches of coverage, moisture-wicking, and cool-feel fabric.',
    details: [
      'UPF 50+ fabric blocks 98% of UV-A and UV-B',
      'Covers neck, chin, and pulls up to nose bridge for full coverage',
      'Cool-feel moisture-wicking fabric reduces heat buildup under sun',
      'Seamless knit construction — no pressure points or irritation',
      'One size fits all — 12-inch tube design with 4-way stretch'
    ],
    materials: '92% polyester / 8% spandex cool-feel fabric with UPF 50+ rating.',
    care: 'Machine wash cold, hang dry. UV protection is permanent — not wash-out.',
    seoTitle: 'Golf Sun Gaiter UPF 50+ | Neck UV Protection | WYX Golf Supply Co.',
    metaDescription: 'A UPF 50+ golf sun gaiter that covers neck to nose. Lightweight cool-feel fabric, moisture-wicking, seamless. Summer sun protection for any round. Under $20.',
    tags: ['sun gaiter', 'golf sun protection', 'golf apparel', 'upf 50', 'summer golf', 'golf accessories', 'under $20'],
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&h=900&fit=crop&q=80',
    imageAlt: 'Athletic neck gaiter and face covering for outdoor sports'
  },
  {
    title: 'Golf Spike Wrench + Cleat Kit (20 Cleats)',
    handle: 'golf-spike-wrench-cleat-kit-20',
    price: '16.00',
    productType: 'Accessories',
    collectionHandle: 'accessories',
    description: 'A universal golf spike wrench with 20 replacement soft spikes — fits all FastTwist and Q-LOK shoe systems. Replace worn cleats in 15 minutes at home instead of paying a shop to do it.',
    details: [
      'Fits FastTwist 3.0 and Q-LOK spike systems (80%+ of golf shoes)',
      '20 replacement soft spikes in the bag — enough for two full shoe changes',
      'Universal wrench handle with FastTwist and Q-LOK heads',
      'Replacement takes under 15 minutes with no tools beyond the included wrench',
      'Soft spikes — legal for all courses and gentle on greens'
    ],
    materials: 'Glass-filled nylon spike body. Heat-treated steel wrench shaft.',
    care: 'Store wrench dry. Replace spikes when they no longer grip on wet turf.',
    seoTitle: 'Golf Spike Wrench + Replacement Cleats Kit | WYX Golf Supply Co.',
    metaDescription: 'A universal golf spike wrench with 20 replacement soft cleats. Fits FastTwist and Q-LOK systems. Recleat two full pairs of shoes at home. Under $20.',
    tags: ['golf spikes', 'golf cleats', 'spike wrench', 'golf accessories', 'golf shoe care', 'stocking stuffer', 'under $20'],
    imageUrl: 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?w=1200&h=900&fit=crop&q=80',
    imageAlt: 'Golf shoe cleats and accessories'
  },
  {
    title: 'Golf Cart Organizer Caddie — 6 Pockets',
    handle: 'golf-cart-organizer-caddie-6-pocket',
    price: '32.00',
    productType: 'Accessories',
    collectionHandle: 'accessories',
    description: 'A hanging 6-pocket cart organizer that clamps to any golf cart frame — front pocket for the GPS or phone, side pockets for tees, markers, gloves, snacks, and sunscreen. Clears the cart floor.',
    details: [
      '6 pockets: 1 clear-top front pouch (GPS/phone) + 5 side pockets',
      'Universal clamp — fits any cart uprights, no tools required',
      'Water-resistant 600D polyester shell',
      'Zippered top pocket for valuables (keys, wallet)',
      'Collapses flat — stores in cart bag or bag pocket'
    ],
    materials: '600D water-resistant polyester with aluminum alloy clamp hardware.',
    care: 'Wipe exterior with damp cloth. Air dry before folding for storage.',
    seoTitle: 'Golf Cart Organizer 6-Pocket Caddie | WYX Golf Supply Co.',
    metaDescription: 'A 6-pocket golf cart organizer caddie that clamps to any cart frame. Clear GPS/phone pocket, 5 side pockets, collapses flat. Clears the cart floor. Under $35.',
    tags: ['golf cart organizer', 'golf accessories', 'cart caddie', 'golf trip', 'golf gifts for dad', 'golf bag accessories', 'under $35'],
    imageUrl: 'https://images.unsplash.com/photo-1598965402089-897ce52e8355?w=1200&h=900&fit=crop&q=80',
    imageAlt: 'Golf cart on course with accessories'
  },
  {
    title: 'Golf Alignment Board — Foot & Ball Position Trainer',
    handle: 'golf-alignment-board-foot-trainer',
    price: '38.00',
    productType: 'Training Aids',
    collectionHandle: 'training-aids',
    description: 'A foldable golf alignment board with foot position guides, ball position markers for driver/iron/wedge, and an aim line — builds consistent setup in 30 days of range use.',
    details: [
      'Three labeled ball position guides: Driver / Irons / Wedge',
      'Foot position markers for shoulder-width stance confirmation',
      'Aim line runs parallel to ball-target line for accurate alignment',
      'Folds in half — fits in bag side pocket or carry sleeve',
      'Non-slip rubber backing — stays in place on range mats and grass'
    ],
    materials: 'HDPE board with printed position guides and rubber non-slip backing.',
    care: 'Wipe clean with damp cloth. Fold along the center crease — do not roll.',
    seoTitle: 'Golf Alignment Board Training Aid | Foot Position Trainer | WYX Golf Supply Co.',
    metaDescription: 'A foldable golf alignment board with ball position guides, foot markers, and aim line. Builds consistent setup at the range. Folds to bag-pocket size. Under $40.',
    tags: ['alignment board', 'golf training aid', 'golf alignment', 'golf practice', 'golf gifts for him', 'golf improvement', 'under $40'],
    imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1200&h=900&fit=crop&q=80',
    imageAlt: 'Golfer practicing alignment and stance on range'
  },
  {
    title: 'Cabretta Leather Golf Glove 3-Pack — Men\'s ML',
    handle: 'cabretta-golf-glove-3-pack-mens',
    price: '32.00',
    productType: 'Gloves',
    collectionHandle: 'gloves',
    description: 'Three genuine cabretta leather golf gloves in men\'s ML — the consumable every golfer runs out of. Fresh cabretta for every 10 rounds, no more playing on a dried-out cracked glove.',
    details: [
      'Genuine cabretta leather palm and fingers for maximum feel and grip',
      'Three gloves — enough for 30-45 rounds without reordering',
      'Men\'s ML (Medium-Large) — fits most hand sizes',
      'Perforated back panel for airflow in warm weather',
      'Adjustable velcro tab closure — secure fit on any swing'
    ],
    materials: 'Cabretta sheepskin leather palm, stretch-mesh back, velcro closure.',
    care: 'Air dry after each round — never in direct sun or dryer. Store flat.',
    seoTitle: 'Cabretta Golf Glove 3-Pack Men\'s | WYX Golf Supply Co.',
    metaDescription: 'Genuine cabretta leather golf glove 3-pack for men. Three gloves for 30-45 rounds of fresh grip. Under $35. Use WYX10 for 10% off.',
    tags: ['golf glove', 'cabretta glove', 'golf gloves', 'mens golf glove', 'golf gifts for dad', 'under $35', 'golf accessories', 'direct-catalog', 'wyx-curated'],
    imageUrl: 'https://images.unsplash.com/photo-1594735308830-1e09e0d93f39?w=1200&h=900&fit=crop&q=80',
    imageAlt: 'Golf glove on hand during golf swing'
  },
  {
    title: 'Microfiber Golf Towel — Clip-On Carabiner, 16x24"',
    handle: 'microfiber-golf-towel-clip-on',
    price: '18.00',
    productType: 'Towels',
    collectionHandle: 'accessories',
    description: 'A 16x24" microfiber golf towel with a heavy-gauge carabiner clip that actually opens wide enough to attach to any bag ring. Dual-sided: waffle weave for clubs, smooth side for ball and grip.',
    details: [
      'Dual-sided: waffle weave for club face scrubbing, smooth side for ball and grip clean',
      'Heavy-gauge carabiner clip opens 1.5" — fits any bag ring, cart, or trolley handle',
      '16x24" — large enough to hang open across the bag face',
      'Machine washable, holds no odor after 3+ wash cycles',
      'Stays damp longer than terry cloth — cleans more clubs per wet'
    ],
    materials: '80% polyester / 20% polyamide microfiber. Stainless steel carabiner.',
    care: 'Machine wash cold, tumble dry low. Do not use fabric softener (reduces absorption).',
    seoTitle: 'Golf Towel Clip-On Microfiber | WYX Golf Supply Co.',
    metaDescription: 'A 16x24" dual-sided microfiber golf towel with heavy-gauge carabiner clip. Hangs on any bag ring. Machine washable. Under $20. Use WYX10 for 10% off.',
    tags: ['golf towel', 'microfiber towel', 'golf accessories', 'clip on towel', 'golf gifts for dad', 'golf bag accessories', 'under $20', 'direct-catalog', 'wyx-curated'],
    imageUrl: 'https://images.unsplash.com/photo-1515191107209-c28698631303?w=1200&h=900&fit=crop&q=80',
    imageAlt: 'Golf towel hanging on golf bag during round'
  },
  {
    title: 'Premium Golf Ball Mix Pack — 12 Urethane Tour Balls',
    handle: 'premium-golf-ball-mix-pack-12',
    price: '34.00',
    productType: 'Golf Balls',
    collectionHandle: 'golf-balls',
    description: 'A 12-ball mix pack of premium urethane tour-grade golf balls — reconditioned to USGA standards. Play the same ball the tour plays at a fraction of new retail. Ideal for a round or two before committing to a specific model.',
    details: [
      '12 urethane-cover tour balls — reconditioned to excellent play condition',
      'Mix of Titleist Pro V1, Pro V1x, Callaway Chrome Soft, TaylorMade TP5',
      'Each ball inspected: no cuts, no cracks, paint scratched only cosmetically',
      'USGA conforming — legal for all competition and handicap rounds',
      'Packaged in a resealable sleeve set — no loose balls rattling in the box'
    ],
    materials: 'Urethane cover, multi-layer construction. Varies by model in mix.',
    care: 'Store at room temperature. Avoid extended exposure to heat.',
    seoTitle: 'Premium Golf Ball Mix Pack 12 | Tour Golf Balls | WYX Golf Supply Co.',
    metaDescription: 'A 12-ball mix pack of premium urethane tour golf balls reconditioned to excellent play condition. Pro V1, Chrome Soft, TP5. Under $35. WYX10 saves 10%.',
    tags: ['golf balls', 'premium golf balls', 'tour golf balls', 'urethane golf balls', 'golf gifts', 'golf gifts for dad', 'under $35', 'direct-catalog', 'wyx-curated'],
    imageUrl: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=1200&h=900&fit=crop&q=80',
    imageAlt: 'Golf balls on green grass'
  },
  {
    title: 'Dual-Sided Golf Club Brush & Groove Pick',
    handle: 'dual-sided-golf-club-brush-groove-pick',
    price: '16.00',
    productType: 'Club Care',
    collectionHandle: 'accessories',
    description: 'A dual-sided club brush with a stiff nylon bristle face, a brass wire side for compacted groove debris, and a retractable groove pick — plus a carabiner clip to live on the bag permanently.',
    details: [
      'Dual sides: nylon bristle for club face cleaning, brass wire for compacted groove dirt',
      'Retractable groove pick clears tightly packed debris from wedge grooves',
      'Carabiner clip attaches to any bag ring or cart hook',
      'Zinc alloy body — will not rust or corrode in rain',
      'Works on all club types: irons, wedges, woods, putters'
    ],
    materials: 'Zinc alloy body, nylon bristles, brass wire, retractable steel pick. Stainless carabiner.',
    care: 'Rinse with fresh water after heavy mud use. Air dry before clipping back to bag.',
    seoTitle: 'Golf Club Brush Groove Pick | Dual-Sided | WYX Golf Supply Co.',
    metaDescription: 'A dual-sided golf club brush with brass wire, nylon bristle, retractable groove pick, and carabiner clip. Attaches to any bag permanently. Under $20.',
    tags: ['golf club brush', 'groove pick', 'club care', 'golf accessories', 'golf bag accessories', 'golf gifts', 'under $20', 'direct-catalog', 'wyx-curated'],
    imageUrl: 'https://images.unsplash.com/photo-1622396481328-9b1b78cdd9fd?w=1200&h=900&fit=crop&q=80',
    imageAlt: 'Golf club brush and grove cleaning tools'
  },
  {
    title: 'Cord Golf Grip Regrip Kit — 13 Grips + Solvent + Tape',
    handle: 'cord-golf-grip-regrip-kit-13-grips',
    price: '48.00',
    productType: 'Grips',
    collectionHandle: 'accessories',
    description: 'A complete regrip kit for a full 13-club set — 13 cord-wrapped all-weather grips, grip solvent, double-sided tape, and a rubber vice clamp insert. Everything to regrip a bag at home in an afternoon for under $50.',
    details: [
      '13 cord-wrapped grips — standard size, 60R core, all-weather performance',
      '8 oz grip solvent bottle — enough for a full bag plus 4-5 touch-ups',
      '1" double-sided grip tape roll (36") — pre-cut marks for single wraps',
      'Rubber vice clamp insert — protects shaft during install without a full vice',
      'Compatible with all steel and graphite shafts in standard diameter'
    ],
    materials: 'Rubber-cord composite grip, standard-weight. Solvent: naphtha-based, evaporates clean.',
    care: 'Clean grips monthly with warm water and mild soap. Replace when tacky feel is gone (typically 40+ rounds or 1 full season).',
    seoTitle: 'Golf Grip Regrip Kit 13 Grips | Cord Golf Grips | WYX Golf Supply Co.',
    metaDescription: 'Complete golf grip regrip kit — 13 cord all-weather grips, grip solvent, tape, and vice clamp insert. Regrip a full set at home for under $50. WYX10 saves 10%.',
    tags: ['golf grips', 'regrip kit', 'cord grips', 'golf bag upgrade', 'golf accessories', 'golf gifts', 'under $50', 'direct-catalog', 'wyx-curated'],
    imageUrl: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=1200&h=900&fit=crop&q=80',
    imageAlt: 'Golf club grips and regripping kit'
  },
  {
    title: 'Stretch Performance Golf Hat — Low Crown, Structured Fit',
    handle: 'stretch-performance-golf-hat-low-crown',
    price: '34.00',
    productType: 'Headwear',
    collectionHandle: 'hats',
    description: 'A low-crown structured golf hat with a stretch-fit band, moisture-wicking sweatband, UPF 30+ fabric, and a flat pre-curved brim. The hat that stays on through 18 holes without a readjust.',
    details: [
      'Low crown structured cap — profile sits flat on the head, not puffed',
      'Stretch-fit inner band — one size fits most without a strapback gap',
      'Moisture-wicking sweatband liner — absorbs and releases sweat between holes',
      'UPF 30+ performance fabric — face and ear protection in summer sun',
      'Pre-curved brim — holds shape from round 1 through the full season'
    ],
    materials: '88% polyester, 12% spandex. Sweatband: 100% cotton terry.',
    care: 'Hand wash cold, air dry. Do not machine dry — pre-curved brim holds shape with air dry only.',
    seoTitle: 'Performance Golf Hat | Stretch Fit Low Crown | WYX Golf Supply Co.',
    metaDescription: 'A low-crown stretch-fit performance golf hat with moisture-wicking sweatband and UPF 30+ fabric. Holds shape all 18. Under $35. WYX10 saves 10%.',
    tags: ['golf hat', 'golf cap', 'performance golf hat', 'stretch fit golf hat', 'headwear', 'golf gifts', 'under $35', 'direct-catalog', 'wyx-curated'],
    imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=1200&h=900&fit=crop&q=80',
    imageAlt: 'Performance golf hat on a sunny course'
  },
  {
    title: 'Golf Laser Rangefinder — 800 Yard Slope-Compensating',
    handle: 'golf-laser-rangefinder-800-yard-slope',
    price: '119.00',
    productType: 'Golf Tech',
    collectionHandle: 'golf-tech',
    description: 'An 800-yard slope-compensating laser rangefinder with 6x magnification, pin-lock vibration confirmation, and a compact belt-clip case. Reads to the pin in under a second on any course.',
    details: [
      '800-yard range — reads flagstick to 400 yards in typical conditions',
      'Slope compensation mode — gives adjusted yardage for elevation changes',
      'Pin-lock vibration confirms you locked the flag, not the tree line',
      '6x magnification with a clear optic and diopter adjustment',
      'Compact belt-clip neoprene case — fits the cart bag side pocket',
      'Battery CR2 (included) — 8,000+ readings per battery'
    ],
    materials: 'ABS and rubber-overmold housing. Fully waterproof to IPX4.',
    care: 'Wipe lens with microfiber only. Store in included case when not in use.',
    seoTitle: 'Golf Laser Rangefinder 800 Yard | Slope Mode | WYX Golf Supply Co.',
    metaDescription: 'An 800-yard slope-compensating golf laser rangefinder with pin-lock vibration, 6x magnification, and belt-clip case. Reads flags in under a second. Under $120.',
    tags: ['rangefinder', 'golf tech', 'laser rangefinder', 'golf gps', 'golf trip', 'golf gifts for dad', 'golf gifts', 'under $120', 'direct-catalog', 'wyx-curated'],
    imageUrl: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=1200&h=900&fit=crop&q=80',
    imageAlt: 'Golf laser rangefinder on course aimed at pin'
  },
  {
    title: 'Golf GPS Watch — 40,000+ Courses, 18-Hole Battery',
    handle: 'golf-gps-watch-40000-courses',
    price: '149.00',
    productType: 'Golf Tech',
    collectionHandle: 'golf-tech',
    description: 'A dedicated golf GPS watch with 40,000+ preloaded courses worldwide, front/middle/back yardages on every hole, shot distance tracking, and a scorekeeping mode — no phone required on the course.',
    details: [
      '40,000+ preloaded courses — no download needed, just select the course and tee off',
      'Front, middle, and back yardage on every hole, every approach',
      'Shot distance tracking — records each shot for post-round review',
      'Scorekeeper mode — track your score and stats through 18',
      '18-hole battery on a single charge — finishes a round before the battery does',
      'Lightweight at 42g — wears like a normal watch, not a computer on your wrist'
    ],
    materials: 'Reinforced composite case with silicone band. Mineral glass lens. IPX7 waterproof.',
    care: 'Rinse with fresh water after rain rounds. Charge with included USB clip cable.',
    seoTitle: 'Golf GPS Watch | 40,000+ Courses | Shot Tracking | WYX Golf Supply Co.',
    metaDescription: 'Golf GPS watch with 40,000+ preloaded courses, front/middle/back yardages, shot tracking, and 18-hole battery. No phone needed. Under $150. WYX10 saves 10%.',
    tags: ['golf watch', 'gps watch', 'golf gps', 'golf tech', 'golf trip', 'golf gifts for dad', 'golf gifts for men', 'golf gifts under $150', 'direct-catalog', 'wyx-curated'],
    imageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=1200&h=900&fit=crop&q=80',
    imageAlt: 'GPS golf watch on wrist on golf course'
  },
  {
    title: 'Leather Golf Scorecard Holder — Full-Grain with Pencil Loop',
    handle: 'leather-golf-scorecard-holder-full-grain',
    price: '38.00',
    productType: 'Accessories',
    collectionHandle: 'bag-accessories',
    description: 'A full-grain leather scorecard holder with a pencil loop, ball marker pocket, and a snap closure. Fits standard USGA scorecards and yardage books. The bag side-pocket upgrade that lasts a decade.',
    details: [
      'Full-grain vegetable-tanned leather — develops a patina with rounds, not worn look',
      'Pencil loop on the spine holds a standard golf pencil flat against the cover',
      'Interior ball marker pocket — one marker always within reach on the green',
      'Snap closure keeps cards dry in light rain and cart wind',
      'Fits standard USGA and course scorecards plus yardage books',
      'Can be monogrammed on the front — ask at checkout'
    ],
    materials: 'Full-grain vegetable-tanned leather. Solid brass snap. Cotton stitching.',
    care: 'Condition with leather conditioner every 6 months. Wipe clean with a damp cloth.',
    seoTitle: 'Leather Golf Scorecard Holder | Full-Grain with Pencil | WYX Golf Supply Co.',
    metaDescription: 'A full-grain leather golf scorecard holder with pencil loop, ball marker pocket, and snap closure. Fits any USGA scorecard. The bag upgrade that lasts a decade. Under $40.',
    tags: ['scorecard holder', 'golf accessories', 'leather golf', 'golf gifts for dad', 'golf gifts', 'bag accessories', 'golf birthday gifts', 'under $40', 'direct-catalog', 'wyx-curated'],
    imageUrl: 'https://images.unsplash.com/photo-1624361172473-a02ba9b79d49?w=1200&h=900&fit=crop&q=80',
    imageAlt: 'Leather golf scorecard holder with pencil and scorecard'
  },
  {
    title: 'Golf Shoe Travel Bag — Ventilated with Divider',
    handle: 'golf-shoe-travel-bag-ventilated-divider',
    price: '28.00',
    productType: 'Accessories',
    collectionHandle: 'bag-accessories',
    description: 'A ventilated golf shoe travel bag with a center divider that keeps the right and left shoe separated, a mesh side panel that lets wet shoes breathe, and a top handle for throwing in the trunk.',
    details: [
      'Center divider separates shoes — no sole-to-upper contact scratching the other shoe',
      'Mesh side panel ventilation — wet spikes dry instead of mildewing in a sealed bag',
      'Wide-mouth zipper gives full access to both sides simultaneously',
      'Reinforced top handle and padded base — survives trunk and overhead bin storage',
      'Fits standard golf shoes up to size 14 wide',
      'Wipe-clean interior lining — mud and grass clean off in seconds'
    ],
    materials: '600D polyester outer. Mesh ventilation panel. Wipe-clean PE lining.',
    care: 'Wipe interior clean with a damp cloth. Air dry open after wet rounds.',
    seoTitle: 'Golf Shoe Travel Bag | Ventilated | WYX Golf Supply Co.',
    metaDescription: 'A ventilated golf shoe travel bag with center divider, mesh side panel, and wide-mouth zipper. Keeps spikes away from clothes in any trunk or travel bag. Under $30.',
    tags: ['golf shoe bag', 'golf travel', 'shoe bag', 'golf trip', 'bag accessories', 'golf accessories', 'golf gifts', 'under $30', 'direct-catalog', 'wyx-curated'],
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1200&h=900&fit=crop&q=80',
    imageAlt: 'Golf shoe travel bag in golf bag pocket'
  },
  {
    title: 'Backyard Chipping Net — 4-Target Folding Frame',
    handle: 'backyard-chipping-net-4-target-folding',
    price: '44.00',
    productType: 'Training Aids',
    collectionHandle: 'golf-training-aids',
    description: 'A 4-target folding chipping net for backyard and garage practice — four different-sized targets test trajectory and carry control, the powder-coated steel frame folds flat in under 60 seconds.',
    details: [
      '4 color-coded target pockets: 6", 12", 18", and 24" — progressively larger for different clubs',
      'Powder-coated steel frame stays rigid in wind — does not tip or wobble on turf',
      'Folds flat in under 60 seconds — stores behind a door or in the garage',
      'Netted frame face catches shanks and skulls — protects the garage wall',
      '5-foot width and 4-foot height accommodates chips, pitches, and bump-and-runs',
      'Compatible with foam practice balls and real golf balls on grass'
    ],
    materials: 'Powder-coated 16mm steel frame. 2mm knotted nylon mesh netting. Polyester target pockets.',
    care: 'Fold and store dry. Wipe frame with a cloth after wet use.',
    seoTitle: 'Backyard Golf Chipping Net | 4-Target Folding | WYX Golf Supply Co.',
    metaDescription: 'A 4-target folding backyard chipping net with powder-coated steel frame — color-coded targets from 6 to 24 inches. Folds flat in 60 seconds. Under $45. WYX10 saves 10%.',
    tags: ['chipping net', 'golf training aid', 'backyard golf', 'short game', 'golf practice', 'golf gifts for dad', 'golf gifts', 'under $50', 'direct-catalog', 'wyx-curated'],
    imageUrl: 'https://images.unsplash.com/photo-1611676028867-89893e54c25c?w=1200&h=900&fit=crop&q=80',
    imageAlt: 'Golf chipping net in backyard practice setup'
  },
  {
    title: 'Putting Alignment Mirror — Folding, Tour-Standard',
    handle: 'putting-alignment-mirror-folding-tour',
    price: '32.00',
    productType: 'Training Aids',
    collectionHandle: 'golf-training-aids',
    description: 'A folding putting alignment mirror that shows eye position, shoulder line, and putter path simultaneously — the same tool used by tour coaches on the putting green. Folds to wallet size.',
    details: [
      'Eye line indicator shows whether eyes are directly over the ball at address',
      'Shoulder line guides reveal open/closed shoulder alignment relative to target',
      'Putter path channel confirms square face-to-path at impact',
      'Folding acrylic mirror — fits in the bag pocket without bulk',
      'Gate function catches the ball on center-face putts only',
      'Works on any putting surface: practice green, carpet, putting mat'
    ],
    materials: 'Shatter-resistant acrylic mirror. Plastic folding frame. Neoprene carrying sleeve.',
    care: 'Wipe mirror with microfiber. Store in included sleeve to prevent scratching.',
    seoTitle: 'Putting Alignment Mirror | Folding Tour Standard | WYX Golf Supply Co.',
    metaDescription: 'A folding putting alignment mirror that checks eye position, shoulder line, and putter path simultaneously. Tour-standard. Folds to wallet size. Under $35. WYX10 saves 10%.',
    tags: ['putting mirror', 'alignment mirror', 'putting aid', 'training aid', 'golf practice', 'golf gifts for dad', 'golf gifts', 'under $35', 'direct-catalog', 'wyx-curated'],
    imageUrl: 'https://images.unsplash.com/photo-1574352245494-d9d4a645e73c?w=1200&h=900&fit=crop&q=80',
    imageAlt: 'Putting alignment mirror on practice green'
  },
  {
    title: 'Stainless Steel Golf Flask — 8oz Hip Flask with Ball Marker Lid',
    handle: 'stainless-golf-flask-8oz-ball-marker-lid',
    price: '36.00',
    productType: 'Accessories',
    collectionHandle: 'golf-accessories',
    description: 'An 8oz brushed stainless steel golf hip flask with a threaded cap that doubles as a milled ball marker — fits flush in the cart bag side pocket, holds enough for the back nine.',
    details: [
      '8oz capacity — 5-6 standard pour shots or a full flask of your preferred spirit',
      'Threaded cap unscrews to reveal a milled stainless ball marker — dual purpose',
      'Brushed stainless exterior — no finish to chip or scratch in the bag',
      'Leak-proof threaded seal — tested to 30° angle without drip',
      'Slim profile fits every cart bag side pocket and most stand bag pockets',
      'Engraving-ready front panel — bring it to a trophy shop for a name or initials'
    ],
    materials: '304 food-grade stainless steel. Threaded cap with silicone seal.',
    care: 'Rinse with warm water after use. Dry fully before storing to prevent interior odor.',
    seoTitle: 'Golf Flask 8oz | Stainless Steel | Ball Marker Lid | WYX Golf Supply Co.',
    metaDescription: 'An 8oz brushed stainless golf flask with a ball marker threaded lid. Fits any cart bag pocket. Leak-proof. Engraving-ready. Under $40. WYX10 saves 10%.',
    tags: ['golf flask', 'golf accessories', 'golf gifts for men', 'golf bachelor party', 'golf gifts', 'golf trip', 'golf gifts under $40', 'under $40', 'direct-catalog', 'wyx-curated'],
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200&h=900&fit=crop&q=80',
    imageAlt: 'Stainless steel golf flask on golf bag'
  },
  {
    title: 'Night Golf Glow Ball Set — 12 LED-Core Light-Up Golf Balls',
    handle: 'night-golf-glow-ball-set-12-led-core',
    price: '42.00',
    productType: 'Golf Balls',
    collectionHandle: 'golf-balls',
    description: 'A 12-pack of LED-core light-up golf balls for night golf, twilight rounds, and backyard practice — each ball activates on impact and glows for 8+ minutes, visible from 100 yards.',
    details: [
      '12 LED-core balls in 4 colors: white, red, blue, and green — 3 of each',
      'Activates on impact — first hit turns on the LED, which glows for 8+ minutes',
      'Visible from 100+ yards in full darkness — find every shot on a night round',
      'Two-piece construction plays like a standard practice ball — not a toy',
      'Compatible with standard ball washers and ball retrievers',
      'Works on any course that permits night play, backyard chipping, and putting'
    ],
    materials: 'Ionomer cover with LED core. Standard USGA dimensions (1.68" diameter).',
    care: 'Store away from extreme heat. Replace batteries by unscrewing the equator seam.',
    seoTitle: 'Night Golf Glow Balls LED | 12 Pack Light-Up Golf Balls | WYX Golf Supply Co.',
    metaDescription: 'A 12-pack of LED-core light-up golf balls for night golf and twilight rounds — activates on impact, glows 8+ minutes, visible 100+ yards. Under $45. WYX10 saves 10%.',
    tags: ['night golf', 'glow golf balls', 'light up golf balls', 'golf balls', 'golf gifts', 'golf bachelor party', 'golf trip', 'fun golf gifts', 'under $45', 'direct-catalog', 'wyx-curated'],
    imageUrl: 'https://images.unsplash.com/photo-1632926565162-2a9e4c31e63f?w=1200&h=900&fit=crop&q=80',
    imageAlt: 'Glowing golf balls on a night golf course'
  },
  {
    title: 'Golf Putting Mat — 9-Foot Velvet Surface with Alignment Lines',
    handle: 'golf-putting-mat-9-foot-alignment',
    price: '54.00',
    productType: 'Training Aids',
    collectionHandle: 'golf-training-aids',
    description: 'A 9-foot velvet putting mat with dual alignment channels, an auto-return ball mechanism, and a regulation-diameter cup — the home putting practice tool that fits any room and rolls up in 30 seconds.',
    details: [
      '9-foot length — enough distance to practice lags and medium-length putts',
      'Dual alignment channels guide the ball down the target line — visual feedback on every stroke',
      'Auto-return mechanism sends the ball back after sinking — no bending over between putts',
      'Regulation-diameter cup (4.25 inches) — same size as a course hole',
      'Velvet surface rolls consistently at ~10 Stimpmeter — faster than most recreational greens',
      'Rolls up and stores in included cloth bag — no dedicated space needed'
    ],
    materials: 'Velvet surface over foam backing. Injection-molded ABS cup and return channel.',
    care: 'Roll with the grain for storage. Vacuum lightly to remove debris from velvet surface.',
    seoTitle: 'Golf Putting Mat 9-Foot | Alignment Lines | Auto-Return | WYX Golf Supply Co.',
    metaDescription: 'A 9-foot golf putting mat with alignment channels, auto-return ball mechanism, and regulation cup. Velvet surface, rolls up in 30 seconds. Under $55. WYX10 saves 10%.',
    tags: ['putting mat', 'golf training aid', 'home putting', 'golf practice', 'golf gifts for dad', 'golf gifts', 'under $60', 'direct-catalog', 'wyx-curated'],
    imageUrl: 'https://images.unsplash.com/photo-1562742937-1e36b6516b6b?w=1200&h=900&fit=crop&q=80',
    imageAlt: 'Golf putting mat on living room floor with alignment lines'
  },
  {
    title: 'Golf Ball Retriever — 15-Foot Telescoping Stainless',
    handle: 'golf-ball-retriever-15-foot-telescoping',
    price: '24.00',
    productType: 'Accessories',
    collectionHandle: 'golf-accessories',
    description: 'A 15-foot telescoping golf ball retriever with a stainless steel shaft, a universal ball-grabbing cup that works for all standard golf ball sizes, and a twist-lock mechanism that holds at any length.',
    details: [
      '15-foot extended reach — retrieves from ponds, thick rough, and steep hazards',
      'Collapses to 26 inches — fits inside any golf bag pocket without hanging out',
      'Stainless steel shaft — does not corrode after repeated water hazard use',
      'Universal scoop cup grabs any standard 1.68-inch golf ball in one smooth motion',
      'Twist-lock at any length — no ratchet clicks, no slipping during reach',
      'Foam grip handle stays secure with a wet glove'
    ],
    materials: 'Stainless steel telescoping shaft. ABS scoop cup. EVA foam grip handle.',
    care: 'Rinse stainless shaft after water hazard use. Extend fully to dry before collapsing.',
    seoTitle: 'Golf Ball Retriever 15-Foot | Telescoping Stainless | WYX Golf Supply Co.',
    metaDescription: 'A 15-foot telescoping golf ball retriever with stainless steel shaft and universal scoop cup. Collapses to 26 inches for bag storage. Under $25. WYX10 saves 10%.',
    tags: ['golf ball retriever', 'golf accessories', 'golf bag accessory', 'golf gifts', 'stocking stuffers', 'under $25', 'direct-catalog', 'wyx-curated'],
    imageUrl: 'https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=1200&h=900&fit=crop&q=80',
    imageAlt: 'Golf ball retriever extended over water hazard'
  },
  {
    title: 'Golf Arm Sleeve UV Protection — Pair',
    handle: 'golf-arm-sleeve-uv-protection-pair',
    price: '22.00',
    productType: 'Accessories',
    collectionHandle: 'golf-accessories',
    description: 'A pair of golf arm sleeves with UPF 50+ UV protection, moisture-wicking fabric, and compression support. Slip on for sun protection during a round without reapplying sunscreen every two hours.',
    details: [
      'UPF 50+ rated fabric blocks 98% of UV-A and UV-B rays',
      'Moisture-wicking polyester-spandex blend stays cool all round',
      'Compression support reduces arm fatigue over 18 holes',
      'One-size-fits-most with elastic bands that grip without cutting',
      'Folds into a shirt pocket — on for back nine sun, off when clouds roll in',
      'Machine washable, holds UPF rating through 50+ washes'
    ],
    materials: '88% polyester, 12% spandex. UPF 50+ rated outer layer.',
    care: 'Machine wash cold, tumble dry low. Do not bleach.',
    seoTitle: 'Golf Arm Sleeves UPF 50+ | Sun Protection Pair | WYX Golf Supply Co.',
    metaDescription: 'Golf arm sleeves with UPF 50+ sun protection and moisture-wicking compression fabric. One-size-fits-most pair, machine washable. Under $25. WYX10 saves 10%.',
    tags: ['golf arm sleeve', 'golf sun protection', 'golf accessories', 'golf gifts', 'under $25', 'direct-catalog', 'wyx-curated'],
    imageUrl: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=1200&h=900&fit=crop&q=80',
    imageAlt: 'Golf arm sleeves with UV protection worn during a round'
  },
  {
    title: 'Golf Hat Clip Ball Marker Set — 3 Markers',
    handle: 'golf-hat-clip-ball-marker-set-3-markers',
    price: '16.00',
    productType: 'Accessories',
    collectionHandle: 'golf-accessories',
    description: 'A set of 3 magnetic golf ball markers with a magnetic hat clip. Mark your ball on the green, return the marker to the hat clip with one hand, and never dig in your pocket mid-round again.',
    details: [
      '3 markers included — two standard rounds plus a backup in the bag',
      'Magnetic hat clip holds markers securely until pulled off with one hand',
      'Coin-sized markers meet USGA marking requirements',
      'Works with any hat brim — curved or flat, structured or unstructured',
      'Brushed aluminum markers do not scratch or corrode from moisture',
      'Fits in any bag side pocket when not on the hat'
    ],
    materials: 'Brushed aluminum markers. Stainless steel magnetic clip.',
    care: 'Wipe clean with a dry cloth. Keep magnets away from phone card readers.',
    seoTitle: 'Golf Hat Clip Ball Marker Set 3-Pack | Magnetic Hat Clip | WYX Golf Supply Co.',
    metaDescription: 'A 3-pack of magnetic golf ball markers with a magnetic hat clip. One-hand retrieval, USGA-compliant, brushed aluminum. Under $20. WYX10 saves 10%.',
    tags: ['golf ball marker', 'hat clip ball marker', 'golf accessories', 'golf gifts', 'stocking stuffers', 'under $20', 'direct-catalog', 'wyx-curated'],
    imageUrl: 'https://images.unsplash.com/photo-1622517658789-cfc0ab4ad893?w=1200&h=900&fit=crop&q=80',
    imageAlt: 'Golf hat clip with ball markers on a golf cap'
  },
  {
    title: 'Golf Rain Glove Pair — Wet Weather Grip',
    handle: 'golf-rain-glove-pair-wet-weather-grip',
    price: '34.00',
    productType: 'Gloves',
    collectionHandle: 'golf-gloves',
    description: 'A pair of golf rain gloves — worn both hands simultaneously — that grip better wet than dry. FiberSoft synthetic fabric activates with moisture. The only glove where rain makes your grip more secure.',
    details: [
      'Worn both hands — left and right included',
      'FiberSoft synthetic material grips better as it gets wetter',
      'No more layering over a standard glove — wear alone in rain',
      'Machine washable and reusable through a full wet season',
      'Overlapping cuff design seals rain from running into the palm',
      'Available in M/L — fits most male and female hand sizes'
    ],
    materials: 'FiberSoft microfiber synthetic. Elasticized cuff.',
    care: 'Hand wash or machine wash cold. Air dry. Do not use heat.',
    seoTitle: 'Golf Rain Gloves Pair | Wet Weather Grip | WYX Golf Supply Co.',
    metaDescription: 'A pair of golf rain gloves that grip better wet than dry. FiberSoft fabric activates with moisture. Machine washable. Both hands included. WYX10 saves 10%.',
    tags: ['golf rain glove', 'wet weather golf', 'golf gloves', 'golf accessories', 'golf gifts', 'direct-catalog', 'wyx-curated'],
    imageUrl: 'https://images.unsplash.com/photo-1600186279038-1cbfe2e7b9e3?w=1200&h=900&fit=crop&q=80',
    imageAlt: 'Golf rain gloves on both hands in wet conditions'
  },
  {
    title: 'Golf Sunglasses Polarized Sport Wrap',
    handle: 'golf-sunglasses-polarized-sport-wrap',
    price: '42.00',
    productType: 'Accessories',
    collectionHandle: 'golf-accessories',
    description: 'Sport wrap polarized golf sunglasses with a lens tint optimized for contrast on the fairway, a rubberized nose bridge that holds through a full swing, and a semi-frameless design that does not obstruct address view.',
    details: [
      'Category 3 polarized lens — reduces glare on water hazards and fairways',
      'Amber/brown lens tint enhances contrast of ball against sky and fairway',
      'Sport wrap stays on through a full driver swing without sliding',
      'Rubberized nose bridge and temple tips grip without pressure points',
      'Semi-frameless lower edge does not interfere with address posture view',
      'UV400 rated — blocks 100% of UV-A and UV-B below 400nm'
    ],
    materials: 'TR90 nylon frame. Polycarbonate polarized lens. Silicone grip inserts.',
    care: 'Rinse with clean water. Wipe lens with microfiber cloth only.',
    seoTitle: 'Golf Sunglasses Polarized | Sport Wrap Amber Lens | WYX Golf Supply Co.',
    metaDescription: 'Polarized golf sunglasses with amber lens for fairway contrast and a sport wrap frame that stays through a full swing. UV400. Under $45. WYX10 saves 10%.',
    tags: ['golf sunglasses', 'polarized golf sunglasses', 'golf accessories', 'golf gifts', 'golf tech', 'under $50', 'direct-catalog', 'wyx-curated'],
    imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=1200&h=900&fit=crop&q=80',
    imageAlt: 'Polarized sport wrap golf sunglasses on a player'
  },
  {
    title: 'Wide Brim Golf Sun Hat — UPF 50+',
    handle: 'wide-brim-golf-sun-hat-upf50',
    price: '36.00',
    productType: 'Headwear',
    collectionHandle: 'hats',
    description: 'A lightweight wide-brim golf sun hat with UPF 50+ coverage, breathable nylon shell, and an adjustable chin cord for windy tee boxes.',
    details: [
      'UPF 50+ brim coverage for ears, neck, and face',
      'Lightweight nylon shell with mesh sweatband',
      'Adjustable chin cord keeps the hat stable in cart wind',
      'Packable crown folds without losing shape',
      'Neutral course-ready colors for any dress code'
    ],
    materials: 'Nylon shell with mesh sweatband and adjustable cord.',
    care: 'Hand wash cold, air dry. Do not machine dry.',
    seoTitle: 'Wide Brim Golf Sun Hat UPF 50+ | WYX Golf Supply Co.',
    metaDescription: 'Wide-brim golf sun hat with UPF 50+ protection, breathable shell, and adjustable chin cord. Maximum sun coverage for summer rounds. Under $40.',
    tags: ['golf hat', 'wide brim hat', 'sun hat', 'headwear', 'wyx-category:headwear', 'golf gifts', 'under $40', 'direct-catalog', 'wyx-curated'],
    imageUrl: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=1200&h=900&fit=crop&q=80',
    imageAlt: 'Wide brim golf sun hat on course'
  },
  {
    title: 'Classic Rope Golf Hat — Coastal Trim',
    handle: 'classic-rope-golf-hat-coastal',
    price: '32.00',
    productType: 'Headwear',
    collectionHandle: 'hats',
    description: 'A structured rope-trim golf hat with a mid-crown profile, moisture-wicking sweatband, and adjustable back closure.',
    details: [
      'Contrast rope brim detail with clean course-ready profile',
      'Moisture-wicking sweatband for warm-weather rounds',
      'Adjustable closure fits most head sizes',
      'Structured crown holds shape through a full season',
      'Pairs with polos, quarter-zips, and weekend trip gear'
    ],
    materials: 'Cotton-poly blend crown with rope brim trim.',
    care: 'Hand wash cold, air dry.',
    seoTitle: 'Classic Rope Golf Hat | Coastal Trim | WYX Golf Supply Co.',
    metaDescription: 'Classic rope-trim golf hat with moisture-wicking sweatband and adjustable fit. Course-ready style under $35.',
    tags: ['golf hat', 'rope hat', 'golf cap', 'headwear', 'wyx-category:headwear', 'golf gifts', 'under $35', 'direct-catalog', 'wyx-curated'],
    imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=1200&h=900&fit=crop&q=80',
    imageAlt: 'Classic rope trim golf hat'
  },
  {
    title: 'Unstructured Dad Golf Cap — Soft Crown',
    handle: 'unstructured-dad-golf-cap-soft-crown',
    price: '28.00',
    productType: 'Headwear',
    collectionHandle: 'hats',
    description: 'An unstructured dad cap with a soft crown, pre-curved brim, and low-profile fit for everyday rounds and post-round errands.',
    details: [
      'Soft unstructured crown for a relaxed everyday fit',
      'Pre-curved brim with clean minimal front panel',
      'Adjustable strapback closure',
      'Lightweight cotton twill for all-day comfort',
      'Easy gift with low sizing risk'
    ],
    materials: 'Cotton twill crown with adjustable strap.',
    care: 'Hand wash cold, air dry.',
    seoTitle: 'Unstructured Dad Golf Cap | Soft Crown | WYX Golf Supply Co.',
    metaDescription: 'Unstructured dad golf cap with soft crown, pre-curved brim, and adjustable strapback. Easy everyday course style under $30.',
    tags: ['golf hat', 'dad cap', 'unstructured cap', 'headwear', 'wyx-category:headwear', 'golf gifts', 'under $30', 'direct-catalog', 'wyx-curated'],
    imageUrl: 'https://images.unsplash.com/photo-1575428652377-a8d9c1ca0d57?w=1200&h=900&fit=crop&q=80',
    imageAlt: 'Unstructured dad golf cap'
  },
  {
    title: 'Performance Snapback Golf Hat — Clean Mark',
    handle: 'performance-snapback-golf-hat-clean-mark',
    price: '30.00',
    productType: 'Headwear',
    collectionHandle: 'hats',
    description: 'A performance snapback golf hat with a flat brim option, breathable panels, and a structured profile for players who want a sharper course look.',
    details: [
      'Structured 6-panel crown with breathable eyelets',
      'Snapback closure for quick fit adjustments',
      'Moisture-wicking inner band',
      'Clean front panel with minimal branding',
      'Works for range sessions, trips, and weekend rounds'
    ],
    materials: 'Polyester performance fabric with cotton sweatband.',
    care: 'Spot clean or hand wash cold, air dry.',
    seoTitle: 'Performance Snapback Golf Hat | WYX Golf Supply Co.',
    metaDescription: 'Performance snapback golf hat with breathable panels, moisture-wicking band, and structured fit. Under $35.',
    tags: ['golf hat', 'snapback', 'golf cap', 'headwear', 'wyx-category:headwear', 'golf gifts', 'under $35', 'direct-catalog', 'wyx-curated'],
    imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=1200&h=900&fit=crop&q=80',
    imageAlt: 'Performance snapback golf hat'
  },
  {
    title: 'Golf Alignment Sticks — 2-Pack Fiberglass',
    handle: 'golf-alignment-sticks-2-pack-fiberglass',
    price: '24.00',
    productType: 'Training Aids',
    collectionHandle: 'golf-training-aids',
    description: 'A pair of 48-inch fiberglass alignment sticks for stance, ball position, and target-line setup at the range or in the backyard.',
    details: [
      'Two 48-inch sticks for target line and ball position',
      'Fiberglass shaft with protective end caps',
      'Fits in most bag pockets or clips to the bag exterior',
      'Works for full swing, chip, and putting alignment',
      'The fastest training upgrade for weekend players'
    ],
    materials: 'Fiberglass shafts with rubber end caps.',
    care: 'Wipe clean and store flat or clipped to the bag.',
    seoTitle: 'Golf Alignment Sticks 2-Pack | Fiberglass | WYX Golf Supply Co.',
    metaDescription: 'Fiberglass golf alignment sticks for stance, ball position, and target-line practice. 2-pack under $25.',
    tags: ['alignment sticks', 'swing correction', 'training aid', 'wyx-category:training aids', 'golf practice', 'under $25', 'direct-catalog', 'wyx-curated'],
    imageUrl: 'https://ae-pic-a1.aliexpress-media.com/kf/S27437703cbdb40b7835f06b957d7578eI.jpg_480x480q75.jpg',
    imageAlt: 'Golf alignment sticks on practice range'
  }
];
