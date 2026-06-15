import { NextResponse } from 'next/server';
import { exchangeForLongLivedToken, exchangeOAuthCode } from '@/lib/marketing/metaOAuth';
import { fetchMetaMe, fetchUserPageAccounts } from '@/lib/marketing/metaAdsApi';

export const dynamic = 'force-dynamic';

async function saveToVercelEnv(key: string, value: string) {
  const token = process.env.VERCEL_ACCESS_TOKEN;
  const projectId = process.env.VERCEL_PROJECT_ID || 'prj_G1j5B3H6gJJeppFatZYLabeUtADn';
  const teamId = process.env.VERCEL_TEAM_ID || 'team_mO7E4PHdgzklUOXPTWrwesOK';
  if (!token) return false;

  const res = await fetch(`https://api.vercel.com/v10/projects/${projectId}/env?teamId=${teamId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      key,
      value,
      type: 'encrypted',
      target: ['production'],
    }),
  });
  return res.ok;
}

function htmlPage(title: string, body: string) {
  return new NextResponse(
    `<!doctype html><html><head><meta charset="utf-8"><title>${title}</title>
    <style>body{font-family:system-ui;max-width:40rem;margin:3rem auto;padding:0 1rem;line-height:1.5}
    code{background:#f4f4f4;padding:.15rem .35rem;border-radius:4px}</style></head>
    <body><h1>${title}</h1>${body}</body></html>`,
    { headers: { 'Content-Type': 'text/html; charset=utf-8' } },
  );
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const error = searchParams.get('error');
  if (error) {
    return htmlPage('Meta OAuth failed', `<p>${error}: ${searchParams.get('error_description') || ''}</p>`);
  }

  const code = searchParams.get('code');
  if (!code) {
    return htmlPage('Meta OAuth', '<p>Missing <code>code</code> parameter.</p>');
  }

  try {
    const short = await exchangeOAuthCode(code);
    const long = await exchangeForLongLivedToken(short.access_token);
    const accessToken = long.access_token;

    process.env.META_ACCESS_TOKEN = accessToken;
    const me = await fetchMetaMe();
    const { pages } = await fetchUserPageAccounts(me.id);
    const page = pages.find((p) => p.id === '1574437179899364') || pages.find((p) => /wyx|golf/i.test(p.name)) || pages[0];

    const saved: string[] = [];
    if (await saveToVercelEnv('META_ACCESS_TOKEN', accessToken)) saved.push('META_ACCESS_TOKEN');
    if (page && (await saveToVercelEnv('META_PAGE_ID', page.id))) saved.push('META_PAGE_ID');
    if (await saveToVercelEnv('META_USER_ID', me.id)) saved.push('META_USER_ID');

    const days = long.expires_in ? Math.round(long.expires_in / 86400) : 60;
    const vercelNote = saved.length
      ? `<p>✅ Saved to Vercel Production: <code>${saved.join(', ')}</code></p>`
      : `<p>⚠️ Add <code>VERCEL_ACCESS_TOKEN</code> to auto-save. Run locally: <code>META_ACCESS_TOKEN=... npm run meta:discover-accounts && npm run meta:launch</code></p>`;

    return htmlPage(
      'Meta authorized — WYX',
      `<p>Logged in as <strong>${me.name}</strong> (${me.id})</p>
       <p>Long-lived token acquired (~${days} days).</p>
       ${page ? `<p>Facebook Page: <strong>${page.name}</strong> (<code>${page.id}</code>)</p>` : ''}
       ${vercelNote}
       <p>Next: run <code>npm run meta:launch</code> or I will launch the Father's Day campaign.</p>
       <p><a href="/marketing/meta">Campaign board</a> · <a href="/lp/fathers-day">Father's Day LP</a></p>`,
    );
  } catch (err) {
    return htmlPage('Meta OAuth error', `<p>${(err as Error).message}</p>
      <p>Ensure Meta App has redirect URI:<br><code>https://wyxgolfsupply.com/api/meta/oauth/callback</code></p>`);
  }
}