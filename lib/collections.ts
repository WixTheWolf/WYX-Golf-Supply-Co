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
    metaDescription: 'Shop golf accessories from WYX Golf Supply Co., including ball markers, bag caddies, grips, and supplier-backed course essentials.',
    match: (product) => categoryFor(product) === 'Accessories',
    bullets: ['Ball markers and bag tools', 'Live supplier availability', 'Curated for everyday rounds']
  },
  {
    slug: 'golf-grips',
    title: 'Golf Grips And Tape For The Range Reset',
    eyebrow: 'Grip Refresh',
    description: 'Grip tape and grip upgrades for players who want a fast equipment refresh without replacing the whole bag.',
    seoTitle: 'Golf Grips & Grip Tape',
    metaDescription: 'Shop golf grips and grip tape from WYX Golf Supply Co. with live supplier inventory and secure Shopify checkout.',
    match: (product) => categoryFor(product) === 'Grips' || text(product).includes('grip'),
    bullets: ['Fast equipment refresh', 'Great add-on purchase', 'Pairs with balls and markers']
  },
  {
    slug: 'golf-bag-essentials',
    title: 'Golf Bag Essentials',
    eyebrow: 'Build The Bag',
    description: 'The small pieces that keep a bag ready: golf balls, grips, markers, gloves, and course accessories.',
    seoTitle: 'Golf Bag Essentials',
    metaDescription: 'Shop golf bag essentials from WYX Golf Supply Co., including golf balls, gloves, grips, markers, and accessories.',
    match: (product) => ['Golf Balls', 'Gloves', 'Grips', 'Accessories'].includes(categoryFor(product)),
    bullets: ['Core round essentials', 'Useful add-ons', 'Secure Shopify checkout']
  }
];

export function getLandingCollection(slug: string) {
  return landingCollections.find((collection) => collection.slug === slug) || null;
}
