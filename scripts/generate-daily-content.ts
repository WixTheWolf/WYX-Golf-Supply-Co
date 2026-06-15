/**
 * Queue daily social content for manual or scheduled posting.
 *
 * Usage:
 *   npm run content:daily
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const KIT = 'https://wyxgolfsupply.com/weekend-golfer-bag-upgrade-kit?discount=WYX10';
const OPEN = 'https://wyxgolfsupply.com/open';
const GIFTS = 'https://wyxgolfsupply.com/fathers-day-golf-gifts?discount=WYX10';

const posts = [
  {
    platform: 'instagram',
    type: 'carousel',
    caption: `WYX is open. We built the golf gift shop we wished existed — practical bag upgrades, not novelty junk.\n\nThe Weekend Golfer Bag Upgrade Kit: towel, marker, grip tape, groove tool, accessory caddie.\n\nLink in bio → ${OPEN}\nCode WYX10 = 10% off first order.`,
    hashtags: '#golfgifts #golflife #weekendgolfer #golfbag #wyxgolf',
  },
  {
    platform: 'facebook',
    type: 'post',
    caption: `Father's Day is June 21. If you're shopping for a golfer who already has everything — try useful bag stuff instead of another polo.\n\nOur Bag Upgrade Kit bundles five fixes weekend players actually use: ${KIT}\n\nWYX10 saves 10% on first order. Secure Shopify checkout.`,
  },
  {
    platform: 'x',
    type: 'thread',
    tweets: [
      'We opened WYX Golf Supply — golf gifts that stay in the bag, not the drawer.',
      'The Bag Test: would a weekend golfer keep this after round one? If no, it doesn\'t list.',
      `Bag Upgrade Kit (towel, marker, grip, groove tool, caddie): ${KIT}`,
      `Father's Day gifts under $75: ${GIFTS} — WYX10 for 10% off.`,
    ],
  },
  {
    platform: 'tiktok',
    type: 'video-script',
    script: [
      '0-3s: POV digging in bag for a marker. Text: "Every weekend bag has this problem."',
      '3-8s: Show tri-fold towel + marker + groove tool. Text: "Five fixes. One kit."',
      '8-12s: Overlay WYX10 + link. Text: "WYX is open. Link in bio."',
    ],
    caption: `Bag upgrades that pass The Bag Test → ${OPEN}`,
  },
  {
    platform: 'linkedin',
    type: 'post',
    caption: `Launched WYX Golf Supply Co. this week — curated golf accessories for weekend players and gift buyers.\n\nNot a 10,000-SKU dropship dump. 93 products that pass one test: would you keep it in the bag after round one?\n\n${OPEN}`,
  },
];

async function main() {
  const date = new Date().toISOString().slice(0, 10);
  const dir = join(process.cwd(), 'data', 'daily-content', date);
  const latest = join(process.cwd(), 'data', 'daily-content', 'latest');
  mkdirSync(dir, { recursive: true });
  mkdirSync(latest, { recursive: true });

  for (const post of posts) {
    const name = `${post.platform}-${post.type}.json`;
    writeFileSync(join(dir, name), JSON.stringify(post, null, 2));
    writeFileSync(join(latest, name), JSON.stringify(post, null, 2));
  }

  writeFileSync(join(dir, 'README.txt'), [
    `Daily content queue — ${date}`,
    'Post manually or schedule via Buffer/Later.',
    `Kit: ${KIT}`,
    `Open: ${OPEN}`,
  ].join('\n'));

  console.log(`\n📱 Daily content queued: ${posts.length} posts`);
  console.log(`   ${dir}\n`);
}

main();