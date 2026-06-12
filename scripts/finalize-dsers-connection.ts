/**
 * Align DSers catalog SKUs + supplier metadata on verified AliExpress products.
 * DSers matches orders by linked import — AE-* SKUs help manual mapping.
 *
 * Usage:
 *   npm run finalize:dsers
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { shopifyAdminFetch } from '../lib/shopify/adminClient';
import { verifiedDropshipCatalog } from '../lib/shopify/verifiedDropshipCatalog';

const FIND = `query($q: String!) {
  products(first: 1, query: $q) {
    nodes {
      id handle title descriptionHtml tags
      variants(first: 3) { nodes { id sku inventoryPolicy } }
    }
  }
}`;

const UPDATE_VARIANTS = `mutation($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
  productVariantsBulkUpdate(productId: $productId, variants: $variants) {
    userErrors { message }
  }
}`;

const UPDATE_PRODUCT = `mutation($id: ID!, $tags: [String!]!, $descriptionHtml: String) {
  productUpdate(product: { id: $id, tags: $tags, descriptionHtml: $descriptionHtml }) {
    userErrors { message }
  }
}`;

function supplierNote(supplier: string, sku: string, url: string) {
  return `<!-- wyx-supplier:${supplier}|${sku}|${url} -->`;
}

async function main() {
  const dsersProducts = verifiedDropshipCatalog.products.filter((p) => p.supplier === 'dsers-aliexpress');
  console.log(`\n🔗 Finalizing ${dsersProducts.length} DSers ↔ Shopify links\n`);

  let skuUpdated = 0;
  let metaUpdated = 0;

  for (const entry of dsersProducts) {
    const targetSku = `AE-${entry.supplierSku}`;
    const found = await shopifyAdminFetch<{
      products: { nodes: Array<{ id: string; handle: string; descriptionHtml: string; tags: string[]; variants: { nodes: Array<{ id: string; sku: string; inventoryPolicy: string }> } }> };
    }>(FIND, { q: `handle:${entry.handle}` });

    const product = found.products.nodes[0];
    if (!product) {
      console.log(`  ⚠️  ${entry.handle}: not found in Shopify`);
      continue;
    }

    const variant = product.variants.nodes[0];
    const note = supplierNote(entry.supplier, entry.supplierSku, entry.supplierUrl);
    const needsNote = !product.descriptionHtml?.includes('wyx-supplier:');
    const mergedTags = Array.from(new Set([...product.tags, 'supplier-dsers', 'fulfillment-aliexpress', 'verified-dropship-catalog']));
    const descriptionHtml = needsNote
      ? `${product.descriptionHtml || ''}\n${note}`
      : product.descriptionHtml;

    if (needsNote || mergedTags.length > product.tags.length) {
      await shopifyAdminFetch(UPDATE_PRODUCT, {
        id: product.id,
        tags: mergedTags,
        descriptionHtml: needsNote ? descriptionHtml : undefined,
      });
      if (needsNote) metaUpdated++;
    }

    const variantInput: Record<string, unknown> = { id: variant.id };
    let changed = false;

    if (variant.sku !== targetSku) {
      variantInput.inventoryItem = { sku: targetSku, tracked: true };
      changed = true;
    }
    if (variant.inventoryPolicy !== 'CONTINUE') {
      variantInput.inventoryPolicy = 'CONTINUE';
      changed = true;
    }

    if (changed) {
      const result = await shopifyAdminFetch<{ productVariantsBulkUpdate: { userErrors: Array<{ message: string }> } }>(
        UPDATE_VARIANTS,
        { productId: product.id, variants: [variantInput] },
      );
      const errors = result.productVariantsBulkUpdate.userErrors;
      if (errors.length) {
        console.log(`  ⚠️  ${entry.handle}: ${errors.map((e) => e.message).join(', ')}`);
      } else {
        console.log(`  ✅ ${entry.handle} → ${targetSku}`);
        skuUpdated++;
      }
    } else {
      console.log(`  ✓  ${entry.handle} already ${targetSku}`);
    }

    await new Promise((r) => setTimeout(r, 350));
  }

  const connPath = join(process.cwd(), 'data', 'dsers-spocket-connection.json');
  const conn = JSON.parse(readFileSync(connPath, 'utf8'));
  conn.dsersSkusAligned = skuUpdated;
  conn.dsersSkusAlignedAt = new Date().toISOString();
  writeFileSync(connPath, JSON.stringify(conn, null, 2));

  console.log(`\n✅ ${skuUpdated} SKUs set to AE-* | ${metaUpdated} supplier notes added`);
  console.log('   DSers still requires in-app "Map to Store Product" per SKU.');
  console.log('   Recovery: npm run dsers:recover-order\n');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});