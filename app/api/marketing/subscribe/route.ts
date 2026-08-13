import { NextResponse } from 'next/server';
import { getUserErrors, shopifyAdminFetch } from '@/lib/shopify/adminClient';

export const dynamic = 'force-dynamic';

const CUSTOMER_FIND = `#graphql
query CustomerFind($query: String!) {
  customers(first: 1, query: $query) {
    nodes {
      id
      email
      emailMarketingConsent { marketingState marketingOptInLevel consentUpdatedAt }
    }
  }
}`;

const CUSTOMER_CREATE = `#graphql
mutation CustomerCreate($input: CustomerInput!) {
  customerCreate(input: $input) {
    customer {
      id
      email
      tags
      emailMarketingConsent { marketingState marketingOptInLevel consentUpdatedAt }
    }
    userErrors { field message }
  }
}`;

const CUSTOMER_CONSENT_UPDATE = `#graphql
mutation CustomerConsentUpdate($input: CustomerEmailMarketingConsentUpdateInput!) {
  customerEmailMarketingConsentUpdate(input: $input) {
    customer {
      id
      email
      emailMarketingConsent { marketingState marketingOptInLevel consentUpdatedAt }
    }
    userErrors { field message code }
  }
}`;

const TAGS_ADD = `#graphql
mutation CustomerTagsAdd($id: ID!, $tags: [String!]!) {
  tagsAdd(id: $id, tags: $tags) {
    node { id }
    userErrors { field message }
  }
}`;

const LEAD_DEFINITION_CREATE = `#graphql
mutation LeadDefinitionCreate($definition: MetaobjectDefinitionCreateInput!) {
  metaobjectDefinitionCreate(definition: $definition) {
    metaobjectDefinition { name type }
    userErrors { field message code }
  }
}`;

const LEAD_CREATE = `#graphql
mutation LeadCreate($metaobject: MetaobjectCreateInput!) {
  metaobjectCreate(metaobject: $metaobject) {
    metaobject { id handle type }
    userErrors { field message code }
  }
}`;

function validEmail(value: unknown) {
  return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) && value.length <= 254;
}

function clean(value: unknown) {
  return typeof value === 'string' ? value.trim().slice(0, 120) : '';
}

function responseError(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

function exactEmailQuery(email: string) {
  const escaped = email.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  return `email:"${escaped}"`;
}

function userErrorMessage(payload: Record<string, any>) {
  return getUserErrors(payload).map((error: any) => error.message).filter(Boolean).join(', ');
}

async function subscribeToKlaviyo(email: string, source: string, campaign: string, now: string) {
  const privateKey = process.env.KLAVIYO_PRIVATE_API_KEY;
  const listId = process.env.KLAVIYO_LIST_ID;
  if (!privateKey || !listId) return null;

  const response = await fetch('https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/', {
    method: 'POST',
    headers: {
      Authorization: `Klaviyo-API-Key ${privateKey}`,
      'Content-Type': 'application/vnd.api+json',
      revision: process.env.KLAVIYO_API_REVISION || '2026-07-15'
    },
    body: JSON.stringify({
      data: {
        type: 'profile-subscription-bulk-create-job',
        attributes: {
          profiles: {
            data: [{
              type: 'profile',
              attributes: {
                email,
                properties: { source, campaign },
                subscriptions: {
                  email: {
                    marketing: {
                      consent: 'SUBSCRIBED',
                      consented_at: now
                    }
                  }
                }
              }
            }]
          }
        },
        relationships: {
          list: { data: { type: 'list', id: listId } }
        }
      }
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Klaviyo subscribe failed: ${text || response.status}`);
  }

  return { ok: true, status: 'klaviyo_subscribed' };
}

async function findCustomer(email: string) {
  const data = await shopifyAdminFetch<any>(CUSTOMER_FIND, { query: exactEmailQuery(email) });
  return data?.customers?.nodes?.[0] || null;
}

async function updateCustomerConsent(customerId: string, tags: string[], now: string) {
  const consentResult = await shopifyAdminFetch<any>(CUSTOMER_CONSENT_UPDATE, {
    input: {
      customerId,
      emailMarketingConsent: {
        marketingState: 'SUBSCRIBED',
        marketingOptInLevel: 'SINGLE_OPT_IN',
        consentUpdatedAt: now
      }
    }
  });
  const consentErrors = getUserErrors(consentResult);
  if (consentErrors.length) throw new Error(consentErrors.map((error: any) => error.message).join(', '));

  const tagsResult = await shopifyAdminFetch<any>(TAGS_ADD, { id: customerId, tags });
  const tagErrors = getUserErrors(tagsResult);
  if (tagErrors.length) throw new Error(tagErrors.map((error: any) => error.message).join(', '));
}

async function syncShopifySubscriber(email: string, source: string, campaign: string, now: string, tags: string[]) {
  let customer = await findCustomer(email);
  if (customer?.id) {
    await updateCustomerConsent(customer.id, tags, now);
    return { ok: true, status: 'shopify_updated' };
  }

  const input = {
    email,
    tags,
    emailMarketingConsent: {
      marketingState: 'SUBSCRIBED',
      marketingOptInLevel: 'SINGLE_OPT_IN',
      consentUpdatedAt: now
    },
    note: `Subscribed through WYX storefront. Source: ${source}. Campaign: ${campaign}.`
  };

  const result = await shopifyAdminFetch<any>(CUSTOMER_CREATE, { input });
  const errors = getUserErrors(result);
  if (!errors.length && result?.customerCreate?.customer?.id) return { ok: true, status: 'shopify_created' };

  const message = errors.map((error: any) => error.message).join(', ');
  if (/already|taken|exists/i.test(message)) {
    customer = await findCustomer(email);
    if (customer?.id) {
      await updateCustomerConsent(customer.id, tags, now);
      return { ok: true, status: 'shopify_updated_after_race' };
    }
  }
  throw new Error(message || 'Shopify customer subscription failed.');
}

async function ensureLeadDefinition() {
  const result = await shopifyAdminFetch<any>(LEAD_DEFINITION_CREATE, {
    definition: {
      name: 'WYX Lead Capture',
      type: '$app:wyx_lead_capture',
      access: { admin: 'MERCHANT_READ_WRITE' },
      fieldDefinitions: [
        { name: 'Email', key: 'email', type: 'single_line_text_field' },
        { name: 'Source', key: 'source', type: 'single_line_text_field' },
        { name: 'Campaign', key: 'campaign', type: 'single_line_text_field' },
        { name: 'Consent', key: 'consent', type: 'single_line_text_field' },
        { name: 'Consent At', key: 'consent_at', type: 'single_line_text_field' }
      ]
    }
  });
  const errors = getUserErrors(result);
  const message = errors.map((error: any) => error.message).join(', ');
  if (errors.length && !/already|taken|exists/i.test(message)) throw new Error(message);
}

async function createLeadMetaobject(email: string, source: string, campaign: string, now: string) {
  await ensureLeadDefinition();
  const handle = `lead-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const result = await shopifyAdminFetch<any>(LEAD_CREATE, {
    metaobject: {
      type: '$app:wyx_lead_capture',
      handle,
      fields: [
        { key: 'email', value: email },
        { key: 'source', value: source },
        { key: 'campaign', value: campaign },
        { key: 'consent', value: 'single_opt_in' },
        { key: 'consent_at', value: now }
      ]
    }
  });
  const errors = getUserErrors(result);
  if (errors.length) throw new Error(errors.map((error: any) => error.message).join(', '));
  return { ok: true, status: 'lead_saved' };
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || body.website) return responseError('Unable to subscribe.');
  if (!validEmail(body.email)) return responseError('Enter a valid email address.');
  if (body.consent !== true) return responseError('Email marketing consent is required.');

  const email = clean(body.email).toLowerCase();
  const source = clean(body.source) || 'storefront';
  const campaign = clean(body.campaign) || 'wyx-list';
  const now = new Date().toISOString();
  const tags = Array.from(new Set(['wyx-email-subscriber', `wyx-source:${source}`, `wyx-campaign:${campaign}`]));

  const klaviyo = await subscribeToKlaviyo(email, source, campaign, now)
    .catch((error) => ({ ok: false, error: error instanceof Error ? error.message : 'Klaviyo failed' }));

  try {
    const shopify = await syncShopifySubscriber(email, source, campaign, now, tags);
    return NextResponse.json({ ok: true, status: shopify.status, shopify, klaviyo });
  } catch (shopifyError) {
    try {
      const fallback = await createLeadMetaobject(email, source, campaign, now);
      return NextResponse.json({ ok: true, status: fallback.status, shopify: { ok: false }, klaviyo });
    } catch (fallbackError) {
      if (klaviyo?.ok) return NextResponse.json({ ok: true, status: 'klaviyo_only', klaviyo });
      console.error('[WYX marketing subscribe] Persistence failed', {
        shopify: shopifyError instanceof Error ? shopifyError.message : 'unknown',
        fallback: fallbackError instanceof Error ? fallbackError.message : 'unknown'
      });
      return responseError('Email signup is temporarily unavailable. Please try again shortly.', 503);
    }
  }
}
