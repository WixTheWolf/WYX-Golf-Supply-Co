import { hiddenGemProducts } from '../lib/shopify/hiddenGemProducts';
import { seedDirectProduct } from '../lib/shopify/directSeed';

async function main() {
  console.log(`\n💎 Seeding ${hiddenGemProducts.length} hidden-gem products...\n`);
  let created = 0;
  let exists = 0;
  let errors = 0;

  for (const product of hiddenGemProducts) {
    const result = await seedDirectProduct(product, true);
    const icon = result.status === 'created' ? '✅' : result.status === 'exists' ? '⏭️' : '❌';
    console.log(`${icon} ${result.handle}: ${result.message}`);
    if (result.status === 'created') created++;
    else if (result.status === 'exists') exists++;
    else errors++;
    await new Promise((r) => setTimeout(r, 600));
  }

  console.log(`\nDone — created: ${created}, existing: ${exists}, errors: ${errors}\n`);
  if (errors) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});