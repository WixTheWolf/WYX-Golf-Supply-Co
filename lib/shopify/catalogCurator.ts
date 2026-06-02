import { categoryFor } from '@/lib/catalog';
import type { Product } from '@/types/shopify';
import { getUserErrors, shopifyAdminFetch } from './adminClient';

type AdminProduct = Omit<Product, 'variants'> & {
  status: 'ACTIVE' | 'ARCHIVED' | 'DRAFT';
  totalInventory: number;
  variants: { edges: Array<{ node: { price: string } }> };
  resourcePublications: { nodes: Array<{ publication: { id: string; name: string } }> };
};

type Decision = {
  id: string;
  title: string;
  handle: string;
  action: 'approved' | 'updated' | 'skipped';
  reasons: string[];
  category?: string;
};

const allowedTerms = ['golf', 'ball', 'glove', 'grip', 'overgrip', 'towel', 'tee', 'divot', 'marker', 'hat', 'cap', 'polo', 'club', 'bag tag', 'cooler', 'flask'];
const blockedTerms = ['disc golf', 'rv', 'atv', 'storage box', 'driving cage', 'enclosure', 'screen', 'renew protect', 'simulator'];
const managedTag = 'wyx-auto-approved';
const pausedTag = 'wyx-auto-paused:no-inventory';
const publicationTerms = ['online store', 'headless'];

const PRODUCTS = `#graphql
query CuratorProducts {
  products(first: 100, sortKey: CREATED_AT, reverse: true) {
    nodes {
      id handle title description vendor productType tags status totalInventory
      featuredImage { url altText width height }
      images(first: 8) { edges { node { url altText width height } } }
      variants(first: 20) { edges { node { id title availableForSale price } } }
      priceRange { minVariantPrice { amount currencyCode } }
      resourcePublications(first: 20) { nodes { publication { id name } } }
    }
  }
  publications(first: 50) { nodes { id name } }
}`;

const UPDATE_PRODUCT = `#graphql
mutation CuratorProductUpdate($product: ProductUpdateInput!) {
  productUpdate(product: $product) { product { id status tags } userErrors { field message } }
}`;

const PUBLISH_PRODUCT = `#graphql
mutation CuratorPublish($id: ID!, $input: [PublicationInput!]!) {
  publishablePublish(id: $id, input: $input) { userErrors { field message } }
}`;

function content(product: AdminProduct) {
  return [product.title, product.description, product.vendor, product.productType, ...(product.tags || [])].filter(Boolean).join(' ').toLowerCase();
}

function qualify(product: AdminProduct) {
  const text = content(product);
  const reasons: string[] = [];
  if (product.status === 'ARCHIVED') reasons.push('archived');
  if (product.totalInventory <= 0) reasons.push('no supplier inventory');
  if (!product.featuredImage?.url) reasons.push('missing image');
  if (!product.vendor) reasons.push('missing supplier');
  if (!allowedTerms.some((term) => text.includes(term))) reasons.push('no approved golf keyword');
  const blocked = blockedTerms.find((term) => text.includes(term));
  if (blocked) reasons.push(`blocked keyword: ${blocked}`);
  const prices = product.variants.edges.map((edge) => Number(edge.node.price)).filter(Number.isFinite);
  if (!prices.length || Math.min(...prices) < 5 || Math.max(...prices) > 250) reasons.push('price outside $5-$250 range');
  return reasons;
}

async function updateProduct(product: AdminProduct, tags: string[]) {
  const data = await shopifyAdminFetch<any>(UPDATE_PRODUCT, { product: { id: product.id, status: 'ACTIVE', tags } });
  const errors = getUserErrors(data);
  if (errors.length) throw new Error(errors.map((error: any) => error.message).join(', '));
}

async function pauseProduct(product: AdminProduct) {
  const tags = Array.from(new Set([...(product.tags || []), pausedTag]));
  const data = await shopifyAdminFetch<any>(UPDATE_PRODUCT, { product: { id: product.id, status: 'DRAFT', tags } });
  const errors = getUserErrors(data);
  if (errors.length) throw new Error(errors.map((error: any) => error.message).join(', '));
}

async function publishProduct(product: AdminProduct, publicationIds: string[]) {
  const existing = new Set(product.resourcePublications.nodes.map((node) => node.publication.id));
  const input = publicationIds.filter((id) => !existing.has(id)).map((publicationId) => ({ publicationId }));
  if (!input.length) return false;
  const data = await shopifyAdminFetch<any>(PUBLISH_PRODUCT, { id: product.id, input });
  const errors = getUserErrors(data);
  if (errors.length) throw new Error(errors.map((error: any) => error.message).join(', '));
  return true;
}

export async function curateCatalog(apply = false) {
  const data = await shopifyAdminFetch<any>(PRODUCTS);
  const products = data.products.nodes as AdminProduct[];
  const publicationIds = data.publications.nodes.filter((publication: { name: string }) => publicationTerms.some((term) => publication.name.toLowerCase().includes(term))).map((publication: { id: string }) => publication.id);
  const decisions: Decision[] = [];

  for (const product of products) {
    const reasons = qualify(product);
    if (reasons.length) {
      if (apply && reasons.includes('no supplier inventory') && product.status === 'ACTIVE') {
        await pauseProduct(product);
        decisions.push({ id: product.id, title: product.title, handle: product.handle, action: 'updated', reasons: ['paused because supplier inventory is unavailable'] });
        continue;
      }
      decisions.push({ id: product.id, title: product.title, handle: product.handle, action: 'skipped', reasons });
      continue;
    }

    const category = categoryFor(product);
    const categoryTag = `wyx-category:${category.toLowerCase().replaceAll(' ', '-')}`;
    const currentTags = product.tags || [];
    const nextTags = Array.from(new Set([...currentTags, managedTag, categoryTag]));
    const needsUpdate = product.status !== 'ACTIVE' || nextTags.length !== currentTags.length;
    const needsPublish = publicationIds.some((id: string) => !product.resourcePublications.nodes.some((node) => node.publication.id === id));
    if (!needsUpdate && !needsPublish) {
      decisions.push({ id: product.id, title: product.title, handle: product.handle, action: 'approved', reasons: ['already active and published'], category });
      continue;
    }

    if (apply) {
      if (needsUpdate) await updateProduct(product, nextTags);
      if (needsPublish) await publishProduct(product, publicationIds);
    }
    decisions.push({ id: product.id, title: product.title, handle: product.handle, action: 'updated', reasons: [apply ? 'activated, tagged, and published where needed' : 'would activate, tag, and publish where needed'], category });
  }

  return {
    ok: true,
    apply,
    publications: publicationIds.length,
    scanned: products.length,
    approved: decisions.filter((decision) => decision.action === 'approved').length,
    updated: decisions.filter((decision) => decision.action === 'updated').length,
    skipped: decisions.filter((decision) => decision.action === 'skipped').length,
    decisions
  };
}
