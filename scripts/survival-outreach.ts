/**
 * Copy-paste outreach for first 10 real sales — personal network beats ads at day zero.
 *
 * Usage:
 *   npm run survival:outreach
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const KIT_URL = 'https://wyxgolfsupply.com/go?ref=survival';
const GIFTS_URL = 'https://wyxgolfsupply.com/gift?ref=survival';
const CODE = 'WYX10';

const texts = [
  {
    id: 'golfer-friend',
    channel: 'iMessage / text',
    message: `Hey — I finally launched the golf shop I've been building. Practical bag stuff (towel, marker, grip tape, groove tool) bundled as one kit instead of random Amazon junk. If you golf or know someone who does: ${KIT_URL} — code ${CODE} takes 10% off. Would mean a lot if you'd take a look or share with your foursome.`,
  },
  {
    id: 'gift-buyer',
    channel: 'iMessage / text',
    message: `Quick favor — I opened WYX Golf Supply (curated golf gifts under $75). Father's Day is June 21. If you need a dad/husband gift: ${GIFTS_URL} — everything ships through Shopify, code ${CODE} for 10% off first order. Honest ask: would you forward to anyone shopping for a golfer?`,
  },
  {
    id: 'facebook-post',
    channel: 'Facebook / LinkedIn',
    message: `I built something I've wanted for a while: a golf gift shop that only lists gear weekend players actually keep in the bag — no simulator junk, no novelty trash.

The Weekend Golfer Bag Upgrade Kit bundles five small fixes (towel, marker, grip refresh, groove tool, accessory caddie) for one cart.

If you golf, or you're shopping for someone who does: ${KIT_URL}

First order: ${CODE} for 10% off. Would love your honest feedback.`,
  },
  {
    id: 'email-blast',
    channel: 'Email',
    subject: 'I launched WYX Golf Supply — golf gifts that stay in the bag',
    message: `Hi —

I'm Matthew. I just launched WYX Golf Supply Co. — a curated golf accessories shop for weekend players and gift buyers.

Instead of a huge catalog of random dropship stuff, I focused on one thing: practical gear people keep after the first round.

Start here: ${KIT_URL}

Use code ${CODE} for 10% off your first order.

If this isn't for you, I'd still appreciate you forwarding to anyone shopping for a golfer before Father's Day (June 21).

Thanks,
Matthew
wyxgolfsupply.com`,
  },
  {
    id: 'reddit-soft',
    channel: 'Reddit (value-first, check sub rules)',
    message: `I got tired of golf "gift" sites selling junk you use once. Built a small shop around the Bag Test idea — would a weekend golfer keep this after round one?

Bundled a starter kit (towel, marker, grip tape, groove cleaner, caddie) for people who don't want to guess individual SKUs: ${KIT_URL}

Not trying to spam — genuinely want feedback from real golfers on whether the kit makes sense.`,
  },
];

async function main() {
  const dir = join(process.cwd(), 'data', 'survival-outreach');
  mkdirSync(dir, { recursive: true });

  console.log('\n╔══════════════════════════════════════════════════════╗');
  console.log('║  WYX Survival Outreach — First 10 Sales Playbook     ║');
  console.log('╚══════════════════════════════════════════════════════╝\n');
  console.log('Zero sales = zero traffic. Ads need pixels. Personal network converts NOW.\n');
  console.log('── Do today (2 hours) ──\n');
  console.log('  1. Text 20 golfers you actually know (template: golfer-friend)');
  console.log('  2. Text 10 non-golfers who buy gifts (template: gift-buyer)');
  console.log('  3. Post once on Facebook/LinkedIn (template: facebook-post)');
  console.log('  4. Email everyone in your contacts who has bought you a gift before');
  console.log('  5. Set GA4 + Meta pixel in Vercel → redeploy (see docs/tracking-setup.md)');
  console.log('  6. Launch $10/day Meta → Bag Upgrade Kit only\n');
  console.log('── Kit link (highest convert) ──');
  console.log(`  ${KIT_URL}?discount=${CODE}\n`);

  for (const t of texts) {
    const path = join(dir, `${t.id}.txt`);
    const body = `Channel: ${t.channel}\n${'subject' in t ? `Subject: ${(t as { subject?: string }).subject}\n` : ''}\n${t.message}`;
    writeFileSync(path, body);
    console.log(`📝 ${t.id} → ${path}`);
  }

  writeFileSync(join(dir, 'README.txt'), [
    'Send 30+ personal messages before spending on ads.',
    'Track responses in a notes app. Goal: 3 orders from people who are not you.',
    `Kit URL: ${KIT_URL}`,
    `Code: ${CODE}`,
  ].join('\n'));

  console.log(`\n✅ Templates saved to data/survival-outreach/\n`);
}

main();