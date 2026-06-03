import { NextResponse } from 'next/server';
import { optimizeShopifyBusiness } from '@/lib/shopify/businessOptimizer';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  if (!process.env.CRON_SECRET || request.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await optimizeShopifyBusiness();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : 'Business optimizer failed.' }, { status: 500 });
  }
}
