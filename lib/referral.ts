import { siteUrl } from '@/lib/feed';

export const DEFAULT_REFERRAL_CODE = 'WYX10';

export type ReferralChannel = 'text' | 'email' | 'facebook' | 'instagram' | 'twitter';

export function referralLink(path: string, ref = 'friend', medium: ReferralChannel = 'text') {
  const url = new URL(path, siteUrl);
  url.searchParams.set('utm_source', 'referral');
  url.searchParams.set('utm_medium', medium);
  url.searchParams.set('utm_campaign', `ref_${ref}`);
  url.searchParams.set('ref', ref);
  return url.toString();
}

export function shareMessages(path = '/weekend-golfer-bag-upgrade-kit') {
  const shortLink = `${siteUrl}/go?ref=share`;
  const giftLink = `${siteUrl}/gift?ref=share`;
  return {
    short: `Practical golf gifts and bag upgrades that actually get used. ${shortLink} — WYX10 saves 10% on a first order.`,
    golfer: `If you golf, check out WYX — useful gear for rounds, trips, and better bags. ${shortLink} — WYX10 saves 10% on a first order.`,
    gift: `Need a golf gift without guessing club specs? Start with useful bag gear and gifts under $60. ${giftLink} — WYX10 saves 10% on a first order.`,
  };
}

export function parseReferralFromSearch(search: string) {
  const params = new URLSearchParams(search);
  return params.get('ref') || params.get('utm_campaign')?.replace(/^ref_/, '') || null;
}
