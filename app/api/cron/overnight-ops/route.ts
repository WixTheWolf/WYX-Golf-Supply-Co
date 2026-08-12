import { NextResponse } from 'next/server';
import { isAuthorizedAdminRequest, unauthorizedResponse } from '@/lib/adminAuth';
import { availableProducts, hasSaleReadyMedia } from '@/lib/catalog';
import { fulfillmentBlocker } from '@/lib/fulfillmentReadiness';
import { coreMerchProducts } from '@/lib/merchandisingFilters';
import { shopifyAdminFetch } from '@/lib/shopify/adminClient';
import { shopifyFetch } from '@/lib/shopify/client';
import { CART_CREATE } from '@/lib/shopify/queries';
import { getProducts } from '@/lib/shopify/products';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

type Check = {
  name: string;
  ok: boolean;
  detail: string;
};

export async function GET(request: Request) {
  if (!isAuthorizedAdminRequest(request)) return unauthorizedResponse();

  const startedAt = new Date().toISOString();
  const checks: Check[] = [];
  let currentDropCount = 0;

  try {
    const products = await getProducts({ fresh: true });
    const available = availableProducts(products);
    const currentDrop = coreMerchProducts(available);
    currentDropCount = currentDrop.length;

    const unsafeCurrentDrop = currentDrop.filter((product) => fulfillmentBlocker(product) || !hasSaleReadyMedia(product));
    checks.push({
      name: 'Storefront catalog',
      ok: products.length > 0 && currentDrop.length >= 15,
      detail: `${products.length} Shopify products · ${available.length} available · ${currentDrop.length} in current WYX drop`,
    });
    checks.push({
      name: 'Current-drop safety gate',
      ok: unsafeCurrentDrop.length === 0,
      detail: unsafeCurrentDrop.length ? `Blocked: ${unsafeCurrentDrop.map((product) => product.handle).join(', ')}` : 'Every current-drop product passed fulfillment and media gates.',
    });

    const firstVariant = currentDrop
      .flatMap((product) => product.variants)
      .find((variant) => variant.availableForSale && !variant.id.startsWith('demo-'));

    if (!firstVariant) {
      checks.push({ name: 'WYX10 checkout test', ok: false, detail: 'No sale-ready variant was available for the discount test.' });
    } else {
      try {
        const created = await shopifyFetch<any>(CART_CREATE, {
          lines: [{ merchandiseId: firstVariant.id, quantity: 1 }],
          discountCodes: ['WYX10'],
        });
        const discount = created.cartCreate?.cart?.discountCodes?.find((item: { code: string; applicable: boolean }) => item.code.toUpperCase() === 'WYX10');
        checks.push({
          name: 'WYX10 checkout test',
          ok: Boolean(discount?.applicable),
          detail: discount?.applicable ? 'Shopify accepted WYX10 on a live Storefront cart.' : 'Shopify did not report WYX10 as applicable.',
        });
      } catch (error) {
        checks.push({ name: 'WYX10 checkout test', ok: false, detail: message(error) });
      }
    }
  } catch (error) {
    checks.push({ name: 'Storefront catalog', ok: false, detail: message(error) });
  }

  try {
    const admin = await shopifyAdminFetch<{ shop: { name: string } }>('query WYXOpsShop { shop { name } }');
    checks.push({ name: 'Shopify Admin API', ok: Boolean(admin.shop?.name), detail: admin.shop?.name ? `Connected to ${admin.shop.name}.` : 'Admin query returned no shop.' });
  } catch (error) {
    checks.push({ name: 'Shopify Admin API', ok: false, detail: message(error) });
  }

  const failed = checks.filter((check) => !check.ok);
  const completedAt = new Date().toISOString();
  const briefing = {
    generatedAt: completedAt,
    status: failed.length ? 'attention' : 'green',
    summary: `WYX production health: ${checks.length - failed.length}/${checks.length} checks passed. Current drop: ${currentDropCount}.`,
    storefront: 'https://wyxgolfsupply.com',
    failedSteps: failed.map((check) => `${check.name}: ${check.detail}`),
    protectedManualActions: [
      'Approve or map new DSers products before they enter the public assortment.',
      'Review supplier-review products before promotion.',
      'Do not auto-publish products merely because a supplier feed says they are available.',
    ],
  };

  return NextResponse.json({
    ok: failed.length === 0,
    startedAt,
    completedAt,
    briefing,
    checks,
  }, { status: failed.length ? 503 : 200 });
}

function message(error: unknown) {
  return error instanceof Error ? error.message.slice(0, 500) : String(error).slice(0, 500);
}
