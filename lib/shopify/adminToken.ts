const domain = process.env.SHOPIFY_STORE_DOMAIN;
const legacyToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const clientId = process.env.SHOPIFY_CLIENT_ID;
const clientSecret = process.env.SHOPIFY_CLIENT_SECRET;

let cachedToken: string | null = null;
let cachedTokenExpiresAt = 0;

export async function getAdminAccessToken(): Promise<string> {
  if (clientId && clientSecret && domain) {
    if (cachedToken && Date.now() < cachedTokenExpiresAt - 60_000) return cachedToken;

    const response = await fetch(`https://${domain}/admin/oauth/access_token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret
      }),
      cache: 'no-store'
    });

    const json = await response.json();
    if (!response.ok) throw new Error(json.error_description || json.error || `Shopify token exchange failed: ${response.status}`);

    if (!json.access_token) throw new Error('Shopify token exchange returned no access token.');

    cachedToken = String(json.access_token);
    cachedTokenExpiresAt = Date.now() + Number(json.expires_in || 86_399) * 1000;
    return cachedToken;
  }

  if (legacyToken) return legacyToken;
  throw new Error('Missing Shopify client credentials or legacy Admin API token.');
}
