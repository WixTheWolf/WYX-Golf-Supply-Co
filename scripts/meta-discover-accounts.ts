/**
 * List Facebook Pages for the long-lived user token.
 * Implements: GET /{app-scoped-user-id}/accounts?access_token=...
 *
 * Usage:
 *   META_ACCESS_TOKEN=EAA... npm run meta:discover-accounts
 *   npm run meta:discover-accounts  (reads .env.local)
 */
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fetchMetaMe, fetchUserPageAccounts, verifyMetaAdsAccess } from '../lib/marketing/metaAdsApi';

function upsertEnv(key: string, value: string) {
  const envPath = join(process.cwd(), '.env.local');
  let env = readFileSync(envPath, 'utf8');
  const line = `${key}=${value}`;
  if (new RegExp(`^${key}=`, 'm').test(env)) {
    env = env.replace(new RegExp(`^${key}=.*$`, 'm'), line);
  } else {
    env += `\n${line}\n`;
  }
  writeFileSync(envPath, env);
}

async function main() {
  if (!process.env.META_ACCESS_TOKEN) {
    console.log('\n❌ META_ACCESS_TOKEN required.\n');
    console.log('Get short-lived token → npm run meta:exchange-token\n');
    process.exit(1);
  }

  console.log('\n📋 Meta account discovery\n');

  const me = await fetchMetaMe();
  console.log(`User: ${me.name} (${me.id})`);

  try {
    const adAccount = await verifyMetaAdsAccess();
    console.log(`Ad account: ${adAccount.name} · status ${adAccount.account_status} · ${adAccount.currency}\n`);
  } catch (err) {
    console.log(`Ad account check: ${(err as Error).message}\n`);
  }

  const { pages } = await fetchUserPageAccounts(me.id);
  if (!pages.length) {
    console.log('No pages returned. Ensure token has pages_read_engagement + business_management.\n');
    process.exit(1);
  }

  console.log('Facebook Pages:\n');
  for (const page of pages) {
    const marker = page.id === '1574437179899364' ? ' ← saved' : '';
    console.log(`  ${page.id}  ${page.name}${page.category ? ` (${page.category})` : ''}${marker}`);
  }

  const preferred =
    pages.find((p) => p.id === '1574437179899364') ||
    pages.find((p) => /wyx|golf/i.test(p.name)) ||
    pages[0];

  upsertEnv('META_USER_ID', me.id);
  upsertEnv('META_PAGE_ID', preferred.id);
  console.log(`\n✅ Saved META_USER_ID=${me.id}`);
  console.log(`✅ Saved META_PAGE_ID=${preferred.id} (${preferred.name})`);

  for (const [name, value] of [
    ['META_USER_ID', me.id],
    ['META_PAGE_ID', preferred.id],
  ] as const) {
    execSync(`printf %s "${value}" | vercel env add ${name} production --force`, { stdio: 'inherit' });
  }
  console.log('\nDone. Run: npm run meta:launch\n');
}

main().catch((err) => {
  console.error('\n❌', err.message);
  process.exit(1);
});