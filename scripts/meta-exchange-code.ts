/**
 * Exchange OAuth authorization code for access token (manual / CLI).
 * Implements the code grant from Meta Login manual flow.
 *
 * Usage:
 *   META_APP_ID=... META_APP_SECRET=... META_OAUTH_CODE=AQ... npm run meta:exchange-code
 */
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { exchangeForLongLivedToken, exchangeOAuthCode } from '../lib/marketing/metaOAuth';

function upsertEnv(key: string, value: string) {
  const envPath = join(process.cwd(), '.env.local');
  let env = readFileSync(envPath, 'utf8');
  const line = `${key}=${value}`;
  if (new RegExp(`^${key}=`, 'm').test(env)) env = env.replace(new RegExp(`^${key}=.*$`, 'm'), line);
  else env += `\n${line}\n`;
  writeFileSync(envPath, env);
}

async function main() {
  const code = process.env.META_OAUTH_CODE || process.argv[2];
  if (!code) {
    console.log('\n❌ META_OAUTH_CODE missing.\n');
    console.log('Easier: open https://wyxgolfsupply.com/api/meta/oauth/start in browser after App ID/Secret are on Vercel.\n');
    console.log('Manual: after Facebook redirects with ?code=AQ..., run:');
    console.log('  META_OAUTH_CODE=AQ... npm run meta:exchange-code\n');
    process.exit(1);
  }

  const short = await exchangeOAuthCode(code);
  const long = await exchangeForLongLivedToken(short.access_token);
  upsertEnv('META_ACCESS_TOKEN', long.access_token);
  console.log('✅ Long-lived META_ACCESS_TOKEN saved to .env.local');

  execSync(`printf %s "${long.access_token.replace(/"/g, '\\"')}" | vercel env add META_ACCESS_TOKEN production --force`, {
    stdio: 'inherit',
  });

  execSync('npm run meta:discover-accounts', {
    stdio: 'inherit',
    env: { ...process.env, META_ACCESS_TOKEN: long.access_token },
  });
  execSync('npm run meta:launch', {
    stdio: 'inherit',
    env: { ...process.env, META_ACCESS_TOKEN: long.access_token },
  });
}

main().catch((e) => {
  console.error('❌', e.message);
  process.exit(1);
});