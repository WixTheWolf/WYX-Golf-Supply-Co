import { categoryFor } from '@/lib/catalog';
import { productDescription } from '@/lib/feed';
import { cleanText } from '@/lib/text';
import type { Product } from '@/types/shopify';
import { getUserErrors, shopifyAdminFetch } from './adminClient';

type AdminProduct = Omit<Product, 'availableForSale' | 'variants'> & {
  availableForSale: boolean;
  status: 'ACTIVE' | 'ARCHIVED' | 'DRAFT';
  totalInventory: number;
  variants: Array<{ id: string; title: string; availableForSale: boolean; price: string }>;
};

type AdminCollection = {
  id: string;
  handle: string;
  title: string;
  products: { nodes: Array<{ id: string }> };
  resourcePublications: { nodes: Array<{ publication: { id: string; name: string } }> };
};

const PRODUCTS = `#graphql
query BusinessOptimizerProducts {
  products(first: 100, sortKey: CREATED_AT, reverse: true) {
    nodes {
      id handle title description descriptionHtml vendor productType tags status totalInventory
      featuredImage { url altText width height }
      images(first: 8) { edges { node { url altText width height } } }
      variants(first: 20) { edges { node { id title price } } }
      priceRange { minVariantPrice { amount currencyCode } }
    }
  }
  publications(first: 50) { nodes { id name } }
}`;

const UPDATE_PRODUCT = `#graphql
mutation BusinessProductUpdate($product: ProductUpdateInput!) {
  productUpdate(product: $product) {
    product { id handle title tags }
    userErrors { field message }
  }
}`;

const COLLECTION_BY_HANDLE = `#graphql
query CollectionByHandle($handle: String!) {
  collectionByHandle(handle: $handle) {
    id handle title
    products(first: 100) { nodes { id } }
    resourcePublications(first: 20) { nodes { publication { id name } } }
  }
}`;

const COLLECTION_CREATE = `#graphql
mutation CollectionCreate($input: CollectionInput!) {
  collectionCreate(input: $input) {
    collection {
      id handle title
      products(first: 100) { nodes { id } }
      resourcePublications(first: 20) { nodes { publication { id name } } }
    }
    userErrors { field message }
  }
}`;

const COLLECTION_ADD_PRODUCTS = `#graphql
mutation CollectionAddProducts($id: ID!, $productIds: [ID!]!) {
  collectionAddProducts(id: $id, productIds: $productIds) {
    collection { id handle title products(first: 100) { nodes { id } } }
    userErrors { field message }
  }
}`;

const PUBLISH = `#graphql
mutation PublishResource($id: ID!, $input: [PublicationInput!]!) {
  publishablePublish(id: $id, input: $input) { userErrors { field message } }
}`;

const collectionPlans = [
  {
    handle: 'wyx-golf-gifts-under-60',
    title: 'WYX Golf Gifts Under $60',
    descriptionHtml: '<p>Useful golf gifts under $60, including towels, tees, gloves, ball markers, club-care tools, and training aids selected for fast checkout.</p>',
    seo: {
      title: 'Golf Gifts Under $60 | WYX Golf Supply Co.',
      description: 'Shop useful golf gifts under $60 from WYX Golf Supply Co. Towels, tees, gloves, markers, tools, and practice aids.'
    },
    match: (product: AdminProduct) => minPrice(product) <= 60
  },
  {
    handle: 'wyx-best-golf-accessories',
    title: 'WYX Best Golf Accessories',
    descriptionHtml: '<p>Practical golf accessories for everyday rounds: towels, tees, ball markers, headcovers, club-care tools, and compact training aids.</p>',
    seo: {
      title: 'Best Golf Accessories | WYX Golf Supply Co.',
      description: 'Shop practical golf accessories for your bag, including towels, tees, markers, headcovers, club-care tools, and training aids.'
    },
    match: (product: AdminProduct) => ['Accessories', 'Club Care', 'Training Aids', 'Towels'].includes(categoryFor(product))
  },
  {
    handle: 'wyx-club-care-essentials',
    title: 'WYX Club Care Essentials',
    descriptionHtml: '<p>Golf club cleaning tools, groove cleaners, brushes, and towels built for cleaner contact and better weekly bag routines.</p>',
    seo: {
      title: 'Golf Club Care Essentials | WYX Golf Supply Co.',
      description: 'Shop golf club-care essentials, including brushes, groove cleaners, and towels for cleaner contact.'
    },
    match: (product: AdminProduct) => ['Club Care', 'Towels'].includes(categoryFor(product))
  },
  {
    handle: 'wyx-training-aids',
    title: 'WYX Golf Training Aids',
    descriptionHtml: '<p>Compact golf training aids and practice tools for better putting, cleaner routines, and more useful practice sessions.</p>',
    seo: {
      title: 'Golf Training Aids | WYX Golf Supply Co.',
      description: 'Shop compact golf training aids and practice accessories from WYX Golf Supply Co.'
    },
    match: (product: AdminProduct) => categoryFor(product) === 'Training Aids'
  },
  {
    handle: 'wyx-premium-golf-bags',
    title: 'WYX Premium Golf Bags',
    descriptionHtml: '<p>Premium supplier-backed golf bags with real product photography, live inventory, and secure Shopify checkout.</p>',
    seo: {
      title: 'Premium Golf Bags | WYX Golf Supply Co.',
      description: 'Shop premium supplier-backed golf bags from WYX Golf Supply Co. with live inventory and secure Shopify checkout.'
    },
    match: (product: AdminProduct) => /golf bag/i.test(`${product.title} ${product.productType} ${(product.tags || []).join(' ')}`)
  }
];

function reshape(product: any): AdminProduct {
  return {
    ...product,
    availableForSale: product.status === 'ACTIVE' && product.totalInventory > 0,
    images: (product.images?.edges || []).map((edge: any) => edge.node),
    variants: (product.variants?.edges || []).map((edge: any) => edge.node)
  };
}

function errors(payload: Record<string, any>) {
  return getUserErrors(payload).map((error: any) => error.message).filter(Boolean);
}

function trim(value: string, max: number) {
  const text = cleanText(value);
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}` : text;
}

function seoFor(product: AdminProduct) {
  const category = categoryFor(product);
  const title = trim(`${cleanText(product.title)} | ${category}`, 68);
  const description = trim(`${productDescription(product)} Shop ${category.toLowerCase()} from WYX Golf Supply Co. with secure Shopify checkout.`, 155);
  return { title, description };
}

function minPrice(product: AdminProduct) {
  const prices = product.variants.map((variant) => Number(variant.price)).filter(Number.isFinite);
  return prices.length ? Math.min(...prices) : Number(product.priceRange.minVariantPrice.amount);
}

function labelsFor(product: AdminProduct) {
  const price = minPrice(product);
  const category = categoryFor(product);
  return {
    priceTier: price < 20 ? 'under_20' : price <= 60 ? 'under_60' : 'premium',
    category,
    conversionType: price <= 35 ? 'impulse_add_on' : 'giftable_upgrade'
  };
}

function tagsFor(product: AdminProduct) {
  const labels = labelsFor(product);
  return Array.from(new Set([
    ...(product.tags || []),
    'wyx-seo-optimized',
    'wyx-marketing-ready',
    `wyx-category:${labels.category.toLowerCase().replaceAll(' ', '-')}`,
    `wyx-price:${labels.priceTier}`,
    `wyx-conversion:${labels.conversionType}`
  ]));
}

async function updateProductMarketing(product: AdminProduct) {
  const data = await shopifyAdminFetch<any>(UPDATE_PRODUCT, {
    product: {
      id: product.id,
      tags: tagsFor(product),
      seo: seoFor(product)
    }
  });
  const updateErrors = errors(data);
  if (updateErrors.length) throw new Error(`${product.title}: ${updateErrors.join(', ')}`);
  return { title: product.title, handle: product.handle, action: 'product-seo-tags-updated' };
}

function publicationIds(publications: Array<{ id: string; name: string }>) {
  return publications.filter((publication) => /online store|headless/i.test(publication.name)).map((publication) => publication.id);
}

async function publish(id: string, currentPublications: AdminCollection['resourcePublications'], ids: string[]) {
  const existing = new Set((currentPublications?.nodes || []).map((node) => node.publication.id));
  const input = ids.filter((publicationId) => !existing.has(publicationId)).map((publicationId) => ({ publicationId }));
  if (!input.length) return false;
  const data = await shopifyAdminFetch<any>(PUBLISH, { id, input });
  const publishErrors = errors(data);
  if (publishErrors.length) throw new Error(publishErrors.join(', '));
  return true;
}

async function ensureCollection(plan: (typeof collectionPlans)[number], products: AdminProduct[], publicationIdsToUse: string[]) {
  const productIds = products.filter(plan.match).map((product) => product.id);
  const found = await shopifyAdminFetch<any>(COLLECTION_BY_HANDLE, { handle: plan.handle });
  let collection = found.collectionByHandle as AdminCollection | null;
  let action: 'created' | 'updated' | 'exists' = 'exists';

  if (!collection) {
    const created = await shopifyAdminFetch<any>(COLLECTION_CREATE, {
      input: {
        title: plan.title,
        handle: plan.handle,
        descriptionHtml: plan.descriptionHtml,
        products: productIds,
        seo: plan.seo
      }
    });
    const createErrors = errors(created);
    if (createErrors.length) throw new Error(`${plan.title}: ${createErrors.join(', ')}`);
    collection = created.collectionCreate.collection;
    action = 'created';
  } else {
    const existingIds = new Set(collection.products.nodes.map((product) => product.id));
    const missingIds = productIds.filter((id) => !existingIds.has(id));
    if (missingIds.length) {
      const added = await shopifyAdminFetch<any>(COLLECTION_ADD_PRODUCTS, { id: collection.id, productIds: missingIds });
      const addErrors = errors(added);
      if (addErrors.length) throw new Error(`${plan.title}: ${addErrors.join(', ')}`);
      action = 'updated';
    }
  }

  if (collection) await publish(collection.id, collection.resourcePublications, publicationIdsToUse);
  return { title: plan.title, handle: plan.handle, products: productIds.length, action };
}

export async function optimizeShopifyBusiness() {
  const data = await shopifyAdminFetch<any>(PRODUCTS);
  const products = data.products.nodes.map(reshape).filter((product: AdminProduct) => product.status === 'ACTIVE' && product.availableForSale);
  const publicationIdsToUse = publicationIds(data.publications.nodes);

  const productUpdates: Array<{ title: string; handle: string; action: string }> = [];
  for (const product of products) productUpdates.push(await updateProductMarketing(product));

  const collections: Array<{ title: string; handle: string; products: number; action: string }> = [];
  for (const plan of collectionPlans) collections.push(await ensureCollection(plan, products, publicationIdsToUse));

  return {
    ok: true,
    activeProducts: products.length,
    productUpdates,
    collections
  };
}
