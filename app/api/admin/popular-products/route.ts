import { NextResponse } from 'next/server';
import { importPopularProducts } from '@/lib/shopify/popularProductImport';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  if (!process.env.CRON_SECRET || request.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const products = await importPopularProducts();
    return NextResponse.json({ ok: true, products });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : 'Popular product import failed.' }, { status: 500 });
  }
}
