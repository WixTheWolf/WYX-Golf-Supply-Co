import { categoryFor } from '@/lib/catalog';
import type { Product } from '@/types/shopify';
import type { IntentPageConfig } from './intentPages';

const under = (product: Product, amount: number) => Number(product.priceRange.minVariantPrice.amount) <= amount;
const categoryIn = (product: Product, categories: string[]) => categories.includes(categoryFor(product));

export const extraIntentPages: Record<string, IntentPageConfig> = {
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
  }
};
