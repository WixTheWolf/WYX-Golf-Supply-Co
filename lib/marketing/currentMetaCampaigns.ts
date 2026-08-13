export type CurrentMetaCreative = {
  id: string;
  name: string;
  primaryText: string;
  headline: string;
  description: string;
  cta: 'Shop Now' | 'Learn More';
  landingPath: string;
  utmCampaign: string;
  angle: string;
};

export const currentMetaCampaigns: CurrentMetaCreative[] = [
  {
    id: 'wyx-brand-edit',
    name: 'WYX — The Good Stuff in Golf',
    primaryText: 'Golf has enough stuff. WYX keeps the good stuff easier to find — apparel, headcovers, gloves, trip gear and useful bag upgrades from brands worth knowing about.',
    headline: 'Golf’s Best Stuff. One Place.',
    description: 'A smaller, sharper edit of modern golf gear.',
    cta: 'Shop Now',
    landingPath: '/products',
    utmCampaign: 'meta_wyx_brand_edit',
    angle: 'Brand discovery + curated multi-brand shop'
  },
  {
    id: 'wyx-apparel',
    name: 'WYX — Apparel Edit',
    primaryText: 'Golf clothes should look right before the logo matters. WYX keeps the apparel edit focused on texture, fit and pieces that still work when the round is over.',
    headline: 'Golf Apparel Without the Costume',
    description: 'Shop the current WYX apparel edit.',
    cta: 'Shop Now',
    landingPath: '/apparel',
    utmCampaign: 'meta_wyx_apparel',
    angle: 'Golf style + course-to-weekend wear'
  },
  {
    id: 'wyx-headcovers',
    name: 'WYX — Headcover Edit',
    primaryText: 'Your bag does not need another generic black headcover. WYX picked covers that protect the club and actually make the setup look like yours.',
    headline: 'Make the Bag Yours',
    description: 'Driver and putter covers with actual personality.',
    cta: 'Shop Now',
    landingPath: '/golf-headcovers',
    utmCampaign: 'meta_wyx_headcovers',
    angle: 'Visual bag upgrade + giftability'
  },
  {
    id: 'wyx-trip',
    name: 'WYX — Golf Trip Gear',
    primaryText: 'The best golf trips are easier when the bag is ready. WYX keeps a tight edit of useful gear for travel days, rental carts, long rounds and the foursome.',
    headline: 'Pack the Golf Trip Better',
    description: 'Useful golf-trip gear without the filler.',
    cta: 'Shop Now',
    landingPath: '/golf-trip-gear',
    utmCampaign: 'meta_wyx_trip_gear',
    angle: 'Golf trips + group buying'
  },
  {
    id: 'wyx-gifts',
    name: 'WYX — Golf Gifts',
    primaryText: 'Buying for a golfer should not mean another sleeve of logo balls. WYX keeps the gift edit focused on things that actually make it into the bag or weekend rotation.',
    headline: 'Give Golf Better',
    description: 'Golf gifts selected for real golfers.',
    cta: 'Shop Now',
    landingPath: '/golf-gifts',
    utmCampaign: 'meta_wyx_gifts',
    angle: 'Gift buyer + low equipment-fit risk'
  },
  {
    id: 'wyx-golf-or-die',
    name: 'WYX — Golf or Die',
    primaryText: 'Not every golf-trip purchase needs to lower your handicap. Golf or Die gives the foursome one more reason to talk trash all day.',
    headline: 'Bring More Game to the Round',
    description: 'A WYX trip pick for the group.',
    cta: 'Shop Now',
    landingPath: '/products/golf-or-die-game-set',
    utmCampaign: 'meta_wyx_golf_or_die',
    angle: 'Social golf + trip impulse purchase'
  }
];

export function currentMetaLandingUrl(path: string, campaign: string, source = 'facebook') {
  const params = new URLSearchParams({
    utm_source: source,
    utm_medium: 'paid_social',
    utm_campaign: campaign
  });
  return `https://wyxgolfsupply.com${path}?${params.toString()}`;
}
