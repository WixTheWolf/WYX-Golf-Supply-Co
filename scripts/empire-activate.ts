/**
 * Growth activation checklist — pixels, feeds, email, ads.
 *
 * Usage:
 *   npm run empire:activate
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

function envSet(name: string) {
  try {
    const local = readFileSync(join(process.cwd(), '.env.local'), 'utf8');
    const line = local.split('\n').find((l) => l.startsWith(`${name}=`));
    const val = line?.split('=').slice(1).join('=').trim();
    return Boolean(val && val.length > 3);
  } catch {
    return false;
  }
}

async function main() {
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║  WYX GROWTH ACTIVATION — Do these to OPEN UP             ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');

  const checks = [
    { name: 'GA4 pixel', env: 'NEXT_PUBLIC_GA_MEASUREMENT_ID', action: 'Vercel → Settings → Env → add ID → redeploy' },
    { name: 'Meta pixel', env: 'NEXT_PUBLIC_META_PIXEL_ID', action: 'Same + run npm run setup:meta-tracking for Shopify checkout' },
    { name: 'Klaviyo', env: 'KLAVIYO_PRIVATE_API_KEY', action: 'Klaviyo list + 4-email welcome (docs/email-and-launch-flows.md)' },
    { name: 'Storefront token', env: 'SHOPIFY_STOREFRONT_ACCESS_TOKEN', action: 'Already set if shop loads' },
  ];

  console.log('── Environment (local .env.local) ──\n');
  for (const c of checks) {
    console.log(`  ${envSet(c.env) ? '✅' : '⬜'} ${c.name}`);
    if (!envSet(c.env)) console.log(`     → ${c.action}`);
  }

  console.log('\n── One-time setup (30 min each) ──\n');
  console.log('  1. Google Search Console → add wyxgolfsupply.com → submit sitemap.xml');
  console.log('  2. Google Merchant Center → feed: https://wyxgolfsupply.com/feeds/google-products.xml');
  console.log('  3. Meta Ads Manager → Campaign from docs/meta-ad-creative.md → $10/day → Bag Kit');
  console.log('  4. Shopify Admin → Settings → Customer events → add Meta + GA4 for Purchase');
  console.log('  5. Microsoft Clarity (free) → add NEXT_PUBLIC_CLARITY_ID to Vercel');

  console.log('\n── Share these URLs today ──\n');
  console.log('  Grand opening:  https://wyxgolfsupply.com/open');
  console.log('  Bag Upgrade Kit: https://wyxgolfsupply.com/weekend-golfer-bag-upgrade-kit?discount=WYX10');
  console.log('  Father\'s Day:    https://wyxgolfsupply.com/fathers-day-golf-gifts');

  console.log('\n── Personal network (non-negotiable) ──\n');
  console.log('  npm run survival:outreach');
  console.log('  Target: 30 messages today → 3 orders this week\n');
}