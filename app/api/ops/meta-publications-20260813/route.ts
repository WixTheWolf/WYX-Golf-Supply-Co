import { NextResponse } from 'next/server';
import { shopifyAdminFetch } from '@/lib/shopify/adminClient';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: Request) {
  const url = new URL(request.url);
  if (url.searchParams.get('confirm') !== 'meta-publications') {
    return NextResponse.json({ ok: false, error: 'confirmation-required' }, { status: 400, headers: { 'cache-control': 'no-store' } });
  }

  try {
    const data = await shopifyAdminFetch<any>(`#graphql
      query WYXPublicationIdentityAudit {
        currentAppInstallation { accessScopes { handle } }
        publications(first: 50) {
          nodes {
            id
            name
            autoPublish
            includedProductsCount { count precision }
            app { id title handle }
            catalog {
              __typename
              id
              title
              status
              ... on AppCatalog {
                apps(first: 5) { nodes { id title handle } }
              }
            }
          }
        }
      }
    `);

    const scopes = (data.currentAppInstallation?.accessScopes || []).map((scope: any) => String(scope?.handle || '')).filter(Boolean);
    const publications = (data.publications?.nodes || []).map((node: any) => ({
      id: node.id,
      name: node.name || null,
      autoPublish: node.autoPublish,
      productCount: node.includedProductsCount?.count ?? null,
      precision: node.includedProductsCount?.precision ?? null,
      app: node.app ? { id: node.app.id, title: node.app.title, handle: node.app.handle } : null,
      catalog: node.catalog ? {
        type: node.catalog.__typename,
        id: node.catalog.id,
        title: node.catalog.title,
        status: node.catalog.status,
        apps: (node.catalog.apps?.nodes || []).map((app: any) => ({ id: app.id, title: app.title, handle: app.handle }))
      } : null
    }));

    return NextResponse.json({
      ok: true,
      capabilities: {
        readProducts: scopes.includes('read_products'),
        readPublications: scopes.includes('read_publications'),
        writePublications: scopes.includes('write_publications')
      },
      publications,
      metaPublications: publications.filter((item: any) => /facebook|instagram|meta/i.test(`${item.name || ''} ${item.app?.title || ''} ${item.app?.handle || ''} ${item.catalog?.title || ''} ${(item.catalog?.apps || []).map((app: any) => `${app.title} ${app.handle}`).join(' ')}`))
    }, { headers: { 'cache-control': 'no-store' } });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown-error';
    return NextResponse.json({ ok: false, error: message.slice(0, 500) }, { status: 500, headers: { 'cache-control': 'no-store' } });
  }
}
