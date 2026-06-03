import { categoryFor } from '@/lib/catalog';
import { productPrice } from '@/lib/feed';
import type { Product } from '@/types/shopify';

export const siteUrl = 'https://wyx-golf-supply-co.vercel.app';

export function campaignUrl(path: string, campaign: string, source = 'organic', medium = 'landing') {
  const url = new URL(path, siteUrl);
  url.searchParams.set('utm_source', source);
  url.searchParams.set('utm_medium', medium);
  url.searchParams.set('utm_campaign', campaign);
  return url.toString();
}

export function productMarketingLabels(product: Product) {
  const price = Number(productPrice(product).amount);
  const category = categoryFor(product);
  return {
    priceTier: price < 20 ? 'under_20' : price <= 60 ? 'under_60' : 'premium',
    category,
    conversionType: price <= 35 ? 'impulse_add_on' : 'giftable_upgrade'
  };
}

export const launchSocialCopy = [
  'Golf bag looking a little tired? WYX has towels, tees, gloves, markers, club-care tools, and training aids ready for checkout. Use WYX10 for 10% off.',
  'Small golf gear that actually gets used: brush cleaners, groove tools, putting mirrors, tees, towels, gloves, and headcovers. Shop WYX Golf Supply today.',
  'Need a golf gift under $60? Start with WYX. Useful golf accessories, secure Shopify checkout, and launch code WYX10.'
];

export const paidSearchAngles = [
  'Golf gifts under $60',
  'Best golf accessories for your bag',
  'Golf club cleaning tools',
  'Putting mirror and practice aids',
  'Golf tees, towels, gloves, and ball markers'
];
