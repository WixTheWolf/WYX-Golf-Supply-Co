import { NextResponse } from 'next/server';
import { shopifyAdminFetch } from '@/lib/shopify/adminClient';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function cleanError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error || 'unknown-error');
  return message.replace(/shpat_[A-Za-z0-9_-]+/g, '[redacted]').slice(0, 500);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  if (url.searchParams.get('confirm') !== 'meta-audit') {
    return NextResponse.json({ ok: false, error: 'confirmation-required' }, { status: 400, headers: { 'cache-control': 'no-store' } });
  }

  const result: Record<string, unknown> = { ok: true };

  try {
    const appData = await shopifyAdminFetch<any>(`#graphql
      query WYXMetaAppAudit {
        currentAppInstallation { accessScopes { handle } }
        appInstallations(first: 100) {
          nodes {
            id
            launchUrl
            app { id title handle }
          }
        }
      }
    `);
    const scopes = (appData.currentAppInstallation?.accessScopes || []).map((scope: any) => String(scope?.handle || '')).filter(Boolean);
    const installations = (appData.appInstallations?.nodes || []).map((node: any) => ({
      id: node.id,
      launchUrl: node.launchUrl,
      app: {
        id: node.app?.id || null,
        title: node.app?.title || null,
        handle: node.app?.handle || null
      }
    }));
    result.adminScopes = {
      readProducts: scopes.includes('read_products'),
      readPublications: scopes.includes('read_publications'),
      writePublications: scopes.includes('write_publications'),
      readMarkets: scopes.includes('read_markets'),
      readMetaobjects: scopes.includes('read_metaobjects'),
      writeMetaobjects: scopes.includes('write_metaobjects')
    };
    result.installations = installations;
    result.metaInstallations = installations.filter((item: any) => /facebook|instagram|meta/i.test(`${item.app?.title || ''} ${item.app?.handle || ''} ${item.launchUrl || ''}`));
  } catch (error) {
    result.ok = false;
    result.installationsError = cleanError(error);
  }

  try {
    const publicationData = await shopifyAdminFetch<any>(`#graphql
      query WYXMetaPublicationAudit {
        publications(first: 50) {
          nodes {
            id
            autoPublish
            includedProductsCount { count precision }
          }
        }
      }
    `);
    result.publications = (publicationData.publications?.nodes || []).map((node: any) => ({
      id: node.id,
      autoPublish: node.autoPublish,
      productCount: node.includedProductsCount?.count ?? null,
      precision: node.includedProductsCount?.precision ?? null
    }));
  } catch (error) {
    result.publicationsError = cleanError(error);
  }

  return NextResponse.json(result, { headers: { 'cache-control': 'no-store' } });
}
