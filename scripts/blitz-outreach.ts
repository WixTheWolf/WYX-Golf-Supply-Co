/**
 * Sales blitz pack — copy-paste texts, posts, and emails for first orders.
 *
 * Usage:
 *   npm run blitz:outreach
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { fathersDayDaysLeft } from '../lib/fathersDay';

const KIT = 'https://wyxgolfsupply.com/weekend-golfer-bag-upgrade-kit?discount=WYX10';
const SHORT = 'https://wyxgolfsupply.com/go?ref=personal';
const FATHERS = 'https://wyxgolfsupply.com/fathers-day-golf-gifts?discount=WYX10';
const OPEN = 'https://wyxgolfsupply.com/open?ref=personal';

const daysLeft = fathersDayDaysLeft();

const texts = [
  {
    audience: 'Golfer you know',
    message: `Hey — I launched a golf gift shop (WYX). Built a Bag Upgrade Kit with towel, marker, grip tape, groove tool + caddie. Father's Day is in ${daysLeft} days if you need a gift idea. WYX10 = 10% off: ${SHORT}`,
  },
  {
    audience: 'Gift buyer (non-golfer)',
    message: `Quick favor — if you know anyone shopping for a golfer before Father's Day (June 21), I built a store for practical bag gifts (not junk). Best pick is the Bag Upgrade Kit. Code WYX10: ${KIT}`,
  },
  {
    audience: 'Close friend — direct ask',
    message: `I'm trying to get WYX's first real orders this week. Would you check out the Bag Upgrade Kit and tell me honestly if you'd buy it? WYX10 takes 10% off: ${KIT} — even if you just browse, it helps.`,
  },
  {
    audience: 'Dad / husband angle',
    message: `Father's Day golf gift idea: five bag upgrades in one kit (towel, marker, grip, groove tool, organizer). Under $80 with WYX10. ${FATHERS}`,
  },
  {
    audience: 'Group chat / foursome',
    message: `WYX is open — golf gifts that pass "would you keep it in the bag after round one?" Bag Upgrade Kit is the hero: ${OPEN}`,
  },
];

const posts = {
  facebook: `Father's Day is June 21 (${daysLeft} days). If you're shopping for a golfer who already has everything — try useful bag stuff instead of another polo.\n\nBag Upgrade Kit: towel, marker, grip tape, groove tool, accessory caddie.\n\n${KIT}\n\nWYX10 = 10% off. Secure Shopify checkout.`,
  linkedin: `Launched WYX Golf Supply — curated golf accessories for weekend players and gift buyers. 93 products that pass one test: would you keep it in the bag after round one?\n\nFather's Day picks: ${FATHERS}\n\nWould appreciate a share if you know a golfer or gift buyer.`,
  instagram: `WYX is open 🏌️ Father's Day is June 21.\n\nThe Bag Upgrade Kit: 5 fixes every weekend bag needs.\n\nLink in bio → ${OPEN}\nCode WYX10 = 10% off`,
};

const email = {
  subject: `Father's Day golf gift idea (${daysLeft} days left)`,
  body: `Hey,\n\nI launched WYX Golf Supply — a curated golf gift shop for weekend players.\n\nIf you need a Father's Day gift for a golfer, the Bag Upgrade Kit is the safest pick: towel, marker, grip tape, groove tool, and accessory caddie. Five practical upgrades in one order.\n\n${KIT}\n\nUse WYX10 at checkout for 10% off.\n\nThanks for taking a look — even forwarding to someone who golfs helps a ton.\n\n— Matthew`,
};

async function main() {
  const dir = join(process.cwd(), 'data', 'blitz-outreach');
  mkdirSync(dir, { recursive: true });

  const pack = { generatedAt: new Date().toISOString(), daysLeft, kit: KIT, fathers: FATHERS, texts, posts, email };
  writeFileSync(join(dir, 'pack.json'), JSON.stringify(pack, null, 2));

  const txt = [
    `WYX SALES BLITZ — ${new Date().toISOString().slice(0, 10)}`,
    `Father's Day: ${daysLeft} days left (June 21)`,
    '',
    '═══ TEXT MESSAGES (copy-paste) ═══',
    ...texts.map((t, i) => `\n[${i + 1}] ${t.audience}\n${t.message}`),
    '',
    '═══ FACEBOOK ═══',
    posts.facebook,
    '',
    '═══ LINKEDIN ═══',
    posts.linkedin,
    '',
    '═══ INSTAGRAM ═══',
    posts.instagram,
    '',
    '═══ EMAIL ═══',
    `Subject: ${email.subject}`,
    email.body,
    '',
    '═══ LINKS ═══',
    `Kit: ${KIT}`,
    `Father's Day: ${FATHERS}`,
    `Open: ${OPEN}`,
    '',
    'Target: 30 messages today → 3 orders this week',
  ].join('\n');

  writeFileSync(join(dir, 'COPY-PASTE.txt'), txt);

  console.log('\n🚀 Sales blitz pack ready');
  console.log(`   ${dir}/COPY-PASTE.txt`);
  console.log(`   Father's Day: ${daysLeft} days left`);
  console.log('   Send 30 texts/posts today for first sales\n');
}

main();