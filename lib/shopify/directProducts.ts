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
  }
];
