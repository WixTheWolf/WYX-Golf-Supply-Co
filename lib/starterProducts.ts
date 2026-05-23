export type StarterProduct = {
  title: string;
  handle: string;
  price: string;
  badge: string;
  image: string;
  productType: string;
  collectionHandle: string;
  description: string;
  details: string[];
  materials: string;
  care: string;
  seoTitle: string;
  metaDescription: string;
  tags: string[];
};

export const imageMap = {
  hero: '/images/hero-coastal-fairway.png',
  ropeHat: '/images/rope-hat-product.png',
  polo: '/images/forest-polo-product.png',
  towel: '/images/golf-towel-product.png',
  walk: '/images/walking-golfer-lifestyle..png',
  leather: '/images/leather-bag-detail.png',
  iron: '/images/journal-iron-practice.png',
  care: '/images/journal-club-care.png',
  strategy: '/images/journal-course-strategy.png'
};

export const starterProducts: StarterProduct[] = [
  {
    title: 'The Long Game Rope Hat',
    handle: 'long-game-rope-hat',
    price: '68.00',
    badge: 'Core Collection',
    image: imageMap.ropeHat,
    productType: 'Headwear',
    collectionHandle: 'headwear',
    description: 'A cream rope hat with restrained WYX embroidery, made for course mornings, travel days, and everything after the round.',
    details: ['Structured five-panel profile', 'Rope detail across the brim', 'Adjustable back closure', 'Designed for course, coast, and travel'],
    materials: 'Cotton canvas crown with woven rope detail and embroidered WYX mark.',
    care: 'Spot clean with cold water. Air dry away from direct heat.',
    seoTitle: 'Golf Rope Hat | WYX Golf Supply Co.',
    metaDescription: 'A premium golf rope hat with restrained WYX embroidery for early tee times, travel days, and life after the round.',
    tags: ['core collection', 'golf rope hat', 'premium golf apparel', 'headwear', 'best seller']
  },
  {
    title: 'The Fairway Polo',
    handle: 'fairway-polo',
    price: '128.00',
    badge: 'Core Collection',
    image: imageMap.polo,
    productType: 'Apparel',
    collectionHandle: 'apparel',
    description: 'A forest green polo with clean structure, quiet detail, and the kind of everyday polish that works far beyond the first tee.',
    details: ['Tailored athletic fit', 'Clean collar structure', 'Subtle WYX detail', 'Built for rounds, travel, and clubhouse evenings'],
    materials: 'Performance knit with soft hand feel and enough structure to hold its shape.',
    care: 'Machine wash cold with like colors. Hang dry or tumble low.',
    seoTitle: 'Premium Golf Polo | WYX Golf Supply Co.',
    metaDescription: 'A forest green premium golf polo with clean structure and quiet WYX detail for course and everyday wear.',
    tags: ['core collection', 'golf polo', 'premium golf apparel', 'apparel']
  },
  {
    title: 'The Waffle Golf Towel',
    handle: 'waffle-golf-towel',
    price: '42.00',
    badge: 'New',
    image: imageMap.towel,
    productType: 'Gear',
    collectionHandle: 'golf-gear',
    description: 'A premium waffle towel with forest trim, built for the bag and styled for the long game.',
    details: ['Waffle texture for club and ball cleaning', 'Bag-ready attachment loop', 'Forest trim detail', 'Sized for walking rounds and travel bags'],
    materials: 'Absorbent waffle microfiber with reinforced trim.',
    care: 'Machine wash cold. Do not use fabric softener. Air dry for best texture.',
    seoTitle: 'Premium Golf Towel | WYX Golf Supply Co.',
    metaDescription: 'A premium waffle golf towel with forest trim for clean clubs, ready gear, and quiet-luxury golf style.',
    tags: ['new arrivals', 'golf towel', 'golf accessories', 'walking golf', 'best seller']
  },
  {
    title: 'Leather Bag Tag',
    handle: 'leather-bag-tag',
    price: '54.00',
    badge: 'Limited',
    image: imageMap.leather,
    productType: 'Accessories',
    collectionHandle: 'accessories',
    description: 'A small detail with lasting presence. Built to bring a quiet mark of identity to your golf bag.',
    details: ['Leather-look finish', 'WYX identity mark', 'Bag strap included', 'Gift-ready accessory for golfers'],
    materials: 'Premium leather-style material with durable attachment hardware.',
    care: 'Wipe clean with a dry cloth. Keep away from prolonged soaking.',
    seoTitle: 'Leather Golf Bag Tag | WYX Golf Supply Co.',
    metaDescription: 'A premium leather golf bag tag made for players who value quiet detail and timeless golf accessories.',
    tags: ['limited', 'golf accessories', 'golf gifts', 'bag tag']
  },
  {
    title: 'Club Care Kit',
    handle: 'club-care-kit',
    price: '48.00',
    badge: 'Core Collection',
    image: imageMap.care,
    productType: 'Club Care',
    collectionHandle: 'club-care',
    description: 'Everything needed to keep grooves clean, gear ready, and the ritual intact.',
    details: ['Compact brush and groove tool', 'Bag-friendly cleaning cloth', 'Simple weekly reset routine', 'Designed for irons, wedges, and everyday rounds'],
    materials: 'Mixed club-care tools selected for compact carry and weekly use.',
    care: 'Rinse brush after use and dry before returning to the bag.',
    seoTitle: 'Golf Club Care Kit | WYX Golf Supply Co.',
    metaDescription: 'A compact golf club care kit for keeping grooves clean, gear ready, and the weekly golf ritual intact.',
    tags: ['core collection', 'golf club care', 'club cleaning kit', 'golf essentials']
  },
  {
    title: 'WYX Golf Ball Set',
    handle: 'wyx-golf-ball-set',
    price: '36.00',
    badge: 'New',
    image: imageMap.iron,
    productType: 'Gear',
    collectionHandle: 'golf-gear',
    description: 'A clean branded ball set for players who care about every detail, even the small ones.',
    details: ['Clean WYX mark', 'Three-ball set placeholder', 'Made for gifts, travel bags, and early rounds', 'Pairs well with towel and club care kit'],
    materials: 'Performance golf ball placeholder product for Shopify setup.',
    care: 'Keep dry and clean before play. Replace when cover wear affects performance.',
    seoTitle: 'WYX Golf Ball Set | WYX Golf Supply Co.',
    metaDescription: 'A clean WYX golf ball set for players who care about every detail in their modern golf goods.',
    tags: ['new arrivals', 'golf balls', 'golf gifts', 'golf essentials']
  },
  {
    title: 'The Course Pouch',
    handle: 'course-pouch',
    price: '42.00',
    badge: 'New Arrival',
    image: imageMap.leather,
    productType: 'Accessories',
    collectionHandle: 'accessories',
    description: 'A restrained valuables pouch for tees, markers, gloves, keys, and the small objects that make a round feel organized.',
    details: ['Compact valuables storage', 'Bag and travel friendly', 'Ideal for tees, markers, glove, wallet, and keys', 'Premium gift profile'],
    materials: 'Waxed-canvas style shell with durable zipper and soft internal structure.',
    care: 'Wipe clean. Let air dry fully before storing.',
    seoTitle: 'Golf Valuables Pouch | WYX Golf Supply Co.',
    metaDescription: 'A premium golf valuables pouch for tees, ball markers, gloves, keys, and organized walking rounds.',
    tags: ['new arrivals', 'golf valuables pouch', 'golf accessories', 'golf gifts']
  },
  {
    title: 'Divot Tool + Ball Marker Set',
    handle: 'divot-tool-ball-marker-set',
    price: '34.00',
    badge: 'Golf Gifts',
    image: imageMap.leather,
    productType: 'Accessories',
    collectionHandle: 'golf-gifts',
    description: 'A clean repair tool and marker set with enough weight to feel permanent without drawing attention to itself.',
    details: ['Divot repair tool', 'Matching ball marker', 'Small, giftable, and easy to carry', 'Built around course care and quiet detail'],
    materials: 'Brass-tone metal placeholder product for supplier sampling.',
    care: 'Wipe dry after wet rounds. Store in pouch between rounds.',
    seoTitle: 'Golf Divot Tool and Ball Marker Set | WYX Golf Supply Co.',
    metaDescription: 'A premium golf divot tool and ball marker set for course care, golf gifts, and everyday carry.',
    tags: ['golf gifts', 'divot tool', 'ball marker', 'golf accessories']
  },
  {
    title: 'Golf Travel Organizer',
    handle: 'golf-travel-organizer',
    price: '58.00',
    badge: 'Travel',
    image: imageMap.walk,
    productType: 'Accessories',
    collectionHandle: 'accessories',
    description: 'A calm way to keep gloves, tees, markers, chargers, and travel-round essentials in one place.',
    details: ['Travel-ready internal organization', 'Works inside a golf bag or weekend bag', 'Built for road trips and away rounds', 'Strong premium gift potential'],
    materials: 'Durable fabric organizer with soft dividers and zipper closure placeholder.',
    care: 'Spot clean and air dry. Empty after wet rounds.',
    seoTitle: 'Golf Travel Organizer | WYX Golf Supply Co.',
    metaDescription: 'A premium golf travel organizer for road trips, away rounds, golf accessories, and course essentials.',
    tags: ['travel', 'golf accessories', 'golf gifts', 'new arrivals']
  }
];
