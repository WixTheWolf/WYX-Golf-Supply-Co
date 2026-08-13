type AnalyticsParams = Record<string, unknown> & { klaviyo?: Record<string, unknown> };
type KlaviyoQueue = Array<unknown> & {
  track?: (eventName: string, params?: Record<string, unknown>) => unknown;
  identify?: (params: Record<string, unknown>) => unknown;
};

type Attribution = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  ref?: string;
  referrer_host?: string;
  landing_path?: string;
};

const ATTRIBUTION_KEY = 'wyx:first-touch-attribution';

export function trackEvent(name: string, params: AnalyticsParams = {}) {
  if (typeof window === 'undefined') return;
  const w = window as typeof window & {
    gtag?: (command: string, eventName: string, params?: Record<string, unknown>) => void;
    fbq?: (command: string, eventName: string, params?: Record<string, unknown>) => void;
    ttq?: { track?: (eventName: string, params?: Record<string, unknown>) => void };
    klaviyo?: KlaviyoQueue;
  };

  const { klaviyo, ...provided } = params;
  const shared = { ...getAttribution(), ...provided };

  void fetch('/api/analytics/event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event: metaEventName(name), path: window.location.pathname, params: shared }),
    keepalive: true
  }).catch(() => undefined);

  w.gtag?.('event', gaEventName(name), shared);
  w.fbq?.('track', metaEventName(name), shared);
  w.ttq?.track?.(tiktokEventName(name), shared);
  trackKlaviyo(w.klaviyo, klaviyoEventName(name), { ...getAttribution(), ...(klaviyo || provided) });
}

export function identifyEmail(email: string, properties: Record<string, unknown> = {}) {
  if (typeof window === 'undefined' || !email) return;
  const w = window as typeof window & { klaviyo?: KlaviyoQueue };
  const payload = { email, ...getAttribution(), ...properties };
  if (typeof w.klaviyo?.identify === 'function') {
    void w.klaviyo.identify(payload);
    return;
  }
  if (Array.isArray(w.klaviyo)) w.klaviyo.push(['identify', payload]);
}

function getAttribution(): Attribution {
  if (typeof window === 'undefined') return {};

  try {
    const existing = window.sessionStorage.getItem(ATTRIBUTION_KEY);
    if (existing) return JSON.parse(existing) as Attribution;
  } catch {
    // Continue with a fresh attribution snapshot when session storage is unavailable.
  }

  const search = new URLSearchParams(window.location.search);
  const currentHost = window.location.hostname.replace(/^www\./, '');
  let referrerHost = '';
  try {
    const referrer = document.referrer ? new URL(document.referrer) : null;
    const candidate = referrer?.hostname.replace(/^www\./, '') || '';
    if (candidate && candidate !== currentHost) referrerHost = candidate;
  } catch {
    referrerHost = '';
  }

  const attribution: Attribution = compact({
    utm_source: cleanParam(search.get('utm_source')),
    utm_medium: cleanParam(search.get('utm_medium')),
    utm_campaign: cleanParam(search.get('utm_campaign')),
    utm_content: cleanParam(search.get('utm_content')),
    ref: cleanParam(search.get('ref')),
    referrer_host: cleanParam(referrerHost),
    landing_path: `${window.location.pathname}${window.location.search}`.slice(0, 240)
  });

  try {
    window.sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(attribution));
  } catch {
    // Attribution still works for the current event even if storage is unavailable.
  }

  return attribution;
}

function compact(value: Attribution): Attribution {
  return Object.fromEntries(Object.entries(value).filter(([, item]) => Boolean(item))) as Attribution;
}

function cleanParam(value: string | null) {
  return value ? value.trim().slice(0, 120) : undefined;
}

function trackKlaviyo(client: KlaviyoQueue | undefined, eventName: string | undefined, params: Record<string, unknown>) {
  if (!client || !eventName) return;
  if (typeof client.track === 'function') {
    void client.track(eventName, params);
    return;
  }
  if (Array.isArray(client)) client.push(['track', eventName, params]);
}

function gaEventName(name: string) {
  return ({ PageView: 'page_view', ViewContent: 'view_item', AddToCart: 'add_to_cart', InitiateCheckout: 'begin_checkout', Purchase: 'purchase', Lead: 'generate_lead' } as Record<string, string>)[name] || name;
}

function metaEventName(name: string) {
  return ({ view_item: 'ViewContent', add_to_cart: 'AddToCart', begin_checkout: 'InitiateCheckout', purchase: 'Purchase', generate_lead: 'Lead' } as Record<string, string>)[name] || name;
}

function tiktokEventName(name: string) {
  return ({ PageView: 'PageView', ViewContent: 'ViewContent', AddToCart: 'AddToCart', InitiateCheckout: 'InitiateCheckout', Purchase: 'CompletePayment', Lead: 'SubmitForm' } as Record<string, string>)[name] || name;
}

function klaviyoEventName(name: string) {
  return ({ PageView: 'Viewed Page', ViewContent: 'Viewed Product', AddToCart: 'Added to Cart', InitiateCheckout: 'Started Checkout', Purchase: 'Placed Order', Lead: 'Signed Up' } as Record<string, string>)[name];
}
