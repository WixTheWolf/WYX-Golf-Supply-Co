import { categoryFor } from '@/lib/catalog';
import type { Product } from '@/types/shopify';

const productText = (product: Product) => `${product.title} ${product.productType} ${(product.tags || []).join(' ')}`.toLowerCase();

const beltHandles = new Set([
  'volcanic-ash', 'sahara-sunset', 'black-birdie', 'twister-grey', 'crimson-dune',
  'mossy-condor', 'bone-dry', 'sea-swell-blue', 'gray-eyed-gator', 'charcoal-mirage', 'bayou-brown-gator'
]);

const specificCopy: Record<string, string> = {
  'pimento-waffle': 'A textured golf layer with more character than another corporate quarter-zip — easy for a cool tee time, a travel day, or the hours after the round.',
  'hello-friends-t-shirt': 'A relaxed golf-culture tee for the off-course side of the game — the kind of piece that belongs on a trip, at the clubhouse, or anywhere a polo would feel like too much effort.',
  'looper': 'A golf-lifestyle tee that keeps the reference subtle and the outfit easy — better with shorts, pants, or under a light layer than another oversized course logo.',
  'legalize-mulligans': 'A graphic golf tee with an actual point of view — built for golf trips, casual rounds, and the part of the day when nobody is pretending the scorecard still matters.',
  'evil-ape': 'A conversation-starting golf piece for the player who wants the bag to have some personality without turning it into a costume.',
  'guerrilla-chief-driver-cover': 'A driver cover with enough personality to change the look of the whole bag while still doing the basic job well: protecting the club you reach for most.',
  'dude-abides-v2-mallet-putter-cover': 'A mallet cover with a point of view — easy to gift, easy to spot, and a lot more memorable than another plain black putter cover.',
  'mafia-mallet-putter-cover': 'A mallet putter cover that turns a practical piece of protection into one of the most visible personality pieces in the bag.',
  'topographic-carolina-blue-driver-headcover': 'A clean topographic driver cover for golfers who want the bag to look more considered without going full novelty.',
  'augusta-bear-hat': 'Course-ready headwear with enough personality to live in the regular weekend rotation after the round is over.',
  'golf-or-die-game-set': 'A golf-group add for trips and casual rounds when the point is not only the score — it gives the foursome something else to talk about all day.',
  'dartee-golf-glove': 'An everyday golf essential with enough visual identity to feel intentional instead of disposable.',
  'park-paisley-womens-gold-golf-glove': 'A golf glove that treats a round-to-round essential like something worth making visually interesting.',
  'stick-grips-golf-camo-golf-grip': 'A grip option for the golfer who wants function at the hands and a little more personality in the setup.',
  'tri-fold-microfiber-golf-towel': 'A compact everyday towel for club faces, golf balls, grips, and wet rounds — the kind of unglamorous piece that earns its place by getting used.',
  'blue-ridge-golf-co-golf-towels': 'A better-looking towel option for the golfer who wants the basic bag utility without making the setup look generic.',
  'magnet-caddie': 'A clean quick-access solution for gloves and small bag gear that you would rather not dig through a pocket to find.',
  'glove-accessory-caddie-black': 'A dedicated parking spot for gloves and small accessories so the useful stuff stays visible instead of disappearing into the bag.',
  'three-rail-ball-marker': 'A small green-side essential with enough visual identity to feel like a real golf gift instead of checkout-line filler.',
  'two-sided-metal-golf-ball-marker-5-color-combo-pack': 'Five two-sided markers for the golfer who likes options, loses one occasionally, or needs an easy small gift for the group.',
  'bamboo-performance-golf-tees-50-pack': 'A straightforward tee restock that belongs in the supporting cast of a good golf bag — inexpensive, useful, and easy to throw into an order.',
  'magnetic-cart-phone-mount': 'A cart-ready phone mount for keeping a device visible instead of loose in a cup holder or bag pocket.',
  'divot-board-swing-trainer': 'A compact practice surface designed to make strike-location and low-point work easier to see during practice.',
  'pop-up-chipping-net-3-target': 'A portable chipping target for adding structure to backyard or short-game practice.',
  'stance-alignment-towel': 'A towel-style practice aid that can help create visual setup and alignment references on the ground.'
};

const specificValueBullets: Record<string, string[]> = {
  'pimento-waffle': ['Adds texture without relying on a loud logo', 'Works naturally in the golf-trip rotation', 'Available sizes are shown before checkout'],
  'hello-friends-t-shirt': ['Easy off-course golf piece', 'Simple layer for travel days and casual golf weekends', 'Choose from the currently available sizes'],
  'looper': ['Subtle golf-culture styling', 'Easy to wear beyond the course', 'Review live size availability before ordering'],
  'legalize-mulligans': ['Graphic golf personality without looking like pro-shop merch', 'Made for the casual side of the game', 'Review live size availability before ordering'],
  'evil-ape': ['Makes a visible part of the bag feel personal', 'Easy gift for the golfer who already owns the basics', 'No sizing or club-fitting decision required'],
  'guerrilla-chief-driver-cover': ['Protects the driver while adding bag personality', 'High-visibility upgrade you notice every round', 'Easy gift when you know the player uses a standard driver'],
  'dude-abides-v2-mallet-putter-cover': ['Built for a mallet-style putter', 'Turns protection into a personality piece', 'A memorable golf-trip or birthday gift when putter shape is known'],
  'augusta-bear-hat': ['Works on the course and after the round', 'Easy personality piece without touching equipment setup', 'Review available fit options before ordering'],
  'golf-or-die-game-set': ['Built for golf groups and trip rounds', 'Adds something social without changing the actual game', 'A memorable group gift or trip-table addition'],
  'dartee-golf-glove': ['Useful round-to-round golf gear', 'Adds a little more personality at the hands', 'Confirm hand and size before purchase'],
  'park-paisley-womens-gold-golf-glove': ['A more expressive take on an everyday golf essential', 'Useful for rounds and practice sessions', 'Confirm hand and size before purchase'],
  'tri-fold-microfiber-golf-towel': ['Clips easily to many golf bags', 'Useful for club faces, golf balls, grips, and hands', 'Low-fuss item that can stay in the everyday bag'],
  'blue-ridge-golf-co-golf-towels': ['Useful every round without looking like generic range gear', 'Easy gift with no sizing decision', 'Works for clubs, golf balls, grips, and wet conditions'],
  'magnet-caddie': ['Keeps quick-access gear outside the bag pocket', 'Small footprint with an obvious on-course job', 'Easy add-on to a bag-upgrade order'],
  'glove-accessory-caddie-black': ['Gives gloves and small accessories a dedicated home', 'Helps keep useful gear visible and easier to grab', 'Simple bag-organization upgrade with no sizing risk'],
  'three-rail-ball-marker': ['Small enough to live in the bag permanently', 'Useful on every putting green', 'Easy gift or prize-table piece'],
  'two-sided-metal-golf-ball-marker-5-color-combo-pack': ['Five markers in one purchase', 'Useful for the bag, foursome, or gift drawer', 'No size or fit decision required'],
  'bamboo-performance-golf-tees-50-pack': ['Fifty-tee bag restock', 'Simple consumable add-on for a larger order', 'No fit decision for normal tee use']
};

function beltCopy(product: Product) {
  const title = product.title.replace(/golf belt/i, '').trim();
  return `A Dartee golf belt that gives a clean golf outfit one stronger finishing piece. ${title || 'This colorway'} is for the golfer who would rather add texture and color than another oversized logo.`;
}

export function productBuyerPromise(product: Product) {
  const category = categoryFor(product);
  const text = productText(product);
  if (specificCopy[product.handle]) return specificCopy[product.handle];
  if (beltHandles.has(product.handle) || /\bbelt\b/.test(text)) return beltCopy(product);
  if (/golf bag/i.test(text)) return 'A full-bag storage upgrade for golfers who want a cleaner, more organized setup.';
  if (category === 'Headwear' || /hat|cap/.test(text)) return 'Course-ready headwear that can move from the range to the round to the rest of the weekend.';
  if (/shirt|t-shirt|tee shirt|polo|hoodie|waffle|layer|pullover|quarter zip|outerwear/.test(text)) return 'A golf-lifestyle piece selected to look intentional on the course without feeling trapped there.';
  if (category === 'Apparel') return 'A finishing piece selected to give the golf wardrobe more personality without turning it into a costume.';
  if (category === 'Grips') return 'A grip-related upgrade for golfers refreshing the feel or look of their current setup.';
  if (category === 'Golf Balls') return 'A straightforward ball restock for the next round, golf trip, or gift bag.';
  if (category === 'Gloves') return 'A practical round-to-round item for golfers who like keeping the bag ready for the next tee time.';
  if (category === 'Towels') return 'A useful towel upgrade for cleaning gear and managing moisture during the round.';
  if (category === 'Training Aids') return 'A practice tool with a clear job, designed to make a range, putting, or at-home session more intentional.';
  if (category === 'Golf Tech') return 'Golf technology with a defined on-course or practice purpose instead of another gadget with no place in the routine.';
  if (category === 'Club Care') return 'Compact club-care gear for keeping equipment cleaner and easier to maintain between rounds.';
  if (category === 'Accessories') return 'A compact golf accessory selected for a clear use case in the bag, on the cart, or during a golf trip.';
  return 'A useful golf product selected to earn a regular spot in the bag, trip kit, or weekend golf routine.';
}

export function productValueBullets(product: Product) {
  const category = categoryFor(product);
  const text = productText(product);
  if (specificValueBullets[product.handle]) return specificValueBullets[product.handle];
  if (beltHandles.has(product.handle) || /\bbelt\b/.test(text)) return ['A stronger finishing piece than another logo', 'Designed to work with an otherwise clean golf outfit', 'Review the live product options before checkout'];
  if (/golf bag/i.test(text)) return ['Adds dedicated storage for a full golf setup', 'Useful for golfers reorganizing or replacing an older bag', 'Review the product configuration and dimensions before purchase'];
  if (category === 'Headwear' || /hat|cap/.test(text)) return ['Easy course-to-weekend use', 'Lower buying friction than club-specific equipment', 'Pairs naturally with apparel and bag accessories'];
  if (category === 'Apparel' || /shirt|polo|hoodie|waffle|layer|pullover/.test(text)) return ['Chosen for golf and the rest of the weekend', 'Review current sizing and variants before purchase', 'Build the outfit first, then finish it with headwear or bag gear'];
  if (category === 'Grips') return ['Useful for refreshing an existing setup', 'Good fit for practice-week or maintenance purchases', 'Check compatibility and product options before use'];
  if (category === 'Golf Balls') return ['Easy bag restock', 'Useful for rounds, trips, and prize tables', 'Check the specific model and quantity before purchase'];
  if (category === 'Gloves') return ['Practical item golfers replace over time', 'Easy add-on to an apparel or bag order', 'Confirm hand, size, and variant before purchase'];
  if (category === 'Towels') return ['Useful for clubs, golf balls, grips, and hands', 'Works for rounds, range sessions, and golf trips', 'Low sizing risk for gift buyers'];
  if (category === 'Training Aids') return ['Gives a practice session a specific focus', 'Compact enough for repeat use when the format allows', 'Best results come from using it for one defined drill at a time'];
  if (category === 'Golf Tech') return ['Clear golf-specific use case', 'Review device features and compatibility before purchase', 'Best for golfers who will actually use the information during a round or practice'];
  if (category === 'Club Care') return ['Helps keep equipment cleaner between rounds', 'Easy to store with normal bag-maintenance gear', 'Use according to the product instructions and club-manufacturer guidance'];
  return ['Clear use case for a normal golf setup', 'Easy addition to a first WYX order', 'Review product details and variants before checkout'];
}

export function productBestFor(product: Product) {
  const category = categoryFor(product);
  const text = productText(product);
  if (product.handle === 'tri-fold-microfiber-golf-towel') return ['Weekend rounds', 'Range sessions', 'Golf gifts', 'A cleaner, more organized bag'];
  if (beltHandles.has(product.handle) || /\bbelt\b/.test(text)) return ['Golf outfits', 'Golf trips', 'Course-to-weekend style', 'A cleaner look with one statement piece'];
  if (category === 'Headwear' || /hat|cap/.test(text)) return ['Weekend rounds', 'Golf trips', 'Golf gifts', 'Course-to-weekend style'];
  if (category === 'Apparel' || /shirt|polo|hoodie|waffle|layer|pullover/.test(text)) return ['Weekend golfers', 'Golf trips', 'Travel days', 'Course-to-weekend outfits'];
  if (category === 'Club Care' || category === 'Towels') return ['Weekend rounds', 'Range sessions', 'Club care', 'Better bag-maintenance habits'];
  if (category === 'Training Aids') return ['Range sessions', 'At-home practice when appropriate', 'Golfers who like structured drills', 'Practice-focused gifts'];
  if (category === 'Golf Tech') return ['On-course information', 'Practice feedback', 'Golf trips', 'Tech-oriented golfers'];
  if (category === 'Accessories') return ['Weekend rounds', 'Golf gifts', 'Bag organization', 'Golf trips'];
  if (category === 'Golf Balls') return ['Weekend rounds', 'Golf trips', 'Golf gifts', 'Bag restocks'];
  if (category === 'Gloves' || category === 'Grips') return ['Weekend rounds', 'Practice sessions', 'Golf gifts', 'Small bag upgrades'];
  return ['Weekend rounds', 'Practice', 'Golf gifts', 'Everyday bag upgrades'];
}

export function productFaq(product: Product) {
  const category = categoryFor(product);
  const text = productText(product);
  const categoryQuestion: [string, string] = beltHandles.has(product.handle) || /\bbelt\b/.test(text)
    ? ['How do I confirm fit?', 'Review the live Shopify options shown on this page before ordering. If the product does not show a size choice and you need fit confirmation, contact WYX support before checkout.']
    : category === 'Headwear' || /hat|cap/.test(text)
      ? ['Is this a good golf gift?', 'Headwear can be a lower-risk golf gift than club-specific equipment. Review the available fit and size information before ordering.']
      : category === 'Apparel' || /shirt|polo|hoodie|waffle|layer|pullover/.test(text)
        ? ['How should I choose a size?', 'Use the live size options on the product page as the source of truth. Sold-out sizes are not selectable; if you are between sizes or need exact garment measurements, contact WYX before ordering.']
        : category === 'Golf Balls'
          ? ['Who should buy golf balls as a gift?', 'Golf balls are a practical gift when you know the golfer will use the specific model or type offered on the product page.']
          : category === 'Towels' || category === 'Club Care'
            ? ['Why buy club-care gear?', 'Towels and basic club-care tools make it easier to keep equipment clean and the bag organized between rounds.']
            : category === 'Training Aids'
              ? ['How should I use a training aid?', 'Pick one drill or practice goal and use the aid consistently for that purpose. A tool is most useful when it supports a clear practice plan.']
              : ['Who is this best for?', 'This is aimed at golfers and gift shoppers who want useful gear with a clear place in a normal golf setup.'];

  return [
    categoryQuestion,
    ['When will shipping show?', 'Shipping rates and current delivery estimates are shown before payment.'],
    ['What if something arrives damaged or incorrect?', 'Contact WYX support with your order number and clear photos so we can help.'],
    ['How does WYX10 work?', 'The WYX cart requests WYX10 automatically. Shopify confirms whether the first-order offer applies before payment.']
  ];
}
