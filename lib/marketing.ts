import { categoryFor } from '@/lib/catalog';
import { productPrice } from '@/lib/feed';
import type { Product } from '@/types/shopify';

export const siteUrl = 'https://wyxgolfsupply.com';

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

export const channelPlan = [
  {
    channel: 'Bag Upgrade Kit',
    audience: 'Weekend golfers who want a better first WYX order without browsing everything.',
    promise: 'Five practical bag upgrades grouped into one editable Shopify cart.',
    href: '/weekend-golfer-bag-upgrade-kit',
    cta: 'Shop the kit',
    campaign: 'bag_upgrade_kit'
  },
  {
    channel: 'Golf Gifts',
    audience: 'Buying for a golfer and not sure where to start?',
    promise: 'Useful gift picks that do not require guessing club specs.',
    href: '/golf-gifts',
    cta: 'Shop golf gifts',
    campaign: 'organic_golf_gifts'
  },
  {
    channel: 'Golf Trip Gear',
    audience: 'Shopping for a golf trip, scramble, or group round?',
    promise: 'Packable gear with a clear job across travel days and multiple rounds.',
    href: '/golf-trip-gear',
    cta: 'Shop trip gear',
    campaign: 'golf_trip_gear'
  },
  {
    channel: 'Gifts Under $60',
    audience: 'Want a useful golf gift at an easy first-cart price?',
    promise: 'Towels, markers, gloves, headwear, club-care tools, and bag accessories under $60.',
    href: '/golf-gifts-under-60',
    cta: 'Shop under $60',
    campaign: 'gifts_under_60'
  },
  {
    channel: 'Full Shop',
    audience: 'Want to see every current WYX pick?',
    promise: 'Shop the live catalog after WYX availability and merchandising gates.',
    href: '/products',
    cta: 'Shop all gear',
    campaign: 'full_shop'
  }
];

export const launchSocialCopy = [
  'Golf bag looking a little tired? WYX has practical towels, tees, gloves, markers, club-care tools, hats, apparel, and trip gear. WYX10 saves 10% on a first order.',
  'Small golf gear that actually gets used: towels, markers, club-care tools, gloves, hats, apparel, headcovers, and trip gear. Shop the WYX Short List.',
  'Need a golf gift under $60? Start with WYX. Useful golf accessories without guessing club specs. WYX10 saves 10% on a first order.',
  'The easiest golf purchase is often the small thing you use every round: a fresh towel, glove, grip, marker, hat, or bag organizer.',
  'WYX Golf Supply is built for weekend golfers: useful gifts, trip gear, and practical bag upgrades selected using The Bag Test.',
  'Planning a golf trip or scramble? Start with WYX trip gear and gifts that are easy to pack and easy to use.',
  'Build a better first cart with the WYX Bag Upgrade Kit, then edit every item before secure Shopify checkout.'
];

export const paidSearchAngles = [
  'Golf gifts under $60',
  'Best golf accessories for your bag',
  'Golf club cleaning tools',
  'Golf bag upgrade kit',
  'Golf towels gloves hats and ball markers',
  'Golf gifts for men under 60',
  'Golf gifts for women',
  'Useful golf accessories',
  'Best golf bag accessories',
  'Golf gifts for dad',
  'Golf hats and apparel',
  'Golf trip gear for groups',
  'Golf scramble prize ideas',
  'Bachelor party golf gifts'
];

export const socialHashtags = [
  '#golfgear',
  '#golfaccessories',
  '#golfgifts',
  '#golfstyle',
  '#golflife',
  '#weekendgolf',
  '#golfshop',
  '#golfproducts'
];

export const dailyGrowthChecklist = [
  'Check fulfillment first. Do not feature or advertise a supplier SKU until its order-routing path is actually mapped and tested.',
  'Review first-party funnel logs plus Shopify analytics: product views, add-to-cart, checkout starts, orders, and top landing pages.',
  'Feature one proven product or one focused collection per day instead of adding more catalog clutter.',
  'Use the Bag Upgrade Kit as the default first-purchase offer until conversion data proves a better hero.',
  'Share /golf-gifts for gift intent, /golf-trip-gear for trip intent, and product pages for product-specific posts. Keep UTMs on campaigns.',
  'Comment helpfully in real golf communities without dropping a link unless it is relevant to the discussion.',
  'Scout new suppliers only after current fulfillment blockers are cleared. Favor domestic or reliably mapped fulfillment before catalog breadth.',
  'Review support, damaged-order, shipping, and return issues for patterns that should change merchandising or supplier priority.'
];

export const supplierScoutingTargets = [
  ['Priority 1', 'Ball markers and divot tools', 'Low size risk, giftable, easy to bundle, and relatively simple fulfillment.'],
  ['Priority 1', 'Golf towels and club-care tools', 'Practical bag needs with strong add-on potential.'],
  ['Priority 1', 'Gloves and grip-related products', 'Consumable or replaceable products for active golfers; sizing and compatibility still need care.'],
  ['Priority 1', 'Rope hats and course-ready headwear', 'Visual, giftable products that can strengthen WYX identity.'],
  ['Priority 2', 'Headcovers and bag personality pieces', 'Brand-led products that can make WYX feel curated without club-spec complexity.'],
  ['Priority 2', 'Compact trip gear', 'Useful for the WYX trip position when fulfillment is predictable.'],
  ['Priority 3', 'Putting mirrors and compact training aids', 'Useful category only after supplier mapping and product claims are verified.']
];

export const adCopyBlocks = [
  ['Golf Gifts Under $60', 'Useful golf gifts that actually get used. Towels, gloves, markers, hats, and club-care tools. WYX10 saves 10% on a first order.'],
  ['The Bag Upgrade Kit', 'Five practical golf-bag upgrades grouped into one editable cart. Review every item before secure Shopify checkout.'],
  ['Upgrade Your Golf Bag', 'Shop practical golf accessories for cleaner gear, easier rounds, golf trips, and better-organized bags.'],
  ['Small Gear. Easy Yes.', 'Golf towels, gloves, hats, markers, club-care tools, and bag accessories that make an easier first cart.'],
  ['Golf Trip Gear', 'Packable golf gear and gifts for weekend trips, group rounds, and travel days.'],
  ['Golf Hats And Apparel', 'Course-ready hats and apparel selected to fit the WYX weekend-golf position.']
];
