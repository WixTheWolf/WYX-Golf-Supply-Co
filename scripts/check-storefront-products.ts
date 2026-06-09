/**
 * check-storefront-products.ts
 * Queries Storefront API directly to see what products are actually visible.
 * Usage: npx tsx --env-file .env.local scripts/check-storefront-products.ts
 */

async function main() {
  const domain = process.env.SHOPIFY_STORE_DOMAIN || process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  const version = process.env.SHOPIFY_API_VERSION || '2026-01';

  if (!domain || !token) throw new Error('Missing SHOPIFY_STORE_DOMAIN or SHOPIFY_STOREFRONT_ACCESS_TOKEN');

  const res = await fetch(`https://${domain}/api/${version}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token,
    },
    body: JSON.stringify({
      query: `{
        products(first: 250, sortKey: CREATED_AT, reverse: true) {
          edges {
            node {
              id handle title vendor availableForSale tags
              featuredImage { url }
            }
          }
        }
      }`,
    }),
  });

  const json = await res.json() as any;
  if (json.errors) throw new Error(JSON.stringify(json.errors));

  const products = json.data.products.edges.map((e: any) => e.node);
  console.log(`\nTotal products visible via Storefront API: ${products.length}\n`);

  const wyx = products.filter((p: any) => p.vendor === 'WYX Golf Supply Co.');
  const other = products.filter((p: any) => p.vendor !== 'WYX Golf Supply Co.');

  console.log(`WYX Golf Supply Co. products: ${wyx.length}`);
  for (const p of wyx) {
    const img = p.featuredImage?.url ? '✓ image' : '✗ NO IMAGE';
    console.log(`  ${p.availableForSale ? '🟢' : '🔴'} ${p.handle} | ${img} | tags: ${p.tags?.slice(0,3).join(', ')}`);
  }

  console.log(`\nOther vendor products (first 20):`);
  for (const p of other.slice(0, 20)) {
    const img = p.featuredImage?.url ? '✓' : '✗';
    console.log(`  ${p.availableForSale ? '🟢' : '🔴'} [${p.vendor || 'no vendor'}] ${p.handle} ${img}`);
  }

  // Look for specific expected products
  const expected = [
    'golf-laser-rangefinder-800-yard-slope',
    'putting-alignment-mirror-folding-tour',
    'golf-alignment-sticks-2-pack-fiberglass',
    'cabretta-leather-golf-glove-medium',
    'microfiber-golf-towel-dual-sided',
  ];

  console.log('\n\nExpected product check:');
  for (const handle of expected) {
    const found = products.find((p: any) => p.handle === handle);
    if (found) {
      console.log(`  ✓ FOUND: ${handle} | vendor: ${found.vendor} | forSale: ${found.availableForSale}`);
    } else {
      console.log(`  ✗ MISSING: ${handle}`);
    }
  }
}

main().catch(err => { console.error('Fatal:', err.message); process.exit(1); });
