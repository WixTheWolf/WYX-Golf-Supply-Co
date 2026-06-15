/**
 * Exchange a short-lived Meta user token for a long-lived token (~60 days).
 *
 * Requires:
 *   META_APP_ID, META_APP_SECRET — from developers.facebook.com → Your App → Settings → Basic
 *   META_SHORT_LIVED_TOKEN — from Graph API Explorer (Generate Access Token, ads_management)
 *
 * Usage:
 *   npm run meta:exchange-token
 *   META_APP_ID=... META_APP_SECRET=... META_SHORT_LIVED_TOKEN=EAA... npm run meta:exchange-token
 *
 * On success: writes META_ACCESS_TOKEN to .env.local and Vercel Production, then runs meta:launch.
 */
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const GRAPH_VERSION = 'v21.0';

async function exchangeToken() {
  const appId = process.env.META_APP_ID;
  const appSecret = process.env.META_APP_SECRET;
  const shortToken = process.env.META_SHORT_LIVED_TOKEN || process.env.FB_EXCHANGE_TOKEN;

  if (!appId || !appSecret || !shortToken) {
    console.log('\n❌ Missing credentials for token exchange.\n');
    console.log('Need all three:');
    console.log('  META_APP_ID          → developers.facebook.com → App → Settings → Basic');
    console.log('  META_APP_SECRET      → same page (click Show)');
    console.log('  META_SHORT_LIVED_TOKEN → Graph API Explorer → Generate Token (ads_management)\n');
    console.log('Then run:');
    console.log('  META_APP_ID=... META_APP_SECRET=... META_SHORT_LIVED_TOKEN=EAA... npm run meta:exchange-token\n');
    process.exit(1);
  }

  const url = new URL(`https://graph.facebook.com/${GRAPH_VERSION}/oauth/access_token`);
  url.searchParams.set('grant_type', 'fb_exchange_token');
  url.searchParams.set('client_id', appId);
  url.searchParams.set('client_secret', appSecret);
  url.searchParams.set('fb_exchange_token', shortToken);

  console.log('\n🔄 Exchanging short-lived token for long-lived token...\n');
  const res = await fetch(url);
  const json = await res.json();

  if (!res.ok || json.error) {
    throw new Error(json.error?.message || `Exchange failed (${res.status})`);
  }

  const longLived = json.access_token as string;
  const expiresIn = json.expires_in as number | undefined;
  console.log(`✅ Long-lived token received${expiresIn ? ` (expires in ${Math.round(expiresIn / 86400)} days)` : ''}`);

  // Persist locally
  const envPath = join(process.cwd(), '.env.local');
  let env = readFileSync(envPath, 'utf8');
  if (/^META_ACCESS_TOKEN=/m.test(env)) {
    env = env.replace(/^META_ACCESS_TOKEN=.*$/m, `META_ACCESS_TOKEN=${longLived}`);
  } else {
    env += `\nMETA_ACCESS_TOKEN=${longLived}\n`;
  }
  if (!/^META_APP_ID=/m.test(env)) env += `META_APP_ID=${appId}\n`;
  if (!/^META_APP_SECRET=/m.test(env)) env += `META_APP_SECRET=${appSecret}\n`;
  writeFileSync(envPath, env);
  console.log('✅ Saved META_ACCESS_TOKEN to .env.local');

  // Vercel production
  for (const [name, value] of [
    ['META_ACCESS_TOKEN', longLived],
    ['META_APP_ID', appId],
    ['META_APP_SECRET', appSecret],
  ] as const) {
    execSync(`printf %s "${value.replace(/"/g, '\\"')}" | vercel env add ${name} production --force`, {
      stdio: 'inherit',
    });
    console.log(`✅ Vercel: ${name}`);
  }

  return longLived;
}

async function main() {
  await exchangeToken();
  console.log('\n🚀 Launching Father\'s Day campaign...\n');
  execSync('npm run meta:launch', { stdio: 'inherit', env: { ...process.env } });
}

main().catch((err) => {
  console.error('\n❌', err.message);
  process.exit(1);
});