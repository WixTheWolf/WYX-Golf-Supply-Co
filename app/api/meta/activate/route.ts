import { NextResponse } from 'next/server';
import { activateExistingCampaign, verifyMetaAdsAccess } from '@/lib/marketing/metaAdsApi';
import { metaAdsConfig } from '@/lib/marketing/metaCampaigns';

export const dynamic = 'force-dynamic';

async function saveToVercelEnv(key: string, value: string) {
  const token = process.env.VERCEL_ACCESS_TOKEN;
  const projectId = process.env.VERCEL_PROJECT_ID || 'prj_G1j5B3H6gJJeppFatZYLabeUtADn';
  const teamId = process.env.VERCEL_TEAM_ID || 'team_mO7E4PHdgzklUOXPTWrwesOK';
  if (!token) return false;
  const res = await fetch(`https://api.vercel.com/v10/projects/${projectId}/env?teamId=${teamId}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ key, value, type: 'encrypted', target: ['production'] }),
  });
  return res.ok;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { accessToken?: string };
    const accessToken = body.accessToken?.trim();
    if (!accessToken) {
      return NextResponse.json({ ok: false, error: 'accessToken required' }, { status: 400 });
    }

    const meRes = await fetch(`https://graph.facebook.com/v21.0/me?fields=id,name&access_token=${accessToken}`);
    const meJson = await meRes.json();
    if (!meRes.ok || meJson.error) {
      return NextResponse.json({ ok: false, error: meJson.error?.message || 'Invalid token' }, { status: 401 });
    }

    process.env.META_ACCESS_TOKEN = accessToken;
    const account = await verifyMetaAdsAccess();

    const result = await activateExistingCampaign({
      campaignId: metaAdsConfig.existingCampaignId,
      adId: metaAdsConfig.existingAdId,
      accessToken,
    });

    const saved = (await saveToVercelEnv('META_ACCESS_TOKEN', accessToken)) ? ['META_ACCESS_TOKEN'] : [];

    return NextResponse.json({
      ok: true,
      user: meJson,
      account: { id: account.id, name: account.name, status: account.account_status },
      activated: result,
      savedToVercel: saved,
      adsManagerUrl: metaAdsConfig.adsManagerUrl,
    });
  } catch (err) {
    return NextResponse.json({ ok: false, error: (err as Error).message }, { status: 500 });
  }
}