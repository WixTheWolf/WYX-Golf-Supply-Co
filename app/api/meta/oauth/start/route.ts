import { NextResponse } from 'next/server';
import { buildMetaOAuthUrl } from '@/lib/marketing/metaOAuth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const url = buildMetaOAuthUrl('wyx-meta-launch');
    return NextResponse.redirect(url);
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: (err as Error).message,
        setup: [
          'Add META_APP_ID + META_APP_SECRET to Vercel Production',
          'Meta App → Facebook Login → Valid OAuth Redirect URIs:',
          '  https://wyxgolfsupply.com/api/meta/oauth/callback',
          'Then open /api/meta/oauth/start again',
        ],
      },
      { status: 500 },
    );
  }
}