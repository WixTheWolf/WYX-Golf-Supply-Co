/**
 * phase2Products.ts
 *
 * Phase 2 direct-seed catalog — fills gaps in the Phase 1 catalog:
 * - More hat styles (bucket, visor, wide-brim)
 * - More training aids (alignment sticks, speed trainer, putting gate)
 * - Divot tools (magnetic combo, switchblade fork)
 * - Apparel (performance polo, quarter-zip pullover)
 * - Accessories (tee dispenser, headcovers, scorecard pencil set)
 *
 * All images: Unsplash free commercial license.
 * All products tagged wyx-curated + direct-catalog for catalog filtering.
 */

import type { DirectProduct } from './directProducts';

export const phase2Products: DirectProduct[] = [
  {
    title: 'Wide Brim Sun Hat — UPF 50+ Golf Sun Hat',
    handle: 'wide-brim-golf-sun-hat-upf50',
    price: '32.00',
    productType: 'Headwear',
    collectionHandle: 'hats',
    description: 'A wide-brim UPF 50+ golf sun hat with a full 3-inch brim that shades the face, ears, and back of neck — the hat for 36-hole days in open conditions where a cap alone is not enough.',
    details: [
      '3-inch all-around brim shades face, ears, and neck simultaneously',
      'UPF 50+ fabric blocks 98% of UV-A and UV-B rays',
      'Moisture-wicking sweatband keeps the brim from sitting heavy on a sweaty head',
      'Wind cord with toggle — prevents loss in cart or coastal course wind',
      'Crushable brim folds flat into a bag pocket — springs back to shape',
      'Adjustable drawstring fit — one size fits most adult heads'
    ],
    materials: '100% polyester UPF 50+ fabric. Cotton sweatband. Nylon wind cord.',
    care: 'Hand wash cold, air dry flat. Do not machine dry.',
    seoTitle: 'Wide Brim Golf Sun Hat UPF 50+ | WYX Golf Supply Co.',
    metaDescription: 'A wide-brim UPF 50+ golf sun hat with 3-inch all-around brim, moisture-wicking sweatband, and crushable brim. Shades face, ears, and neck. Under $35.',
    tags: ['golf hat', 'wide brim hat', 'sun hat', 'headwear', 'upf 50', 'summer golf', 'golf accessories', 'golf gifts', 'under $35', 'direct-catalog', 'wyx-curated'],
    imageUrl: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=1200&h=900&fit=crop&q=80',
    imageAlt: 'Wide brim sun hat worn outdoors in bright sunlight'
  },
  {
    title: 'Golf Visor — Performance Stretch Fit',
    handle: 'golf-visor-performance-stretch-fit',
    price: '22.00',
    productType: 'Headwear',
    collectionHandle: 'hats',
    description: 'A stretch-fit golf visor with a moisture-wicking sweatband, UPF 30+ brim, and an open crown that keeps the head cool in summer conditions when a full cap traps heat.',
    details: [
      'Open crown design allows full airflow — 8-10°F cooler than a full cap in direct sun',
      'UPF 30+ brim provides meaningful face and eye shadow on sunny days',
      'Stretch-fit band — one size fits most without an awkward strapback gap',
      'Moisture-wicking interior band absorbs and releases sweat between holes',
      'Pre-curved brim holds shape through a full round and machine washes'
    ],
    materials: '88% polyester, 12% spandex. Sweatband: 100% cotton terry.',
    care: 'Machine wash cold, air dry. Do not tumble dry.',
    seoTitle: 'Golf Visor Stretch Fit | Open Crown Performance | WYX Golf Supply Co.',
    metaDescription: 'A stretch-fit open-crown golf visor with moisture-wicking sweatband and UPF 30+ brim. Cooler than a cap in summer. Under $25.',
    tags: ['golf visor', 'golf hat', 'headwear', 'golf cap', 'summer golf', 'golf accessories', 'golf gifts', 'under $25', 'direct-catalog', 'wyx-curated'],
    imageUrl: 'https://images.unsplash.com/photo-1557180295-76eee20ae8aa?w=1200&h=900&fit=crop&q=80',
    imageAlt: 'Athletic visor worn on golf course in summer'
  },
  {
    title: 'Performance Golf Polo — Moisture-Wicking Stretch',
    handle: 'performance-golf-polo-moisture-wicking',
    price: '44.00',
    productType: 'Apparel',
    collectionHandle: 'apparel',
    description: 'A moisture-wicking stretch performance golf polo with a 4-way stretch fabric, flat-lock seams that do not rub, and a UV50+ rating — built for 18-hole comfort on any course with a polo dress code.',
    details: [
      '4-way stretch fabric moves with the swing without pulling or binding at the shoulders',
      'Moisture-wicking finish pulls sweat away from the skin across all 18 holes',
      'UPF 30+ fabric protection on sun-exposed rounds',
      'Flat-lock seams at shoulders and collar — no rubbing under a bag strap or glove',
      'Self-fabric collar stays down through a full round without wilting',
      'Machine washable, holds shape through 80+ wash cycles'
    ],
    materials: '92% polyester, 8% spandex performance stretch fabric.',
    care: 'Machine wash cold inside out. Tumble dry low. Do not iron the collar.',
    seoTitle: 'Performance Golf Polo | Moisture-Wicking Stretch | WYX Golf Supply Co.',
    metaDescription: 'A moisture-wicking 4-way stretch golf polo with UPF 30+ and flat-lock seams. Moves with the swing, holds shape all round. Under $45.',
    tags: ['golf polo', 'golf shirt', 'golf apparel', 'performance polo', 'golf gifts', 'golf gifts for dad', 'under $50', 'direct-catalog', 'wyx-curated'],
    imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=1200&h=900&fit=crop&q=80',
    imageAlt: 'Performance polo shirt on man outdoors'
  },
  {
    title: 'Golf Quarter-Zip Pullover — Thermal Stretch',
    handle: 'golf-quarter-zip-pullover-thermal',
    price: '58.00',
    productType: 'Apparel',
    collectionHandle: 'apparel',
    description: 'A thermal stretch quarter-zip golf pullover for early morning rounds and autumn conditions — lightweight enough to swing freely, warm enough to remove the need for a full-layer vest underneath.',
    details: [
      'Thermal stretch knit — insulating without the bulk of a traditional midlayer',
      '4-way stretch maintains full range of motion through driver and iron swings',
      'Quarter-zip collar vents heat on the back nine when the morning chill breaks',
      'Thumbhole cuffs keep sleeves in place and prevent riding up at address',
      'Long tail stays tucked through a full round without adjustment',
      'Machine washable — does not pill after multiple cycles'
    ],
    materials: '85% polyester, 10% wool, 5% spandex thermal knit.',
    care: 'Machine wash cold, lay flat to dry or tumble dry low. Do not dry clean.',
    seoTitle: 'Golf Quarter-Zip Pullover | Thermal Stretch | WYX Golf Supply Co.',
    metaDescription: 'A thermal stretch quarter-zip golf pullover for early morning rounds. Lightweight, 4-way stretch, thumbhole cuffs. Under $60.',
    tags: ['golf pullover', 'quarter zip', 'golf apparel', 'golf midlayer', 'golf gifts', 'golf gifts for him', 'under $60', 'direct-catalog', 'wyx-curated'],
    imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=1200&h=900&fit=crop&q=80',
    imageAlt: 'Quarter zip pullover worn outdoors in autumn conditions'
  },
  {
    title: 'Golf Alignment Sticks 2-Pack — Fiberglass 48"',
    handle: 'golf-alignment-sticks-2-pack-fiberglass',
    price: '24.00',
    productType: 'Training Aids',
    collectionHandle: 'training-aids',
    description: 'A 2-pack of 48-inch fiberglass golf alignment sticks — the training tool used by every tour professional and owned by very few amateurs. Two sticks reveal aim, ball position, and stance width simultaneously.',
    details: [
      '48-inch length — long enough to run parallel to the ball-target line and into peripheral vision',
      'Fiberglass shaft — light, flexible, and will not damage range mats on removal',
      'Two sticks: one for target line, one for ball position or foot alignment',
      'High-visibility orange with a neon tip — visible in all lighting conditions',
      'Carrying tube included — protects both sticks inside the bag',
      'Used by PGA Tour players before every range session; most amateurs have never tried them'
    ],
    materials: 'Fiberglass shaft with rubber tip and protective carrying tube.',
    care: 'Wipe clean with a damp cloth. Store in the included tube.',
    seoTitle: 'Golf Alignment Sticks 2-Pack | 48" Fiberglass | WYX Golf Supply Co.',
    metaDescription: 'A 2-pack of 48-inch fiberglass golf alignment sticks in a carrying tube. Used by tour pros every session. Reveals aim errors in 10 minutes. Under $25.',
    tags: ['alignment sticks', 'golf training aid', 'golf alignment', 'golf practice', 'golf gifts for dad', 'golf improvement', 'under $25', 'direct-catalog', 'wyx-curated'],
    imageUrl: 'https://images.unsplash.com/photo-1510521196603-23acd98bfde7?w=1200&h=900&fit=crop&q=80',
    imageAlt: 'Golf training alignment sticks on a range mat'
  },
  {
    title: 'Golf Swing Speed Trainer — Weighted Stick',
    handle: 'golf-swing-speed-trainer-weighted-stick',
    price: '36.00',
    productType: 'Training Aids',
    collectionHandle: 'training-aids',
    description: 'A weighted golf swing speed trainer that builds swing speed through progressive overspeed training — swinging heavier builds fast-twitch muscle memory that produces measurable speed gains within 6 weeks.',
    details: [
      '44-inch training stick with adjustable weight sleeve — 200g and 350g settings',
      'Flexible shaft generates audible whoosh feedback — louder whoosh means higher speed',
      'Overspeed training protocol: 20 swings lighter + 20 swings heavier before each round',
      'Works for drivers, irons, and one-handed drills',
      'Compatible with any training aid protocol including SuperSpeed and Stack System methods',
      'Includes printed protocol card with 6-week speed improvement program'
    ],
    materials: 'Composite flexible shaft with adjustable steel weight sleeve.',
    care: 'Wipe clean with a damp cloth. Store in the included fabric sleeve.',
    seoTitle: 'Golf Swing Speed Trainer | Weighted Training Stick | WYX Golf Supply Co.',
    metaDescription: 'A weighted golf swing speed trainer for overspeed training — 200g and 350g settings, flexible shaft with whoosh feedback. 6-week speed program included. Under $40.',
    tags: ['swing speed trainer', 'golf training aid', 'golf practice', 'golf gifts for dad', 'golf improvement', 'speed training', 'under $40', 'direct-catalog', 'wyx-curated'],
    imageUrl: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=1200&h=900&fit=crop&q=80',
    imageAlt: 'Golf swing training aid on golf course'
  },
  {
    title: 'Magnetic Golf Divot Tool — Combo with Ball Marker',
    handle: 'magnetic-golf-divot-tool-combo-marker',
    price: '18.00',
    productType: 'Accessories',
    collectionHandle: 'accessories',
    description: 'A magnetic golf divot repair tool with a ball marker recessed in the head — one-push deployment, magnetic closure, USGA-legal coin-sized marker. The combo that covers both greens-side needs in one bag slot.',
    details: [
      'Push-button deployment — opens one-handed with a gloved hand',
      'Magnetic ball marker (coin-sized) recessed flush in the tool head',
      'USGA-legal dimensions — legal for all competition and handicap rounds',
      'Prong design per USGA-approved technique: push in, not up, rotate to lift',
      'Zinc alloy body — will not corrode in rain or morning dew',
      'Fits shirt pocket, bag side pocket, or clips to any bag ring'
    ],
    materials: 'Zinc alloy tool body. Stainless magnet. Brushed aluminum marker.',
    care: 'Wipe clean with a dry cloth. Keep magnet away from phone card readers.',
    seoTitle: 'Magnetic Golf Divot Tool | Combo Ball Marker | WYX Golf Supply Co.',
    metaDescription: 'A push-button magnetic golf divot tool with ball marker recessed in the head. USGA-legal, one-handed deployment, zinc alloy. Under $20.',
    tags: ['golf divot tool', 'divot repair tool', 'golf accessories', 'golf ball marker', 'golf gifts', 'stocking stuffers', 'under $20', 'direct-catalog', 'wyx-curated'],
    imageUrl: 'https://images.unsplash.com/photo-1622517658789-cfc0ab4ad893?w=1200&h=900&fit=crop&q=80',
    imageAlt: 'Golf divot repair tool and ball marker on putting green'
  },
  {
    title: 'Switchblade Fork Divot Tool — One-Click Deploy',
    handle: 'switchblade-fork-divot-tool-one-click',
    price: '14.00',
    productType: 'Accessories',
    collectionHandle: 'accessories',
    description: 'A switchblade-style fork divot tool that deploys with a single button click and closes with a squeeze — no more fumbling with a traditional two-prong open tool on the green under pace-of-play pressure.',
    details: [
      'Single-click switchblade deployment — opens the fork instantly from a closed position',
      'Squeeze to close — one-hand operation fully supported with a gloved hand',
      'Classic two-prong fork for the push-in repair technique on ball marks',
      'Lightweight aluminum body — under 1oz, disappears in the shirt pocket',
      'Available in brushed silver and matte black',
      'Ships with a custom ball marker in the same finish'
    ],
    materials: 'Anodized aluminum body with stainless steel fork prongs.',
    care: 'Wipe clean with a dry cloth.',
    seoTitle: 'Switchblade Divot Tool | One-Click Fork | WYX Golf Supply Co.',
    metaDescription: 'A switchblade-style one-click fork divot tool — opens and closes with one hand in a glove. Lightweight aluminum. Ships with a ball marker. Under $15.',
    tags: ['divot tool', 'switchblade divot tool', 'golf accessories', 'golf gifts', 'stocking stuffers', 'golf ball marker', 'under $15', 'direct-catalog', 'wyx-curated'],
    imageUrl: 'https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=1200&h=900&fit=crop&q=80',
    imageAlt: 'Golf divot repair switchblade tool close up'
  },
  {
    title: 'Golf Tee Dispenser Holder — 50 Tees + Carabiner',
    handle: 'golf-tee-dispenser-holder-50-tees',
    price: '14.00',
    productType: 'Accessories',
    collectionHandle: 'accessories',
    description: 'A twist-dispenser golf tee holder with 50 standard 2.75" wooden tees, a carabiner clip for the bag ring, and a twist top that drops one tee at a time — no more digging in pockets on the tee box.',
    details: [
      '50 standard 2.75" natural wood tees included — USGA conforming',
      'Twist-dispenser mechanism drops one tee at a time from the bottom',
      'Carabiner clip attaches to any bag ring — always accessible at the tee',
      'Holds 20 extra tees after the included 50 for mid-round restocking',
      'Water-resistant cap seals tees against rain and morning dew',
      'Refillable with any standard 2.75" golf tee'
    ],
    materials: 'ABS plastic dispenser. Stainless carabiner. Wooden tees.',
    care: 'Refill from the top cap. Keep lid closed in wet conditions.',
    seoTitle: 'Golf Tee Dispenser | 50 Tees + Carabiner Clip | WYX Golf Supply Co.',
    metaDescription: 'A twist golf tee dispenser with 50 standard tees and a carabiner bag clip. Drops one tee at a time from the bottom — no pocket digging. Under $15.',
    tags: ['golf tees', 'tee dispenser', 'golf accessories', 'golf bag accessories', 'stocking stuffer', 'golf gifts', 'under $15', 'direct-catalog', 'wyx-curated'],
    imageUrl: 'https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?w=1200&h=900&fit=crop&q=80',
    imageAlt: 'Golf tees and ball on golf course tee box'
  },
  {
    title: 'Driver Head Cover — Knit Pom Pom, Vintage Style',
    handle: 'driver-head-cover-knit-pom-pom-vintage',
    price: '28.00',
    productType: 'Accessories',
    collectionHandle: 'accessories',
    description: 'A vintage-style knit driver head cover with a stretch cuff that fits all 460cc drivers and a detachable pom-pom. The cover that signals a golfer with a sense of style — worn on carts at every serious club.',
    details: [
      'Fits all 460cc driver heads — the maximum USGA legal size',
      'Stretch knit cuff prevents slipping off on cart rides over rough terrain',
      'Thick knit shell padded with fleece lining — protects finish from club-on-club contact',
      'Detachable pom-pom — remove for a cleaner look, re-attach for range days',
      'Embroidered number on the cuff indicates the club (1 for driver)',
      'Machine washable — lay flat to dry'
    ],
    materials: 'Acrylic knit outer with fleece lining. Cotton pom-pom.',
    care: 'Machine wash cold, lay flat to dry. Do not dry clean.',
    seoTitle: 'Driver Head Cover Knit Pom Pom | Vintage Golf | WYX Golf Supply Co.',
    metaDescription: 'A vintage knit driver head cover with pom-pom and stretch cuff for all 460cc drivers. Fleece-lined, machine washable. Under $30.',
    tags: ['golf headcover', 'driver cover', 'knit headcover', 'golf accessories', 'golf gifts', 'golf style', 'under $30', 'direct-catalog', 'wyx-curated'],
    imageUrl: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=1200&h=900&fit=crop&q=80',
    imageAlt: 'Golf club driver head cover on golf bag'
  },
  {
    title: 'Golf Scorecard Pencil Set — 12 Pencils with Eraser',
    handle: 'golf-scorecard-pencil-set-12-erasers',
    price: '12.00',
    productType: 'Accessories',
    collectionHandle: 'accessories',
    description: 'Twelve pre-sharpened golf pencils with attached erasers — the consumable no golfer thinks about until they are on the first tee with a scorecard and no way to mark it.',
    details: [
      '12 pre-sharpened pencils with clip-on erasers — enough for a full season',
      'Standard golf pencil length (3.5 inches) — fits every scorecard holder',
      'Soft-lead #2 graphite — marks cleanly on coated scorecard paper',
      'Attached eraser does not smudge the surrounding score boxes',
      'Branding reads "WYX Golf" — subtle bag presence for any gifter',
      'Refill for the leather scorecard holder (sold separately)'
    ],
    materials: '#2 graphite with cedar body. Attached latex eraser.',
    care: 'Keep dry between rounds. Sharpen with a standard pencil sharpener.',
    seoTitle: 'Golf Scorecard Pencils | 12-Pack with Eraser | WYX Golf Supply Co.',
    metaDescription: 'Twelve pre-sharpened golf pencils with attached erasers. Standard 3.5-inch length, #2 graphite, fits every scorecard holder. Under $15.',
    tags: ['golf pencils', 'scorecard pencils', 'golf accessories', 'stocking stuffer', 'golf gifts', 'under $15', 'direct-catalog', 'wyx-curated'],
    imageUrl: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=1200&h=900&fit=crop&q=80',
    imageAlt: 'Golf scorecard and pencil on a putting green'
  },
  {
    title: 'Golf Putting Gate Set — 2 Precision Gates',
    handle: 'golf-putting-gate-set-2-precision-gates',
    price: '22.00',
    productType: 'Training Aids',
    collectionHandle: 'training-aids',
    description: 'A 2-gate putting precision trainer — place the gates 6 inches in front of the ball and 18 inches down the line. A ball that passes both gates is on the ideal starting line with a square face at impact.',
    details: [
      'Gate 1 (6 inches ahead): confirms face is square at impact — offline stroke hits the gate',
      'Gate 2 (18 inches down line): confirms starting line is on target through the full stroke',
      'Adjustable gate width — set wide for beginners, narrow for advanced face control',
      'Magnetic base — sticks to the putting mat or lies flat on carpet and grass',
      'Folds flat — both gates store inside a soft pouch under 2oz total',
      'Works with any putter and any ball on any putting surface'
    ],
    materials: 'Aluminum gate frame with rubber foot pads and neoprene carry pouch.',
    care: 'Wipe clean with a dry cloth. Store in included pouch to protect gate edges.',
    seoTitle: 'Golf Putting Gate Set | 2 Precision Training Gates | WYX Golf Supply Co.',
    metaDescription: 'A 2-gate golf putting trainer — place 6 and 18 inches from the ball. Confirms face angle and starting line simultaneously. Under $25.',
    tags: ['putting gate', 'golf training aid', 'putting practice', 'golf practice', 'golf gifts for dad', 'under $25', 'direct-catalog', 'wyx-curated'],
    imageUrl: 'https://images.unsplash.com/photo-1574352245494-d9d4a645e73c?w=1200&h=900&fit=crop&q=80',
    imageAlt: 'Golf putting training gate set on practice green'
  },
  {
    title: 'Waterproof Golf Towel — 16x24" Waffle Weave',
    handle: 'waterproof-golf-towel-waffle-weave',
    price: '22.00',
    productType: 'Towels',
    collectionHandle: 'accessories',
    description: 'A 16x24" waffle-weave golf towel with a water-resistant microfiber back that keeps the club-cleaning side dry even in light rain — the towel that works in weather conditions where a standard microfiber goes soaked and useless.',
    details: [
      'Dual-layer construction: waffle weave face + water-resistant microfiber back',
      'Water-resistant back stays dry in light rain — the dry side always faces the clubs',
      '16x24" — large enough to drape across the bag for full-round access',
      'Heavy-gauge carabiner clip opens 1.5 inches to fit any bag ring',
      'Machine washable and holds its water-resistant back for 30+ wash cycles',
      'Works in all conditions — the towel golfers use in rain rounds, not just fair weather'
    ],
    materials: '70% polyester / 30% polyamide waffle face. PU-backed water-resistant microfiber reverse.',
    care: 'Machine wash cold, tumble dry low. Do not use fabric softener on the water-resistant side.',
    seoTitle: 'Waterproof Golf Towel | Waffle Weave 16x24 | WYX Golf Supply Co.',
    metaDescription: 'A 16x24" dual-layer golf towel — waffle weave face and water-resistant back. Stays functional in rain rounds. Machine washable. Under $25.',
    tags: ['golf towel', 'waterproof towel', 'waffle weave towel', 'golf accessories', 'golf gifts', 'golf rain gear', 'under $25', 'direct-catalog', 'wyx-curated'],
    imageUrl: 'https://images.unsplash.com/photo-1515191107209-c28698631303?w=1200&h=900&fit=crop&q=80',
    imageAlt: 'Golf towel on golf bag in wet conditions'
  },
  {
    title: 'Golf Ball Retriever — 21-Foot Telescoping',
    handle: 'golf-ball-retriever-21-foot-telescoping',
    price: '32.00',
    productType: 'Accessories',
    collectionHandle: 'golf-accessories',
    description: 'A 21-foot telescoping golf ball retriever for deep water hazards and steep banks where a standard 15-foot model cannot reach — the extended-reach tool for coastal courses and resort layouts with long-carry water.',
    details: [
      '21-foot extended reach — reaches balls that a 15-foot model cannot',
      'Collapses to 34 inches — fits in the bag side pocket without hanging out',
      'Stainless steel shaft with a zinc alloy ball cup — does not corrode in salt water',
      'Universal scoop retrieves any standard 1.68-inch golf ball in one motion',
      'Twist-lock at any extension length — no ratcheting, no slipping',
      'Foam grip handle grips securely with a wet glove'
    ],
    materials: 'Stainless steel telescoping shaft. Zinc alloy scoop cup. EVA foam grip.',
    care: 'Rinse with fresh water after salt or brackish water hazard use. Extend to dry.',
    seoTitle: 'Golf Ball Retriever 21-Foot | Extended Reach | WYX Golf Supply Co.',
    metaDescription: 'A 21-foot telescoping golf ball retriever — extended reach for deep water hazards on resort and coastal courses. Collapses to 34 inches. Under $35.',
    tags: ['golf ball retriever', 'extended retriever', 'golf accessories', 'golf trip', 'golf gifts', 'under $35', 'direct-catalog', 'wyx-curated'],
    imageUrl: 'https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=1200&h=900&fit=crop&q=80',
    imageAlt: 'Extended golf ball retriever near water hazard'
  },
  {
    title: 'Putter Grip — Pistol Jumbo Oversize',
    handle: 'putter-grip-pistol-jumbo-oversize',
    price: '28.00',
    productType: 'Grips',
    collectionHandle: 'accessories',
    description: 'A jumbo pistol-profile putter grip that reduces grip pressure and restricts wrist rotation — the format used by more tour professionals than any other putter grip style, now available as a drop-in replacement.',
    details: [
      'Pistol profile provides a consistent reference point for grip position every putt',
      'Jumbo size (68g) fills the palm — naturally reduces grip pressure that causes yips',
      'Restricted wrist engagement reduces breakdown at impact that creates pushed putts',
      'Tour-standard rubber compound — tacky from 40°F to 90°F without performance loss',
      'Standard 15/16" bore fits 95% of off-the-shelf putter shafts without adaptation',
      'Installation requires grip tape + solvent (available in the regrip kit, sold separately)'
    ],
    materials: 'Natural rubber compound with polyurethane surface coating.',
    care: 'Wipe with a damp cloth and mild soap monthly. Replace when tacky feel diminishes.',
    seoTitle: 'Putter Grip Pistol Jumbo | Oversize Tour Style | WYX Golf Supply Co.',
    metaDescription: 'A jumbo pistol-profile putter grip — reduces grip pressure and wrist breakdown. Tour-standard rubber, standard 15/16" bore. Under $30.',
    tags: ['putter grip', 'golf grips', 'golf accessories', 'golf gifts', 'golf improvement', 'under $30', 'direct-catalog', 'wyx-curated'],
    imageUrl: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=1200&h=900&fit=crop&q=80',
    imageAlt: 'Putter with pistol grip on practice green'
  },
  {
    title: 'Golf Practice Ball Set — 12 Foam Airflow Balls',
    handle: 'golf-practice-ball-set-12-foam-airflow',
    price: '16.00',
    productType: 'Golf Balls',
    collectionHandle: 'golf-balls',
    description: 'A 12-pack of foam airflow golf practice balls for backyard, garage, and basement swing practice — real ball feel at impact, safe to use indoors, and visible flight pattern even on 30-yard chip shots.',
    details: [
      '12 foam airflow balls — enough for a full practice session without chasing',
      'Airflow holes produce visible ball flight on even short chips and pitches',
      'Real-ball dimensions (1.68" diameter) — same setup and swing as a real ball',
      'Foam construction is safe for indoor use: bounces harmlessly off walls and furniture',
      'Compatible with real clubs — no damage to iron faces or grooves',
      'Visible from 30+ yards for drive simulation in an open backyard'
    ],
    materials: 'High-density foam with airflow channels. Standard golf ball dimensions.',
    care: 'Pick up with a standard ball retriever. Clean with a damp cloth.',
    seoTitle: 'Golf Practice Foam Balls | 12 Airflow Balls | WYX Golf Supply Co.',
    metaDescription: 'A 12-pack of foam airflow golf practice balls for indoor and backyard swing practice. Real-ball dimensions, safe indoors. Under $20.',
    tags: ['practice golf balls', 'foam golf balls', 'golf training aid', 'golf practice', 'backyard golf', 'golf gifts for dad', 'under $20', 'direct-catalog', 'wyx-curated'],
    imageUrl: 'https://images.unsplash.com/photo-1579723985163-26b6de5e1ab8?w=1200&h=900&fit=crop&q=80',
    imageAlt: 'Golf practice balls on backyard practice mat'
  }
];
