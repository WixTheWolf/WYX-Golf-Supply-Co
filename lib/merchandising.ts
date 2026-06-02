import { categoryFor } from '@/lib/catalog';
import type { Product } from '@/types/shopify';

export function productValueBullets(product: Product) {
  const category = categoryFor(product);
  if (category === 'Grips') return ['Refresh your feel without replacing the bag', 'Easy add-on for range sessions and practice weeks', 'Pairs well with golf balls and markers'];
  if (category === 'Golf Balls') return ['Restock the bag before the next tee time', 'Useful gift for any golfer', 'Simple checkout through Shopify'];
  if (category === 'Gloves') return ['Small upgrade with real round-to-round utility', 'Keeps your bag better organized', 'Strong under-$60 cart builder'];
  if (category === 'Headwear') return ['Course-ready style with everyday wear potential', 'Strong gift profile for golf people', 'Pairs with small bag accessories'];
  return ['Useful bag upgrade for everyday rounds', 'Low-friction golf gift', 'Supplier-backed inventory synced through Shopify'];
}

export function productFaq(product: Product) {
  return [
    ['Who fulfills this product?', `This item is supplied and fulfilled by ${product.vendor || 'the connected Shopify supplier'}. WYX curates the listing and checkout runs through Shopify.`],
    ['When will shipping show?', 'Shipping rates and delivery estimates are calculated during Shopify checkout based on the product and destination.'],
    ['Can I use the launch code?', 'Yes. Use WYX10 at checkout while the launch offer is active.']
  ];
}
