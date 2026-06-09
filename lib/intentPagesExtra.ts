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
  }
};
