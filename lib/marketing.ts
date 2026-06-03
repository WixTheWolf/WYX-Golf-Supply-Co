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
  'Need a golf gift under $60? Start with WYX. Useful golf accessories, secure Shopify checkout, and launch code WYX10.',
  'The easiest golf purchase is the thing you forgot you needed: a fresh towel, glove, grip, marker, or ball restock. WYX10 is live today.',
  'New golf supply shop is live. Independent finds, quick bag upgrades, and checkout powered by Shopify. Start with the under-$60 picks.',
  "Father's Day is June 21. Get Dad something he will actually use: golf towels, ball markers, gloves, grips, golf balls, and bag upgrades. Use WYX10."
];

export const paidSearchAngles = [
  'Golf gifts under $60',
  'Best golf accessories for your bag',
  'Golf club cleaning tools',
  'Putting mirror and practice aids',
  'Golf tees, towels, gloves, and ball markers',
  'Golf gifts for men under 50',
  'Golf gifts for women under 50',
  'Cool golf accessories 2026',
  'Best golf bag accessories',
  "Father's Day golf gifts 2026",
  'golf gifts for dad'
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
  'Post one product carousel: towel, marker, glove, grip, or headcover. Use the matching product page, not the homepage.',
  'Post one short-form video idea: "3 things every golf bag should have before Saturday morning."',
  'Share the /popular-golf-products-2026 page in bio or story with WYX10.',
  'Comment helpfully on local golf-course, range, simulator, and golf-group posts without spamming links.',
  'Add at least two new supplier products to review: one under-$25 impulse item and one $35-$60 giftable upgrade.',
  'Check Shopify analytics for product views, add-to-cart, reached checkout, and top landing page.'
];

export const supplierScoutingTargets = [
  ['Priority 1', 'Ball markers and divot tools', 'Low size risk, giftable, good margins, easy content.'],
  ['Priority 1', 'Golf towels and club-care tools', 'Practical repeatable need; strong bundle/add-on behavior.'],
  ['Priority 1', 'Gloves and grip tape', 'Consumable products that active golfers replace.'],
  ['Priority 2', 'Women’s golf apparel and skorts', 'Growing demand, strong visual content, but sizing/returns need care.'],
  ['Priority 2', 'Rope hats and headcovers', 'Brand/style-led products that make WYX feel curated.'],
  ['Priority 3', 'Putting mirrors and compact training aids', 'Higher-intent buyers; good SEO landing-page match.']
];

export const adCopyBlocks = [
  ['Golf Gifts Under $60', 'Useful golf gifts that actually get used. Towels, tees, gloves, markers, and club-care tools. Use WYX10 today.'],
  ['Upgrade Your Golf Bag', 'Shop practical golf accessories for cleaner clubs, better practice, and easier rounds. Secure Shopify checkout.'],
  ['Small Gear. Easy Yes.', 'Golf towels, tees, gloves, putting aids, and bag tools selected for fast checkout. Launch code WYX10.'],
  ['Popular Golf Products 2026', 'Fresh golf accessories, gifts, gloves, towels, markers, and bag upgrades. Shop WYX with WYX10.']
  , ["Father's Day Golf Gifts", "Father's Day is June 21. Shop useful golf gifts Dad will actually use: towels, markers, gloves, balls, grips, and bag upgrades."]
];
