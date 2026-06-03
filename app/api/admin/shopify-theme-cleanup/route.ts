import { NextResponse } from 'next/server';
import { isAuthorizedAdminRequest, unauthorizedResponse } from '@/lib/adminAuth';
import { getAdminAccessToken } from '@/lib/shopify/adminToken';

export const dynamic = 'force-dynamic';

const domain = process.env.SHOPIFY_STORE_DOMAIN;
const version = process.env.SHOPIFY_API_VERSION || '2026-01';

async function shopifyRest(path: string, init: RequestInit = {}) {
  if (!domain) throw new Error('Missing Shopify Admin domain environment variable.');
  const response = await fetch(`https://${domain}/admin/api/${version}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': await getAdminAccessToken(),
      ...(init.headers || {})
    },
    cache: 'no-store'
  });
  const text = await response.text();
  const json = text ? JSON.parse(text) : {};
  if (!response.ok) throw new Error(json.errors || json.error || `Shopify REST ${response.status}`);
  return json;
}

function removeEmptyFeaturedProducts(template: any, minimalFallback = false, blankFallback = false) {
  const sections = template.sections || {};
  const remove = Object.entries(sections)
    .filter(([, section]: [string, any]) => {
      const product = String(section?.settings?.product || '');
      const serialized = JSON.stringify(section);
      return blankFallback
        || (minimalFallback && section?.type !== 'product-list')
        || (section?.type === 'featured_product' && !product)
        || (section?.type === 'featured-product-information' && (!product || product.includes('player-preferred')))
        || serialized.includes('Product title');
    })
    .map(([id]) => id);

  for (const id of remove) delete sections[id];
  template.sections = sections;
  template.order = (template.order || []).filter((id: string) => !remove.includes(id));
  return remove;
}

function sectionSummary(template: any) {
  return Object.entries(template.sections || {}).map(([id, section]: [string, any]) => ({
    id,
    type: section?.type,
    disabled: section?.disabled || false,
    product: section?.settings?.product || null,
    collection: section?.settings?.collection || null,
    heading: section?.settings?.heading || section?.settings?.title || null
  }));
}

export async function GET(request: Request) {
  if (!isAuthorizedAdminRequest(request)) return unauthorizedResponse();

  try {
    const url = new URL(request.url);
    const shouldFix = url.searchParams.get('fix') === 'true';
    const minimalFallback = url.searchParams.get('minimal') === 'true';
    const blankFallback = url.searchParams.get('blank') === 'true';
    const themes = await shopifyRest('/themes.json');
    const mainTheme = themes.themes?.find((theme: any) => theme.role === 'main');
    if (!mainTheme?.id) throw new Error('No live Shopify theme found.');

    const asset = await shopifyRest(`/themes/${mainTheme.id}/assets.json?asset[key]=templates/index.json`);
    const template = JSON.parse(asset.asset.value);
    const removed = removeEmptyFeaturedProducts(template, minimalFallback, blankFallback);

    if (shouldFix && removed.length) {
      await shopifyRest(`/themes/${mainTheme.id}/assets.json`, {
        method: 'PUT',
        body: JSON.stringify({ asset: { key: 'templates/index.json', value: JSON.stringify(template, null, 2) } })
      });
    }

    return NextResponse.json({
      ok: true,
      fixed: shouldFix,
      minimalFallback,
      blankFallback,
      theme: { id: mainTheme.id, name: mainTheme.name, role: mainTheme.role },
      removedEmptyFeaturedProductSections: removed,
      sections: sectionSummary(template)
    });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : 'Theme cleanup failed.' }, { status: 500 });
  }
}
