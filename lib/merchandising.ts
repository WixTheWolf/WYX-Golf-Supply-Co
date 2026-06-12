import { categoryFor } from '@/lib/catalog';
import type { Product } from '@/types/shopify';

const productText = (product: Product) => `${product.title} ${product.productType} ${(product.tags || []).join(' ')}`.toLowerCase();

const hiddenGemCopy: Record<string, string> = {
  'magnetic-cart-phone-mount': 'A magnetic cart phone mount that stops the every-hole bag dig — yardages and videos without the wobble.',
  'divot-board-swing-trainer': 'Instant swing-path feedback on the range, garage, or carpet — the training aid golfers buy after seeing one stripe.',
  'pop-up-chipping-net-3-target': 'Backyard short-game reps in 30 seconds — pop-up net with scoring targets, no range trip required.',
  'stance-alignment-towel': 'Alignment lines for practice, microfiber for the round — two tools in one towel.',
  'silicone-cart-beverage-holder-2pack': 'Two flexible cup holders that stop tumbler wobble on every cart frame.',
  'extendable-ball-retriever-15ft': 'Pond insurance that pays for itself on the first Pro V1 save.',
  'portable-putting-arc-trainer': 'Stroke-path guide for the living room carpet — putting feedback without a $300 lab.',
  'windproof-cart-umbrella-holder': 'Hands-free umbrella lock when the front nine turns into a monsoon.'
};

export function productBuyerPromise(product: Product) {
  const category = categoryFor(product);
  const text = productText(product);
  if (hiddenGemCopy[product.handle]) return hiddenGemCopy[product.handle];
  if (product.handle === 'tri-fold-microfiber-golf-towel') return 'A compact microfiber towel built for wet grips, clean club faces, and everyday bag carry.';
  if (/golf bag/i.test(text)) return 'A full-bag upgrade for golfers ready to carry their gear with more order and personality.';
  if (category === 'Headwear' || /hat|cap/.test(text)) return 'A course-ready golf hat that works for the range, the trip, and the weekend rotation.';
  if (category === 'Apparel' || /shirt|polo|hoodie|belt/.test(text)) return 'Wearable golf gear for players who want the cart to feel sharper than a random pro-shop rack.';
  if (category === 'Grips') return 'A simple grip refresh for better feel during range sessions and weekend rounds.';
  if (category === 'Golf Balls') return 'An easy ball restock for the next tee time, golf trip, or gift bag.';
  if (category === 'Gloves') return 'A small round-to-round upgrade for golfers who like a cleaner, more prepared bag.';
  if (category === 'Towels') return 'A practical towel upgrade for cleaner clubs, cleaner hands, and better bag habits.';
  if (category === 'Accessories') return 'A compact golf accessory that is easy to gift, easy to pack, and easy to keep in the bag.';
  return 'A useful golf product built to earn a regular spot in the bag, trip kit, or weekend golf rotation.';
}

export function productValueBullets(product: Product) {
  const category = categoryFor(product);
  const text = productText(product);
  if (product.handle === 'tri-fold-microfiber-golf-towel') return ['Clips easily to most golf bags', 'Helps keep clubs, balls, and hands clean during the round', 'Small enough to carry every day, useful enough to actually use'];
  if (/golf bag/i.test(text)) return ['Premium full-bag upgrade', 'Keeps gear organized for everyday rounds', 'Best for golfers ready to upgrade the whole setup'];
  if (category === 'Headwear' || /hat|cap/.test(text)) return ['Course-ready style without feeling overbuilt', 'Easy gift for golfers, dads, and trip groups', 'Pairs well with towels, markers, balls, and apparel'];
  if (category === 'Apparel' || /shirt|polo|hoodie|belt/.test(text)) return ['Wearable golf style for rounds, range days, and weekends', 'Strong cart builder with hats and bag accessories', 'Better gift profile than random novelty golf gear'];
  if (category === 'Grips') return ['Refresh your feel without replacing the bag', 'Easy add-on for range sessions and practice weeks', 'Pairs well with golf balls and markers'];
  if (category === 'Golf Balls') return ['Restock the bag before the next tee time', 'Useful gift for any golfer', 'Easy fit for trips and prize tables'];
  if (category === 'Gloves') return ['Small upgrade with real round-to-round utility', 'Keeps your bag better organized', 'Easy under-$60 golf gift'];
  if (category === 'Towels') return ['Keeps clubs, balls, and hands cleaner', 'Works for rounds, range sessions, and trip kits', 'Low-risk golf gift with real utility'];
  return ['Useful bag upgrade for everyday rounds', 'Easy golf gift', 'Built for real rounds, range sessions, and bag organization'];
}

export function productBestFor(product: Product) {
  const category = categoryFor(product);
  const text = productText(product);
  if (product.handle === 'tri-fold-microfiber-golf-towel') return ['Weekend rounds', 'Range sessions', 'Golf gifts under $25', 'Building a cleaner, more organized bag'];
  if (category === 'Headwear' || /hat|cap/.test(text)) return ['Weekend rounds', 'Golf trips', 'Golf gifts', 'Course-to-weekend style'];
  if (category === 'Apparel' || /shirt|polo|hoodie|belt/.test(text)) return ['Weekend golfers', 'Golf dads', 'Trip outfits', 'Cart-building apparel picks'];
  if (category === 'Club Care' || category === 'Towels') return ['Weekend rounds', 'Range sessions', 'Club care', 'Cleaner bag habits'];
  if (category === 'Accessories') return ['Weekend rounds', 'Golf gifts', 'Bag organization', 'Golf trips'];
  if (category === 'Golf Balls') return ['Weekend rounds', 'Range sessions', 'Golf gifts', 'Bag restocks'];
  if (category === 'Gloves' || category === 'Grips') return ['Weekend rounds', 'Range sessions', 'Golf gifts', 'Small bag upgrades'];
  return ['Weekend rounds', 'Range sessions', 'Golf gifts', 'Everyday bag upgrades'];
}

export function productFaq(product: Product) {
  const category = categoryFor(product);
  const text = productText(product);
  const categoryQuestion: [string, string] = category === 'Headwear' || /hat|cap/.test(text)
    ? ['Is this a good golf gift?', 'Yes. Golf hats are easy to gift because they add course-ready style without requiring club specs or complicated sizing.']
    : category === 'Apparel' || /shirt|polo|hoodie|belt/.test(text)
      ? ['How should I think about apparel sizing?', 'Review the product options before purchase. Apparel makes the best WYX cart when paired with a low-sizing-risk accessory like a towel, marker, or balls.']
      : category === 'Golf Balls'
        ? ['Who should buy golf balls as a gift?', 'Golf balls are a practical gift for almost any player because they get used, lost, and restocked often.']
        : category === 'Towels' || category === 'Club Care'
          ? ['Why buy club-care gear?', 'Clean clubs, dry grips, and a simple towel setup help the bag feel more prepared every round.']
          : ['Who is this best for?', 'This is best for weekend golfers, golf dads, trip groups, and gift shoppers who want useful gear with low buying friction.'];

  return [
    categoryQuestion,
    ['When will shipping show?', 'Shipping rates and delivery estimates are shown before payment.'],
    ['What if something arrives damaged or incorrect?', 'Contact WYX support with your order number and clear photos so we can help.'],
    ['Can I use the launch code?', 'Yes. Use WYX10 at checkout while the launch offer is active.']
  ];
}
