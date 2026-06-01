import { getAdminAccessToken } from './adminToken';

const domain = process.env.SHOPIFY_STORE_DOMAIN;
const version = process.env.SHOPIFY_API_VERSION || '2026-01';

function formatGraphqlErrors(errors: unknown) {
  if (Array.isArray(errors)) return errors.map((error: any) => error?.message || JSON.stringify(error)).join(', ');
  return String(errors);
}

export async function shopifyAdminFetch<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  if (!domain) throw new Error('Missing Shopify Admin domain environment variable.');
  const response = await fetch(`https://${domain}/admin/api/${version}/graphql.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': await getAdminAccessToken() },
    body: JSON.stringify({ query, variables }),
    cache: 'no-store'
  });
  const json = await response.json();
  if (!response.ok) throw new Error(`Shopify Admin API ${response.status}: ${formatGraphqlErrors(json.errors || json)}`);
  if (json.errors) throw new Error(formatGraphqlErrors(json.errors));
  return json.data;
}

export function getUserErrors(payload: Record<string, any>) {
  return Object.values(payload).flatMap((value: any) => value?.userErrors || []);
}
