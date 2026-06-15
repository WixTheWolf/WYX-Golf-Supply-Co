/**
 * Sync all known Meta/CAPIG env vars from .env.local → Vercel Production.
 * Usage: npx tsx --env-file .env.local scripts/sync-meta-vercel.ts
 */
import { execSync } from 'node:child_process';

const keys = [
  'NEXT_PUBLIC_META_PIXEL_ID',
  'META_ACCOUNT_NAME',
  'META_AD_ACCOUNT_ID',
  'META_PAGE_ID',
  'META_COMMERCE_ACCOUNT_ID',
  'META_CATALOG_ID',
  'META_CAPIG_URL',
  'META_CAPIG_IDENTIFIER',
  'META_CAPIG_API_KEY',
  'META_ACCESS_TOKEN',
  'META_ADMIN_EMAIL',
] as const;

function addVercelEnv(name: string, value: string) {
  execSync(`printf %s "${value.replace(/"/g, '\\"')}" | vercel env add ${name} production --force`, {
    stdio: 'inherit',
  });
}

async function main() {
  console.log('\n📡 Syncing Meta env → Vercel Production\n');
  let synced = 0;
  let missing: string[] = [];

  for (const key of keys) {
    const value = process.env[key]?.trim();
    if (!value) {
      missing.push(key);
      continue;
    }
    addVercelEnv(key, value);
    console.log(`✅ ${key}`);
    synced++;
  }

  console.log(`\nSynced ${synced} variables.`);
  if (missing.length) {
    console.log(`Missing locally (not synced): ${missing.join(', ')}`);
  }
  if (!process.env.META_ACCESS_TOKEN) {
    console.log('\n⚠️  META_ACCESS_TOKEN not found — required for npm run meta:launch');
    console.log('   Generate at https://developers.facebook.com/tools/explorer/ (ads_management)');
  }
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});