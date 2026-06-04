import { categoryFor } from '@/lib/catalog';
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
    title: 'Golf Gifts That Actually Get Used',
    eyebrow: 'Gift-Ready Picks',
    description: 'Useful bag upgrades for golf dads, league partners, range regulars, and last-minute gift shoppers. No clutter, just gear golfers can put to work.',
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
    title: 'Golf Gifts For Dad That Will Make The Bag',
    eyebrow: 'Golf Dad Approved',
    description: 'Practical gifts for dads who play early, practice after work, and always have one more round on the calendar.',
    metaTitle: 'Golf Gifts For Dad',
    metaDescription: 'Shop golf gifts for Dad from WYX Golf Supply Co., including useful towels, ball markers, gloves, golf balls, grips, and bag essentials.',
    primaryCta: 'Shop Dad Gifts',
    secondaryCta: 'Father\'s Day Picks',
    secondaryHref: '/fathers-day-golf-gifts',
    proof: ['Golf dad approved', 'Useful for real rounds', 'Easy gift bundles', 'WYX10 launch offer'],
    faq: [
      ['What should I buy a golf dad?', 'Start with products he will use every round: towels, balls, gloves, ball markers, grips, and bag organizers.'],
      ['Are these novelty gifts?', 'No. WYX prioritizes practical gear with real product images and active checkout availability.'],
      ['What if I am not sure what he needs?', 'Choose a low-friction accessory or build a small kit. Useful beats complicated.']
    ],
    match: (product) => under(product, 100) || has(product, /dad|father|towel|marker|glove|grip|ball|headcover|bag/)
  },
  'bag-essentials': {
    slug: 'bag-essentials',
    title: 'Golf Bag Essentials For Weekend Players',
    eyebrow: 'Better Bag Builds',
    description: 'The small things that keep a round moving: balls, gloves, towels, markers, grips, caddies, and clean-contact tools.',
    metaTitle: 'Golf Bag Essentials',
    metaDescription: 'Shop golf bag essentials from WYX Golf Supply Co., including golf balls, gloves, towels, ball markers, grips, caddies, and accessories.',
    primaryCta: 'Build The Bag',
    secondaryCta: 'Shop Accessories',
    secondaryHref: '/best-golf-accessories',
    proof: ['Weekend golfer approved', 'Useful add-ons', 'Under-$75 cart builders', 'Built for real rounds'],
    faq: [
      ['What belongs in every golf bag?', 'A clean towel, fresh glove, balls, markers, tees or tools, and a few small pieces that make the round easier.'],
      ['Why start with essentials?', 'They are easier to buy, easier to gift, and more likely to be used immediately than complex equipment.'],
      ['Can I add multiple essentials at once?', 'Use the WYX kits on the homepage to add a ready-made bundle to your bag.']
    ],
    match: (product) => categoryIn(product, ['Golf Balls', 'Gloves', 'Grips', 'Towels', 'Accessories', 'Club Care']) && !isPremiumGolfBag(product)
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
    title: 'Bachelor Party Golf Gifts And Cart Prizes',
    eyebrow: 'Group Golf Gifts',
    description: 'Easy cart prizes, tee-gift add-ons, and useful golf accessories for bachelor trips, scramble teams, and weekend groups.',
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
    match: (product) => under(product, 75) || has(product, /marker|towel|flask|cooler|balls|headcover|tee|divot|caddie/)
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
      ['Is this a good gift?', 'Yes. Club-care gear is low-friction, useful, and easy to buy for almost any golfer.']
    ],
    match: (product) => categoryIn(product, ['Club Care', 'Towels']) || has(product, /clean|brush|groove|towel|care|contact/)
  }
};
