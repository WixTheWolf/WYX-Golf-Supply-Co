/**
 * Launch WYX Father's Day Meta campaign via Marketing API.
 *
 * Prerequisites:
 *   META_ACCESS_TOKEN — User token with ads_management, business_management
 *   META_PAGE_ID — Facebook Page connected to ad account (optional if page in token)
 *
 * Usage:
 *   npm run meta:launch
 *   META_ACCESS_TOKEN=... META_PAGE_ID=... npm run meta:launch
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { execSync } from 'node:child_process';
import { discoverMetaPageId, launchFathersDayCampaign, verifyMetaAdsAccess } from '../lib/marketing/metaAdsApi';
import { metaAdsConfig, metaLandingUrl } from '../lib/marketing/metaCampaigns';

async function main() {
  console.log('\n🚀 WYX Meta Campaign Launcher\n');
  console.log(`   Account: ${metaAdsConfig.accountName}`);
  console.log(`   Ad account: act_${metaAdsConfig.adAccountId}`);
  console.log(`   Pixel: ${metaAdsConfig.pixelId}`);
  console.log(`   Landing: ${metaLandingUrl('/lp/fathers-day', 'meta_fathers_day_2026')}\n`);

  if (!process.env.META_ACCESS_TOKEN) {
    console.log('❌ META_ACCESS_TOKEN not set.\n');
    console.log('One-time setup (2 min):');
    console.log('  1. https://developers.facebook.com/tools/explorer/');
    console.log('  2. Meta App → Get User Access Token');
    console.log('  3. Permissions: ads_management, business_management, pages_read_engagement');
    console.log('  4. Add to .env.local: META_ACCESS_TOKEN=<token>');
    console.log('  5. Add META_PAGE_ID=<your Facebook Page ID> (Ads Manager → Page)');
    console.log('  6. Rerun: npm run meta:launch\n');
    console.log('Or paste token once:');
    console.log('  META_ACCESS_TOKEN=<token> META_PAGE_ID=<page_id> npm run meta:launch\n');
    process.exit(1);
  }

  const account = await verifyMetaAdsAccess();
  const pageId = await discoverMetaPageId();
  console.log(`✅ Ad account: ${account.name} (${account.currency}, status ${account.account_status})`);
  console.log(`✅ Facebook Page: ${pageId}\n`);

  const result = await launchFathersDayCampaign({ dailyBudgetUsd: 30, activate: true });

  const dir = join(process.cwd(), 'data');
  mkdirSync(dir, { recursive: true });
  const payload = {
    launchedAt: new Date().toISOString(),
    account: metaAdsConfig.accountName,
    adAccountId: metaAdsConfig.adAccountId,
    pixelId: metaAdsConfig.pixelId,
    dailyBudgetUsd: 30,
    ...result,
    adsManagerUrl: metaAdsConfig.adsManagerUrl,
  };
  writeFileSync(join(dir, 'meta-campaign-launch.json'), JSON.stringify(payload, null, 2));

  try {
    execSync(`printf %s "${process.env.META_ACCESS_TOKEN!.replace(/"/g, '\\"')}" | vercel env add META_ACCESS_TOKEN production --force`, {
      stdio: 'inherit',
    });
    if (process.env.META_PAGE_ID) {
      execSync(`printf %s "${process.env.META_PAGE_ID.replace(/"/g, '\\"')}" | vercel env add META_PAGE_ID production --force`, {
        stdio: 'inherit',
      });
    }
  } catch {
    console.log('ℹ️  Skipped saving token to Vercel (CLI unavailable).');
  }

  console.log('\n✅ Campaign LIVE\n');
  console.log(`   Campaign ID: ${result.campaignId}`);
  console.log(`   Ad Set ID:   ${result.adSetId}`);
  console.log(`   Ad ID:       ${result.adId}`);
  console.log(`   Budget:      $30/day`);
  console.log(`   Status:      ${result.status}`);
  console.log(`   Ads Manager: ${metaAdsConfig.adsManagerUrl}\n`);
}

main().catch((err) => {
  console.error('\n❌ Launch failed:', err.message);
  if (/page_id/i.test(err.message)) {
    console.error('\nAdd META_PAGE_ID to .env.local — your Facebook Page numeric ID from Page Settings → About.');
  }
  process.exit(1);
});