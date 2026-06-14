/**
 * Multi-channel sales outreach — forums, groups, creators, platforms.
 *
 * Usage:
 *   npm run channel:outreach
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { fathersDayDaysLeft } from '../lib/fathersDay';

const GO = 'https://wyxgolfsupply.com/go?ref=outreach';
const GIFT = 'https://wyxgolfsupply.com/gift?ref=outreach';
const SHARE = 'https://wyxgolfsupply.com/share';
const daysLeft = fathersDayDaysLeft();

const channels = {
  reddit_golf: {
    subs: ['r/golf', 'r/GolfGear'],
    title: 'Built a small curated golf gift shop — looking for honest feedback on the Bag Upgrade Kit',
    body: `I got tired of golf gift sites selling novelty junk, so I launched WYX with one rule: would a weekend golfer keep it in the bag after round one?

Hero product is a 5-piece Bag Upgrade Kit (towel, marker, grip tape, groove tool, caddie). Father's Day is in ${daysLeft} days.

${GO} — code WYX10 for 10% off.

Not affiliate spam — genuinely want feedback from real golfers. What would you add or cut?`,
    rules: 'Read sub rules first. Value-first, no link drops in title on some subs.',
  },
  reddit_gift: {
    subs: ['r/Gifts', 'r/GiftIdeas'],
    title: `Father's Day golf gift under $80 — bag upgrade kit (${daysLeft} days left)`,
    body: `Shopping for a golfer who has everything? I built a kit of five practical bag upgrades (towel, marker, grip refresh, groove tool, organizer) instead of another polo.

${GIFT} — WYX10 saves 10% at checkout. Secure Shopify.`,
  },
  nextdoor: {
    title: 'Local golfer? New golf gift shop — Father\'s Day picks',
    body: `Launched WYX Golf Supply — curated accessories for weekend golfers (not Amazon novelty junk). Bag Upgrade Kit is the easy Father's Day pick. ${GO} — WYX10 for 10% off. Based locally, ships US.`,
  },
  facebook_groups: {
    title: 'Father\'s Day golf gift idea',
    body: `If anyone in the group is shopping for a golfer before June 21 — I launched a curated shop (WYX) focused on useful bag upgrades.

Best pick: Bag Upgrade Kit — towel, marker, grip tape, groove tool, caddie.
${GO}

WYX10 = 10% off. Would appreciate shares to golfers you know.`,
    targets: 'Search: "golf" + your city, alumni groups, dad groups, local buy/sell',
  },
  product_hunt: {
    tagline: 'Golf gifts that pass The Bag Test — practical bag upgrades, not novelty junk',
    description: `WYX Golf Supply curates ~93 golf accessories for weekend players and gift buyers. Every product passes one test: would you keep it in the bag after round one?

Launch offer: Bag Upgrade Kit + WYX10 (10% off first order).
${GO}`,
  },
  indie_hackers: {
    title: 'Launched a curated golf ecommerce shop — 0 → first 10 orders',
    body: `Building WYX Golf Supply in public. Shopify headless on Vercel, curated catalog (not 10k SKU dropship dump), hero bundle is the Weekend Golfer Bag Upgrade Kit.

Father's Day in ${daysLeft} days. Driving first sales via personal network + Meta ads.

Would love IH feedback: ${SHARE}`,
  },
  creator_dm: {
    subject: 'Bag Test kit for creators — free review?',
    body: `Hey [NAME] — Matthew from WYX Golf Supply. We curate golf gear weekend players actually keep in the bag.

Would you try our Bag Upgrade Kit on camera? Happy to send one for an honest Bag Test review — no script required.

Store: wyxgolfsupply.com/creators
Kit: ${GO}`,
  },
  golf_course_pro: {
    subject: 'Wholesale / pro shop inquiry — curated golf accessories',
    body: `Hi — Matthew from WYX Golf Supply Co. We stock curated golf accessories (towels, markers, gloves, training aids) that pass a simple retail test: weekend players keep them in the bag.

Interested in a small pro-shop test rack or tournament prize bundles? Reply with your shop name and we\'ll send a wholesale sheet.

${GO}`,
  },
};

async function main() {
  const dir = join(process.cwd(), 'data', 'channel-outreach');
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'channels.json'), JSON.stringify({ generatedAt: new Date().toISOString(), daysLeft, channels }, null, 2));

  const txt = [
    `WYX CHANNEL OUTREACH — ${new Date().toISOString().slice(0, 10)}`,
    `Father's Day: ${daysLeft} days`,
    '',
    '═══ REDDIT r/golf ═══',
    `Title: ${channels.reddit_golf.title}`,
    channels.reddit_golf.body,
    `Rules: ${channels.reddit_golf.rules}`,
    '',
    '═══ REDDIT r/Gifts ═══',
    `Title: ${channels.reddit_gift.title}`,
    channels.reddit_gift.body,
    '',
    '═══ NEXTDOOR ═══',
    channels.nextdoor.body,
    '',
    '═══ FACEBOOK GROUPS ═══',
    channels.facebook_groups.body,
    `Targets: ${channels.facebook_groups.targets}`,
    '',
    '═══ PRODUCT HUNT (draft) ═══',
    `Tagline: ${channels.product_hunt.tagline}`,
    channels.product_hunt.description,
    '',
    '═══ INDIE HACKERS ═══',
    `Title: ${channels.indie_hackers.title}`,
    channels.indie_hackers.body,
    '',
    '═══ CREATOR DM TEMPLATE ═══',
    channels.creator_dm.body,
    '',
    '═══ PRO SHOP EMAIL ═══',
    channels.golf_course_pro.body,
    '',
    '═══ LINKS ═══',
    `Kit: ${GO}`,
    `Gifts: ${GIFT}`,
    `Share hub: ${SHARE}`,
  ].join('\n');

  writeFileSync(join(dir, 'COPY-PASTE.txt'), txt);
  console.log(`\n📡 Channel outreach pack: ${dir}/COPY-PASTE.txt\n`);
}

main();