const GRAPH_VERSION = 'v21.0';
const GRAPH = `https://graph.facebook.com/${GRAPH_VERSION}`;

export const metaOAuthScopes = [
  'ads_management',
  'business_management',
  'pages_read_engagement',
  'pages_show_list',
].join(',');

export function metaOAuthRedirectUri() {
  return process.env.META_OAUTH_REDIRECT_URI || 'https://wyxgolfsupply.com/api/meta/oauth/callback';
}

export function buildMetaOAuthUrl(state?: string) {
  const appId = process.env.META_APP_ID;
  if (!appId) throw new Error('META_APP_ID missing on server');
  const url = new URL(`https://www.facebook.com/${GRAPH_VERSION}/dialog/oauth`);
  url.searchParams.set('client_id', appId);
  url.searchParams.set('redirect_uri', metaOAuthRedirectUri());
  url.searchParams.set('scope', metaOAuthScopes);
  url.searchParams.set('response_type', 'code');
  if (state) url.searchParams.set('state', state);
  return url.toString();
}

/** Exchange authorization code → short-lived user access token (server-side). */
export async function exchangeOAuthCode(code: string) {
  const appId = process.env.META_APP_ID;
  const appSecret = process.env.META_APP_SECRET;
  if (!appId || !appSecret) throw new Error('META_APP_ID and META_APP_SECRET required');

  const url = new URL(`${GRAPH}/oauth/access_token`);
  url.searchParams.set('client_id', appId);
  url.searchParams.set('client_secret', appSecret);
  url.searchParams.set('redirect_uri', metaOAuthRedirectUri());
  url.searchParams.set('code', code);

  const res = await fetch(url);
  const json = await res.json();
  if (!res.ok || json.error) throw new Error(json.error?.message || 'Code exchange failed');
  return json as { access_token: string; token_type?: string; expires_in?: number };
}

export async function exchangeForLongLivedToken(shortLived: string) {
  const appId = process.env.META_APP_ID;
  const appSecret = process.env.META_APP_SECRET;
  if (!appId || !appSecret) throw new Error('META_APP_ID and META_APP_SECRET required');

  const url = new URL(`${GRAPH}/oauth/access_token`);
  url.searchParams.set('grant_type', 'fb_exchange_token');
  url.searchParams.set('client_id', appId);
  url.searchParams.set('client_secret', appSecret);
  url.searchParams.set('fb_exchange_token', shortLived);

  const res = await fetch(url);
  const json = await res.json();
  if (!res.ok || json.error) throw new Error(json.error?.message || 'Long-lived exchange failed');
  return json as { access_token: string; token_type?: string; expires_in?: number };
}