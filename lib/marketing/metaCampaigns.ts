/** Meta (Facebook/Instagram) ad creative — copy + UTM defaults for WYX campaigns. */

export type MetaAdCreative = {
  id: string;
  name: string;
  primaryText: string;
  headline: string;
  description: string;
  cta: 'Shop Now' | 'Learn More' | 'Get Offer';
  landingPath: string;
  utmCampaign: string;
  angle: string;
};

export const metaCampaigns: MetaAdCreative[] = [
  {
    id: 'hidden-gems-cart',
    name: 'Hidden Gems — Cart Life',
    primaryText: 'Your cart is missing three things: a phone mount that doesn\'t wobble, cup holders that actually hold tumblers, and an umbrella clip for surprise rain. WYX10 saves 10% on gear golfers didn\'t know they needed.',
    headline: 'Cart Upgrades Under $35',
    description: 'Magnetic phone mount, silicone cup holders, windproof umbrella clip.',
    cta: 'Shop Now',
    landingPath: '/lp/hidden-gems',
    utmCampaign: 'meta_hidden_gems_cart',
    angle: 'Problem → visible fix → impulse price'
  },
  {
    id: 'hidden-gems-train',
    name: 'Hidden Gems — Backyard Practice',
    primaryText: 'No range trip required. Divot board feedback, pop-up chipping net, portable putting arc — the training aids that make golfers say "why didn\'t I buy this sooner?" Code WYX10 for 10% off.',
    headline: 'Practice Gear That Actually Works',
    description: 'Divot board, chipping net, putting arc — under $50 each.',
    cta: 'Shop Now',
    landingPath: '/lp/hidden-gems',
    utmCampaign: 'meta_hidden_gems_train',
    angle: 'Frustration → demo-friendly product'
  },
  {
    id: 'bag-upgrade-kit',
    name: 'Bag Upgrade Kit — Hero Offer',
    primaryText: 'The Weekend Golfer\'s Bag Upgrade Kit: five practical pieces that fix the annoyances in every bag. Real stock. Secure Shopify checkout. WYX10 takes 10% off your first order.',
    headline: 'The Bag Upgrade Kit — Under $80',
    description: 'Towel, marker, grip refresh, groove tool, caddie — one kit.',
    cta: 'Shop Now',
    landingPath: '/lp/bag-kit',
    utmCampaign: 'meta_bag_upgrade_kit',
    angle: 'Bundle AOV + gift buyer'
  },
  {
    id: 'scramble-prizes',
    name: 'Scramble Prizes — Tournament',
    primaryText: 'Running a scramble? Skip junk drawer prizes. Markers, towels, gloves — gear players use the next round. Bulk quotes for 4+ players. WYX10 saves 10%.',
    headline: 'Scramble Prizes Under $50',
    description: 'Tournament prize ideas + bulk kits.',
    cta: 'Shop Now',
    landingPath: '/lp/scramble',
    utmCampaign: 'meta_scramble_prizes',
    angle: 'B2B tournament organizer'
  },
  {
    id: 'fathers-day-2026',
    name: 'Father\'s Day 2026 — Gift Buyer',
    primaryText: 'Father\'s Day is June 21. Skip the novelty polo — give him bag upgrades he\'ll use every round. Bag Upgrade Kit: towel, marker, grip tape, groove tool, caddie. WYX10 saves 10%.',
    headline: 'Golf Gifts Dad Will Actually Use',
    description: 'Father\'s Day picks under $75. WYX10 at checkout.',
    cta: 'Shop Now',
    landingPath: '/lp/fathers-day',
    utmCampaign: 'meta_fathers_day_2026',
    angle: 'Deadline urgency + gift buyer'
  },
  {
    id: 'gifts-under-60',
    name: 'Golf Gifts Under $60',
    primaryText: 'Shopping for a golfer and don\'t know their handicap? Start here — useful gifts under $60 that earn a permanent bag spot. Not another sleeve of balls. WYX10 saves 10%.',
    headline: 'Golf Gifts He\'ll Actually Use',
    description: 'Markers, towels, gloves, training aids — gift-safe picks.',
    cta: 'Shop Now',
    landingPath: '/golf-gifts-under-60',
    utmCampaign: 'meta_gifts_under_60',
    angle: 'Gift buyer — zero size risk'
  },
  {
    id: 'hidden-gem-kit',
    name: 'Hidden Gem Starter Kit — Bundle',
    primaryText: 'Four cart and practice upgrades in one kit — phone mount, cup holders, ball retriever, divot board. Under $130 before WYX10. The bundle golfers add after seeing one hidden gem work.',
    headline: 'Hidden Gem Starter Kit',
    description: 'Cart + practice bundle — one click, four upgrades.',
    cta: 'Shop Now',
    landingPath: '/kits/hidden-gem-starter-kit',
    utmCampaign: 'meta_hidden_gem_kit',
    angle: 'Bundle AOV — 4 hidden gems'
  },
  {
    id: 'retriever-hook',
    name: 'Ball Retriever — Water Save',
    primaryText: 'One water hazard save pays for this retriever. Extends to 15ft, collapses to bag-pocket size. The $24 accessory that stops the "$4 ball tax." WYX10 for 10% off.',
    headline: '15ft Ball Retriever — $24',
    description: 'Pond insurance every weekend golfer needs.',
    cta: 'Shop Now',
    landingPath: '/lp/hidden-gems',
    utmCampaign: 'meta_ball_retriever',
    angle: 'Single SKU hook — clear ROI story'
  }
];

export function metaLandingUrl(path: string, campaign: string, source = 'facebook') {
  const base = 'https://wyxgolfsupply.com';
  const params = new URLSearchParams({
    utm_source: source,
    utm_medium: 'paid_social',
    utm_campaign: campaign
  });
  return `${base}${path}?${params.toString()}`;
}

export function carouselCardCopy(creative: MetaAdCreative) {
  return {
    primary_text: creative.primaryText,
    headline: creative.headline,
    link_description: creative.description,
    call_to_action: creative.cta,
    website_url: metaLandingUrl(creative.landingPath, creative.utmCampaign)
  };
}