import { categoryFor } from '@/lib/catalog';
import { bagUpgradeProducts, tripProducts } from '@/lib/merchandisingFilters';
import { isPremiumGolfBag } from '@/lib/productQuality';
import type { Product } from '@/types/shopify';
import { extraIntentPages } from './intentPagesExtra';

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
  'golf-divot-tools': {
    slug: 'golf-divot-tools',
    title: 'Golf Divot Tools — The One Accessory Every Bag Needs.',
    eyebrow: 'Etiquette Essential',
    description: 'Magnetic divot tools with built-in ball markers — the most practical small golf accessory for the green, and one of the easiest golf gifts under $30.',
    metaTitle: 'Golf Divot Tools | WYX Golf Supply Co.',
    metaDescription: 'Shop golf divot tools from WYX Golf Supply Co. — magnetic divot tools with milled ball markers. Under $30 and one of the best small golf gifts.',
    primaryCta: 'Shop Divot Tools',
    secondaryCta: 'Ball Markers',
    secondaryHref: '/golf-ball-markers',
    proof: ['Magnetic ball marker included', 'Fork and plunger styles', 'Works for every golfer', 'WYX10 launch code'],
    faq: [
      ['What is a golf divot tool used for?', 'A divot tool repairs ball marks (pitch marks) on the putting green. Properly repaired marks recover in 24 hours. Unrepaired marks can take two weeks. Every golfer on every course needs one.'],
      ['What is the best golf divot tool?', 'A fork-style or plunger divot tool with a magnetic ball marker attachment covers two green tasks in one tool. It is the most practical setup — one item in the pocket, two jobs handled.'],
      ['Is a divot tool a good golf gift?', 'Yes — one of the best golf gifts under $25. No sizing, immediate utility, and golfers lose or misplace them constantly. A quality magnetic divot tool with a milled marker is a gift that goes in the bag and stays there.']
    ],
    match: (product) => has(product, /divot|pitch mark|ball mark repair|divot tool/)
  },
  'golf-gift-sets': {
    slug: 'golf-gift-sets',
    title: 'Golf Gift Sets — Curated Bundles That Feel Intentional.',
    eyebrow: 'Bundle & Save',
    description: 'Pre-built golf gift ideas across $30, $60, and $100 budgets — practical bag accessories, training aids, and apparel grouped for easy gifting.',
    metaTitle: 'Golf Gift Sets & Bundles | WYX Golf Supply Co.',
    metaDescription: 'Shop golf gift sets from WYX Golf Supply Co. — curated bundles across $30, $60, and $100 budgets for golfers. Use WYX10 for 10% off any order.',
    primaryCta: 'Shop Gift Sets',
    secondaryCta: 'Under $60 Picks',
    secondaryHref: '/golf-gifts-under-60',
    proof: ['Curated $30–$100 sets', 'Ships in clean packaging', 'No sizing on most picks', 'WYX10 launch code'],
    faq: [
      ['How do I build a golf gift set?', 'Pick 2–4 practical accessories in the same price tier: a ball marker, a towel, grip tape, and alignment sticks all work together. Avoid mixing novelty and practical items — it dilutes the intent.'],
      ['What is a good golf gift set under $60?', 'Golf towel + ball marker set + grip tape roll = under $60 at WYX. Three different bag needs, all practical, all immediately useful. Use WYX10 for an additional 10% off.'],
      ['Can I get gift sets shipped for Father\'s Day?', 'Yes — most WYX orders ship in 1–2 business days. Order by June 18 for standard delivery before Father\'s Day June 21.']
    ],
    match: (product) => Number(product.priceRange.minVariantPrice.amount) <= 100
  },
  'golf-ball-markers': {
    slug: 'golf-ball-markers',
    title: 'Golf Ball Markers That Stay In The Bag.',
    eyebrow: 'On The Green',
    description: 'Milled ball markers, magnetic hat clips, and accessory caddies for golfers who are done losing markers in their pockets every round.',
    metaTitle: 'Golf Ball Markers | WYX Golf Supply Co.',
    metaDescription: 'Shop golf ball markers from WYX Golf Supply Co. — milled markers, magnetic hat clips, and accessory caddies. Best small golf gifts under $35.',
    primaryCta: 'Shop Ball Markers',
    secondaryCta: 'Golf Gifts Under $25',
    secondaryHref: '/golf-gifts-under-25',
    proof: ['Stays on the brim', 'Milled flat profile', 'Great stocking stuffer', 'WYX10 launch code'],
    faq: [
      ['What is the best golf ball marker?', 'A milled flat marker with a magnetic hat clip is the most practical setup. The marker attaches to the brim, releases with one hand, and reattaches without looking. No more pocket searches on the green.'],
      ['Are ball markers a good gift?', 'Yes — one of the best sub-$35 golf gifts with zero sizing risk. Every golfer needs markers and they are always getting lost. A quality milled marker with a clip is a gift that goes in the bag and stays there.'],
      ['What is an accessory caddie?', 'A silicone loop that attaches to a golf glove and holds a ball marker and tee. Puts both where your hand already is — no pocket digging, no marker on the scorecard.']
    ],
    match: (product) => has(product, /ball marker|hat clip|magnetic marker|magnet caddie|accessory caddie|divot tool/)
  },
  'golf-headcovers': {
    slug: 'golf-headcovers',
    title: 'Golf Headcovers That Make A Statement.',
    eyebrow: 'Bag Personality',
    description: 'Driver headcovers, putter covers, and iron covers that protect your clubs while giving your bag a point of view. The most visible golf accessory on the course.',
    metaTitle: 'Golf Headcovers | WYX Golf Supply Co.',
    metaDescription: 'Shop golf headcovers from WYX Golf Supply Co. — driver covers and putter headcovers with bag personality. Great golf gifts that get seen every round.',
    primaryCta: 'Shop Headcovers',
    secondaryCta: 'Ball Markers',
    secondaryHref: '/golf-ball-markers',
    proof: ['Seen every hole', 'Driver + putter options', 'Statement piece', 'WYX10 launch code'],
    faq: [
      ['Why do I need a golf headcover?', 'A driver headcover prevents shaft-to-shaft contact in the bag on every cart ride. Over time, unprotected drivers develop finish wear and micro-scratches. A good headcover protects a $400+ investment for the cost of a dinner.'],
      ['Is a golf headcover a good gift?', 'Yes — especially for golfers with a clear aesthetic. A driver or putter cover is visible every hole and reflects the golfer\'s personality. Stick to neutral or statement-but-clean designs for gift buying.'],
      ['What is the difference between a driver and putter cover?', 'A driver cover fits the clubhead and part of the hosel, with a sock sleeve for the shaft. A putter cover (mallet or blade) fits just the head and is designed for the shape of the putter. Check putter shape before buying — mallets and blades are not interchangeable.']
    ],
    match: (product) => has(product, /headcover|head cover|putter cover|driver cover|iron cover/)
  },
  'golf-towels': {
    slug: 'golf-towels',
    title: 'Golf Towels That Actually Stay On The Bag.',
    eyebrow: 'Clean Every Shot',
    description: 'Loop-end, waffle-weave, and tri-fold golf towels built for real rounds — hang from any bag ring, clean every club face, and make the best small golf gifts that actually get used.',
    metaTitle: 'Golf Towels | WYX Golf Supply Co.',
    metaDescription: 'Shop golf towels from WYX Golf Supply Co. — loop-end microfiber and waffle-weave options for every bag. One of the best small golf gifts under $35.',
    primaryCta: 'Shop Golf Towels',
    secondaryCta: 'Ball Markers',
    secondaryHref: '/golf-gifts',
    proof: ['Hangs from any bag ring', 'Microfiber and waffle options', 'Great stocking stuffer', 'WYX10 launch code'],
    faq: [
      ['What is the best golf towel?', 'A loop-end microfiber towel with a grommet or carabiner attachment is the most practical setup. It hangs from the bag ring on both ends — wet end for cleaning, dry end for hands.'],
      ['Is a golf towel a good gift?', 'Yes — it is one of the most universally useful golf gifts. No sizing, immediate practical value, and every golfer needs one. Under $35 for most options.'],
      ['What size golf towel do I need?', '16x24 inches minimum. Larger covers more surface per use and holds up better in wet conditions. WYX towels are full-size and include a grommet clip.']
    ],
    match: (product) => categoryIn(product, ['Towels']) || has(product, /towel|golf towel|microfiber/)
  },
  'golf-belts': {
    slug: 'golf-belts',
    title: 'Golf Belts That Move With Your Swing.',
    eyebrow: 'On The Course',
    description: 'Stretch golf belts with low-profile buckles that stay put through 18 holes. The underrated bag upgrade most golfers never buy themselves — and one of the best gifts in the $30–$50 range.',
    metaTitle: 'Golf Belts | Stretch Golf Belts | WYX Golf Supply Co.',
    metaDescription: 'Shop stretch golf belts from WYX Golf Supply Co. — low-profile buckles, full hip rotation, fits every polo. Under $50 and one of the best golf gifts that gets used.',
    primaryCta: 'Shop Golf Belts',
    secondaryCta: 'Golf Apparel',
    secondaryHref: '/golf-apparel',
    proof: ['Stays put through 18 holes', 'Full hip rotation', 'Pairs with every polo', 'WYX10 launch code'],
    faq: [
      ['What is a stretch golf belt?', 'A stretch golf belt uses an elastic or woven stretch fabric with a low-profile non-slip buckle. It allows full hip rotation through the swing without binding at the waist — unlike rigid leather belts.'],
      ['What size golf belt do I need?', 'Most golfers wear belt size = pant size + 2 inches. For a 34-inch waist, buy a 36-inch belt. Stretch belts often have wider size ranges and more forgiveness.'],
      ['Is a golf belt a good gift?', 'Yes — it is practical, under $50, and something most golfers never prioritize for themselves. No sizing guesswork beyond the size range. One of the better mid-range golf gifts.']
    ],
    match: (product) => categoryIn(product, ['Accessories', 'Apparel']) || has(product, /belt|golf belt|stretch belt/)
  },
  'golf-travel-bag': {
    slug: 'golf-travel-bag',
    title: 'Golf Trip Gear — Pack Right, Play Better.',
    eyebrow: 'Trip Ready',
    description: 'Shoe bags, towels, club brushes, and bag accessories built for golf travel weekends — car trips, destination rounds, and bachelor party golf weekends.',
    metaTitle: 'Golf Travel Bag & Trip Gear | WYX Golf Supply Co.',
    metaDescription: 'Shop golf travel gear from WYX Golf Supply Co. — shoe bags, towels, scorecard holders, and trip accessories for golf weekends and destination rounds.',
    primaryCta: 'Shop Trip Gear',
    secondaryCta: 'Golf Trip Kits',
    secondaryHref: '/golf-trip-gear',
    proof: ['Packs in any travel bag', 'Keeps gear separated', 'Ships before your trip', 'WYX10 launch code'],
    faq: [
      ['What should I pack in a golf travel bag?', 'The essentials: a vented shoe bag, a clean towel, a club brush, a scorecard holder, extra tees, and a second glove. These cover every practical need for a 4-round trip without adding bulk.'],
      ['Do I need a special golf shoe bag?', 'Yes — a vented golf shoe bag keeps spikes away from clothes and lets moisture escape. Regular stuff sacks trap odor and moisture. Any golfer who travels more than twice a year should have one.'],
      ['What are the best golf gifts for a golf trip?', 'A shoe bag, a golf towel, and a scorecard holder make a practical trip gift bundle for under $80. Everything goes in the bag and gets used on day one.']
    ],
    match: (product) => categoryIn(product, ['Accessories', 'Towels', 'Club Care']) || has(product, /shoe bag|travel bag|trip gear|scorecard|club brush|towel/)
  },
  'best-golf-gifts-under-100': {
    slug: 'best-golf-gifts-under-100',
    title: 'Best Golf Gifts Under $100 — What Actually Gets Used.',
    eyebrow: 'Real Budget',
    description: 'Curated golf accessories under $100 — from $15 consumables to $75 rangefinders. Every pick earns a spot in the bag.',
    metaTitle: 'Best Golf Gifts Under $100 | WYX Golf Supply Co.',
    metaDescription: 'Shop golf gifts under $100 from WYX Golf Supply Co. — alignment sticks, putting mirrors, rangefinders, towels, gloves, and bag accessories for weekend golfers.',
    primaryCta: 'Shop Under $100',
    secondaryCta: 'Under $60 Picks',
    secondaryHref: '/golf-gifts-under-60',
    proof: ['Every pick under $100', 'No sizing on most picks', 'Practical over novelty', 'WYX10 launch code'],
    faq: [
      ['What are the best golf gifts under $100?', 'The best gifts in this range are layered by price: under $25 for consumables (markers, tees, grip tape), $25–$60 for bag upgrades (towel, alignment sticks, scorecard holder), and $60–$100 for skill tools (putting mirror + trainer combo or rangefinder).'],
      ['Is a rangefinder a good gift under $100?', 'Entry-level pin-seeker rangefinders can land under $100. They are the highest-impact purchase for a weekend golfer who wants actual yardages instead of estimates.'],
      ['Can I build a golf gift bundle under $100?', 'Yes. Towel + alignment sticks + scorecard holder + ball marker = under $90 at WYX. Use WYX10 for an additional 10% off your first order.']
    ],
    match: (product) => under(product, 100)
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
  'golf-gps-watch': {
    slug: 'golf-gps-watch',
    title: 'Golf GPS Watch — No Phone. No Fumbling. Just Yardage.',
    eyebrow: 'Golf Tech',
    description: 'A dedicated golf GPS watch with 40,000+ preloaded courses, front/middle/back yardages, and a full-round battery. No phone needed, no subscription, no excuses.',
    metaTitle: 'Golf GPS Watch | 40,000 Courses Preloaded | WYX Golf Supply Co.',
    metaDescription: 'Shop golf GPS watches at WYX Golf Supply Co. — 40,000+ courses, front/middle/back yardage, no phone required. Under $150 with free shipping.',
    primaryCta: 'Shop GPS Watches',
    secondaryCta: 'See All Golf Tech',
    secondaryHref: '/collections/golf-tech',
    proof: ['40,000+ courses loaded', 'No subscription fee', '18-hole battery life', 'WYX10 launch code'],
    faq: [
      ['Do golf GPS watches work without a phone?', 'Yes — a dedicated golf GPS watch has courses preloaded in internal memory. You don\'t need a phone, a signal, or an app. Turn it on at the first tee and it finds the course automatically.'],
      ['Is a GPS watch better than a rangefinder?', 'Rangefinders give more precise point-to-flag yardage. GPS watches are faster for front/middle/back distances and don\'t require aiming. Most casual golfers find GPS watches more practical for pace of play.'],
      ['How many courses are on a golf GPS watch?', 'The WYX GPS Watch includes 40,000+ worldwide courses preloaded — no download fees or subscriptions required. Most major US courses are included.']
    ],
    match: (product) => /gps watch|golf watch|golf gps|golf tech/i.test(`${product.title} ${product.productType} ${(product.tags || []).join(' ')}`)
  },
  'golf-sunglasses': {
    slug: 'golf-sunglasses',
    title: 'Golf Sunglasses That Actually Help You Track the Ball.',
    eyebrow: 'On-Course Gear',
    description: 'Polarized golf sunglasses with high-contrast lenses that cut glare off fairways and track the ball against blue sky. Wraparound fit. Under $50.',
    metaTitle: 'Golf Sunglasses Polarized | Ball Tracking | WYX Golf Supply Co.',
    metaDescription: 'Shop polarized golf sunglasses at WYX Golf Supply Co. — high-contrast lenses for ball tracking, UV400 protection, wraparound TR90 frame. Under $50.',
    primaryCta: 'Shop Golf Sunglasses',
    secondaryCta: 'See All Accessories',
    secondaryHref: '/collections/accessories',
    proof: ['High-contrast polarized lens', 'UV400 protection', 'Wraparound fit stays put', 'WYX10 launch code'],
    faq: [
      ['Are polarized sunglasses good for golf?', 'Yes — polarized lenses eliminate horizontal glare off fairways and water hazards. Choose a high-contrast tint like amber or brown rather than grey, which can reduce ball visibility against bright sky.'],
      ['What lens color is best for golf?', 'Amber and brown tints improve contrast and help you track a white ball against blue sky. Grey lenses reduce brightness but can make ball tracking harder.'],
      ['Can you wear regular sunglasses golfing?', 'You can, but a wraparound fit helps prevent wind and peripheral glare during the swing. Standard fashion frames often shift or create blind spots at the impact zone.']
    ],
    match: (product) => /sunglasses|golf eyewear|polarized/i.test(`${product.title} ${product.productType} ${(product.tags || []).join(' ')}`)
  },
  'golf-arm-sleeves': {
    slug: 'golf-arm-sleeves',
    title: 'Golf Arm Sleeves — UPF 50+ Sun Protection for Any Round.',
    eyebrow: 'Summer Essential',
    description: 'Lightweight UPF 50+ compression arm sleeves that block 98% of UV rays and stay cool via moisture-wicking fabric. Slip on in 10 seconds, skip the sunscreen reapplication.',
    metaTitle: 'Golf Arm Sleeves UPF 50+ | Sun Protection | WYX Golf Supply Co.',
    metaDescription: 'Shop golf arm sleeves with UPF 50+ sun protection at WYX Golf Supply Co. — moisture-wicking, 4-way stretch, machine washable. Under $20.',
    primaryCta: 'Shop Arm Sleeves',
    secondaryCta: 'See All Apparel',
    secondaryHref: '/collections/apparel',
    proof: ['UPF 50+ blocks 98% of UV', 'No reapplication needed', 'Machine washable', 'WYX10 launch code'],
    faq: [
      ['Do golf arm sleeves really block UV?', 'Yes — UPF 50+ fabric blocks 98% of UV-A and UV-B radiation for the entire round without reapplication. Sunscreen typically wears off after 80 minutes of sweating.'],
      ['Are golf arm sleeves hot?', 'Quality arm sleeves use moisture-wicking compression fabric that actually feels cooler than exposed skin in direct sun, because the fabric prevents solar heat from hitting skin directly.'],
      ['Can you wear arm sleeves under a golf glove?', 'Yes — most golf arm sleeves are designed to layer under a golf glove on the lead hand. The compression fabric is thin enough not to affect grip feel.']
    ],
    match: (product) => /arm sleeve|upf|sun protection/i.test(`${product.title} ${product.productType} ${(product.tags || []).join(' ')}`)
  },
  'golf-water-bottle': {
    slug: 'golf-water-bottle',
    title: 'Golf Water Bottle — Insulated, Cart-Holder Fit, 12 Hours Cold.',
    eyebrow: 'Course Essential',
    description: 'A 20 oz insulated tumbler designed to fit every cart cup holder, keep ice cold for 18 holes, and not sweat on your scorecard. The course accessory most golfers forget until they need it.',
    metaTitle: 'Golf Water Bottle Insulated | Cart Cup Holder Fit | WYX Golf Supply Co.',
    metaDescription: 'Shop insulated golf tumblers at WYX Golf Supply Co. — 20oz, fits all cart cup holders, ice-cold for 12+ hours, sweat-free exterior. Under $35.',
    primaryCta: 'Shop Golf Tumblers',
    secondaryCta: 'See All Accessories',
    secondaryHref: '/collections/accessories',
    proof: ['Fits all cart cup holders', 'Ice cold 12+ hours', 'Sweat-free exterior', 'WYX10 launch code'],
    faq: [
      ['What size water bottle fits a golf cart cup holder?', 'Standard golf cart cup holders fit containers up to 3.5 inches in diameter at the base. A 20 oz tumbler with a flat base is the most reliable fit — wide-mouth 32 oz bottles often don\'t fit.'],
      ['How do you keep drinks cold on the golf course?', 'Double-wall vacuum insulation is the only reliable method. Foam coolers, soft-sided coolers, and thin-wall bottles lose ice within a few holes on a hot day.'],
      ['Are insulated tumblers dishwasher safe?', 'The body is typically dishwasher safe, but the lid should be hand-washed to preserve the seal. Always check the manufacturer\'s care guide.']
    ],
    match: (product) => /tumbler|water bottle|insulated|cooler/i.test(`${product.title} ${product.productType} ${(product.tags || []).join(' ')}`)
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
  },
  'golf-rangefinder': {
    slug: 'golf-rangefinder',
    title: 'Golf Rangefinder — Know Your Yardage. Every Approach.',
    eyebrow: 'Golf Tech',
    description: 'A laser golf rangefinder with first-target priority flag lock, 6× magnification, and a slope-mode switch for tournament compliance. Under $130.',
    metaTitle: 'Golf Rangefinder | Laser Yardage | WYX Golf Supply Co.',
    metaDescription: 'Shop golf rangefinders at WYX Golf Supply Co. — first-target priority, slope mode with tournament switch, 6x magnification. Under $130 with free shipping.',
    primaryCta: 'Shop Rangefinders',
    secondaryCta: 'Compare GPS Watch',
    secondaryHref: '/golf-gps-watch',
    proof: ['First-target priority flag lock', 'Slope-mode tournament switch', '±1 yard accuracy', 'WYX10 launch code'],
    faq: [
      ['What is first-target priority on a rangefinder?', 'First-target priority (also called flag lock or pin-seeker mode) locks onto the closest target — the flagstick — rather than trees or background objects behind the green. It is the most important feature for golfers.'],
      ['Are slope rangefinders legal in tournaments?', 'Rangefinders with a lockable slope switch are tournament legal when slope is turned off. Pure slope-mode-only units are not allowed in USGA-governed events. When in doubt, check with the competition committee.'],
      ['Rangefinder vs GPS watch — which is better?', 'Rangefinders give more precise point-to-flag yardage (±1 yard). GPS watches give faster front/middle/back distances without aiming. Rangefinders win for approach accuracy; GPS watches win for pace of play.']
    ],
    match: (product) => /rangefinder|laser rangefinder/i.test(`${product.title} ${product.productType} ${(product.tags || []).join(' ')}`)
  },
  'golf-gifts-for-boss': {
    slug: 'golf-gifts-for-boss',
    title: 'Golf Gifts for Your Boss — Professional, Useful, On Budget.',
    eyebrow: 'Corporate Golf Gift',
    description: 'Golf gifts that work for bosses, clients, and colleagues — practical accessories at professional price points that ship gift-ready without overthinking it.',
    metaTitle: 'Golf Gifts for Boss | Corporate Golf Gifts | WYX Golf Supply Co.',
    metaDescription: 'Shop corporate golf gifts at WYX Golf Supply Co. — leather scorecard holders, ball marker sets, towels, and accessories that ship gift-ready. Under $75.',
    primaryCta: 'Shop Corporate Golf Gifts',
    secondaryCta: 'See All Accessories',
    secondaryHref: '/collections/accessories',
    proof: ['Ships gift-ready', 'Under $75 most picks', 'No sizing required', 'WYX10 launch code'],
    faq: [
      ['What is a good golf gift for a boss?', 'Stay practical and universal. A leather scorecard holder, a milled ball marker set, a quality towel, or a club brush set all work regardless of handicap or bag setup. Avoid personalization unless you know their preference.'],
      ['How much should I spend on a golf gift for my boss?', 'For a casual office context, $25–$50 is the right range. For a client or senior executive, $50–$100 feels appropriate. Above $100, the gift starts to feel more personal than professional.'],
      ['Do golf gifts need to be personalized?', 'No — unpersonalized accessories are safer corporate gifts because they do not require sizing or style assumptions. A leather scorecard holder in kraft gift packaging looks intentional without needing a monogram.']
    ],
    match: (product) => under(product, 100) || categoryIn(product, ['Accessories', 'Towels', 'Gloves'])
  },
  'golf-accessories-for-beginners': {
    slug: 'golf-accessories-for-beginners',
    title: 'Golf Accessories for Beginners — What to Buy First.',
    eyebrow: 'Starter Gear',
    description: 'The golf accessories every new golfer needs first: consumables for the first 10 rounds, course-etiquette essentials, and the one training aid worth buying before anything else.',
    metaTitle: 'Golf Accessories for Beginners | Starter Golf Gear | WYX Golf Supply Co.',
    metaDescription: 'Shop beginner golf accessories at WYX Golf Supply Co. — gloves, tees, ball markers, divot tools, towels, and starter training aids. Under $80 for the full set.',
    primaryCta: 'Shop Starter Gear',
    secondaryCta: 'See All Accessories',
    secondaryHref: '/collections/accessories',
    proof: ['No experience needed', 'Under $80 full starter set', 'Ships in 2–4 days', 'WYX10 launch code'],
    faq: [
      ['What accessories does a beginner golfer need?', 'The essential five: a golf glove (1), a pack of tees (2), a ball marker (3), a divot tool (4), and a clip-on towel (5). These cover the basics for every round and cost under $50 combined.'],
      ['Do beginners need a rangefinder?', 'Not at first. Learn yardages from course markers and GPS apps before adding a rangefinder. The money is better spent on a lesson or a sleeve of better balls for the first 20 rounds.'],
      ['What is the best training aid for a new golfer?', 'A putting alignment mirror gives the fastest visible feedback and costs under $30. Fix your eye position first — it is the root of most missed putts for new players.']
    ],
    match: (product) => under(product, 60) || categoryIn(product, ['Gloves', 'Golf Balls', 'Accessories', 'Training Aids', 'Towels'])
  },
  'golf-tech-gifts': {
    slug: 'golf-tech-gifts',
    title: 'Golf Tech Gifts — Rangefinders, GPS Watches, and Phone Mounts.',
    eyebrow: 'Golf Tech',
    description: 'The golf technology products that actually improve rounds — laser rangefinders, GPS watches, and waterproof phone mounts. Ranked by real-round impact, not spec sheets.',
    metaTitle: 'Golf Tech Gifts | Rangefinder GPS Watch | WYX Golf Supply Co.',
    metaDescription: 'Shop golf tech gifts at WYX Golf Supply Co. — laser rangefinders, GPS watches, waterproof phone mounts. Under $150 each. Free shipping over $50.',
    primaryCta: 'Shop Golf Tech',
    secondaryCta: 'Compare GPS vs Rangefinder',
    secondaryHref: '/golf-rangefinder',
    proof: ['Rangefinder under $130', 'GPS watch under $150', 'Phone mount $28', 'WYX10 launch code'],
    faq: [
      ['What golf tech is actually worth buying?', 'In order of impact: (1) rangefinder or GPS watch for yardage, (2) waterproof phone mount for app access on the cart, (3) swing tempo trainer for practice sessions. Everything else is bonus.'],
      ['Is a rangefinder or GPS watch better for golf?', 'Rangefinders win on precision — accurate to ±1 yard with flag lock. GPS watches win on speed — no aiming, just a glance. Casual golfers usually prefer GPS watches. Precision players prefer rangefinders.'],
      ['What is a good golf tech gift under $150?', 'The WYX GPS Watch (40,000 courses, 18-hole battery, $149) or the WYX Rangefinder (flag lock, slope switch, $129). Both include a carrying case and use WYX10 for 10% off.']
    ],
    match: (product) => categoryIn(product, ['Golf Tech'])
  },
  'golf-gifts-for-golfers-who-have-everything': {
    slug: 'golf-gifts-for-golfers-who-have-everything',
    title: 'Golf Gifts for Golfers Who Have Everything.',
    eyebrow: 'Gift Guide',
    description: 'Premium consumables, category upgrades, and tech picks for the golfer who already has every club and bag — the products avid golfers know they need but never buy for themselves.',
    metaTitle: 'Golf Gifts for Golfers Who Have Everything | WYX Golf Supply Co.',
    metaDescription: 'Shop golf gifts for golfers who have everything at WYX. Consumables, GPS watches, groove sharpeners, grip kits — upgrades they know they need but never buy. Free shipping over $50.',
    primaryCta: 'Shop All Picks',
    secondaryCta: 'See Golf Tech',
    secondaryHref: '/golf-tech-gifts',
    proof: ['Premium consumables', 'Upgrades they skipped', 'Under $200 bundles', 'WYX10 launch code'],
    faq: [
      ['What do you get a golfer who has everything?', 'Consumables and maintenance gear. Every golfer runs out of gloves, tees, and balls. And most avid golfers have never bought a groove sharpener, a bag organizer, or a grip kit for themselves — even though they know the value.'],
      ['Is a GPS watch a good gift for an avid golfer?', 'Yes — dedicated golf GPS watches are different from smartwatches. They load 40,000+ courses without an app, auto-advance holes, and last a full round on a single charge. Avid golfers who do not already have one will use it every round.'],
      ['What is a good high-end golf gift?', 'A leather scorecard holder + milled ball marker set in gift packaging makes a premium impression under $100. A GPS watch or rangefinder hits the $130–$150 range. A full grip kit or groove restoration set is a working gift under $50.']
    ],
    match: (product) => categoryIn(product, ['Golf Tech', 'Club Care', 'Accessories']) || under(product, 150)
  },
  'golf-gifts-under-150': {
    slug: 'golf-gifts-under-150',
    title: 'Golf Gifts Under $150 — Tech, Gear, and Upgrades Worth Giving.',
    eyebrow: 'Gift Guide',
    description: 'The best golf gifts in the $75–$150 range — GPS watches, rangefinders, leather accessories, and bag upgrades that feel premium without going overboard.',
    metaTitle: 'Golf Gifts Under $150 | Premium Golf Gifts | WYX Golf Supply Co.',
    metaDescription: 'Shop golf gifts under $150 at WYX Golf Supply Co. — GPS watches, rangefinders, leather scorecard holders, and bag upgrades. Free shipping over $50.',
    primaryCta: 'Shop Gifts Under $150',
    secondaryCta: 'See Gifts Under $60',
    secondaryHref: '/golf-gifts-under-60',
    proof: ['GPS watch $149', 'Rangefinder $129', 'Leather gifts $42–$68', 'WYX10 launch code'],
    faq: [
      ['What are good golf gifts in the $75–$150 range?', 'The sweet spot for premium golf gifts: a dedicated GPS watch ($149), a laser rangefinder with slope ($129), a leather scorecard holder set ($54–$68), or a full grip regrip kit bundled with a groove sharpener. All are products avid golfers know they want but rarely buy themselves.'],
      ['Is a $150 golf GPS watch worth it?', 'Yes — a dedicated golf GPS watch with 40,000+ preloaded courses is one of the highest-use golf purchases. Avid golfers use it every round. Unlike a phone GPS app, it does not require a signal, drain a phone battery, or require aiming.'],
      ['What golf gift impresses a serious golfer?', 'Tech and maintenance gear impress serious golfers because they signal understanding of the game. A rangefinder, groove sharpener, or grip kit says you know what actually makes golf better — not just what looks golf-branded.']
    ],
    match: (product) => under(product, 150) && !under(product, 40)
  },
  'golf-club-care': {
    slug: 'golf-club-care',
    title: 'Golf Club Care — Maintain Your Clubs Between Rounds.',
    eyebrow: 'Club Maintenance',
    description: 'The club care products that extend equipment life and restore performance — groove sharpeners, club brushes, grip kits, and what to do between every round.',
    metaTitle: 'Golf Club Care | Groove Sharpener Club Brush | WYX Golf Supply Co.',
    metaDescription: 'Shop golf club care at WYX Golf Supply Co. — groove sharpeners, club brushes, grip tape, and regrip kits that restore spin and control. Under $30 most picks.',
    primaryCta: 'Shop Club Care',
    secondaryCta: 'See Bag Upgrades',
    secondaryHref: '/bag-upgrades',
    proof: ['Restore wedge spin $22', 'Regrip full set $26', 'Club brush under $15', 'WYX10 launch code'],
    faq: [
      ['How often should you clean golf clubs?', 'Ideally after every round — dirt and grass in grooves reduces spin immediately. A clip-on club brush takes 5 seconds per club. A full soak-and-scrub with warm soapy water once a month for irons and wedges.'],
      ['How often should golf grips be replaced?', 'Most teaching professionals recommend regripping once a year for golfers playing 30+ rounds, or every 40 rounds. Grips that feel slick or shiny under the rain have lost their texture and are affecting your stroke.'],
      ['Does sharpening golf grooves really help?', 'Yes — for wedges and short irons used around the green. A groove sharpener restores the sharp edge that creates backspin. It is legal for recreational play and extends wedge life 2–3 seasons before replacement is necessary.']
    ],
    match: (product) => categoryIn(product, ['Club Care']) || /brush|groove|grip tape|solvent|regrip/i.test(`${product.title} ${product.productType} ${(product.tags || []).join(' ')}`)
  },
  ...extraIntentPages
};
