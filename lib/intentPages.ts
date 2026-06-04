import { categoryFor } from '@/lib/catalog';
import { bagUpgradeProducts, tripProducts } from '@/lib/merchandisingFilters';
import { isPremiumGolfBag } from '@/lib/productQuality';
import type { Product } from '@/types/shopify';

export type IntentPageConfig = {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  primaryCta: string;
  secondaryCta: string;
  secondaryHref: string;
  proof: string[];
  faq: Array<[string, string]>;
  match: (product: Product) => boolean;
};

const haystack = (product: Product) => [product.title, product.description, product.vendor, product.productType, ...(product.tags || [])]
  .filter(Boolean)
  .join(' ')
  .toLowerCase();

const under = (product: Product, amount: number) => Number(product.priceRange.minVariantPrice.amount) <= amount;
const categoryIn = (product: Product, categories: string[]) => categories.includes(categoryFor(product));
const has = (product: Product, pattern: RegExp) => pattern.test(haystack(product));

export const intentPages: Record<string, IntentPageConfig> = {
  'golf-gifts': {
    slug: 'golf-gifts',
    title: 'Golf Gifts That Actually Get Used.',
    eyebrow: 'Gift-Ready Picks',
    description: 'Useful towels, markers, grips, gloves, balls, and bag accessories for golfers who already have enough polos.',
    metaTitle: 'Golf Gifts That Actually Get Used',
    metaDescription: 'Shop useful golf gifts from WYX Golf Supply Co., including towels, ball markers, gloves, grips, golf balls, and bag accessories.',
    primaryCta: 'Shop Golf Gifts',
    secondaryCta: 'Under $60 Picks',
    secondaryHref: '/golf-gifts-under-60',
    proof: ['Gift-ready picks', 'Useful bag upgrades', 'Launch code WYX10', 'Easy checkout'],
    faq: [
      ['What makes a good golf gift?', 'Choose something useful, easy to size, and simple to put in the bag: towels, markers, balls, gloves, grips, and small accessories.'],
      ['Is WYX good for last-minute gifts?', 'Yes. Start with under-$60 products and checkout will show available delivery timing before payment.'],
      ['Can I use the launch discount?', 'Use WYX10 at checkout for 10% off eligible products during the launch window.']
    ],
    match: (product) => under(product, 75) || categoryIn(product, ['Accessories', 'Towels', 'Gloves', 'Grips', 'Golf Balls'])
  },
  'golf-gifts-for-dad': {
    slug: 'golf-gifts-for-dad',
    title: "Golf Gifts For Dad That Aren't Another Mug.",
    eyebrow: 'Golf Dad Approved',
    description: "Useful towels, markers, gloves, balls, and bag upgrades he'll actually bring to the course.",
    metaTitle: 'Golf Gifts For Dad',
    metaDescription: 'Shop golf gifts for Dad from WYX Golf Supply Co., including useful towels, ball markers, gloves, golf balls, grips, and bag essentials.',
    primaryCta: 'Shop Dad Gifts',
    secondaryCta: 'Father\'s Day Picks',
    secondaryHref: '/fathers-day-golf-gifts',
    proof: ['Golf dad approved', 'Useful for real rounds', 'Easy gift bundles', 'WYX10 launch offer'],
    faq: [
      ['What should I buy a golf dad?', 'Start with products he will use every round: towels, balls, gloves, ball markers, grips, and bag organizers.'],
      ['Are these novelty gifts?', 'No. WYX prioritizes practical gear golfers can bring to the course.'],
      ['What if I am not sure what he needs?', 'Choose an easy bag accessory or build a small kit. Useful beats complicated.']
    ],
    match: (product) => !isPremiumGolfBag(product) && (under(product, 75) || has(product, /dad|father|towel|marker|glove|grip|ball|headcover|caddie/))
  },
  'bag-essentials': {
    slug: 'bag-essentials',
    title: 'Small Bag Upgrades. Better Rounds.',
    eyebrow: 'Better Bag Builds',
    description: 'Simple golf accessories that make the bag cleaner, easier, and more ready for the next round.',
    metaTitle: 'Golf Bag Essentials',
    metaDescription: 'Shop golf bag essentials from WYX Golf Supply Co., including golf balls, gloves, towels, ball markers, grips, caddies, and accessories.',
    primaryCta: 'Shop Bag Upgrades',
    secondaryCta: 'Shop Accessories',
    secondaryHref: '/best-golf-accessories',
    proof: ['Weekend golfer approved', 'Useful add-ons', 'Under-$75 golf picks', 'Built for real rounds'],
    faq: [
      ['What belongs in every golf bag?', 'A clean towel, fresh glove, balls, markers, tees or tools, and a few small pieces that make the round easier.'],
      ['Why start with essentials?', 'They are easier to buy, easier to gift, and more likely to be used immediately than complex equipment.'],
      ['Can I add multiple essentials at once?', 'Use the WYX kits on the homepage to add a ready-made bundle to your bag.']
    ],
    match: (product) => categoryIn(product, ['Golf Balls', 'Gloves', 'Grips', 'Towels', 'Accessories', 'Club Care']) && !isPremiumGolfBag(product)
  },
  'bag-upgrades': {
    slug: 'bag-upgrades',
    title: 'Small Bag Upgrades. Better Rounds.',
    eyebrow: 'Bag Upgrades',
    description: 'Simple golf accessories that make the bag cleaner, easier, and more ready for the next round.',
    metaTitle: 'Small Golf Bag Upgrades',
    metaDescription: 'Shop small golf bag upgrades from WYX Golf Supply Co., including towels, ball markers, caddies, golf balls, gloves, grips, and accessories.',
    primaryCta: 'Shop Bag Upgrades',
    secondaryCta: 'Gifts Under $60',
    secondaryHref: '/golf-gifts-under-60',
    proof: ['Small useful gear', 'Weekend-player ready', 'No club fitting required', 'WYX10 launch code'],
    faq: [
      ['What counts as a bag upgrade?', 'Anything that makes the bag cleaner, more organized, or easier to use: towels, markers, caddies, gloves, balls, and simple accessories.'],
      ['Are these beginner friendly?', 'Yes. These are low-friction products for weekend players, golf dads, league golfers, and gift shoppers.'],
      ['Do premium golf bags show here?', 'No. Premium bags live on their own page so this page stays focused on small upgrades.']
    ],
    match: (product) => bagUpgradeProducts([product], 1).length > 0
  },
  'scramble-prizes': {
    slug: 'scramble-prizes',
    title: 'Scramble Prizes People Actually Want.',
    eyebrow: 'Prize Table Gear',
    description: 'Tournament gifts, prize-table gear, and small golf accessories that beat another sleeve of random balls.',
    metaTitle: 'Golf Scramble Prizes',
    metaDescription: 'Shop scramble prizes, tournament gifts, and useful golf prize-table gear from WYX Golf Co.',
    primaryCta: 'Shop Prize Packs',
    secondaryCta: 'Bachelor Party Gifts',
    secondaryHref: '/bachelor-party-golf-gifts',
    proof: ['Prize-table ready', 'Under-$60 picks', 'Group golf friendly', 'Useful after the round'],
    faq: [
      ['What makes a good scramble prize?', 'Pick something small, useful, and easy for any golfer to take home: markers, towels, balls, caddies, and compact accessories.'],
      ['Can I buy for a whole group?', 'Yes. Start with lower-priced markers, towels, and golf balls, then mix in a few better bag upgrades.'],
      ['Do you do custom packs?', 'Not yet. Custom and personalized packs are on the sourcing list.']
    ],
    match: (product) => !isPremiumGolfBag(product) && (under(product, 60) || has(product, /marker|towel|ball|glove|caddie|prize|scramble/))
  },
  'weekend-golfer': {
    slug: 'weekend-golfer',
    title: 'Weekend Golfer Gear That Earns A Spot',
    eyebrow: 'Saturday Morning Ready',
    description: 'For the player who wants a cleaner bag, better range sessions, and fewer tiny annoyances during the round.',
    metaTitle: 'Weekend Golfer Essentials',
    metaDescription: 'Shop weekend golfer essentials from WYX Golf Supply Co., including golf towels, gloves, balls, grips, accessories, and compact practice gear.',
    primaryCta: 'Shop Weekend Picks',
    secondaryCta: 'Build A Kit',
    secondaryHref: '/#kits',
    proof: ['Range-ready gear', 'Real-round utility', 'Simple checkout', 'Launch discount'],
    faq: [
      ['What is the best first WYX product?', 'A towel, glove, ball marker, grip, or ball restock is the easiest first cart.'],
      ['Are these products for beginners?', 'Yes. They are useful for casual players, weekend regulars, and golfers who just want a better organized bag.'],
      ['Do you carry premium upgrades too?', 'Yes, premium golf bags are available, but the best first cart usually starts with useful smaller gear.']
    ],
    match: (product) => under(product, 90) || categoryIn(product, ['Training Aids', 'Club Care', 'Towels', 'Accessories'])
  },
  'bachelor-party-golf-gifts': {
    slug: 'bachelor-party-golf-gifts',
    title: "Bachelor Party Golf Gifts That Won't Get Left In The Airbnb.",
    eyebrow: 'Group Golf Gifts',
    description: 'Small, useful, funny golf gear for tournament weekends, group trips, and first-tee chaos.',
    metaTitle: 'Bachelor Party Golf Gifts',
    metaDescription: 'Shop bachelor party golf gifts, scramble prizes, and useful group golf accessories from WYX Golf Supply Co.',
    primaryCta: 'Shop Group Gifts',
    secondaryCta: 'Golf Gifts',
    secondaryHref: '/golf-gifts',
    proof: ['Group gift friendly', 'Easy prize table picks', 'Small useful gear', 'WYX10 saves 10%'],
    faq: [
      ['What works for a golf bachelor party?', 'Ball markers, towels, balls, gloves, caddies, headcovers, and small accessories are easy to buy for groups.'],
      ['Can I build a prize table?', 'Yes. Start with several under-$60 items and mix practical pieces with one premium upgrade.'],
      ['Are custom items available?', 'Only when the product listing offers personalization. Review options before purchase.']
    ],
    match: (product) => !isPremiumGolfBag(product) && (under(product, 75) || has(product, /marker|towel|balls|headcover|tee|divot|caddie/))
  },
  'golf-trip-gear': {
    slug: 'golf-trip-gear',
    title: 'Golf Trip Gear For The Guys Who Almost Remembered Everything.',
    eyebrow: 'Golf Trip Gear',
    description: 'Towels, markers, balls, pouches, and small bag upgrades for bachelor parties, scramble weekends, and golf trips where the first tee is already chaos.',
    metaTitle: 'Golf Trip Gear',
    metaDescription: 'Shop golf trip gear from WYX Golf Supply Co., including towels, ball markers, golf balls, caddies, and bag upgrades for group golf weekends.',
    primaryCta: 'Shop Trip Gear',
    secondaryCta: 'Bachelor Party Gifts',
    secondaryHref: '/bachelor-party-golf-gifts',
    proof: ['Bachelor trip ready', 'Scramble weekend picks', 'Small packable gear', 'WYX10 launch code'],
    faq: [
      ['What should I pack for a golf trip?', 'Start with a towel, ball marker, golf balls, glove or caddie, and a small pouch once The Roo is sourced.'],
      ['Can I buy for a group?', 'Yes. Markers, towels, balls, and small accessories are easy group buys and prize-table picks.'],
      ['Is The Roo available?', 'Not yet. The Roo valuables pouch is waitlist-only until sourcing is confirmed.']
    ],
    match: (product) => tripProducts([product], 1).length > 0
  },
  'clean-contact-kit': {
    slug: 'clean-contact-kit',
    title: 'Clean Contact Kit',
    eyebrow: 'Club Care Essentials',
    description: 'Towels, brushes, groove tools, and bag reset picks for golfers who want cleaner clubs and more predictable contact.',
    metaTitle: 'Clean Contact Golf Kit',
    metaDescription: 'Shop club-care essentials and clean-contact golf gear from WYX Golf Supply Co., including towels, brush cleaners, groove tools, and bag accessories.',
    primaryCta: 'Shop Clean Contact',
    secondaryCta: 'Bag Essentials',
    secondaryHref: '/bag-essentials',
    proof: ['Cleaner grooves', 'Better range routine', 'Simple bag reset', 'Useful for every skill level'],
    faq: [
      ['Why does clean contact matter?', 'Clean grooves and a dry face help the club do its job, especially on wedges and approach shots.'],
      ['What should be in a clean-contact kit?', 'A towel, brush or groove tool, and a few simple pieces that keep the bag organized.'],
      ['Is this a good gift?', 'Yes. Club-care gear is useful, easy to buy, and a good fit for almost any golfer.']
    ],
    match: (product) => !isPremiumGolfBag(product) && (categoryIn(product, ['Club Care', 'Towels']) || has(product, /clean|brush|groove|towel|care|contact/))
  }
};
