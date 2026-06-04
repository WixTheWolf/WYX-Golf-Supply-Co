import { categoryFor } from '@/lib/catalog';
import type { Product } from '@/types/shopify';

export function productBuyerPromise(product: Product) {
  const category = categoryFor(product);
  if (product.handle === 'tri-fold-microfiber-golf-towel') return 'A compact microfiber towel built for wet grips, clean club faces, and everyday bag carry.';
  if (/golf bag/i.test(`${product.title} ${product.productType} ${(product.tags || []).join(' ')}`)) return 'A full-bag upgrade for golfers ready to carry their gear with more order and personality.';
  if (category === 'Grips') return 'A simple grip refresh for better feel during range sessions and weekend rounds.';
  if (category === 'Golf Balls') return 'An easy ball restock for the next tee time, golf trip, or gift bag.';
  if (category === 'Gloves') return 'A small round-to-round upgrade for golfers who like a cleaner, more prepared bag.';
  if (category === 'Towels') return 'A practical towel upgrade for cleaner clubs, cleaner hands, and better bag habits.';
  return 'A useful golf accessory built to earn a regular spot in the bag.';
}

export function productValueBullets(product: Product) {
  const category = categoryFor(product);
  if (product.handle === 'tri-fold-microfiber-golf-towel') return ['Clips easily to most golf bags', 'Helps keep clubs, balls, and hands clean during the round', 'Small enough to carry every day, useful enough to actually use'];
  if (/golf bag/i.test(`${product.title} ${product.productType} ${(product.tags || []).join(' ')}`)) return ['Premium full-bag upgrade', 'Keeps gear organized for everyday rounds', 'Best for golfers ready to upgrade the whole setup'];
  if (category === 'Grips') return ['Refresh your feel without replacing the bag', 'Easy add-on for range sessions and practice weeks', 'Pairs well with golf balls and markers'];
  if (category === 'Golf Balls') return ['Restock the bag before the next tee time', 'Useful gift for any golfer', 'Simple checkout'];
  if (category === 'Gloves') return ['Small upgrade with real round-to-round utility', 'Keeps your bag better organized', 'Easy under-$60 golf gift'];
  if (category === 'Headwear') return ['Course-ready style with everyday wear potential', 'Strong gift profile for golf people', 'Pairs with small bag accessories'];
  return ['Useful bag upgrade for everyday rounds', 'Easy golf gift', 'Built for real rounds, range sessions, and bag organization'];
}

export function productBestFor(product: Product) {
  const category = categoryFor(product);
  if (product.handle === 'tri-fold-microfiber-golf-towel') return ['Weekend rounds', 'Range sessions', 'Golf gifts under $25', 'Building a cleaner, more organized bag'];
  if (category === 'Club Care' || category === 'Towels') return ['Weekend rounds', 'Range sessions', 'Club care', 'Cleaner bag habits'];
  if (category === 'Accessories') return ['Weekend rounds', 'Golf gifts', 'Bag organization', 'Golf trips'];
  if (category === 'Golf Balls') return ['Weekend rounds', 'Range sessions', 'Golf gifts', 'Bag restocks'];
  if (category === 'Gloves' || category === 'Grips') return ['Weekend rounds', 'Range sessions', 'Golf gifts', 'Small bag upgrades'];
  return ['Weekend rounds', 'Range sessions', 'Golf gifts', 'Everyday bag upgrades'];
}

export function productFaq(_product: Product) {
  return [
    ['When will shipping show?', 'Shipping rates and delivery estimates are shown before payment.'],
    ['What if something arrives damaged or incorrect?', 'Contact WYX support with your order number and clear photos so we can help.'],
    ['Can I use the launch code?', 'Yes. Use WYX10 at checkout while the launch offer is active.']
  ];
}
