/**
 * Meta Marketing API helpers — campaign / ad set / ad creation.
 * Requires META_ACCESS_TOKEN with ads_management + business_management.
 */

const GRAPH = 'https://graph.facebook.com/v21.0';

type GraphError = { error?: { message: string; code?: number; error_subcode?: number } };

export type MetaLaunchResult = {
  campaignId: string;
  adSetId: string;
  creativeId: string;
  adId: string;
  status: string;
  landingUrl: string;
};

function token() {
  const t = process.env.META_ACCESS_TOKEN;
  if (!t) throw new Error('META_ACCESS_TOKEN missing. Run: npm run meta:token-help');
  return t;
}

function adAccount() {
  const id = process.env.META_AD_ACCOUNT_ID || '47116609';
  return `act_${id.replace(/^act_/, '')}`;
}

async function graphPost<T>(path: string, body: Record<string, unknown>, accessToken?: string): Promise<T> {
  const url = `${GRAPH}${path}`;
  const form = new URLSearchParams();
  form.set('access_token', accessToken || token());
  for (const [key, value] of Object.entries(body)) {
    if (value === undefined || value === null) continue;
    form.set(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
  }
  const res = await fetch(url, { method: 'POST', body: form });
  const json = (await res.json()) as T & GraphError;
  if (!res.ok || (json as GraphError).error) {
    const msg = (json as GraphError).error?.message || `Meta API ${res.status}`;
    throw new Error(msg);
  }
  return json;
}

export async function verifyMetaAdsAccess() {
  const account = adAccount();
  const url = `${GRAPH}/${account}?fields=name,account_status,currency,timezone_name,amount_spent&access_token=${token()}`;
  const res = await fetch(url);
  const json = await res.json();
  if (!res.ok || json.error) throw new Error(json.error?.message || 'Cannot access ad account');
  return json as { id: string; name: string; account_status: number; currency: string };
}

export type MetaPageAccount = { id: string; name: string; category?: string };

export async function fetchMetaMe() {
  const url = `${GRAPH}/me?fields=id,name&access_token=${token()}`;
  const res = await fetch(url);
  const json = await res.json();
  if (!res.ok || json.error) throw new Error(json.error?.message || 'Cannot fetch /me');
  return json as { id: string; name: string };
}

/** GET /{app-scoped-user-id}/accounts — lists Facebook Pages the token can manage. */
export async function fetchUserPageAccounts(userId?: string) {
  const me = userId ? { id: userId } : await fetchMetaMe();
  const url = `${GRAPH}/${me.id}/accounts?fields=id,name,category,tasks&limit=25&access_token=${token()}`;
  const res = await fetch(url);
  const json = await res.json();
  if (!res.ok || json.error) throw new Error(json.error?.message || 'Cannot fetch user accounts');
  return {
    userId: me.id,
    pages: (json.data || []) as MetaPageAccount[],
  };
}

export async function discoverMetaPageId(): Promise<string> {
  if (process.env.META_PAGE_ID) return process.env.META_PAGE_ID;

  const { pages } = await fetchUserPageAccounts();
  const saved = pages.find((p) => p.id === '1574437179899364');
  const wyx = pages.find((p) => /wyx|golf/i.test(p.name));
  const page = saved || wyx || pages[0];
  if (page?.id) return String(page.id);

  const account = adAccount();
  const promoteUrl = `${GRAPH}/${account}/promote_pages?fields=id,name&limit=5&access_token=${token()}`;
  const promoteRes = await fetch(promoteUrl);
  const promoteJson = await promoteRes.json();
  const promoted = promoteJson.data?.[0];
  if (promoted?.id) return String(promoted.id);

  throw new Error('META_PAGE_ID missing — no Facebook Page found on this token/ad account.');
}

async function graphGet<T>(path: string, accessToken?: string): Promise<T> {
  const url = `${GRAPH}${path}${path.includes('?') ? '&' : '?'}access_token=${accessToken || token()}`;
  const res = await fetch(url);
  const json = (await res.json()) as T & GraphError;
  if (!res.ok || (json as GraphError).error) {
    const msg = (json as GraphError).error?.message || `Meta API ${res.status}`;
    throw new Error(msg);
  }
  return json;
}

export type MetaEntityStatus = {
  id: string;
  name?: string;
  status?: string;
  effective_status?: string;
  adset_id?: string;
  campaign_id?: string;
};

export async function activateExistingCampaign(opts: {
  campaignId: string;
  adId?: string;
  accessToken?: string;
}) {
  const accessToken = opts.accessToken || token();
  const post = (path: string, body: Record<string, unknown>) =>
    graphPost(path, body, accessToken).then(() => undefined);

  const ad = opts.adId
    ? await graphGet<MetaEntityStatus>(
        `/${opts.adId}?fields=id,name,status,effective_status,adset_id,campaign_id`,
        accessToken,
      )
    : null;

  const campaignId = ad?.campaign_id || opts.campaignId;
  const adSetId = ad?.adset_id;

  const campaign = await graphGet<MetaEntityStatus>(
    `/${campaignId}?fields=id,name,status,effective_status`,
    accessToken,
  );

  if (adSetId) await post(`/${adSetId}`, { status: 'ACTIVE' });
  await post(`/${campaignId}`, { status: 'ACTIVE' });
  if (opts.adId) await post(`/${opts.adId}`, { status: 'ACTIVE' });

  return {
    campaignId,
    adSetId,
    adId: opts.adId,
    before: {
      campaign: campaign.effective_status || campaign.status,
      ad: ad?.effective_status || ad?.status,
    },
    after: 'ACTIVE',
  };
}

export async function launchFathersDayCampaign(opts?: { dailyBudgetUsd?: number; activate?: boolean }) {
  const dailyBudgetUsd = opts?.dailyBudgetUsd ?? 30;
  const activate = opts?.activate ?? true;
  const account = adAccount();
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID || '2129816234251975';
  const pageId = await discoverMetaPageId();
  const landingUrl =
    'https://wyxgolfsupply.com/lp/fathers-day?utm_source=facebook&utm_medium=paid_social&utm_campaign=meta_fathers_day_2026';
  const imageUrl = 'https://wyxgolfsupply.com/images/boys-weekend-hero.png';

  const campaign = await graphPost<{ id: string }>(`/${account}/campaigns`, {
    name: 'WYX Fathers Day 2026',
    objective: 'OUTCOME_SALES',
    status: 'PAUSED',
    special_ad_categories: '[]',
    is_adset_budget_sharing_enabled: false,
  });

  const adSet = await graphPost<{ id: string }>(`/${account}/adsets`, {
    name: 'WYX FD — US Golf Gift Buyers',
    campaign_id: campaign.id,
    daily_budget: dailyBudgetUsd * 100,
    billing_event: 'IMPRESSIONS',
    optimization_goal: 'OFFSITE_CONVERSIONS',
    bid_strategy: 'LOWEST_COST_WITHOUT_CAP',
    promoted_object: JSON.stringify({
      pixel_id: pixelId,
      custom_event_type: 'INITIATE_CHECKOUT',
    }),
    targeting: JSON.stringify({
      geo_locations: { countries: ['US'] },
      age_min: 25,
      age_max: 65,
      flexible_spec: [
        {
          interests: [
            { id: '6003139266461', name: 'Golf' },
            { id: '6003020834693', name: 'Golf course' },
          ],
        },
      ],
    }),
    status: 'PAUSED',
  });

  const creative = await graphPost<{ id: string }>(`/${account}/adcreatives`, {
    name: 'WYX FD — Bag Upgrade Kit',
    object_story_spec: JSON.stringify({
      page_id: pageId,
      link_data: {
        link: landingUrl,
        message:
          "Father's Day is June 21. Skip the novelty polo — give him bag upgrades he'll use every round. Bag Upgrade Kit: towel, marker, grip tape, groove tool, caddie. WYX10 saves 10%.",
        name: "Golf Gifts Dad Will Actually Use",
        description: "Father's Day picks under $75. WYX10 at checkout.",
        picture: imageUrl,
        call_to_action: { type: 'SHOP_NOW', value: { link: landingUrl } },
      },
    }),
  });

  const ad = await graphPost<{ id: string }>(`/${account}/ads`, {
    name: 'WYX FD — Shop Now',
    adset_id: adSet.id,
    creative: JSON.stringify({ creative_id: creative.id }),
    status: activate ? 'ACTIVE' : 'PAUSED',
  });

  if (activate) {
    await graphPost(`/${adSet.id}`, { status: 'ACTIVE' });
    await graphPost(`/${campaign.id}`, { status: 'ACTIVE' });
  }

  return {
    campaignId: campaign.id,
    adSetId: adSet.id,
    creativeId: creative.id,
    adId: ad.id,
    status: activate ? 'ACTIVE' : 'PAUSED',
    landingUrl,
  } satisfies MetaLaunchResult;
}