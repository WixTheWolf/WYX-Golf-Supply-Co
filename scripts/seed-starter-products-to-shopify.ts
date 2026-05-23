import { seedStarterProducts } from '../lib/shopify/starterSeed';

async function main() {
  const publish = process.env.PUBLISH_STARTER_PRODUCTS === 'true';
  console.log(publish ? 'Publishing starter products as ACTIVE because PUBLISH_STARTER_PRODUCTS=true.' : 'Creating starter products as DRAFT. Set PUBLISH_STARTER_PRODUCTS=true only when ready to go live.');
  const results = await seedStarterProducts(publish);
  console.table(results.map((result) => ({ handle: result.handle, status: result.status, shopifyStatus: result.shopifyStatus || '', message: result.message })));

  const failures = results.filter((result) => result.status === 'error');
  if (failures.length) process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
