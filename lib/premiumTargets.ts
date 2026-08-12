export type PremiumTarget = {
  brand: string;
  product: string;
  category: string;
  price: string;
  proof: string;
  rating?: string;
  reviews?: string;
  status: string;
  sourceUrl: string;
};

export const premiumTargets: PremiumTarget[] = [
  {
    brand: 'Holderness & Bourne',
    product: 'The Hicks Shirt',
    category: 'Polo',
    price: '$125',
    rating: '4.8★',
    reviews: '27 reviews',
    proof: 'Structured collar, performance jersey, UPF 50+, four-way stretch and moisture wicking.',
    status: 'WHOLESALE TARGET',
    sourceUrl: 'https://holdernessandbourne.com/products/the-hicks-shirt-maidstone-blue'
  },
  {
    brand: 'Holderness & Bourne',
    product: 'The Harwood Short',
    category: 'Shorts',
    price: '$135',
    rating: '4.4★',
    reviews: '192 reviews',
    proof: 'Four-way stretch, quick dry, water resistance, UPF 50+ and a golf-specific non-slip waistband.',
    status: 'WHOLESALE TARGET',
    sourceUrl: 'https://holdernessandbourne.com/products/the-harwood-short-andover'
  },
  {
    brand: 'Holderness & Bourne',
    product: 'The McDaniel 5 Pocket Pant',
    category: 'Pants',
    price: '$185',
    rating: '4.5★',
    reviews: '60 reviews',
    proof: 'Matte performance fabric, four-way stretch, quick dry, wrinkle resistance and course-to-travel styling.',
    status: 'WHOLESALE TARGET',
    sourceUrl: 'https://holdernessandbourne.com/products/the-mcdaniel-5-pocket-pant-fescue'
  },
  {
    brand: 'TRUE linkswear',
    product: 'TRUE Original 1.2',
    category: 'Footwear',
    price: '$189',
    rating: '4.7★',
    reviews: '1,289 reviews',
    proof: 'Waterproof zero-drop golf shoe with a wide toe box and one of TRUE’s deepest review histories.',
    status: 'RETAIL PARTNER TARGET',
    sourceUrl: 'https://truelinkswear.com/collections/best-sellers'
  },
  {
    brand: 'Sunday Swagger',
    product: 'Weekday Polo — Onyx',
    category: 'Polo',
    price: '$49',
    rating: '4.9★',
    reviews: '216 reviews',
    proof: 'Four-way stretch, UPF 40, moisture wicking, wrinkle resistance and a cleaner solid-color look.',
    status: 'RETAILER TARGET',
    sourceUrl: 'https://sundayswagger.com/products/mens-golf-polo-shirt-performance-solid-black'
  },
  {
    brand: 'KENTWOOL',
    product: 'Men’s Classic Low',
    category: 'Socks',
    price: 'PREMIUM SOCK',
    rating: '5.0★',
    reviews: '9 verified reviews',
    proof: 'Made-in-USA performance wool sock with cushioning and strong walking-comfort feedback.',
    status: 'WHOLESALE TARGET',
    sourceUrl: 'https://www.kentwool.com/products/new-mens-classic-low-3'
  },
  {
    brand: 'Sunday Golf',
    product: 'Ryder Full Size Stand Bag',
    category: 'Golf Bag',
    price: '$249.99',
    reviews: '500 reviews',
    proof: 'Bestselling full-size stand bag with strong design, cooler storage and a lifetime warranty.',
    status: 'WHOLESALE TARGET',
    sourceUrl: 'https://sundaygolf.com/products/ryder-toasted-almond-lightweight-stand-bag'
  },
  {
    brand: 'Grooveit',
    product: 'The Wet Club Scrub',
    category: 'Club Care',
    price: 'PREMIUM BRUSH',
    reviews: '904 reviews',
    proof: 'Patented leak-proof magnetic wet brush backed by a three-year bristle guarantee and wholesale program.',
    status: 'WHOLESALE TARGET',
    sourceUrl: 'https://grooveitbrush.com/products/grooveit-the-wet-club-scrub'
  },
  {
    brand: 'Blue Tees Golf',
    product: 'Captain Pro Connected GPS Rangefinder',
    category: 'Golf Tech',
    price: '$299.98',
    proof: '7X optics, OLED display, GPS distances, slope/wind-adjusted True Distance, AI club recommendations and IP67 rating.',
    status: 'WHOLESALE / DEALER TARGET',
    sourceUrl: 'https://blueteesgolf.com/products/captain-pro'
  },
  {
    brand: 'Blue Tees Golf',
    product: 'Player Pro GPS Speaker',
    category: 'Golf Tech',
    price: '$199.98',
    proof: 'Full-color GPS touchscreen, hole views, green heat maps, 360° audio, scoring and connected golf features.',
    status: 'WHOLESALE / DEALER TARGET',
    sourceUrl: 'https://blueteesgolf.com/products/player-pro'
  },
  {
    brand: 'Blue Tees Golf',
    product: 'Rainmaker Portable Launch Monitor',
    category: 'Practice Tech',
    price: '$599.99',
    proof: 'Portable 2026 launch monitor designed for range/home use with carry distance, ball speed, launch and spin data.',
    status: 'WHOLESALE / DEALER TARGET',
    sourceUrl: 'https://blueteesgolf.com/'
  }
];
