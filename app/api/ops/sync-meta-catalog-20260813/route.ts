import { NextResponse } from 'next/server';
import { availableProducts } from '@/lib/catalog';
import { coreMerchProducts } from '@/lib/merchandisingFilters';
import { shopifyAdminFetch } from '@/lib/shopify/adminClient';
import { getProducts } from '@/lib/shopify/products';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const META_PUBLICATION_ID = 'gid://shopify/Publication/308702675243';

const UNPUBLISH = `#graphql
mutation WYXMetaUnpublish($id: ID!, $input: [PublicationInput!]!) {
  publishableUnpublish(id: $id, input: $input) {
    publishable { publishedOnPublication(publicationId: "gid://shopify/Publication/308702675243") }
    userErrors { field message }
  }
}`;

const PUBLISH = `#graphql
mutation WYXMetaPublish($id: ID!, $input: [PublicationInput!]!) {
  publishablePublish(id: $id, input: $input) {
    publishable { publishedOnPublication(publicationId: "gid://shopify/Publication/308702675243") }
    userErrors { field message }
  }
}`;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  if (url.searchParams.get('confirm') !== 'curate-meta') {
    return NextResponse.json({ ok: false, error: 'confirmation-required' }, { status: 400, headers: { 'cache-control': 'no-store' } });
  }

  const apply = url.searchParams.get('apply') === 'true';
  const targetProducts = coreMerchProducts(availableProducts(await getProducts()));
  const targetById = new Map(targetProducts.map((product) => [product.id, { id: product.id, handle: product.handle, title: product.title }]));

  const publication = await shopifyAdminFetch<any>(`#graphql
    query WYXMetaCurrentCatalog($id: ID!) {
      publication(id: $id) {
        id
        name
        autoPublish
        includedProducts(first: 250) {
          nodes { id handle title status }
        }
      }
    }
  `, { id: META_PUBLICATION_ID });

  const current = publication.publication?.includedProducts?.nodes || [];
  const currentById = new Map(current.map((product: any) => [product.id, product]));
  const toUnpublish = current.filter((product: any) => !targetById.has(product.id));
  const toPublish = targetProducts.filter((product) => !currentById.has(product.id));

  if (!apply) {
    return NextResponse.json({
      ok: true,
      applied: false,
      publication: publication.publication?.name || 'Facebook & Instagram',
      autoPublish: publication.publication?.autoPublish ?? null,
      currentCount: current.length,
      targetCount: targetProducts.length,
      removeCount: toUnpublish.length,
      addCount: toPublish.length,
      target: targetProducts.map((product) => ({ handle: product.handle, title: product.title })),
      removeSample: toUnpublish.slice(0, 25).map((product: any) => ({ handle: product.handle, title: product.title, status: product.status })),
      add: toPublish.map((product) => ({ handle: product.handle, title: product.title }))
    }, { headers: { 'cache-control': 'no-store' } });
  }

  const errors: Array<{ id: string; action: string; messages: string[] }> = [];
  let removed = 0;
  let added = 0;

  for (const product of toUnpublish) {
    try {
      const result = await shopifyAdminFetch<any>(UNPUBLISH, { id: product.id, input: [{ publicationId: META_PUBLICATION_ID }] });
      const userErrors = result.publishableUnpublish?.userErrors || [];
      if (userErrors.length) errors.push({ id: product.id, action: 'unpublish', messages: userErrors.map((error: any) => error.message) });
      else removed += 1;
    } catch (error) {
      errors.push({ id: product.id, action: 'unpublish', messages: [error instanceof Error ? error.message : 'unknown error'] });
    }
    await sleep(90);
  }

  for (const product of toPublish) {
    try {
      const result = await shopifyAdminFetch<any>(PUBLISH, { id: product.id, input: [{ publicationId: META_PUBLICATION_ID }] });
      const userErrors = result.publishablePublish?.userErrors || [];
      if (userErrors.length) errors.push({ id: product.id, action: 'publish', messages: userErrors.map((error: any) => error.message) });
      else added += 1;
    } catch (error) {
      errors.push({ id: product.id, action: 'publish', messages: [error instanceof Error ? error.message : 'unknown error'] });
    }
    await sleep(90);
  }

  const verification = await shopifyAdminFetch<any>(`#graphql
    query WYXMetaVerify($id: ID!) {
      publication(id: $id) {
        includedProductsCount { count precision }
        includedProducts(first: 250) { nodes { id handle title } }
      }
    }
  `, { id: META_PUBLICATION_ID });

  const finalProducts = verification.publication?.includedProducts?.nodes || [];
  const finalIds = new Set(finalProducts.map((product: any) => product.id));
  const missingTarget = targetProducts.filter((product) => !finalIds.has(product.id)).map((product) => product.handle);
  const unexpected = finalProducts.filter((product: any) => !targetById.has(product.id)).map((product: any) => product.handle);

  return NextResponse.json({
    ok: errors.length === 0 && missingTarget.length === 0 && unexpected.length === 0,
    applied: true,
    removed,
    added,
    errors: errors.slice(0, 25),
    finalCount: verification.publication?.includedProductsCount?.count ?? finalProducts.length,
    targetCount: targetProducts.length,
    missingTarget,
    unexpected
  }, { headers: { 'cache-control': 'no-store' } });
}
