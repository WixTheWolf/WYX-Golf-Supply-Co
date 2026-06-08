import { categoryFor } from '@/lib/catalog';
import { bagUpgradeProducts, tripProducts } from '@/lib/merchandisingFilters';
import { isPremiumGolfBag } from '@/lib/productQuality';
import type { Product } from '@/types/shopify';

export type IntentPageConfig = {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  primaryCta: string;
  secondaryCta: string;
  secondaryHref: string;
  proof: string[];
  faq: Array<[string, string]>;
  match: (product: Product) => boolean;
};

const haystack = (product: Product) => [product.title, product.description, product.vendor, product.productType, ...(product.tags || [])]
  .filter(Boolean)
  .join(' ')
  .toLowerCase();

const under = (product: Product, amount: number) => Number(product.priceRange.minVariantPrice.amount) <= amount;
const categoryIn = (product: Product, categories: string[]) => categories.includes(categoryFor(product));
const has = (product: Product, pattern: RegExp) => pattern.test(haystack(product));

export const intentPages: Record<string, IntentPageConfig> = {
  'golf-gifts': {
    slug: 'golf-gifts',
    title: 'Golf Gifts That Actually Get Used.',
    eyebrow: 'Gift-Ready Picks',
    description: 'Useful towels, markers, grips, gloves, balls, and bag accessories for golfers who already have enough polos.',
    metaTitle: 'Golf Gifts That Actually Get Used',
    metaDescription: 'Shop useful golf gifts from WYX Golf Supply Co., including towels, ball markers, gloves, grips, golf balls, and bag accessories.',
    primaryCta: 'Shop Golf Gifts',
    secondaryCta: 'Under $60 Picks',
    secondaryHref: '/golf-gifts-under-60',
    proof: ['Gift-ready picks', 'Useful bag upgrades', 'Launch code WYX10', 'Bag-friendly picks'],
    faq: [
      ['What makes a good golf gift?', 'Choose something useful, easy to size, and simple to put in the bag: towels, markers, balls, gloves, grips, and small accessories.'],
      ['Is WYX good for last-minute gifts?', 'Yes. Start with under-$60 products and checkout will show available delivery timing before payment.'],
      ['Can I use the launch discount?', 'Use WYX10 at checkout for 10% off eligible products during the launch window.']
    ],
    match: (product) => under(product, 75) || categoryIn(product, ['Accessories', 'Towels', 'Gloves', 'Grips', 'Golf Balls'])
  },
  'golf-gifts-for-dad': {
    slug: 'golf-gifts-for-dad',
    title: "Golf Gifts For Dad That Aren't Another Mug.",
    eyebrow: 'Golf Dad Approved',
    description: "Useful towels, markers, gloves, balls, and bag upgrades he'll actually bring to the course.",
    metaTitle: 'Golf Gifts For Dad',
    metaDescription: 'Shop golf gifts for Dad from WYX Golf Supply Co., including useful towels, ball markers, gloves, golf balls, grips, and bag essentials.',
    primaryCta: 'Shop Dad Gifts',
    secondaryCta: 'Father\'s Day Picks',
    secondaryHref: '/fathers-day-golf-gifts',
    proof: ['Golf dad approved', 'Useful for real rounds', 'Easy gift bundles', 'WYX10 launch offer'],
    faq: [
      ['What should I buy a golf dad?', 'Start with products he will use every round: towels, balls, gloves, ball markers, grips, and bag organizers.'],
      ['Are these novelty gifts?', 'No. WYX prioritizes practical gear golfers can bring to the course.'],
      ['What if I am not sure what he needs?', 'Choose an easy bag accessory or build a small kit. Useful beats complicated.']
    ],
    match: (product) => !isPremiumGolfBag(product) && (under(product, 75) || has(product, /dad|father|towel|marker|glove|grip|ball|headcover|caddie/))
  },
  'bag-essentials': {
    slug: 'bag-essentials',
    title: 'Small Bag Upgrades. Better Rounds.',
    eyebrow: 'Better Bag Builds',
    description: 'Simple golf accessories that make the bag cleaner, easier, and more ready for the next round.',
    metaTitle: 'Golf Bag Essentials',
    metaDescription: 'Shop golf bag essentials from WYX Golf Supply Co., including golf balls, gloves, towels, ball markers, grips, caddies, and accessories.',
    primaryCta: 'Shop Bag Upgrades',
    secondaryCta: 'Shop Accessories',
    secondaryHref: '/best-golf-accessories',
    proof: ['Weekend golfer approved', 'Useful add-ons', 'Under-$75 golf picks', 'Built for real rounds'],
    faq: [
      ['What belongs in every golf bag?', 'A clean towel, fresh glove, balls, markers, tees or tools, and a few small pieces that make the round easier.'],
      ['Why start with essentials?', 'They are easier to buy, easier to gift, and more likely to be used immediately than complex equipment.'],
      ['Can I add multiple essentials at once?', 'Use the WYX kits on the homepage to add a ready-made bundle to your bag.']
    ],
    match: (product) => categoryIn(product, ['Golf Balls', 'Gloves', 'Grips', 'Towels', 'Accessories', 'Club Care']) && !isPremiumGolfBag(product)
  },
  'bag-upgrades': {
    slug: 'bag-upgrades',
    title: 'Small Bag Upgrades. Better Rounds.',
    eyebrow: 'Bag Upgrades',
    description: 'Simple golf accessories that make the bag cleaner, easier, and more ready for the next round.',
    metaTitle: 'Small Golf Bag Upgrades',
    metaDescription: 'Shop small golf bag upgrades from WYX Golf Supply Co., including towels, ball markers, caddies, golf balls, gloves, grips, and accessories.',
    primaryCta: 'Shop Bag Upgrades',
    secondaryCta: 'Gifts Under $60',
    secondaryHref: '/golf-gifts-under-60',
    proof: ['Small useful gear', 'Weekend-player ready', 'No club fitting required', 'WYX10 launch code'],
    faq: [
      ['What counts as a bag upgrade?', 'Anything that makes the bag cleaner, more organized, or easier to use: towels, markers, caddies, gloves, balls, and simple accessories.'],
      ['Are these beginner friendly?', 'Yes. These are low-friction products for weekend players, golf dads, league golfers, and gift shoppers.'],
      ['Do premium golf bags show here?', 'No. Premium bags live on their own page so this page stays focused on small upgrades.']
    ],
    match: (product) => bagUpgradeProducts([product], 1).length > 0
  },
  'scramble-prizes': {
    slug: 'scramble-prizes',
    title: 'Scramble Prizes People Actually Want.',
    eyebrow: 'Prize Table Gear',
    description: 'Tournament gifts, prize-table gear, and small golf accessories that beat another sleeve of random balls.',
    metaTitle: 'Golf Scramble Prizes',
    metaDescription: 'Shop scramble prizes, tournament gifts, and useful golf prize-table gear from WYX Golf Co.',
    primaryCta: 'Shop Prize Packs',
    secondaryCta: 'Bachelor Party Gifts',
    secondaryHref: '/bachelor-party-golf-gifts',
    proof: ['Prize-table ready', 'Under-$60 picks', 'Group golf friendly', 'Useful after the round'],
    faq: [
      ['What makes a good scramble prize?', 'Pick something small, useful, and easy for any golfer to take home: markers, towels, balls, caddies, and compact accessories.'],
      ['Can I buy for a whole group?', 'Yes. Start with lower-priced markers, towels, and golf balls, then mix in a few better bag upgrades.'],
      ['Do you do custom packs?', 'Not yet. Custom and personalized packs are on the sourcing list.']
    ],
    match: (product) => !isPremiumGolfBag(product) && (under(product, 60) || has(product, /marker|towel|ball|glove|caddie|prize|scramble/))
  },
  'weekend-golfer': {
    slug: 'weekend-golfer',
    title: 'Weekend Golfer Gear That Earns A Spot',
    eyebrow: 'Saturday Morning Ready',
    description: 'For the player who wants a cleaner bag, better range sessions, and fewer tiny annoyances during the round.',
    metaTitle: 'Weekend Golfer Essentials',
    metaDescription: 'Shop weekend golfer essentials from WYX Golf Supply Co., including golf towels, gloves, balls, grips, accessories, and compact practice gear.',
    primaryCta: 'Shop Weekend Picks',
    secondaryCta: 'Build A Kit',
    secondaryHref: '/#kits',
    proof: ['Range-ready gear', 'Real-round utility', 'Bag-friendly picks', 'Launch discount'],
    faq: [
      ['What is the best first WYX product?', 'A towel, glove, ball marker, grip, or ball restock is the easiest first cart.'],
      ['Are these products for beginners?', 'Yes. They are useful for casual players, weekend regulars, and golfers who just want a better organized bag.'],
      ['Do you carry premium upgrades too?', 'Yes, premium golf bags are available, but the best first cart usually starts with useful smaller gear.']
    ],
    match: (product) => under(product, 90) || categoryIn(product, ['Training Aids', 'Club Care', 'Towels', 'Accessories'])
  },
  'bachelor-party-golf-gifts': {
    slug: 'bachelor-party-golf-gifts',
    title: "Bachelor Party Golf Gifts That Won't Get Left In The Airbnb.",
    eyebrow: 'Group Golf Gifts',
    description: 'Small, useful, funny golf gear for tournament weekends, group trips, and first-tee chaos.',
    metaTitle: 'Bachelor Party Golf Gifts',
    metaDescription: 'Shop bachelor party golf gifts, scramble prizes, and useful group golf accessories from WYX Golf Supply Co.',
    primaryCta: 'Shop Group Gifts',
    secondaryCta: 'Golf Gifts',
    secondaryHref: '/golf-gifts',
    proof: ['Group gift friendly', 'Easy prize table picks', 'Small useful gear', 'WYX10 saves 10%'],
    faq: [
      ['What works for a golf bachelor party?', 'Ball markers, towels, balls, gloves, caddies, headcovers, and small accessories are easy to buy for groups.'],
      ['Can I build a prize table?', 'Yes. Start with several under-$60 items and mix practical pieces with one premium upgrade.'],
      ['Are custom items available?', 'Only when the product listing offers personalization. Review options before purchase.']
    ],
    match: (product) => !isPremiumGolfBag(product) && (under(product, 75) || has(product, /marker|towel|balls|headcover|tee|divot|caddie/))
  },
  'golf-trip-gear': {
    slug: 'golf-trip-gear',
    title: 'Golf Trip Gear For The Guys Who Almost Remembered Everything.',
    eyebrow: 'Golf Trip Gear',
    description: 'Towels, markers, balls, pouches, and small bag upgrades for bachelor parties, scramble weekends, and golf trips where the first tee is already chaos.',
    metaTitle: 'Golf Trip Gear',
    metaDescription: 'Shop golf trip gear from WYX Golf Supply Co., including towels, ball markers, golf balls, caddies, and bag upgrades for group golf weekends.',
    primaryCta: 'Shop Trip Gear',
    secondaryCta: 'Bachelor Party Gifts',
    secondaryHref: '/bachelor-party-golf-gifts',
    proof: ['Bachelor trip ready', 'Scramble weekend picks', 'Small packable gear', 'WYX10 launch code'],
    faq: [
      ['What should I pack for a golf trip?', 'Start with a towel, ball marker, golf balls, glove or caddie, and a small pouch once The Roo is sourced.'],
      ['Can I buy for a group?', 'Yes. Markers, towels, balls, and small accessories are easy group buys and prize-table picks.'],
      ['Is The Roo available?', 'Not yet. The Roo valuables pouch is waitlist-only until sourcing is confirmed.']
    ],
    match: (product) => tripProducts([product], 1).length > 0
  },
  'clean-contact-kit': {
    slug: 'clean-contact-kit',
    title: 'Clean Contact Kit',
    eyebrow: 'Club Care Essentials',
    description: 'Towels, brushes, groove tools, and bag reset picks for golfers who want cleaner clubs and more predictable contact.',
    metaTitle: 'Clean Contact Golf Kit',
    metaDescription: 'Shop club-care essentials and clean-contact golf gear from WYX Golf Supply Co., including towels, brush cleaners, groove tools, and bag accessories.',
    primaryCta: 'Shop Clean Contact',
    secondaryCta: 'Bag Essentials',
    secondaryHref: '/bag-essentials',
    proof: ['Cleaner grooves', 'Better range routine', 'Simple bag reset', 'Useful for every skill level'],
    faq: [
      ['Why does clean contact matter?', 'Clean grooves and a dry face help the club do its job, especially on wedges and approach shots.'],
      ['What should be in a clean-contact kit?', 'A towel, brush or groove tool, and a few simple pieces that keep the bag organized.'],
      ['Is this a good gift?', 'Yes. Club-care gear is useful, easy to buy, and a good fit for almost any golfer.']
    ],
    match: (product) => !isPremiumGolfBag(product) && (categoryIn(product, ['Club Care', 'Towels']) || has(product, /clean|brush|groove|towel|care|contact/))
  },
  'golf-hats': {
    slug: 'golf-hats',
    title: 'Golf Hats Worth Wearing Off The Course.',
    eyebrow: 'Headwear',
    description: 'Rope hats, snapbacks, and dad caps built for tee times, travel days, and every casual hour after the round.',
    metaTitle: 'Golf Hats | WYX Golf Supply Co.',
    metaDescription: 'Shop golf hats from WYX Golf Supply Co., including rope hats, snapbacks, and dad caps for course wear, travel, and everyday carry.',
    primaryCta: 'Shop Hats',
    secondaryCta: 'Shop Apparel',
    secondaryHref: '/golf-apparel',
    proof: ['Course and casual wear', 'Adjustable fit', 'Giftable headwear', 'WYX10 launch offer'],
    faq: [
      ['What types of golf hats do you carry?', 'Rope hats, snapbacks, and unstructured dad caps. All built with course wear and everyday use in mind.'],
      ['Do the hats fit most head sizes?', 'Yes. Snapbacks and adjustable closures make sizing easy for most golfers.'],
      ['Are golf hats a good gift?', 'Yes. Hats are easy to buy, easy to size, and useful whether or not the recipient plays every week.']
    ],
    match: (product) => categoryIn(product, ['Headwear']) || has(product, /hat|cap|headwear|rope hat|snapback/)
  },
  'golf-apparel': {
    slug: 'golf-apparel',
    title: 'Golf Apparel Built For The Round And Everything After.',
    eyebrow: 'Apparel',
    description: 'Polos, quarter-zips, hoodies, and performance socks for players who want clean, functional gear that holds up beyond the 18th hole.',
    metaTitle: 'Golf Apparel | WYX Golf Supply Co.',
    metaDescription: 'Shop golf apparel from WYX Golf Supply Co., including golf polos, quarter-zips, hoodies, and performance socks for course and everyday wear.',
    primaryCta: 'Shop Apparel',
    secondaryCta: 'Shop Hats',
    secondaryHref: '/golf-hats',
    proof: ['Course-ready fit', 'Clean WYX detail', 'Performance fabrics', 'WYX10 launch offer'],
    faq: [
      ['What apparel do you carry?', 'Polos, quarter-zip pullovers, hoodies, and performance socks — all built to work on the course and off it.'],
      ['Is WYX apparel true to size?', 'Sizing notes are on each product page. Most pieces run standard athletic fit.'],
      ['Is golf apparel a good gift?', 'Yes. Polos and quarter-zips are strong gift candidates. When unsure on size, socks or a hat are the safest choice.']
    ],
    match: (product) => categoryIn(product, ['Apparel']) || has(product, /polo|shirt|hoodie|quarter.?zip|pullover|apparel|sock/)
  },
  'golf-training-aids': {
    slug: 'golf-training-aids',
    title: 'Training Aids For Golfers Who Actually Want To Get Better.',
    eyebrow: 'Practice Gear',
    description: 'Swing trainers, alignment sticks, putting aids, and range gear for weekend golfers who want more than a few warm-up swings.',
    metaTitle: 'Golf Training Aids | WYX Golf Supply Co.',
    metaDescription: 'Shop golf training aids from WYX Golf Supply Co., including swing trainers, alignment sticks, putting aids, and range gear for weekend golfers.',
    primaryCta: 'Shop Training Aids',
    secondaryCta: 'Golf Tech',
    secondaryHref: '/golf-tech',
    proof: ['Range-ready gear', 'Great gift for improving golfers', 'Compact and bag-friendly', 'WYX10 saves 10%'],
    faq: [
      ['What training aids work best for weekend golfers?', 'Swing tempo trainers, alignment sticks, and putting aids are the most practical. They work at the range, in the backyard, or indoors.'],
      ['Are training aids a good gift?', 'Yes, especially for golfers who take the game seriously. Tempo trainers and alignment sticks are easy to use right away.'],
      ['Do I need lessons to use training aids?', 'No. Most products include clear directions and work as standalone tools for building feel and consistency.']
    ],
    match: (product) => categoryIn(product, ['Training Aids']) || has(product, /training|trainer|tempo|alignment|putting|chipping|swing|range gear/)
  },
  'golf-tech': {
    slug: 'golf-tech',
    title: 'Golf Tech That Earns Its Place In The Bag.',
    eyebrow: 'Golf Technology',
    description: 'Laser rangefinders, GPS speakers, and tech upgrades for golfers who want better information on every shot.',
    metaTitle: 'Golf Tech & Rangefinders | WYX Golf Supply Co.',
    metaDescription: 'Shop golf tech from WYX Golf Supply Co., including laser rangefinders, GPS speakers, and smart bag upgrades for serious weekend golfers.',
    primaryCta: 'Shop Golf Tech',
    secondaryCta: 'Training Aids',
    secondaryHref: '/golf-training-aids',
    proof: ['Accurate yardages', 'Great dad gift', 'High-value upgrade', 'WYX10 launch code'],
    faq: [
      ['Is a rangefinder worth it?', 'Yes. Knowing exact yardages changes how you approach every shot. Most golfers who try one keep using it.'],
      ['What is the best rangefinder gift for under $150?', 'Look for pin-seeker models with slope mode toggle. Under $150 is a practical gift range that covers solid performance.'],
      ['Do you carry GPS speakers?', 'We are sourcing GPS speaker options. Rangefinders are available now.']
    ],
    match: (product) => categoryIn(product, ['Golf Tech']) || has(product, /rangefinder|gps|launch monitor|golf tech|gps speaker/)
  },
  'golf-gloves': {
    slug: 'golf-gloves',
    title: 'Golf Gloves That Last More Than One Season.',
    eyebrow: 'Grip & Feel',
    description: 'Cabretta leather golf gloves with built-in ball markers and breathable mesh backs. The one piece of gear you replace every few months — make it count.',
    metaTitle: 'Golf Gloves | WYX Golf Supply Co.',
    metaDescription: 'Shop golf gloves from WYX Golf Supply Co. — cabretta leather palm, built-in ball marker, breathable mesh back. One of the best golf gifts under $30.',
    primaryCta: 'Shop Golf Gloves',
    secondaryCta: 'All Golf Gifts',
    secondaryHref: '/golf-gifts',
    proof: ['Cabretta leather grip', 'Built-in ball marker', 'Breathable mesh back', 'Fits S / M / L / XL'],
    faq: [
      ['What is a cabretta leather golf glove?', 'Cabretta leather comes from a specific type of sheep that produces a very thin, soft hide. It gives the closest feel to gripping bare-handed while still protecting your grip hand.'],
      ['How often should I replace a golf glove?', 'Most regular golfers replace a glove every 10–15 rounds or when the palm shows visible wear. Playing in rain or heat speeds up wear.'],
      ['Is a golf glove a good gift?', 'Yes — it is consumable, easy to size, practical, and priced well. One of the best stocking stuffers for a golfer.']
    ],
    match: (product) => categoryIn(product, ['Gloves']) || has(product, /glove|cabretta|grip hand/)
  },
  'golf-balls': {
    slug: 'golf-balls',
    title: 'Golf Balls Worth Keeping Track Of.',
    eyebrow: 'On The Tee',
    description: 'High-visibility and standard golf ball options for weekend rounds, practice sessions, scrambles, and gifting. Always useful, always welcome in the bag.',
    metaTitle: 'Golf Balls | WYX Golf Supply Co.',
    metaDescription: 'Shop golf balls from WYX Golf Supply Co. — high-vis, standard, and gift sets for weekend golfers, scramble events, and bag upgrades.',
    primaryCta: 'Shop Golf Balls',
    secondaryCta: 'Ball Markers',
    secondaryHref: '/golf-gifts',
    proof: ['Great for scrambles', 'Easy to gift', 'WYX10 launch code', 'In-stock and ship-ready'],
    faq: [
      ['What golf ball is best for a weekend golfer?', 'Most weekend golfers do well with a soft, low-compression ball that spins less off the driver but still gives short-game feedback. High-vis options are great for early mornings and wooded courses.'],
      ['Are golf balls a good gift?', 'Yes — they are consumable, always useful, and priced right for any budget. Add a ball marker or glove for a complete gift.'],
      ['Can you buy golf balls in sets?', 'Yes. WYX carries ball sets in sleeve and full-sleeve configurations. Check product listings for current options.']
    ],
    match: (product) => categoryIn(product, ['Golf Balls']) || has(product, /golf ball|ball set|sleeve/)
  },
  'golf-practice-gear': {
    slug: 'golf-practice-gear',
    title: 'Practice Gear That Actually Moves The Needle.',
    eyebrow: 'Range & Backyard',
    description: 'Alignment sticks, putting mirrors, swing trainers, and tempo trainers. The tools weekend golfers use to fix real problems between rounds — without a lesson.',
    metaTitle: 'Golf Practice Gear & Training Aids | WYX Golf Supply Co.',
    metaDescription: 'Shop golf practice gear from WYX Golf Supply Co. — alignment sticks, putting mirrors, swing trainers, and tempo aids for weekend golfers.',
    primaryCta: 'Shop Practice Gear',
    secondaryCta: 'Golf Tech',
    secondaryHref: '/golf-tech',
    proof: ['Alignment sticks in every bag', 'Putting mirror for home use', 'Swing tempo trainer', 'Under $50 most picks'],
    faq: [
      ['What is the best golf training aid for beginners?', 'Alignment sticks are the best starting point — they are cheap, versatile, and used at every level. A putting mirror is the second best purchase for fixing your setup.'],
      ['Can I practice golf at home?', 'Yes. A putting mirror and a putting mat cover 40% of the game in your living room. Swing tempo trainers work in any open space.'],
      ['Are training aids a good golf gift?', 'Yes — especially for golfers who are working on their game. Alignment sticks, putting mirrors, and tempo trainers are all practical, under $50, and easy to wrap.']
    ],
    match: (product) => categoryIn(product, ['Training Aids']) || has(product, /alignment|putting mirror|swing trainer|tempo trainer|training aid|range gear/)
  },
  'golf-gifts-for-women': {
    slug: 'golf-gifts-for-women',
    title: 'Golf Gifts For Women Golfers That Actually Get Used.',
    eyebrow: 'For Her Game',
    description: 'Practical golf gift ideas for women golfers — gloves, towels, ball markers, scorecard holders, and training aids that work for every skill level and every bag.',
    metaTitle: 'Golf Gifts For Women | WYX Golf Supply Co.',
    metaDescription: 'Shop golf gifts for women from WYX Golf Supply Co. — gloves, towels, ball markers, scorecard holders, and training aids. No sizing guesswork for most picks.',
    primaryCta: 'Shop Gifts For Her',
    secondaryCta: 'Golf Gifts Under $60',
    secondaryHref: '/golf-gifts-under-60',
    proof: ['No sizing risk on most picks', 'Useful for every skill level', 'Ships in clean packaging', 'WYX10 launch code'],
    faq: [
      ['What are the best golf gifts for women?', 'The best golf gifts for women are the same as for any golfer: a quality glove, a clean towel, a ball marker, and small bag accessories. Avoid novelty pink versions — go practical.'],
      ['Do I need to know her glove size?', 'For a glove, yes — ask for her dominant hand and approximate size. For everything else (towels, markers, scorecard holders, grip tape, tees), there is no sizing risk.'],
      ['Are alignment sticks a good gift for a woman golfer?', 'Yes — alignment sticks are the most universally useful practice tool in golf. No size, no style preference required. They go in the bag immediately.']
    ],
    match: (product) => under(product, 75) || categoryIn(product, ['Accessories', 'Towels', 'Gloves', 'Training Aids'])
  },
  'best-golf-accessories-2026': {
    slug: 'best-golf-accessories-2026',
    title: 'Best Golf Accessories 2026 — What Actually Stays In The Bag.',
    eyebrow: '2026 Picks',
    description: 'The best golf accessories for 2026 — bag markers, towels, gloves, grip tape, alignment sticks, and club-care gear that weekend golfers use every round.',
    metaTitle: 'Best Golf Accessories 2026 | WYX Golf Supply Co.',
    metaDescription: 'Shop the best golf accessories for 2026 from WYX Golf Supply Co. — ball markers, towels, gloves, alignment sticks, grip tape, and bag upgrades for weekend golfers.',
    primaryCta: 'Shop 2026 Picks',
    secondaryCta: 'Golf Gifts',
    secondaryHref: '/golf-gifts',
    proof: ['Practical over novelty', 'Under $60 most picks', 'Consumable & giftable', 'WYX10 launch code'],
    faq: [
      ['What are the best golf accessories for 2026?', 'The best golf accessories are the ones that stay in the bag for years: a quality glove, a clean towel, a milled ball marker, grip tape, and alignment sticks. These are practical, low-risk, and always welcome.'],
      ['What golf accessories should every golfer have?', 'Every bag should have: a clean towel, a reliable glove, ball markers, a divot tool, a tee supply, and a club brush. Most golfers are light on one or two of these — fill the gap.'],
      ['What golf accessories are good as gifts?', 'Ball markers, gloves, towels, grip tape, alignment sticks, and scorecard holders are all easy gift choices. Most have no sizing risk and go straight into the bag.']
    ],
    match: (product) => under(product, 100) && categoryIn(product, ['Accessories', 'Towels', 'Gloves', 'Grips', 'Club Care', 'Training Aids'])
  },
  'golf-gifts-under-25': {
    slug: 'golf-gifts-under-25',
    title: 'Golf Gifts Under $25 That Are Actually Good.',
    eyebrow: 'Budget Wins',
    description: 'Ball markers, grip tape, magnetic hat clips, and small bag essentials that make great stocking stuffers and add-on gifts — all under $25.',
    metaTitle: 'Golf Gifts Under $25 | WYX Golf Supply Co.',
    metaDescription: 'Shop golf gifts under $25 from WYX Golf Supply Co. — ball markers, grip tape, magnetic hat clips, and bag essentials. Great stocking stuffers for golfers.',
    primaryCta: 'Shop Under $25',
    secondaryCta: 'Under $60 Picks',
    secondaryHref: '/golf-gifts-under-60',
    proof: ['All under $25', 'Ships with other items', 'Great stocking stuffers', 'WYX10 launch code'],
    faq: [
      ['What are the best golf gifts under $25?', 'Ball markers, magnetic hat clips, grip tape rolls, and novelty golf balls are all great under $25. They get used every round and never collect dust.'],
      ['Are cheap golf gifts worth giving?', 'Yes — consumable golf accessories like markers and grip tape are always welcome. They are practical, not novelty, so they stay in the bag.'],
      ['Can I bundle under-$25 golf gifts?', 'Absolutely. Two or three small accessories bundled together feel more intentional than one item. Try a marker + grip tape + tee pack.']
    ],
    match: (product) => under(product, 25)
  },
  'golf-putting-mat': {
    slug: 'golf-putting-mat',
    title: 'Golf Putting Gear — Mirror, Mat, and Practice Tools That Work.',
    eyebrow: 'Putting Practice',
    description: 'Putting mirrors, practice aids, and setup tools for weekend golfers who want to fix their putting at home — no lesson required.',
    metaTitle: 'Golf Putting Mat & Putting Mirror | WYX Golf Supply Co.',
    metaDescription: 'Shop golf putting practice gear from WYX Golf Supply Co. — putting alignment mirrors and training aids for home use. Fix your setup in 15 minutes.',
    primaryCta: 'Shop Putting Gear',
    secondaryCta: 'All Training Aids',
    secondaryHref: '/golf-practice-gear',
    proof: ['Fix setup at home', 'Works on any surface', 'Pairs with any mat', 'WYX10 launch code'],
    faq: [
      ['Do putting mats actually improve your game?', 'Yes — specifically for alignment and distance control. Pair a mat with a putting mirror for the highest-leverage home practice setup in golf.'],
      ['What is a putting alignment mirror?', 'A putting mirror is a flat reflective surface you set on the ground at address. It shows your eye position, shoulder alignment, and putter face angle before you stroke — the three most common putting setup errors.'],
      ['Is a putting mirror a good golf gift?', 'Yes — it is practical, under $40, works on any surface, and addresses a real problem most golfers have. One of the best training aid gifts for any skill level.']
    ],
    match: (product) => categoryIn(product, ['Training Aids']) || has(product, /putting mirror|putting mat|putting aid|alignment mirror/)
  },
  'golf-grips': {
    slug: 'golf-grips',
    title: 'Golf Grips & Grip Tape — DIY Regripping Made Easy.',
    eyebrow: 'Grip Upgrade',
    description: 'Grip tape rolls, regripping supplies, and club-care gear for weekend golfers who want to regrip at home and stop paying shop rates every season.',
    metaTitle: 'Golf Grips & Grip Tape | WYX Golf Supply Co.',
    metaDescription: 'Shop golf grip tape and regripping supplies from WYX Golf Supply Co. — one roll covers a full set. DIY regripping under $20 including supplies.',
    primaryCta: 'Shop Grip Tape',
    secondaryCta: 'Club Care',
    secondaryHref: '/bag-upgrades',
    proof: ['One roll = full set', 'DIY in 45 minutes', 'Stops slipping immediately', 'WYX10 launch code'],
    faq: [
      ['How do I know when to regrip my golf clubs?', 'If your grips feel slick when dry, show shiny worn patches, or you are gripping tighter to compensate, it is time. Most golfers should regrip once a season.'],
      ['Can I regrip golf clubs at home?', 'Yes — you need grip tape, solvent (or paint thinner), a utility knife, and about 45 minutes. One roll of double-sided grip tape covers a full 14-club set.'],
      ['Is grip tape different from regular tape?', 'Golf grip tape is double-sided and designed to hold against sweat and repeated rotation. Regular tape degrades quickly. Use golf-specific tape for a lasting bond.']
    ],
    match: (product) => categoryIn(product, ['Grips', 'Club Care']) || has(product, /grip tape|regrip|grip solvent|club grip/)
  },
  'golf-gifts-for-coworkers': {
    slug: 'golf-gifts-for-coworkers',
    title: 'Golf Gifts For Coworkers That Land Every Time.',
    eyebrow: 'Office Ready',
    description: 'Practical golf accessories for office gifting — no sizing risk, under $60, ships in clean packaging. Works for any skill level from once-a-year scramble golfer to weekend regular.',
    metaTitle: 'Golf Gifts For Coworkers | WYX Golf Supply Co.',
    metaDescription: 'Shop golf gifts for coworkers from WYX Golf Supply Co. — ball markers, gloves, towels, and bag accessories under $60. No sizing required. Ships fast.',
    primaryCta: 'Shop Coworker Gifts',
    secondaryCta: 'Under $25 Picks',
    secondaryHref: '/golf-gifts-under-25',
    proof: ['No sizing on most picks', 'Ships fast and clean', 'Under $60 options', 'WYX10 launch code'],
    faq: [
      ['What is a good golf gift for a coworker?', 'The safest golf gifts are accessories with no sizing: ball markers, hat clips, grip tape, towels, and scorecard holders. All useful, all under $50, and none require knowing their preferences.'],
      ['How much should I spend on a golf gift for a coworker?', 'For a general office gift, $20–$35 is standard. For a closer colleague or manager, $40–$60 gives you room for a real bag upgrade.'],
      ['Can I get golf gifts shipped to an office?', 'Yes. WYX ships to any US address. Most orders arrive in 3–5 business days. Use WYX10 for 10% off your first order.']
    ],
    match: (product) => under(product, 60) && categoryIn(product, ['Accessories', 'Towels', 'Gloves', 'Headwear'])
  },
  'scramble-prize-ideas': {
    slug: 'scramble-prize-ideas',
    title: 'Scramble Prize Ideas That Players Actually Want.',
    eyebrow: 'Tournament Ready',
    description: 'Ball markers, towels, gloves, hats, and golf accessories that work for scramble prize tables, closest-to-the-pin awards, and group golf events.',
    metaTitle: 'Scramble Prize Ideas | Golf Tournament Prizes | WYX Golf Supply Co.',
    metaDescription: 'Shop scramble prize ideas from WYX Golf Supply Co. — towels, ball markers, gloves, hats, and golf accessories for tournament events and group golf weekends.',
    primaryCta: 'Shop Scramble Prizes',
    secondaryCta: 'Bachelor Party Gear',
    secondaryHref: '/bachelor-party-golf-gifts',
    proof: ['Easy to bulk buy', 'Under $60 most picks', 'Works for any handicap', 'WYX10 launch code'],
    faq: [
      ['What are good scramble prizes?', 'The best scramble prizes are universally useful: golf towels, ball marker sets, a sleeve of balls, a glove, or a simple hat. Avoid novelty items most players will leave behind.'],
      ['How much should I spend on scramble prizes?', 'Most scramble prizes land in the $15–$60 range. $20–$35 feels substantial without blowing the budget. A few premium anchors at $50–$75 for top finishes round out a good prize table.'],
      ['Can I buy scramble prizes in bulk from WYX?', 'Yes — add multiple units to your cart and use WYX10 for 10% off. Email support if you need a larger group order.']
    ],
    match: (product) => under(product, 75) || categoryIn(product, ['Accessories', 'Towels', 'Gloves', 'Headwear', 'Golf Balls'])
  }
};
