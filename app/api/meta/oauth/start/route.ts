import { NextResponse } from 'next/server';
import { buildMetaOAuthUrl } from '@/lib/marketing/metaOAuth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const url = buildMetaOAuthUrl('wyx-meta-launch');
    return NextResponse.redirect(url);
  } catch (err) {
    const body = {
      ok: false,
      error: (err as Error).message,
      note: 'CAPIG (Stape) credentials are for pixel/CAPI only — not OAuth. You need a Meta Developer App.',
      capigAlreadyConfigured: {
        pixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID || '2129816234251975',
        capigUrl: process.env.META_CAPIG_URL || 'https://capig.stape.do',
        capigIdentifier: process.env.META_CAPIG_IDENTIFIER || 'tkduzrwn',
      },
      getAppCredentials: [
        'https://developers.facebook.com/apps',
        'Create App (Business) or open your existing app',
        'Settings -> Basic -> copy App ID + App Secret (click Show)',
        'Add product: Facebook Login',
        'Facebook Login -> Settings -> Valid OAuth Redirect URIs:',
        '  https://wyxgolfsupply.com/api/meta/oauth/callback',
      ],
      vercel: [
        'https://vercel.com/wixthewolfs-projects/wyx-golf-supply-co/settings/environment-variables',
        'Add META_APP_ID (Production)',
        'Add META_APP_SECRET (Production)',
        'Redeploy, then open /api/meta/oauth/start again',
      ],
    };
    return NextResponse.json(body, { status: 500 });
  }
}