import { categoryFor } from '@/lib/catalog';
import type { Product } from '@/types/shopify';
import type { IntentPageConfig } from './intentPages';

const under = (product: Product, amount: number) => Number(product.priceRange.minVariantPrice.amount) <= amount;
const categoryIn = (product: Product, categories: string[]) => categories.includes(categoryFor(product));

export const extraIntentPages: Record<string, IntentPageConfig> = {
  'golf-gifts-for-beginners': {
    slug: 'golf-gifts-for-beginners',
    title: 'Golf Gifts for Beginners — Start Strong, Skip the Learning Tax.',
    eyebrow: 'Beginner Golf',
    description: 'The four gear categories that matter most when starting golf: gloves (grip control), alignment sticks (instant feedback), balls (stop losing the good ones), and a bag brush (club care from day one).',
    metaTitle: 'Golf Gifts for Beginners 2026 | Best Starter Golf Gear | WYX Golf Supply Co.',
    metaDescription: 'Shop golf gifts for beginners at WYX — alignment sticks, cabretta gloves, golf balls, and club care starter kits. Use WYX10 for 10% off your first beginner golf order.',
    primaryCta: 'Shop Beginner Golf Gear',
    secondaryCta: 'See Training Aids',
    secondaryHref: '/golf-training-aids',
    proof: ['Alignment sticks $24', 'Glove 3-pack $32', 'Range balls under $30', 'WYX10 saves 10%'],
    faq: [
      ['What golf gear does a beginner actually need?', 'Four things that make an immediate difference: (1) a cabretta glove — gives grip control before their grip technique is solid, (2) alignment sticks — corrects the #1 beginner error (poor aim) before bad habits form, (3) a half-dozen range balls — beginners lose balls, do not give them premium tour balls, (4) a club brush — builds the maintenance habit early. Everything else is optional in the first season.'],
      ['What is the best first golf gift under $30?', 'Alignment sticks ($24) are the best first golf gift under $30. Two fiberglass sticks placed on the ground fix stance alignment, ball position, and swing path simultaneously. Most beginner golfers aim 15-20 yards offline without knowing it — sticks fix this in one session.'],
      ['Is a GPS watch good for a beginner golfer?', 'Yes — a golf GPS watch removes the anxiety of not knowing yardages, which helps beginners make cleaner decisions and enjoy the round more. It also removes the phone from the round. The WYX GPS Watch loads 40,000+ courses and is straightforward to use. Worth it after the first 5 rounds.']
    ],
    match: (product: Product) => under(product, 75) && (categoryIn(product, ['Training Aids', 'Gloves', 'Golf Balls', 'Accessories']) || /alignment|stick|glove|ball|brush/i.test(`${product.title} ${product.productType}`))
  },
  'golf-birthday-gifts': {
    slug: 'golf-birthday-gifts',
    title: 'Golf Birthday Gifts — The Picks He Actually Puts In The Bag.',
    eyebrow: 'Birthday Golf Gifts',
    description: 'Golf birthday gifts that earn a permanent bag spot: the consumables he always runs out of, the accessories he keeps meaning to buy, and the one tech item that improves every round.',
    metaTitle: 'Golf Birthday Gifts 2026 | WYX Golf Supply Co.',
    metaDescription: 'Shop golf birthday gifts at WYX Golf Supply Co. — gloves, ball markers, towels, GPS watch, and alignment sticks. Useful gifts under $150. Use WYX10 for 10% off.',
    primaryCta: 'Shop Birthday Golf Gifts',
    secondaryCta: 'See Golf Gift Sets',
    secondaryHref: '/golf-gift-sets',
    proof: ['Gifts under $60', 'WYX10 saves 10%', 'Ships via Shopify', 'No guesswork required'],
    faq: [
      ['What are the best golf birthday gifts?', 'The best golf birthday gifts are: (1) a cabretta glove 3-pack ($32) — used within two rounds, (2) a milled ball marker set — something every golfer wants but skips buying, (3) a quality clip-on towel ($18) — gets used every round, (4) a GPS watch ($149) — the premium birthday gift that changes every round. All useful every single round.'],
      ['What golf gift should I get a golfer who has everything?', 'Get them the consumables they always run out of — a premium glove 3-pack, a box of the exact ball they play, or a fresh set of grips. Or go premium: a GPS watch, a laser rangefinder, or a leather scorecard holder. These are the gifts every golfer wants but would not buy themselves.'],
      ['What is a good golf birthday gift under $50?', 'Under $50: a microfiber clip-on towel ($18) + groove sharpener ($22) = $40 and looks like a considered gift set. A bamboo tee set ($8) + ball marker ($28) = $36 for the bag-staple gift. Or a single cabretta glove 3-pack ($32) — practical, immediately needed, used within one round.']
    ],
    match: (product: Product) => under(product, 150) || categoryIn(product, ['Accessories', 'Gloves', 'Towels', 'Golf Tech', 'Golf Balls'])
  },
  'golf-trip-packing-list': {
    slug: 'golf-trip-packing-list',
    title: 'Golf Trip Packing List — Everything You Need, Nothing You Don\'t.',
    eyebrow: 'Trip Prep',
    description: 'The complete golf trip packing list: bag gear, travel protection, round essentials, and the accessories most golfers forget until they\'re already at the course.',
    metaTitle: 'Golf Trip Packing List | What to Pack for a Golf Trip | WYX Golf Supply Co.',
    metaDescription: 'The complete golf trip packing list — travel bag, rain hood, gloves, balls, alignment sticks, and gear. Shop WYX for trip-ready golf accessories. Use WYX10 for 10% off.',
    primaryCta: 'Shop Golf Trip Gear',
    secondaryCta: 'Build a Trip Kit',
    secondaryHref: '/kits/golf-trip-kit',
    proof: ['Complete trip checklist', 'Under $200 starter kit', 'WYX10 saves 10%', 'Ships before your tee time'],
    faq: [
      ['What should I pack for a golf trip?', 'The complete golf trip packing list: Bag gear — 3 gloves, 2 dozen balls, 100 tees, divot tool, ball markers, groove brush, towel. Apparel — 4 polos, 2 pairs pants, 2 pairs shorts, 3 pairs golf socks, rain jacket. Tech — rangefinder or GPS watch, phone charging cable. Travel protection — travel bag or hard case, rain hood, club head covers. Shoes — one pair on, one pair in the bag. Forgotten most often: rain hood, spare gloves, divot tool.'],
      ['What golf gear should I buy before a golf trip?', 'The pre-trip priority list: (1) fresh gloves if current ones are dried out — a 3-pack means a fresh glove each day, (2) rain gear if the destination is wet or the season is unpredictable, (3) a rangefinder or GPS watch if you are playing unfamiliar courses, (4) a rain hood if your bag does not have one. Buy these before the trip, not at the pro shop where prices are 30-40% higher.'],
      ['How many golf balls should I bring on a golf trip?', 'Two dozen minimum for a 3-4 day trip playing unfamiliar courses. A new course means more lost balls in the rough and water until you learn the layout. If you play tour-grade balls at $50/dozen, bring the budget for replacements or drop to a slightly less expensive ball for the trip.']
    ],
    match: (product: Product) => /towel|glove|rain|ball|tee|alignment|rangefinder|gps|headcover|umbrella/i.test(`${product.title} ${product.productType} ${(product.tags || []).join(' ')}`) || categoryIn(product, ['Accessories', 'Gloves', 'Golf Tech', 'Golf Balls'])
  },
  'golf-stocking-stuffers': {
    slug: 'golf-stocking-stuffers',
    title: 'Golf Stocking Stuffers — Under $25 Picks That Get Used Every Round.',
    eyebrow: 'Golf Gifts Under $25',
    description: 'Golf stocking stuffers that earn a bag spot instead of a junk drawer: bamboo tee sets, milled ball markers, groove brushes, and alignment sticks — all under $25, all used every round.',
    metaTitle: 'Golf Stocking Stuffers Under $25 | WYX Golf Supply Co.',
    metaDescription: 'Shop golf stocking stuffers under $25 at WYX — bamboo tees, ball markers, groove brushes, and alignment sticks. Every round useful. Use WYX10 for 10% off.',
    primaryCta: 'Shop Golf Stocking Stuffers',
    secondaryCta: 'See Gifts Under $25',
    secondaryHref: '/golf-gifts-under-25',
    proof: ['All picks under $25', 'Every-round useful', 'WYX10 saves 10%', 'Ships fast'],
    faq: [
      ['What are good golf stocking stuffers under $25?', 'The best golf stocking stuffers under $25: bamboo tee set ($8, 100 tees) — biodegradable and used every single shot, ball marker set ($18) — magnetic clip style that attaches to the hat, groove brush ($16) — used every round for clean contact, alignment sticks ($24) — the training aid used at every range session. All practical, all immediately used.'],
      ['What golf gifts are under $20?', 'Under $20 golf gifts: bamboo tees ($8), golf ball stamps/identification kit ($18), divot tool with magnetic ball marker ($14), groove brush ($16), scorecard holder ($18), visor clip for tees and markers ($12). All items that get used every round and take up zero bag space. The best low-dollar golf gifts are always consumable or bag-pocket practical.'],
      ['Is a ball marker a good golf gift?', 'Yes — a quality ball marker is one of the best golf stocking stuffers or small gifts because every golfer uses one every single round, most golfers are using a random coin or worn plastic marker, and a quality milled magnetic marker costs $18-28 and gets noticed by every playing partner. It is the gift that gets commented on during every round.']
    ],
    match: (product: Product) => under(product, 25) || /tee|marker|brush|alignment|divot/i.test(`${product.title} ${product.productType} ${(product.tags || []).join(' ')}`)
  },
  'golf-gifts-for-husband': {
    slug: 'golf-gifts-for-husband',
    title: 'Golf Gifts for Your Husband — Useful, Not Generic.',
    eyebrow: 'Gift Guide',
    description: 'Golf gifts for a husband who plays regularly — consumables he always needs, upgrades he keeps skipping, and accessories that earn a permanent spot in the bag.',
    metaTitle: 'Golf Gifts for Husband | Practical Golf Gifts | WYX Golf Supply Co.',
    metaDescription: 'Shop golf gifts for husbands at WYX Golf Supply Co. — gloves, ball markers, club care, GPS watches, and bag essentials he will actually use. Free shipping over $50.',
    primaryCta: 'Shop Husband Golf Gifts',
    secondaryCta: 'See Golf Tech',
    secondaryHref: '/golf-tech-gifts',
    proof: ['Consumables he always needs', 'Upgrades he skipped', 'Under $75 most picks', 'WYX10 launch code'],
    faq: [
      ['What are good golf gifts for a husband?', 'Consumables are always safe: a 3-pack of cabretta gloves, a fresh ball marker set, or 50 bamboo tees. For something more substantial, a GPS watch ($149) or groove sharpener + grip kit bundle ($48) are practical upgrades most avid golfers have been putting off.'],
      ['What golf gifts do men actually use?', 'The gifts that stay in the bag: a quality clip-on towel, a milled ball marker, a club brush, and a leather scorecard holder. Things that have a permanent home in the bag last. Novelty items get left behind.'],
      ['How much should I spend on a golf gift for my husband?', 'Everyday occasion: $25–$50. Birthday or anniversary: $50–$100. Special gift: $100–$200 (GPS watch, full grip kit, rangefinder). WYX10 saves 10% on first orders.']
    ],
    match: (product: Product) => under(product, 150) || categoryIn(product, ['Accessories', 'Gloves', 'Golf Tech', 'Club Care'])
  },
  'golf-tournament-prizes': {
    slug: 'golf-tournament-prizes',
    title: 'Golf Tournament Prizes That Players Actually Want.',
    eyebrow: 'Event Gear',
    description: 'Tournament prize ideas for closest-to-the-pin, longest drive, and team prizes — useful accessories under $75 that players take home and keep.',
    metaTitle: 'Golf Tournament Prizes | Event Golf Gifts | WYX Golf Supply Co.',
    metaDescription: 'Shop golf tournament prizes at WYX Golf Supply Co. — towels, ball markers, gloves, hats, and accessories for closest-to-the-pin and team events. Under $60.',
    primaryCta: 'Shop Tournament Prizes',
    secondaryCta: 'See Scramble Ideas',
    secondaryHref: '/scramble-prize-ideas',
    proof: ['Useful across all handicaps', 'Under $60 most picks', 'No sizing guesswork', 'WYX10 launch code'],
    faq: [
      ['What are good golf tournament prize ideas?', 'Stick to universally useful accessories: a quality microfiber towel, a milled ball marker set, a sleeve of premium balls, or a leather bag tag. Avoid novelty items — players will keep something useful and leave something funny behind.'],
      ['How much should tournament prizes cost?', 'Closest-to-the-pin: $25–$40. Longest drive: $30–$50. Team prizes: $20–$35 per person. Overall winner: $50–$100. Budget accordingly so every category gets something worth winning.'],
      ['Can I order golf tournament prizes in bulk?', 'Yes — add multiple quantities to your cart and use WYX10 for 10% off. For larger group orders, email support at WYX for volume pricing.']
    ],
    match: (product: Product) => under(product, 75) || categoryIn(product, ['Accessories', 'Towels', 'Gloves', 'Headwear', 'Golf Balls'])
  },
  'golf-bag-accessories': {
    slug: 'golf-bag-accessories',
    title: 'Golf Bag Accessories — Every Slot in Your Bag, Covered.',
    eyebrow: 'Bag Essentials',
    description: 'The accessories that belong in every golf bag — clip-on towel, club brush, ball markers, divot tool, tees, and a bag organizer for the pockets that always become a mess.',
    metaTitle: 'Golf Bag Accessories | Bag Essentials | WYX Golf Supply Co.',
    metaDescription: 'Shop golf bag accessories at WYX Golf Supply Co. — towels, club brushes, ball markers, divot tools, tees, and organizers. Under $30 most picks.',
    primaryCta: 'Shop Bag Accessories',
    secondaryCta: 'See Bag Upgrades',
    secondaryHref: '/bag-upgrades',
    proof: ['Under $30 most picks', 'Permanent bag additions', 'Works any bag style', 'WYX10 launch code'],
    faq: [
      ['What accessories should every golf bag have?', 'The core five: (1) clip-on towel, (2) club brush, (3) ball markers, (4) divot tool, (5) spare tees. Everything else builds on this foundation. A bag organizer insert adds a sixth layer of organization to the main pocket.'],
      ['What do you keep in golf bag pockets?', 'Main pocket: extra balls, gloves, rain gear. Side pockets: tees, markers, divot tools. Small top pocket: snacks, phone charger, sunscreen. Ball retriever and umbrella in the external sleeves.'],
      ['What is the best golf bag organization system?', 'A 14-way divider bag keeps clubs separated. A bag organizer insert creates compartments in the main pocket. A velcro towel ring keeps the cleaning towel accessible on every shot.']
    ],
    match: (product: Product) => categoryIn(product, ['Accessories', 'Towels', 'Club Care']) || under(product, 40)
  },
  'golf-gifts-for-teenage-golfer': {
    slug: 'golf-gifts-for-teenage-golfer',
    title: 'Golf Gifts for Teen Golfers — Gear That Keeps Up With Their Game.',
    eyebrow: 'Gift Guide',
    description: 'Golf gifts for teenage golfers who are serious about the game — training aids that improve fundamentals, tech that gives a competitive edge, and accessories that hold up to heavy use.',
    metaTitle: 'Golf Gifts for Teenage Golfers | Teen Golf Gear | WYX Golf Supply Co.',
    metaDescription: 'Shop golf gifts for teenage golfers at WYX Golf Supply Co. — alignment sticks, putting mirrors, GPS watches, gloves, and training aids. Under $100.',
    primaryCta: 'Shop Teen Golf Gifts',
    secondaryCta: 'See Training Aids',
    secondaryHref: '/golf-training-aids',
    proof: ['Training aids that build skills', 'GPS watch under $150', 'Universal sizing', 'WYX10 launch code'],
    faq: [
      ['What are good golf gifts for a teenager?', 'Serious teen golfers benefit from training aids: alignment sticks ($24), a putting mirror ($28), or a swing tempo trainer. For tech, a GPS watch ($149) is a high-use gift. For essentials, a cabretta glove 3-pack and bamboo tees always work.'],
      ['What is the best training aid for a junior golfer?', 'Alignment sticks are the most versatile training aid for any golfer. They improve setup, alignment, ball position, and swing path simultaneously and cost under $25.'],
      ['Is a GPS watch a good gift for a teenage golfer?', 'Yes — for a teen who plays competition golf or plays frequently. A dedicated golf GPS watch removes the phone from the round, which improves focus and pace of play. The WYX GPS Watch loads 40,000+ courses and has an 18-hole battery.']
    ],
    match: (product: Product) => categoryIn(product, ['Training Aids', 'Golf Tech', 'Gloves', 'Golf Balls']) || under(product, 50)
  },
  'golf-scorecard-holder': {
    slug: 'golf-scorecard-holder',
    title: 'Golf Scorecard Holder — Leather, Slim, Ships Gift-Ready.',
    eyebrow: 'Bag Accessory',
    description: 'A full-grain leather golf scorecard holder with yardage book pocket, pencil loop, and tee slot — the one bag accessory that makes a round feel intentional.',
    metaTitle: 'Golf Scorecard Holder | Leather Yardage Book Cover | WYX Golf Supply Co.',
    metaDescription: 'Shop leather golf scorecard holders at WYX Golf Supply Co. — full-grain leather, pencil loop, tee slot, ships gift-ready. Under $60. Free shipping over $50.',
    primaryCta: 'Shop Scorecard Holders',
    secondaryCta: 'See All Accessories',
    secondaryHref: '/collections/accessories',
    proof: ['Full-grain leather', 'Pencil loop + tee slot', 'Ships gift-ready', 'WYX10 launch code'],
    faq: [
      ['What is a golf scorecard holder?', 'A golf scorecard holder is a protective cover for your scorecard and yardage book. A good one includes a pencil loop so you are not hunting for a pencil between holes, and a tee slot so your pocket is not full of sharp broken tees.'],
      ['Is a leather scorecard holder a good golf gift?', 'Yes — it is one of the most universally useful golf gifts because it works for any handicap and does not require sizing. A leather scorecard holder is something most golfers would use every round but would not buy for themselves.'],
      ['How does a yardage book holder work?', 'A yardage book holder is a cover sized to hold a standard course yardage book (4" x 3") alongside the scorecard. The WYX version has a full-grain leather flap, pencil loop, snap closure, and a tee slot on the spine.']
    ],
    match: (product: Product) => /scorecard|yardage book|yardage holder/i.test(`${product.title} ${product.productType} ${(product.tags || []).join(' ')}`)
  },
  'golf-summer-gear': {
    slug: 'golf-summer-gear',
    title: 'Golf Summer Gear — Sun, Hydration, and Grip in One Haul.',
    eyebrow: 'Summer Ready',
    description: 'The three summer golf essentials: UPF 50+ arm sleeves for sun coverage, an insulated tumbler that fits the cart cup holder, and a microfiber towel to keep grips dry in the heat.',
    metaTitle: 'Golf Summer Gear | Sun Protection Hydration | WYX Golf Supply Co.',
    metaDescription: 'Shop golf summer gear at WYX — UPF 50+ arm sleeves, insulated 20oz tumbler, and microfiber towels for hot-weather rounds. Under $100 for the complete summer set.',
    primaryCta: 'Shop Summer Gear',
    secondaryCta: 'See Arm Sleeves',
    secondaryHref: '/golf-arm-sleeves',
    proof: ['UPF 50+ sun blocking', 'Ice cold for 18 holes', 'Grip stays dry', 'WYX10 launch code'],
    faq: [
      ['What gear do you need for summer golf?', 'Three essentials: (1) sun protection — UPF 50+ arm sleeves cover more area than sunscreen without reapplication, (2) hydration — an insulated tumbler keeps drinks cold for 18 holes, (3) grip maintenance — a microfiber towel keeps the grip and glove dry in heat.'],
      ['Do golf arm sleeves keep you cool?', 'Yes — UPF 50+ compression fabric blocks solar heat from hitting skin directly, which often makes the arm feel cooler than bare skin in direct sunlight. Moisture-wicking properties pull sweat away to accelerate evaporation cooling.'],
      ['What size water bottle fits in a golf cart?', 'A 20 oz tumbler with a flat base fits every standard cart cup holder. Wide-mouth 32 oz bottles often do not fit. The WYX 20oz Insulated Tumbler is designed specifically for cart holder compatibility.']
    ],
    match: (product: Product) => /arm sleeve|tumbler|towel|sun protection|upf/i.test(`${product.title} ${product.productType} ${(product.tags || []).join(' ')}`) || categoryIn(product, ['Towels', 'Apparel'])
  },
  'golf-ball-retriever': {
    slug: 'golf-ball-retriever',
    title: 'Golf Ball Retriever — 12 Feet, Collapses to Pocket Size.',
    eyebrow: 'Bag Essential',
    description: 'A 12-foot telescoping golf ball retriever that collapses to 18 inches and fits in any bag side pocket. Stop sacrificing a sleeve every time a shot finds the hazard.',
    metaTitle: 'Golf Ball Retriever 12 Ft | Telescoping Pocket Size | WYX Golf Supply Co.',
    metaDescription: 'Shop golf ball retrievers at WYX Golf Supply Co. — 12-foot telescoping, collapses to 18 inches, fits any bag pocket. Under $25. Free shipping over $50.',
    primaryCta: 'Shop Ball Retrievers',
    secondaryCta: 'See All Accessories',
    secondaryHref: '/collections/accessories',
    proof: ['12-foot reach', 'Collapses to 18 inches', 'Fits any bag pocket', 'WYX10 launch code'],
    faq: [
      ['What is the longest telescoping golf ball retriever?', 'Most telescoping ball retrievers extend to 12–15 feet. The WYX Ball Retriever extends to 12 feet — enough to reach most water hazard edges without getting your feet wet — and collapses to 18 inches to fit in any bag side pocket.'],
      ['Do ball retrievers work in water?', 'Yes — a ball retriever is designed specifically for water hazard recovery. The scoop head closes around a submerged ball and holds it through the retrieval motion. The WYX model works in up to 12 feet of depth.'],
      ['Is a ball retriever worth carrying?', 'At $22, a ball retriever pays for itself the first time it saves a sleeve of premium balls from a water hazard. It adds negligible weight to the bag and collapses small enough to fit in a water bottle pocket.']
    ],
    match: (product: Product) => /ball retriever|retriever/i.test(`${product.title} ${product.productType} ${(product.tags || []).join(' ')}`)
  },
  'golf-gifts-for-anniversary': {
    slug: 'golf-gifts-for-anniversary',
    title: 'Golf Anniversary Gifts — For the Golfer Who Is Also Your Partner.',
    eyebrow: 'Gift Guide',
    description: 'Anniversary golf gifts that feel personal and intentional — leather accessories, premium gear bundles, and meaningful upgrades for the golfer who shares your life.',
    metaTitle: 'Golf Anniversary Gifts | Golf Gifts for Partner | WYX Golf Supply Co.',
    metaDescription: 'Shop golf anniversary gifts at WYX Golf Supply Co. — leather scorecard holders, GPS watches, premium bundles, and accessories that feel meaningful. Free shipping over $50.',
    primaryCta: 'Shop Anniversary Gifts',
    secondaryCta: 'See Premium Golf Gifts',
    secondaryHref: '/golf-gifts-under-150',
    proof: ['Leather gifts ship gift-ready', 'GPS watch $149', 'Meaningful, not generic', 'WYX10 launch code'],
    faq: [
      ['What is a good golf anniversary gift?', 'Anniversary gifts for golfers work best when they feel personal and premium. A leather scorecard holder ($54) or leather yardage book holder engraved with initials, a GPS watch ($149), or a full bag upgrade kit all hit the right tone — personal, useful, and beyond what they would buy themselves.'],
      ['What do you get a golfer as a gift from a spouse?', 'The most appreciated golf gifts from a spouse are the ones that show you understood what they needed — a GPS watch if they always struggle with yardage, a new glove 3-pack if they always run out, or a premium tumbler if they mention hydration on the course.'],
      ['Is a GPS watch a romantic anniversary gift?', 'For a golfer, yes — it is a premium, daily-use item that improves every round. The WYX GPS Watch at $149 is a thoughtful high-use gift that shows you paid attention to their game. Pair it with a leather bag tag for the complete package.']
    ],
    match: (product: Product) => under(product, 175) || categoryIn(product, ['Golf Tech', 'Accessories'])
  },
  'golf-rain-gear': {
    slug: 'golf-rain-gear',
    title: 'Golf Rain Gear — Stay Dry, Keep Playing.',
    eyebrow: 'Weather Ready',
    description: 'The three rain-round essentials: a waterproof stretch jacket that moves on the backswing, a rain glove that grips harder wet, and a 62-inch double-canopy umbrella that will not invert.',
    metaTitle: 'Golf Rain Gear | Waterproof Golf Jacket | WYX Golf Supply Co.',
    metaDescription: 'Shop golf rain gear at WYX — waterproof golf jacket, rain gloves, 62-inch umbrella, and microfiber towels for wet rounds. Free shipping over $50.',
    primaryCta: 'Shop Rain Gear',
    secondaryCta: 'See Summer Gear',
    secondaryHref: '/golf-summer-gear',
    proof: ['Taped-seam waterproof jacket', '62-inch wind-vent umbrella', 'Rain gloves grip better wet', 'WYX10 launch code'],
    faq: [
      ['What golf gear do I need for rain?', 'Three items handle most rain rounds: (1) a waterproof jacket with fully taped seams and a stretch panel for swing freedom, (2) a rain glove or pair of rain gloves — they grip harder when wet unlike standard cabretta, (3) a 62-inch double-canopy umbrella that covers you and the bag and will not invert in gusts.'],
      ['Do golf rain gloves actually work?', 'Yes — properly. Rain gloves use a synthetic material that increases grip coefficient when wet, the inverse of how standard cabretta leather behaves. Many players find they hit crisper shots with rain gloves in light rain than they do with dry-condition gloves in humidity.'],
      ['What is the best waterproof golf jacket?', 'Look for fully taped seams (not just critically taped), a stretch panel across the upper back or underarm gusset, and a hem that covers the waistband at full rotation. The WYX Rain Jacket ($88) hits all three — taped seams, stretch back panel, and a cut long enough to stay tucked in your swing.']
    ],
    match: (product: Product) => /rain|waterproof|jacket|umbrella/i.test(`${product.title} ${product.productType} ${(product.tags || []).join(' ')}`) || categoryIn(product, ['Apparel', 'Accessories'])
  },
  'golf-corporate-gifts': {
    slug: 'golf-corporate-gifts',
    title: 'Golf Corporate Gifts — Useful Enough to Earn a Spot in the Bag.',
    eyebrow: 'Gift Guide',
    description: 'Corporate golf gifts that land with clients and colleagues — useful accessories under $100, leather pieces that ship gift-ready, and nothing that looks like a bulk catalog order.',
    metaTitle: 'Golf Corporate Gifts | Golf Gifts for Clients | WYX Golf Supply Co.',
    metaDescription: 'Shop golf corporate gifts at WYX Golf Supply Co. — ball markers, yardage holders, GPS watches, and bag accessories that earn a permanent spot in the bag. Free shipping over $50.',
    primaryCta: 'Shop Corporate Golf Gifts',
    secondaryCta: 'See Premium Picks',
    secondaryHref: '/golf-gifts-under-150',
    proof: ['Ships gift-ready', 'Under $100 most picks', 'No sizing guesswork', 'WYX10 launch code'],
    faq: [
      ['What are good golf gifts for corporate clients?', 'The best corporate golf gifts work across handicaps without requiring sizing: a leather ball marker set ($42), a leather yardage book holder ($54), or a polarized sunglass set ($44). The milled marker set is particularly strong — it is something most golfers want but do not buy for themselves.'],
      ['How much should I spend on a corporate golf gift?', 'Thank-you/appreciation: $25–$50 (ball markers, towel, microfiber set). Client gifts: $50–$100 (yardage holder, sunglasses, rangefinder accessories). High-value client: $100–$200 (GPS watch, full bag care kit). WYX10 saves 10% for first-time orders — useful for group purchases across a client list.'],
      ['Do golf gifts need to be personalized for corporate use?', 'Engraving adds a personal touch but is not required. A high-quality unbranded leather bag tag or ball marker set signals taste without the branding cost. If you want logos, start with the bag tag — it is the most visible real estate without disrupting the gift.']
    ],
    match: (product: Product) => under(product, 150) || categoryIn(product, ['Accessories', 'Golf Tech', 'Towels'])
  },
  'golf-gifts-for-women': {
    slug: 'golf-gifts-for-women',
    title: 'Golf Gifts for Women — Useful Gear, Not Novelty.',
    eyebrow: 'Gift Guide',
    description: 'Golf gifts for women who play seriously — quality gloves, sun protection, bag essentials, and accessories sized and designed for performance, not just appearance.',
    metaTitle: 'Golf Gifts for Women | Women Golfer Accessories | WYX Golf Supply Co.',
    metaDescription: 'Shop golf gifts for women at WYX Golf Supply Co. — UPF arm sleeves, gloves, ball markers, and accessories designed for serious women golfers. Free shipping over $50.',
    primaryCta: 'Shop Women Golf Gifts',
    secondaryCta: 'See Summer Gear',
    secondaryHref: '/golf-summer-gear',
    proof: ['UPF 50+ sun protection', 'AAA cabretta gloves', 'No novelty filler', 'WYX10 launch code'],
    faq: [
      ['What are good golf gifts for women?', 'The gifts women golfers actually use: (1) UPF 50+ arm sleeves ($18) for sun protection without sunscreen reapplication, (2) a quality cabretta glove 3-pack in the right size, (3) a milled ball marker set ($42) — something most golfers want but skip buying. Avoid novelty items with generic golf-themed patterns.'],
      ['What golf accessories do women actually use?', 'The daily-use accessories: a clip-on microfiber towel, a compact ball marker, UV arm sleeves for hot rounds, and polarized sunglasses. A leather yardage book holder is a gift that gets used every round for years. The GPS watch ($149) is the premium daily-use gift for the serious woman golfer.'],
      ['Is a GPS watch a good gift for a woman golfer?', 'Yes — it is one of the highest-utility golf gifts for any golfer who plays frequently. It removes the phone from the round, which improves focus and pace of play. The WYX GPS Watch loads 40,000+ courses, has an 18-hole battery, and fits smaller wrists comfortably.']
    ],
    match: (product: Product) => under(product, 150) || categoryIn(product, ['Accessories', 'Apparel', 'Golf Tech', 'Gloves'])
  },
  'golf-training-aids-for-beginners': {
    slug: 'golf-training-aids-for-beginners',
    title: 'Golf Training Aids for Beginners — 4 That Actually Make a Difference.',
    eyebrow: 'Beginner Golf',
    description: 'The four training aids that improve swing path, putting consistency, setup alignment, and tempo for beginner golfers — no lessons required, results show in one range session.',
    metaTitle: 'Golf Training Aids for Beginners | WYX Golf Supply Co.',
    metaDescription: 'Shop beginner golf training aids at WYX — alignment sticks, putting mirror, tempo trainer, and chipping net. Four aids that work without lessons. Use WYX10 for 10% off.',
    primaryCta: 'Shop Training Aids',
    secondaryCta: 'See Full Golf Gift Guide',
    secondaryHref: '/golf-gifts',
    proof: ['Alignment sticks $24', 'Putting mirror $32', 'Chipping net $44', 'WYX10 saves 10%'],
    faq: [
      ['What are the best training aids for beginner golfers?', 'The four most effective beginner golf training aids: (1) alignment sticks ($24) — fix path, stance, and ball position; (2) a putting mirror ($32) — fix eye position and face angle at setup; (3) a chipping net ($44) — build short game at home; (4) a tempo trainer ($28) — fix the most common beginner swing flaw (too fast). All four can be used without a lesson.'],
      ['Do golf training aids really work?', 'Yes, when they target the correct problem. Alignment sticks work because they give immediate visual feedback on path and stance — two of the top three beginner swing errors. A putting mirror works because it fixes eye position, which controls whether the putter face is square at setup. Both work in one session. Swing trainers that fix sequence and tempo also show results quickly for golfers who swing over the top.'],
      ['What is the best beginner golf gift under $30?', 'Alignment sticks ($24) are the best beginner golf gift under $30. Two fiberglass sticks placed on the ground before each range session fix 3-4 of the most common beginner errors simultaneously: open stance, ball position too far forward, alignment left or right of target, and over-the-top swing path. Most PGA Tour players use them at every practice session — the same tool works for beginners.']
    ],
    match: (product: Product) => categoryIn(product, ['Training Aids']) || /alignment|putting|chipping|tempo|training/i.test(`${product.title} ${product.productType} ${(product.tags || []).join(' ')}`)
  },
  'golf-club-care-kit': {
    slug: 'golf-club-care-kit',
    title: 'Golf Club Care Kit — Clean Grooves, Fresh Grips, Sharp Wedges.',
    eyebrow: 'Club Care',
    description: 'The three-part club care routine: clean grooves before every round, regrip every season, and sharpen wedge grooves when spin starts dropping. Everything needed ships under $100.',
    metaTitle: 'Golf Club Care Kit | Clean Grooves Regrip | WYX Golf Supply Co.',
    metaDescription: 'Shop golf club care at WYX Golf Supply Co. — groove sharpener, grip solvent kit, club brushes, and iron polish. Under $100 for a complete season care kit.',
    primaryCta: 'Shop Club Care',
    secondaryCta: 'See All Accessories',
    secondaryHref: '/collections/accessories',
    proof: ['Groove sharpener $22', 'Grip solvent kit $26', 'Club brush combo', 'WYX10 launch code'],
    faq: [
      ['How do I clean golf club grooves?', 'Use a stiff-bristle club brush with warm soapy water after every round. For packed dirt, a groove pick (or the pick end of a dual-sided brush) clears compacted debris. Clean grooves spin the ball consistently — packed grooves do not. A 2-minute clean after each round takes 45 seconds per club.'],
      ['How do I know if I need to regrip my clubs?', 'The tests: (1) does the grip feel smooth or shiny rather than tacky? (2) are you gripping tighter in pressure situations to avoid slipping? (3) did you play more than 40 rounds this season? Any single yes is a regrip indicator. Worn grips are the cheapest swing problem to fix.'],
      ['How does a groove sharpener work?', 'A groove sharpener is a hardened-steel pick that re-cuts the flat face of each groove to restore its sharp edge. Wedge grooves dull after 40-50 rounds of hitting real grass and real sand — a dull groove loses 20-30% of spin generation. The WYX Groove Sharpener restores factory-spec grooves in 3 minutes per wedge.']
    ],
    match: (product: Product) => categoryIn(product, ['Club Care', 'Accessories']) || /groove|grip|brush|cleaner|polish/i.test(`${product.title} ${product.productType} ${(product.tags || []).join(' ')}`)
  },
  'golf-gifts-for-men': {
    slug: 'golf-gifts-for-men',
    title: 'Golf Gifts for Men',
    eyebrow: 'The Short List',
    description: "Golf gifts for men that actually get used — gloves, towels, alignment sticks, ball markers, and tech picks in every price range. No sizing guesswork, no novelty gear.",
    metaTitle: 'Golf Gifts for Men — Practical Picks Every Golfer Uses | WYX Golf Supply Co.',
    metaDescription: "The best golf gifts for men: cabretta gloves, clip-on towels, milled ball markers, GPS watches. Practical gifts in every price range. WYX10 for 10% off.",
    primaryCta: 'Shop Golf Gifts for Men',
    secondaryCta: "See Father's Day Picks",
    secondaryHref: '/fathers-day-golf-gifts',
    proof: ['Under $25 picks', 'Under $60 picks', 'Under $150 picks', 'WYX10 launch code'],
    faq: [
      ["What are the best golf gifts for men under $50?", "Best golf gifts for men under $50: cabretta glove 3-pack ($32 — used every round), clip-on microfiber towel ($18), alignment sticks ($24), milled ball marker set ($28), dual-sided club brush ($16). Use WYX10 for 10% off at WYX Golf Supply Co."],
      ["What do you get a man who has everything golf related?", "For a golfer who has everything: a GPS watch ($149) for yardage on every course, a full regrip kit ($48) to refresh a full bag, a leather scorecard holder ($38), or a milled ball marker set ($28) — the one accessory golfers want but never buy for themselves."],
      ["What golf gifts work for any skill level?", "Skill-agnostic golf gifts: a glove 3-pack (all golfers use gloves), a quality clip-on towel (used every round regardless of skill), a ball marker set (used on every green), and alignment sticks (tour pros and beginners both use them). Avoid swing aids that require a specific skill level."]
    ],
    match: (product: Product) => categoryIn(product, ['Accessories', 'Gloves', 'Towels', 'Training Aids', 'Golf Tech', 'Golf Balls', 'Club Care']) || /glove|towel|marker|alignment|gps|brush|grip/i.test(`${product.title} ${(product.tags || []).join(' ')}`)
  },
  'golf-accessories-every-golfer-needs': {
    slug: 'golf-accessories-every-golfer-needs',
    title: 'Golf Accessories Every Golfer Needs',
    eyebrow: 'The Essentials',
    description: "The short list of golf accessories that every golfer actually reaches for — not the optional stuff, the non-negotiables. Build the bag right from the start.",
    metaTitle: 'Golf Accessories Every Golfer Needs | Essential Golf Bag Setup | WYX Golf Supply Co.',
    metaDescription: "The golf accessories every golfer needs: gloves, towel, ball marker, club brush, tees, and a bag tag. The essentials in one place. WYX10 for 10% off.",
    primaryCta: 'Shop Essential Accessories',
    secondaryCta: 'See Bag Upgrades',
    secondaryHref: '/bag-upgrades',
    proof: ['Curated essentials list', 'Under $90 for full setup', 'No novelty gear', 'WYX10 launch code'],
    faq: [
      ["What golf accessories does every golfer need?", "Every golfer needs: (1) a golf glove — used every round for grip and feel, (2) a clip-on towel — cleans club faces and grips between holes, (3) a ball marker — used on every green, (4) a club brush — keeps grooves performing, (5) tees — always running out. These five items are the core bag setup. Add alignment sticks for range sessions."],
      ["What golf accessories make a good gift?", "The best golf gift accessories: a cabretta glove 3-pack ($32), a microfiber clip-on towel ($18), a milled ball marker set ($28), and a dual-sided club brush ($16). These four items together = a complete bag essentials gift set under $100 before WYX10."],
      ["What golf accessories fit in a golf bag?", "Every golf bag has side pockets for accessories. Essential fits: tees in the front zipper pocket, gloves in the apparel pocket, towel on the D-ring (clip-on), ball marker in the ball pocket, club brush on the bag ring. A scorecard holder goes in the front panel pocket. An alignment stick tube goes beside the clubs."]
    ],
    match: (product: Product) => categoryIn(product, ['Accessories', 'Gloves', 'Towels', 'Club Care']) || /glove|towel|marker|brush|tee|alignment/i.test(`${product.title} ${(product.tags || []).join(' ')}`)
  },
  'golf-gifts-for-boyfriend': {
    slug: 'golf-gifts-for-boyfriend',
    title: 'Golf Gifts for Your Boyfriend',
    eyebrow: 'Gift Guide',
    description: 'Golf gifts for a boyfriend that actually make it into the bag — practical accessories, training tools, and bag upgrades in every price range. No sizing guesswork.',
    metaTitle: 'Golf Gifts for Boyfriend — Practical Picks He Will Actually Use | WYX Golf Supply Co.',
    metaDescription: 'The best golf gifts for your boyfriend: cabretta gloves, clip-on towels, GPS watches, milled ball markers. Practical picks in every price range. WYX10 for 10% off.',
    primaryCta: 'Shop Golf Gifts for Him',
    secondaryCta: 'See All Golf Gifts',
    secondaryHref: '/golf-gifts',
    proof: ['Under $30 picks', 'Under $60 picks', 'Premium picks', 'WYX10 launch code'],
    faq: [
      ['What are good golf gifts for a boyfriend?', 'The best golf gifts for a boyfriend: cabretta glove 3-pack ($32 — used every round), a milled ball marker set ($28 — the gift golfers want but never buy themselves), alignment sticks ($24 — what tour pros warm up with), or a GPS watch ($149 — the premium gift that changes every round). All are size-free, no guesswork.'],
      ['What golf gifts work if I don't know much about golf?', "The safe picks for any golfer: a glove 3-pack (all golfers use gloves, and they always need more), a quality clip-on towel (used every round), and a ball marker set (required on every green). These three items total under $80 before WYX10 and are used every single round — they can't miss."],
      ['What is a unique golf gift for a boyfriend?', 'For a unique golf gift: a milled ball marker set (not the $8 plastic version — a proper precision-milled set in a gift box), a leather scorecard holder (an accessory most golfers think about but never buy), or a GPS watch (yardage on 40,000+ courses from the wrist). These are the picks he wants but skips buying for himself.']
    ],
    match: (product: Product) => categoryIn(product, ['Accessories', 'Gloves', 'Towels', 'Golf Tech', 'Training Aids', 'Golf Balls']) || /glove|towel|marker|gps|alignment|brush/i.test(`${product.title} ${(product.tags || []).join(' ')}`)
  },
  'golf-gifts-for-girlfriend': {
    slug: 'golf-gifts-for-girlfriend',
    title: 'Golf Gifts for Your Girlfriend',
    eyebrow: 'Gift Guide',
    description: "Golf gifts for a girlfriend who golfs — practical accessories, training tools, and bag upgrades that earn a permanent spot in the bag. No sizing guesswork, no novelty gear.",
    metaTitle: 'Golf Gifts for Girlfriend — Practical Picks She Will Actually Use | WYX Golf Supply Co.',
    metaDescription: 'The best golf gifts for your girlfriend: cabretta gloves, clip-on towels, milled ball markers, GPS watches. Practical picks in every price range. WYX10 for 10% off.',
    primaryCta: 'Shop Golf Gifts for Her',
    secondaryCta: 'See Golf Gifts for Women',
    secondaryHref: '/golf-gifts-for-women',
    proof: ['Under $30 picks', 'Under $60 picks', 'Premium picks', 'WYX10 launch code'],
    faq: [
      ['What are the best golf gifts for a girlfriend?', 'The best golf gifts for a girlfriend who golfs: a cabretta glove 3-pack ($32 — used every round), a milled ball marker set ($28), a microfiber clip-on towel ($18), or a GPS watch ($149). These are size-free, practical, and used every round — unlike apparel gifts that require knowing her style and size.'],
      ['What golf accessories do female golfers use?', 'Female golfers use the same accessories as male golfers: golf gloves (cabretta leather for feel and grip), a clip-on towel (used between every iron shot), a ball marker (used on every green), alignment sticks (training aid for range sessions), and a club brush (clean grooves for consistent spin). All of these are skill-agnostic and size-free.'],
      ['What is a thoughtful golf gift for a girlfriend?', 'The most thoughtful golf gifts: a milled ball marker set (something she wants but would never buy herself), a leather scorecard holder (an accessory most golfers think about but skip), or a 3-pack of cabretta gloves (consumable she will always need and use within 2 rounds). These signal you paid attention to what she actually plays with.']
    ],
    match: (product: Product) => categoryIn(product, ['Accessories', 'Gloves', 'Towels', 'Golf Tech', 'Training Aids', 'Golf Balls']) || /glove|towel|marker|gps|alignment|brush/i.test(`${product.title} ${(product.tags || []).join(' ')}`)
  },
  'golf-gifts-for-wife': {
    slug: 'golf-gifts-for-wife',
    title: 'Golf Gifts for Your Wife',
    eyebrow: 'Gift Guide',
    description: "Golf gifts for a wife who plays golf — practical accessories and bag upgrades that earn a permanent spot in the bag. The picks she actually wants, not the ones that look nice in a box.",
    metaTitle: 'Golf Gifts for Wife — Practical Picks She Will Use Every Round | WYX Golf Supply Co.',
    metaDescription: "Golf gifts for your wife who golfs: gloves, towels, ball markers, GPS watches. The practical picks she'll use every round. WYX10 for 10% off at WYX Golf Supply Co.",
    primaryCta: 'Shop Golf Gifts for Her',
    secondaryCta: "See Father's Day Picks",
    secondaryHref: '/fathers-day-golf-gifts',
    proof: ['Anniversary gifts', 'Birthday gifts', 'Holiday picks', 'WYX10 launch code'],
    faq: [
      ["What are good golf gifts for a wife who golfs?", "The best golf gifts for a wife who golfs: a cabretta glove 3-pack ($32 — always needed, used within 2 rounds), a milled ball marker set ($28 — the golf gift she wants but would never buy for herself), a clip-on microfiber towel ($18 — used every round), or a GPS watch ($149 — the premium gift that changes every round). All size-free."],
      ["What golf anniversary gifts work for a golfer?", "Golf anniversary gift ideas: a leather scorecard holder ($38 — an elegant practical gift), a milled ball marker gift box set ($28 — something she treasures), a GPS watch ($149 — the gift that comes up in conversation for years), or a premium cabretta glove 3-pack ($32 — high-quality, always useful). These are the picks that get used, not displayed."],
      ["What do you buy a woman who loves golf?", "For a woman who loves golf: skip the apparel (too many sizing variables) and go for accessories. The self-buy paradox applies equally: a milled ball marker set, a leather scorecard holder, a GPS watch, and fresh cabretta gloves are all things she wants and skips buying for herself. These are the gifts that land."]
    ],
    match: (product: Product) => categoryIn(product, ['Accessories', 'Gloves', 'Towels', 'Golf Tech', 'Training Aids', 'Golf Balls']) || /glove|towel|marker|gps|alignment|brush|scorecard/i.test(`${product.title} ${(product.tags || []).join(' ')}`)
  }
};
