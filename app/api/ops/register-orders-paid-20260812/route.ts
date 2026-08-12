import { NextRequest, NextResponse } from 'next/server';
import { getUserErrors, shopifyAdminFetch } from '@/lib/shopify/adminClient';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const CONFIRM = 'wyx-orders-paid-measurement-20260812';
const URI = 'https://wyxgolfsupply.com/api/webhooks/shopify/orders-paid';

const LIST = `#graphql
query OrdersPaidWebhooks($topics: [WebhookSubscriptionTopic!], $uri: String) {
  webhookSubscriptions(first: 20, topics: $topics, uri: $uri) {
    nodes { id topic uri }
  }
}`;

const CREATE = `#graphql
mutation OrdersPaidWebhookCreate($topic: WebhookSubscriptionTopic!, $webhookSubscription: WebhookSubscriptionInput!) {
  webhookSubscriptionCreate(topic: $topic, webhookSubscription: $webhookSubscription) {
    webhookSubscription { id topic uri }
    userErrors { field message }
  }
}`;

export async function GET(request: NextRequest) {
  if (request.nextUrl.searchParams.get('confirm') !== CONFIRM) {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  try {
    const existing = await shopifyAdminFetch<any>(LIST, { topics: ['ORDERS_PAID'], uri: URI });
    const current = existing.webhookSubscriptions?.nodes || [];
    if (current.length) return NextResponse.json({ ok: true, status: 'already_registered', subscriptions: current });

    const created = await shopifyAdminFetch<any>(CREATE, {
      topic: 'ORDERS_PAID',
      webhookSubscription: { uri: URI }
    });
    const errors = getUserErrors(created);
    if (errors.length) return NextResponse.json({ ok: false, status: 'shopify_error', errors }, { status: 400 });

    return NextResponse.json({ ok: true, status: 'registered', subscription: created.webhookSubscriptionCreate?.webhookSubscription });
  } catch (error) {
    return NextResponse.json({ ok: false, status: 'failed', error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
