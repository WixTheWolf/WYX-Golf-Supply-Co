import crypto from 'node:crypto';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const siteUrl = 'https://wyxgolfsupply.com';

type ShopifyOrder = {
  id: number | string;
  name?: string;
  email?: string;
  contact_email?: string;
  created_at?: string;
  processed_at?: string;
  total_price?: string;
  current_total_price?: string;
  subtotal_price?: string;
  total_tax?: string;
  currency?: string;
  discount_codes?: Array<{ code?: string }>;
  shipping_lines?: Array<{ price?: string }>;
  note_attributes?: Array<{ name?: string; value?: string }>;
  custom_attributes?: Array<{ key?: string; value?: string }>;
  customer?: { id?: number | string; email?: string; first_name?: string; last_name?: string };
  line_items?: Array<{
    id?: number | string;
    product_id?: number | string;
    variant_id?: number | string;
    title?: string;
    name?: string;
    variant_title?: string | null;
    vendor?: string;
    quantity?: number;
    price?: string;
    sku?: string;
  }>;
};

function verifyShopifyWebhook(rawBody: string, provided: string | null) {
  const secret = process.env.SHOPIFY_CLIENT_SECRET;
  if (!secret || !provided) return false;
  const computed = crypto.createHmac('sha256', secret).update(rawBody).digest('base64');
  const a = Buffer.from(computed, 'utf8');
  const b = Buffer.from(provided, 'utf8');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function attribute(order: ShopifyOrder, key: string) {
  const note = order.note_attributes?.find((item) => item.name === key)?.value;
  if (note) return note;
  return order.custom_attributes?.find((item) => item.key === key)?.value || '';
}

function orderValue(order: ShopifyOrder) {
  return Number(order.current_total_price || order.total_price || 0);
}

function gaItems(order: ShopifyOrder) {
  return (order.line_items || []).map((item) => ({
    item_id: String(item.variant_id || item.product_id || item.id || ''),
    item_name: item.title || item.name || 'Golf product',
    item_brand: item.vendor,
    item_variant: item.variant_title || undefined,
    price: Number(item.price || 0),
    quantity: Number(item.quantity || 1)
  }));
}

function klaviyoItems(order: ShopifyOrder) {
  return (order.line_items || []).map((item) => ({
    ProductID: String(item.product_id || ''),
    VariantID: String(item.variant_id || ''),
    SKU: item.sku || undefined,
    ProductName: item.title || item.name || 'Golf product',
    ProductVariant: item.variant_title || undefined,
    Brand: item.vendor || undefined,
    Quantity: Number(item.quantity || 1),
    ItemPrice: Number(item.price || 0),
    RowTotal: Number(item.price || 0) * Number(item.quantity || 1)
  }));
}

async function sendGaPurchase(order: ShopifyOrder) {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const apiSecret = process.env.GA4_API_SECRET;
  const clientId = attribute(order, '_wyx_ga_client_id');
  if (!measurementId || !apiSecret || !clientId) return { skipped: 'ga_not_configured_or_client_missing' };

  const response = await fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${encodeURIComponent(measurementId)}&api_secret=${encodeURIComponent(apiSecret)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: clientId,
      events: [{
        name: 'purchase',
        params: {
          transaction_id: String(order.id),
          value: orderValue(order),
          currency: order.currency || 'USD',
          tax: Number(order.total_tax || 0),
          shipping: (order.shipping_lines || []).reduce((sum, item) => sum + Number(item.price || 0), 0),
          coupon: (order.discount_codes || []).map((item) => item.code).filter(Boolean).join(','),
          items: gaItems(order),
          engagement_time_msec: 1
        }
      }]
    })
  });
  if (!response.ok) throw new Error(`GA4 purchase failed: ${response.status}`);
  return { ok: true };
}

async function createKlaviyoEvent(metric: string, order: ShopifyOrder, properties: Record<string, unknown>, uniqueSuffix = '') {
  const privateKey = process.env.KLAVIYO_PRIVATE_API_KEY;
  const email = order.email || order.contact_email || order.customer?.email;
  if (!privateKey || !email) return { skipped: 'klaviyo_not_configured_or_email_missing' };

  const response = await fetch('https://a.klaviyo.com/api/events', {
    method: 'POST',
    headers: {
      Authorization: `Klaviyo-API-Key ${privateKey}`,
      'Content-Type': 'application/vnd.api+json',
      revision: process.env.KLAVIYO_API_REVISION || '2026-07-15'
    },
    body: JSON.stringify({
      data: {
        type: 'event',
        attributes: {
          properties,
          time: order.processed_at || order.created_at || new Date().toISOString(),
          value: orderValue(order),
          value_currency: order.currency || 'USD',
          unique_id: `shopify-${order.id}-${metric.replace(/\s+/g, '-').toLowerCase()}${uniqueSuffix}`,
          metric: { data: { type: 'metric', attributes: { name: metric } } },
          profile: {
            data: {
              type: 'profile',
              attributes: {
                email,
                external_id: order.customer?.id ? String(order.customer.id) : undefined,
                first_name: order.customer?.first_name || undefined,
                last_name: order.customer?.last_name || undefined
              }
            }
          }
        }
      }
    })
  });
  if (!response.ok) throw new Error(`Klaviyo ${metric} failed: ${response.status} ${await response.text()}`);
  return { ok: true };
}

async function sendKlaviyoOrder(order: ShopifyOrder) {
  const items = klaviyoItems(order);
  const placed = createKlaviyoEvent('Placed Order', order, {
    OrderId: String(order.id),
    OrderNumber: order.name,
    $value: orderValue(order),
    ItemNames: items.map((item) => item.ProductName),
    Items: items,
    LandingURL: attribute(order, '_wyx_landing'),
    Referrer: attribute(order, '_wyx_referrer')
  });
  const ordered = items.map((item, index) => createKlaviyoEvent('Ordered Product', order, { ...item, OrderId: String(order.id) }, `-${index}`));
  return Promise.allSettled([placed, ...ordered]);
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  if (!verifyShopifyWebhook(rawBody, request.headers.get('x-shopify-hmac-sha256'))) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  let order: ShopifyOrder;
  try { order = JSON.parse(rawBody); } catch { return NextResponse.json({ ok: false }, { status: 400 }); }

  const webhookId = request.headers.get('x-shopify-webhook-id') || '';
  console.log(JSON.stringify({
    type: 'wyx_paid_order',
    webhookId,
    orderId: String(order.id),
    orderName: order.name,
    value: orderValue(order),
    currency: order.currency || 'USD',
    itemCount: (order.line_items || []).reduce((sum, item) => sum + Number(item.quantity || 0), 0),
    hasGaClient: Boolean(attribute(order, '_wyx_ga_client_id')),
    landing: attribute(order, '_wyx_landing') || undefined,
    at: new Date().toISOString()
  }));

  const results = await Promise.allSettled([sendGaPurchase(order), sendKlaviyoOrder(order)]);
  for (const result of results) if (result.status === 'rejected') console.error('WYX purchase measurement:', result.reason);

  return NextResponse.json({ ok: true, orderId: String(order.id), returnTo: siteUrl });
}
