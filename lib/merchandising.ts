import { categoryFor } from '@/lib/catalog';
import type { Product } from '@/types/shopify';

const productText = (product: Product) => `${product.title} ${product.productType} ${(product.tags || []).join(' ')}`.toLowerCase();

const specificCopy: Record<string, string> = {
  'magnetic-cart-phone-mount': 'A cart-ready phone mount for keeping a device visible instead of loose in a cup holder or bag pocket.',
  'divot-board-swing-trainer': 'A compact practice surface designed to make strike-location and low-point work easier to see during practice.',
  'pop-up-chipping-net-3-target': 'A portable chipping target for adding structure to backyard or short-game practice.',
  'stance-alignment-towel': 'A towel-style practice aid that can help create visual setup and alignment references on the ground.',
  'silicone-cart-beverage-holder-2pack': 'A simple cart accessory for keeping compatible drink containers easier to organize during a round.',
  'extendable-ball-retriever-15ft': 'A collapsible retriever for reaching golf balls that would otherwise be difficult or unsafe to recover.',
  'portable-putting-arc-trainer': 'A compact putting practice guide for golfers who want a repeatable visual reference during stroke work.',
  'windproof-cart-umbrella-holder': 'A cart accessory designed to hold a compatible umbrella so your hands stay free when conditions change.'
};

export function productBuyerPromise(product: Product) {
  const category = categoryFor(product);
  const text = productText(product);
  if (specificCopy[product.handle]) return specificCopy[product.handle];
  if (product.handle === 'tri-fold-microfiber-golf-towel') return 'A compact microfiber towel for club faces, golf balls, grips, and everyday bag carry.';
  if (/golf bag/i.test(text)) return 'A full-bag storage upgrade for golfers who want a cleaner, more organized setup.';
  if (category === 'Headwear' || /hat|cap/.test(text)) return 'Course-ready headwear that can move from the range to the round to the rest of the weekend.';
  if (category === 'Apparel' || /shirt|polo|hoodie|belt/.test(text)) return 'Golf-oriented apparel for rounds, travel days, and the hours before or after the course.';
  if (category === 'Grips') return 'A grip-related upgrade for golfers refreshing the feel or organization of their current setup.';
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
  if (product.handle === 'tri-fold-microfiber-golf-towel') return ['Clips easily to many golf bags', 'Useful for club faces, golf balls, grips, and hands', 'Low-fuss item that can stay in the everyday bag'];
  if (/golf bag/i.test(text)) return ['Adds dedicated storage for a full golf setup', 'Useful for golfers reorganizing or replacing an older bag', 'Review the product configuration and dimensions before purchase'];
  if (category === 'Headwear' || /hat|cap/.test(text)) return ['Easy course-to-weekend use', 'Lower buying friction than club-specific equipment', 'Pairs naturally with towels, markers, gloves, and apparel'];
  if (category === 'Apparel' || /shirt|polo|hoodie|belt/.test(text)) return ['Built around golf and weekend wear', 'Review available sizing or variant options before purchase', 'Pairs naturally with headwear and bag accessories'];
  if (category === 'Grips') return ['Useful for refreshing an existing setup', 'Good fit for practice-week or maintenance purchases', 'Check compatibility and product options before use'];
  if (category === 'Golf Balls') return ['Easy bag restock', 'Useful for rounds, trips, and prize tables', 'Check the specific model and quantity before purchase'];
  if (category === 'Gloves') return ['Practical item golfers replace over time', 'Easy add-on to a bag-upgrade order', 'Confirm hand, size, and variant before purchase'];
  if (category === 'Towels') return ['Useful for clubs, golf balls, grips, and hands', 'Works for rounds, range sessions, and golf trips', 'Low sizing risk for gift buyers'];
  if (category === 'Training Aids') return ['Gives a practice session a specific focus', 'Compact enough for repeat use when the product format allows', 'Best results come from using it for one defined drill at a time'];
  if (category === 'Golf Tech') return ['Clear golf-specific use case', 'Review device features and compatibility before purchase', 'Best for golfers who will actually use the information during a round or practice'];
  if (category === 'Club Care') return ['Helps keep equipment cleaner between rounds', 'Easy to store with normal bag-maintenance gear', 'Use according to the product instructions and club-manufacturer guidance'];
  return ['Clear use case for a normal golf setup', 'Easy addition to a first WYX order', 'Review product details and variants before checkout'];
}

export function productBestFor(product: Product) {
  const category = categoryFor(product);
  const text = productText(product);
  if (product.handle === 'tri-fold-microfiber-golf-towel') return ['Weekend rounds', 'Range sessions', 'Golf gifts', 'A cleaner, more organized bag'];
  if (category === 'Headwear' || /hat|cap/.test(text)) return ['Weekend rounds', 'Golf trips', 'Golf gifts', 'Course-to-weekend style'];
  if (category === 'Apparel' || /shirt|polo|hoodie|belt/.test(text)) return ['Weekend golfers', 'Golf trips', 'Gift buyers who know the size', 'Course-to-weekend outfits'];
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
  const categoryQuestion: [string, string] = category === 'Headwear' || /hat|cap/.test(text)
    ? ['Is this a good golf gift?', 'Headwear can be a lower-risk golf gift than club-specific equipment. Review the available fit and size information before ordering.']
    : category === 'Apparel' || /shirt|polo|hoodie|belt/.test(text)
      ? ['How should I think about apparel sizing?', 'Review the product options and sizing information before purchase. If you are unsure, a non-sized accessory may be the safer gift.']
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
