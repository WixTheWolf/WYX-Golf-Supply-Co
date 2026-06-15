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

Steps (long-lived token — recommended):
  1. developers.facebook.com → Create App (Business) or use existing
  2. App → Settings → Basic → copy App ID + App Secret
  3. Graph API Explorer → select your app → Generate Token:
       ads_management, business_management, pages_read_engagement
  4. Copy short-lived token (EAA...)
  5. Run:
       META_APP_ID=<id> META_APP_SECRET=<secret> META_SHORT_LIVED_TOKEN=EAA... npm run meta:exchange-token
     → exchanges for 60-day token, saves to Vercel, launches campaign

Quick path (short-lived, ~1 hour):
  META_SHORT_LIVED_TOKEN=EAA... npm run meta:launch
  (add META_ACCESS_TOKEN=EAA... to .env.local manually)

Payment: Ad account act_${metaAdsConfig.adAccountId} must have a valid payment method in Ads Manager.

After launch, campaign goes ACTIVE at $30/day → Father's Day LP.
`);