import { NextResponse } from 'next/server';
import { shopifyAdminFetch } from '@/lib/shopify/adminClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const MARKER = 'WYX_HEADLESS_RETURN_BRIDGE_20260811';
const RETURN_URL = 'https://wyxgolfsupply.com';

function installBridge(layout: string) {
  if (layout.includes(MARKER)) return layout;
  const bridge = `\n{% if request.page_type == 'index' %}\n  <!-- ${MARKER} -->\n  <meta http-equiv="refresh" content="0;url=${RETURN_URL}">\n  <script>window.location.replace(${JSON.stringify(RETURN_URL)});</script>\n{% endif %}\n`;
  const headClose = layout.indexOf('</head>');
  if (headClose >= 0) return `${layout.slice(0, headClose)}${bridge}${layout.slice(headClose)}`;
  return `${bridge}${layout}`;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  if (url.searchParams.get('confirm') !== 'wyx-storefront-return') {
    return NextResponse.json({ ok: false, error: 'confirmation-required' }, { status: 400, headers: { 'cache-control': 'no-store' } });
  }

  try {
    const diagnostic = await shopifyAdminFetch<{
      currentAppInstallation: { accessScopes: Array<{ handle: string }> } | null;
      themes: { nodes: Array<{ id: string; name: string; role: string }> };
    }>(`#graphql
      query WYXThemeRepairDiagnostic {
        currentAppInstallation { accessScopes { handle } }
        themes(first: 20) { nodes { id name role } }
      }
    `);

    const scopes = new Set(diagnostic.currentAppInstallation?.accessScopes?.map((scope) => scope.handle) || []);
    const mainTheme = diagnostic.themes.nodes.find((theme) => theme.role === 'MAIN');
    if (!mainTheme) {
      return NextResponse.json({ ok: false, error: 'main-theme-not-found', hasReadThemes: scopes.has('read_themes'), hasWriteThemes: scopes.has('write_themes') }, { status: 500, headers: { 'cache-control': 'no-store' } });
    }

    if (!scopes.has('read_themes') || !scopes.has('write_themes')) {
      return NextResponse.json({
        ok: false,
        error: 'missing-theme-scope',
        theme: { name: mainTheme.name, role: mainTheme.role },
        hasReadThemes: scopes.has('read_themes'),
        hasWriteThemes: scopes.has('write_themes')
      }, { status: 403, headers: { 'cache-control': 'no-store' } });
    }

    const themeData = await shopifyAdminFetch<{
      theme: { files: { nodes: Array<{ filename: string; body: { content?: string } }> } } | null;
    }>(`#graphql
      query WYXReadMainTheme($id: ID!) {
        theme(id: $id) {
          files(first: 1, filenames: ["layout/theme.liquid"]) {
            nodes {
              filename
              body { ... on OnlineStoreThemeFileBodyText { content } }
            }
          }
        }
      }
    `, { id: mainTheme.id });

    const file = themeData.theme?.files.nodes[0];
    const original = file?.body?.content;
    if (!original || file?.filename !== 'layout/theme.liquid') {
      return NextResponse.json({ ok: false, error: 'theme-layout-unreadable', theme: { name: mainTheme.name } }, { status: 500, headers: { 'cache-control': 'no-store' } });
    }

    const updated = installBridge(original);
    if (updated === original) {
      return NextResponse.json({ ok: true, changed: false, bridge: 'already-installed', theme: { name: mainTheme.name }, returnUrl: RETURN_URL }, { headers: { 'cache-control': 'no-store' } });
    }

    const mutation = await shopifyAdminFetch<{
      themeFilesUpsert: { upsertedThemeFiles: Array<{ filename: string }>; userErrors: Array<{ field?: string[]; message: string }> };
    }>(`#graphql
      mutation WYXInstallReturnBridge($themeId: ID!, $files: [OnlineStoreThemeFilesUpsertFileInput!]!) {
        themeFilesUpsert(themeId: $themeId, files: $files) {
          upsertedThemeFiles { filename }
          userErrors { field message }
        }
      }
    `, {
      themeId: mainTheme.id,
      files: [{ filename: 'layout/theme.liquid', body: { type: 'TEXT', value: updated } }]
    });

    const errors = mutation.themeFilesUpsert.userErrors || [];
    if (errors.length) {
      return NextResponse.json({
        ok: false,
        error: 'theme-write-rejected',
        errors: errors.map((item) => item.message),
        theme: { name: mainTheme.name },
        hasReadThemes: true,
        hasWriteThemes: true
      }, { status: 403, headers: { 'cache-control': 'no-store' } });
    }

    return NextResponse.json({
      ok: true,
      changed: true,
      theme: { name: mainTheme.name },
      files: mutation.themeFilesUpsert.upsertedThemeFiles.map((item) => item.filename),
      returnUrl: RETURN_URL
    }, { headers: { 'cache-control': 'no-store' } });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : 'unknown-error' }, { status: 500, headers: { 'cache-control': 'no-store' } });
  }
}
