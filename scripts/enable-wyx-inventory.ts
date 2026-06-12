/**
 * Uses write_products + write_inventory scopes to make WYX SKUs purchasable:
 * - inventoryPolicy CONTINUE (sell when stock is managed)
 * - 100 units on hand at the primary location
 * - publish ACTIVE products to Headless + Online Store
 */
import { shopifyAdminFetch } from '../lib/shopify/adminClient';

const SKIP_HANDLES = new Set([
  'clean-contact-bundle-supplier-review',
  'short-game-practice-bundle',
  'golf-travel-essentials-bundle'
]);

const PRODUCTS = `#graphql
query WyxProducts($cursor: String) {
  products(first: 50, after: $cursor, query: "vendor:'WYX Golf Supply Co.' status:active") {
    pageInfo { hasNextPage endCursor }
    nodes {
      id
      handle
      variants(first: 20) {
        nodes {
          id
          inventoryPolicy
          inventoryQuantity
          inventoryItem { id }
        }
      }
    }
  }
  locations(first: 1) { nodes { id } }
  publications(first: 20) { nodes { id name } }
}`;

const UPDATE_VARIANTS = `#graphql
mutation UpdateVariants($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
  productVariantsBulkUpdate(productId: $productId, variants: $variants) {
    userErrors { message }
  }
}`;

const SET_INVENTORY = `#graphql
mutation SetInventory($input: InventorySetQuantitiesInput!) {
  inventorySetQuantities(input: $input) {
    userErrors { message }
  }
}`;

const PUBLISH = `#graphql
mutation PublishProduct($id: ID!, $input: [PublicationInput!]!) {
  publishablePublish(id: $id, input: $input) {
    userErrors { message }
  }
}`;

async function main() {
  let cursor: string | null = null;
  let policyUpdated = 0;
  let inventoryUpdated = 0;
  let published = 0;
  let locationId = '';
  let publicationIds: string[] = [];

  do {
    const data = await shopifyAdminFetch<{
      products: {
        pageInfo: { hasNextPage: boolean; endCursor: string | null };
        nodes: Array<{
          id: string;
          handle: string;
          variants: {
            nodes: Array<{
              id: string;
              inventoryPolicy: string;
              inventoryQuantity: number;
              inventoryItem: { id: string };
            }>;
          };
        }>;
      };
      locations: { nodes: Array<{ id: string }> };
      publications: { nodes: Array<{ id: string; name: string }> };
    }>(PRODUCTS, { cursor });

    if (!locationId) locationId = data.locations.nodes[0]?.id || '';
    if (!publicationIds.length) {
      publicationIds = data.publications.nodes
        .filter((publication) => /headless|online store/i.test(publication.name))
        .map((publication) => publication.id);
    }

    if (!locationId) throw new Error('No Shopify location found for inventory updates.');

    for (const product of data.products.nodes) {
      if (SKIP_HANDLES.has(product.handle)) {
        console.log(`skip bundle: ${product.handle}`);
        continue;
      }

      const variants = product.variants.nodes;
      if (!variants.length) continue;

      const needsPolicy = variants.some((variant) => variant.inventoryPolicy !== 'CONTINUE');
      if (needsPolicy) {
        const result = await shopifyAdminFetch<{ productVariantsBulkUpdate: { userErrors: Array<{ message: string }> } }>(
          UPDATE_VARIANTS,
          {
            productId: product.id,
            variants: variants.map((variant) => ({ id: variant.id, inventoryPolicy: 'CONTINUE' }))
          }
        );
        const errors = result.productVariantsBulkUpdate.userErrors;
        if (errors.length) {
          console.log(`policy error ${product.handle}: ${errors.map((error) => error.message).join(', ')}`);
        } else {
          policyUpdated += variants.length;
          console.log(`policy CONTINUE: ${product.handle}`);
        }
      }

      const quantities = variants
        .filter((variant) => variant.inventoryQuantity <= 0)
        .map((variant) => ({
          inventoryItemId: variant.inventoryItem.id,
          locationId,
          quantity: 100
        }));

      if (quantities.length) {
        const result = await shopifyAdminFetch<{ inventorySetQuantities: { userErrors: Array<{ message: string }> } }>(
          SET_INVENTORY,
          {
            input: {
              reason: 'correction',
              name: 'available',
              ignoreCompareQuantity: true,
              quantities
            }
          }
        );
        const errors = result.inventorySetQuantities.userErrors;
        if (errors.length) {
          console.log(`inventory error ${product.handle}: ${errors.map((error) => error.message).join(', ')}`);
        } else {
          inventoryUpdated += quantities.length;
          console.log(`inventory 100: ${product.handle}`);
        }
      }

      for (const publicationId of publicationIds) {
        await shopifyAdminFetch(PUBLISH, { id: product.id, input: [{ publicationId }] });
      }
      published += 1;

      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    cursor = data.products.pageInfo.hasNextPage ? data.products.pageInfo.endCursor : null;
  } while (cursor);

  console.log('\nInventory enable summary');
  console.log(`Variant policies set to CONTINUE: ${policyUpdated}`);
  console.log(`Inventory quantities set to 100: ${inventoryUpdated}`);
  console.log(`Products published: ${published}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});