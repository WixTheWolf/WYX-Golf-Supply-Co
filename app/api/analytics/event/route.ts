import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const allowedEvents = new Set(['ViewContent', 'AddToCart', 'InitiateCheckout', 'Lead', 'Search']);

function cleanString(value: unknown, max = 160) {
  return typeof value === 'string' ? value.slice(0, max) : undefined;
}

function cleanNumber(value: unknown) {
  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
}

function sanitizeParams(params: unknown) {
  if (!params || typeof params !== 'object') return {};
  const input = params as Record<string, unknown>;
  return {
    content_name: cleanString(input.content_name),
    content_type: cleanString(input.content_type, 60),
    category: cleanString(input.category, 80),
    source: cleanString(input.source, 80),
    currency: cleanString(input.currency, 8),
    value: cleanNumber(input.value),
    num_items: cleanNumber(input.num_items),
    content_ids: Array.isArray(input.content_ids) ? input.content_ids.slice(0, 12).map((id) => cleanString(id, 120)).filter(Boolean) : undefined
  };
}

export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  if (origin) {
    let hostname = '';
    try { hostname = new URL(origin).hostname; } catch { return new NextResponse(null, { status: 204 }); }
    if (hostname !== 'wyxgolfsupply.com' && hostname !== 'www.wyxgolfsupply.com' && !hostname.endsWith('.vercel.app')) {
      return new NextResponse(null, { status: 204 });
    }
  }

  const body = await request.json().catch(() => null);
  const event = cleanString(body?.event, 60);
  if (!event || !allowedEvents.has(event)) return new NextResponse(null, { status: 204 });

  const path = cleanString(body?.path, 240) || '/';
  const params = sanitizeParams(body?.params);

  console.log(JSON.stringify({
    type: 'wyx_funnel_event',
    event,
    path,
    params,
    at: new Date().toISOString()
  }));

  return NextResponse.json({ ok: true });
}
