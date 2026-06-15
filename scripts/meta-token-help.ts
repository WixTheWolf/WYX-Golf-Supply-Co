/**
 * Prints one-time Meta API token setup steps for mwixted1 / act_47116609.
 */
import { metaAdsConfig } from '../lib/marketing/metaCampaigns';

console.log(`
╔══════════════════════════════════════════════════════════════╗
║  WYX Meta API — One-Time Token (enables npm run meta:launch) ║
╚══════════════════════════════════════════════════════════════╝

Account:     ${metaAdsConfig.accountName}
Ad account:  act_${metaAdsConfig.adAccountId}
Pixel:       ${metaAdsConfig.pixelId}

Steps:
  1. Open https://developers.facebook.com/tools/explorer/
  2. Meta App: use your app or "Graph API Explorer" default
  3. User or Page → Get Token → select permissions:
       ads_management, business_management, pages_read_engagement
  4. Generate Access Token → copy (starts with EAA...)
  5. Find Page ID: Facebook Page → About → Page transparency → Page ID
  6. Add to .env.local:
       META_ACCESS_TOKEN=EAA...
       META_PAGE_ID=123456789
  7. Run: npm run meta:launch

Payment: Ad account act_${metaAdsConfig.adAccountId} must have a valid payment method in Ads Manager.

After launch, campaign goes ACTIVE at $30/day → Father's Day LP.
`);