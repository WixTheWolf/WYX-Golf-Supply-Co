import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { optimizeShopifyBusiness } from '../lib/shopify/businessOptimizer';

function loadEnvFile(file: string) {
  try {
    const raw = readFileSync(resolve(process.cwd(), file), 'utf8');
    for (const line of raw.split(/\r?\n/)) {
      const match = line.match(/^([^#=\s]+)=(.*)$/);
      if (!match) continue;
      const [, key, rawValue] = match;
      const value = rawValue.trim().replace(/^["']|["']$/g, '');
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    // Optional local env file.
  }
}

async function main() {
  loadEnvFile('.env.local');
  loadEnvFile('.env.production.local');
  loadEnvFile('.env.vercel.local');

  const apply = !process.argv.includes('--dry-run');
  const result = await optimizeShopifyBusiness({ apply });
  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
