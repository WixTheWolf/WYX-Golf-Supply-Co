import { NextResponse } from 'next/server';
import { isAuthorizedAdminRequest, unauthorizedResponse } from '@/lib/adminAuth';
import { getAdminAccessToken } from '@/lib/shopify/adminToken';

export const dynamic = 'force-dynamic';

const domain = process.env.SHOPIFY_STORE_DOMAIN;
const version = process.env.SHOPIFY_API_VERSION || '2026-01';
const targetHost = 'wyxgolfsupply.com';
const marker = 'WYX_VERCEL_STOREFRONT_REDIRECT';

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

function redirectSnippet() {
  return `<script id="${marker}">
  (function () {
    var shopifyHosts = ['wyxgolfsupply.myshopify.com', 'back-nine-supply-co-3.myshopify.com', 'inf22x-gt.myshopify.com'];
    var checkoutPaths = ['/cart/c', '/checkouts', '/checkout', '/orders'];
    var isShopifyHost = shopifyHosts.indexOf(window.location.hostname) !== -1;
    var isCheckoutPath = checkoutPaths.some(function (path) { return window.location.pathname.indexOf(path) === 0; });
    function addReturnLink() {
      if (document.getElementById('wyx-return-to-storefront')) return;
      var link = document.createElement('a');
      link.id = 'wyx-return-to-storefront';
      link.href = 'https://${targetHost}';
      link.textContent = 'Return to WYX Golf Supply';
      link.style.position = 'fixed';
      link.style.right = '18px';
      link.style.bottom = '18px';
      link.style.zIndex = '2147483647';
      link.style.padding = '12px 16px';
      link.style.borderRadius = '999px';
      link.style.background = '#07140f';
      link.style.color = '#fff';
      link.style.font = '700 13px/1.2 system-ui,-apple-system,BlinkMacSystemFont,sans-serif';
      link.style.textDecoration = 'none';
      link.style.boxShadow = '0 12px 32px rgba(0,0,0,.18)';
      document.body.appendChild(link);
    }
    if (isShopifyHost && !isCheckoutPath) {
      window.location.replace('https://${targetHost}' + window.location.pathname + window.location.search + window.location.hash);
    } else if (isShopifyHost && isCheckoutPath) {
      if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', addReturnLink);
      else addReturnLink();
    }
  }());
</script>`;
}

function installRedirect(layout: string) {
  if (layout.includes(marker)) return { changed: false, value: layout };
  const snippet = redirectSnippet();
  if (layout.includes('</head>')) {
    return { changed: true, value: layout.replace('</head>', `${snippet}\n</head>`) };
  }
  return { changed: true, value: `${snippet}\n${layout}` };
}

export async function GET(request: Request) {
  if (!isAuthorizedAdminRequest(request)) return unauthorizedResponse();

  try {
    const url = new URL(request.url);
    const apply = url.searchParams.get('apply') === 'true';
    const themes = await shopifyRest('/themes.json');
    const mainTheme = themes.themes?.find((theme: any) => theme.role === 'main');
    if (!mainTheme?.id) throw new Error('No live Shopify theme found.');

    const asset = await shopifyRest(`/themes/${mainTheme.id}/assets.json?asset[key]=layout/theme.liquid`);
    const current = String(asset.asset.value || '');
    const next = installRedirect(current);

    if (apply && next.changed) {
      await shopifyRest(`/themes/${mainTheme.id}/assets.json`, {
        method: 'PUT',
        body: JSON.stringify({ asset: { key: 'layout/theme.liquid', value: next.value } })
      });
    }

    return NextResponse.json({
      ok: true,
      applied: apply && next.changed,
      alreadyInstalled: !next.changed,
      theme: { id: mainTheme.id, name: mainTheme.name, role: mainTheme.role },
      target: `https://${targetHost}`,
      note: apply ? 'Shopify online store traffic now redirects back to the Vercel storefront.' : 'Dry run only. Add ?apply=true to install the redirect.'
    });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : 'Shopify return redirect failed.' }, { status: 500 });
  }
}
