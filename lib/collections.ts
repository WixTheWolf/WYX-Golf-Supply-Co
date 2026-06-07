import { categoryFor } from '@/lib/catalog';
import { isImpulseProduct } from '@/lib/feed';
import type { Product } from '@/types/shopify';

export type LandingCollection = {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  seoTitle: string;
  metaDescription: string;
  match: (product: Product) => boolean;
  bullets: string[];
};

const text = (product: Product) => [product.title, product.description, product.vendor, product.productType, ...(product.tags || [])].filter(Boolean).join(' ').toLowerCase();

export const landingCollections: LandingCollection[] = [
  {
    slug: 'golf-gifts',
    title: 'Golf Gifts That Actually Get Used',
    eyebrow: 'Giftable Golf Gear',
    description: 'Small, useful golf gifts for players who always need one more marker, grip, glove, or bag upgrade.',
    seoTitle: 'Golf Gifts Under $60',
    metaDescription: 'Shop useful golf gifts under $60 from WYX Golf Supply Co., including ball markers, grips, gloves, golf balls, and bag accessories.',
    match: (product) => isImpulseProduct(product),
    bullets: ['Easy gift price points', 'Useful on the course', 'Launch discount applies at checkout']
  },
  {
    slug: 'golf-accessories',
    title: 'Golf Accessories For A Better Bag',
    eyebrow: 'Bag Essentials',
    description: 'Ball markers, caddies, utility pieces, and small upgrades selected to make every round feel more organized.',
    seoTitle: 'Golf Accessories',
    metaDescription: 'Shop golf accessories from WYX Golf Supply Co., including ball markers, bag caddies, grips, and practical course essentials.',
    match: (product) => categoryFor(product) === 'Accessories',
    bullets: ['Ball markers and bag tools', 'Ready for everyday rounds', 'Built for better bag habits']
  },
  {
    slug: 'golf-grips',
    title: 'Golf Grips And Tape For The Range Reset',
    eyebrow: 'Grip Refresh',
    description: 'Grip tape and grip upgrades for players who want a fast equipment refresh without replacing the whole bag.',
    seoTitle: 'Golf Grips & Grip Tape',
    metaDescription: 'Shop golf grips and grip tape from WYX Golf Supply Co. for fast bag refreshes and better range sessions.',
    match: (product) => categoryFor(product) === 'Grips' || text(product).includes('grip'),
    bullets: ['Fast equipment refresh', 'Great add-on purchase', 'Pairs with balls and markers']
  },
  {
    slug: 'golf-club-care',
    title: 'Golf Club Care Essentials',
    eyebrow: 'Clean Contact',
    description: 'Brushes, groove tools, towels, and simple reset gear for players who want cleaner contact from the range to the back nine.',
    seoTitle: 'Golf Club Care Essentials',
    metaDescription: 'Shop golf club care essentials from WYX Golf Supply Co., including brush cleaners, groove tools, towels, and bag-ready maintenance gear.',
    match: (product) => ['Club Care', 'Towels'].includes(categoryFor(product)) || text(product).includes('club care') || text(product).includes('groove'),
    bullets: ['Better pre-shot routine', 'Strong low-ticket add-ons', 'Useful for every skill level']
  },
  {
    slug: 'golf-training-aids',
    title: 'Golf Training Aids For Better Practice',
    eyebrow: 'Practice Better',
    description: 'Compact training aids and scoring tools for golfers who want more useful practice without rebuilding the whole bag.',
    seoTitle: 'Golf Training Aids',
    metaDescription: 'Shop compact golf training aids from WYX Golf Supply Co., including putting mirrors and practice-ready golf accessories.',
    match: (product) => categoryFor(product) === 'Training Aids' || text(product).includes('training aid') || text(product).includes('putting mirror'),
    bullets: ['Practice-focused products', 'Compact bag-friendly picks', 'Built for scoring improvement']
  },
  {
    slug: 'golf-bag-essentials',
    title: 'Golf Bag Essentials',
    eyebrow: 'Build The Bag',
    description: 'The small pieces that keep a bag ready: golf balls, grips, markers, gloves, and course accessories.',
    seoTitle: 'Golf Bag Essentials',
    metaDescription: 'Shop golf bag essentials from WYX Golf Supply Co., including golf balls, gloves, grips, markers, and accessories.',
    match: (product) => ['Golf Balls', 'Gloves', 'Grips', 'Accessories'].includes(categoryFor(product)),
    bullets: ['Core round essentials', 'Useful add-ons', 'Easy first cart']
  }
];

export function getLandingCollection(slug: string) {
  return landingCollections.find((collection) => collection.slug === slug) || null;
}
