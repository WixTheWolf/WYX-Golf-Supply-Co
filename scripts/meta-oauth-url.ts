/**
 * Print Meta OAuth login URL for browser authorization.
 * Usage: npx tsx --env-file .env.local scripts/meta-oauth-url.ts
 */
import { buildMetaOAuthUrl, metaOAuthRedirectUri } from '../lib/marketing/metaOAuth';

try {
  console.log('\n🔗 Meta OAuth — one-click authorize\n');
  console.log('Add this redirect URI in Meta App → Facebook Login → Settings:');
  console.log(`  ${metaOAuthRedirectUri()}\n`);
  console.log('Open in browser (after META_APP_ID + META_APP_SECRET on Vercel):');
  console.log(`  https://wyxgolfsupply.com/api/meta/oauth/start\n`);
  console.log('Or direct Facebook dialog:');
  console.log(`  ${buildMetaOAuthUrl('wyx')}\n`);
} catch (e) {
  console.error('❌', (e as Error).message);
  console.log('\nSet META_APP_ID and META_APP_SECRET in .env.local first.\n');
  process.exit(1);
}