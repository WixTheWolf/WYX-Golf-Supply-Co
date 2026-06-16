/**
 * Activate the existing Ads Manager campaign/ad (from user's URL).
 * Usage: META_ACCESS_TOKEN=EAA... npm run meta:activate-existing
 */
import { activateExistingCampaign, verifyMetaAdsAccess } from '../lib/marketing/metaAdsApi';
import { metaAdsConfig } from '../lib/marketing/metaCampaigns';

async function main() {
  if (!process.env.META_ACCESS_TOKEN) {
    console.log('\n❌ META_ACCESS_TOKEN required.\n');
    console.log('Fastest: https://wyxgolfsupply.com/marketing/meta/launch');
    console.log('Or Graph Explorer → paste token → npm run meta:activate-existing\n');
    process.exit(1);
  }

  const account = await verifyMetaAdsAccess();
  console.log(`✅ Ad account: ${account.name}`);

  const result = await activateExistingCampaign({
    campaignId: metaAdsConfig.existingCampaignId,
    adId: metaAdsConfig.existingAdId,
  });

  console.log('\n✅ Campaign activated\n', result);
  console.log(`\nAds Manager: ${metaAdsConfig.adsManagerUrl}\n`);
}

main().catch((e) => {
  console.error('❌', e.message);
  process.exit(1);
});