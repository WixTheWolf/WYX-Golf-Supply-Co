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

async function graphPost<T>(path: string, body: Record<string, unknown>): Promise<T> {
  const url = `${GRAPH}${path}`;
  const form = new URLSearchParams();
  form.set('access_token', token());
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

export async function discoverMetaPageId(): Promise<string> {
  if (process.env.META_PAGE_ID) return process.env.META_PAGE_ID;
  const account = adAccount();
  const urls = [
    `${GRAPH}/${account}/promote_pages?fields=id,name&limit=5&access_token=${token()}`,
    `${GRAPH}/me/accounts?fields=id,name&limit=5&access_token=${token()}`,
  ];
  for (const url of urls) {
    const res = await fetch(url);
    const json = await res.json();
    const page = json.data?.[0];
    if (page?.id) return String(page.id);
  }
  throw new Error('META_PAGE_ID missing — no Facebook Page found on this token/ad account.');
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