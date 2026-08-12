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
    reviews: '26+ reviews',
    proof: 'Structured collar, performance jersey, UPF 50+, four-way stretch and moisture wicking.',
    status: 'APPAREL RADAR',
    sourceUrl: 'https://holdernessandbourne.com/products/the-hicks-shirt-belmont'
  },
  {
    brand: 'Holderness & Bourne',
    product: 'The Harwood Short',
    category: 'Shorts',
    price: '$135',
    rating: '4.4★',
    reviews: '192 reviews',
    proof: 'Four-way stretch, quick dry, water resistance, UPF 50+, non-slip waistband and ball-marker pocket.',
    status: 'APPAREL RADAR',
    sourceUrl: 'https://holdernessandbourne.com/products/the-harwood-short-andover'
  },
  {
    brand: 'Holderness & Bourne',
    product: 'The McDaniel 5 Pocket Pant',
    category: 'Pants',
    price: '$185',
    rating: '4.5★',
    reviews: '59 reviews',
    proof: 'Matte performance fabric, four-way stretch, quick dry, water and wrinkle resistance, plus a golf-specific waistband.',
    status: 'APPAREL RADAR',
    sourceUrl: 'https://holdernessandbourne.com/products/the-mcdaniel-5-pocket-pant-navy'
  },
  {
    brand: 'TRUE linkswear',
    product: 'TRUE Original 1.2',
    category: 'Footwear',
    price: '$189',
    rating: '4.7★',
    reviews: '1,290 reviews',
    proof: 'Waterproof zero-drop golf shoe with a wide toe box, flexible outsole and unusually deep customer proof.',
    status: 'FOOTWEAR RADAR',
    sourceUrl: 'https://truelinkswear.com/products/true-original-1-2'
  },
  {
    brand: 'TRUE linkswear',
    product: 'TRUE OG3 Pro',
    category: 'Footwear',
    price: '$199',
    rating: '4.7★',
    reviews: '276 reviews',
    proof: 'Tour-oriented spikeless shoe with zero-drop cushioning, wide toe box, waterproof construction and stronger lateral stability.',
    status: 'FOOTWEAR RADAR',
    sourceUrl: 'https://truelinkswear.com/products/true-og3-pro'
  },
  {
    brand: 'Grooveit',
    product: 'The Wet Club Scrub',
    category: 'Club Care',
    price: '$24.99',
    reviews: '2,000+ five-star reviews',
    proof: 'Patented spray-and-scrub wet brush with a powerful magnetic attachment and a three-year bristle guarantee.',
    status: 'ACCESSORY RADAR',
    sourceUrl: 'https://grooveitbrush.com/products/grooveit-the-wet-club-scrub'
  },
  {
    brand: 'Sunday Golf',
    product: 'Ryder Full Size Stand Bag',
    category: 'Golf Bag',
    price: '$249.99',
    reviews: '503 reviews',
    proof: 'Bestselling full-size stand bag from a brand reporting more than 4,560 five-star customer reviews overall.',
    status: 'BAG RADAR',
    sourceUrl: 'https://sundaygolf.com/'
  },
  {
    brand: 'Blue Tees Golf',
    product: 'Captain Pro Connected GPS Rangefinder',
    category: 'Golf Tech',
    price: '$299.98',
    rating: '4.8★ brand rating',
    reviews: '2,000+ Blue Tees reviews',
    proof: '7X OLED optics, 1,200-yard range, GPS distances, True Distance, AI club recommendations, Find My and IP67 protection.',
    status: 'TECH RADAR',
    sourceUrl: 'https://blueteesgolf.com/products/captain-pro'
  },
  {
    brand: 'Blue Tees Golf',
    product: 'Player Pro GPS Speaker',
    category: 'Golf Tech',
    price: '$199.98',
    rating: '4.8★ brand rating',
    reviews: '2,000+ Blue Tees reviews',
    proof: 'GPS touchscreen, course intelligence, scoring and 360-degree audio in one cart-ready device.',
    status: 'TECH RADAR',
    sourceUrl: 'https://blueteesgolf.com/collections/all'
  },
  {
    brand: 'Blue Tees Golf',
    product: 'Rainmaker Portable Launch Monitor',
    category: 'Practice Tech',
    price: '$599.99',
    rating: '4.8★ brand rating',
    reviews: '2,000+ Blue Tees reviews',
    proof: 'Portable launch-monitor category entry from Blue Tees for range and home practice.',
    status: 'TECH RADAR',
    sourceUrl: 'https://blueteesgolf.com/collections/all'
  },
  {
    brand: 'KENTWOOL',
    product: "Men's Classic Ankle",
    category: 'Socks',
    price: '$21.95',
    rating: '91% five-star',
    reviews: '35 reviews',
    proof: '79% Merino wool performance sock with cushioning and repeated positive feedback from golfers who walk frequently.',
    status: 'APPAREL RADAR',
    sourceUrl: 'https://www.kentwool.com/products/copy-of-mens-classic-ankle-essentials'
  },
  {
    brand: 'Sunday Swagger',
    product: 'Signature Performance Polo',
    category: 'Polo',
    price: '$64',
    rating: '4.9★',
    reviews: '15,000+ reviews across the signature polo line',
    proof: 'High-volume customer proof with four-way stretch, moisture management and a deliberate personality lane for WYX.',
    status: 'APPAREL RADAR',
    sourceUrl: 'https://sundayswagger.com/collections/mens-polos'
  }
];
