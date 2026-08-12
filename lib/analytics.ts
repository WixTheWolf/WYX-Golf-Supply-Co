type AnalyticsParams = Record<string, unknown> & { klaviyo?: Record<string, unknown> };
type KlaviyoQueue = Array<unknown> & {
  track?: (eventName: string, params?: Record<string, unknown>) => unknown;
  identify?: (params: Record<string, unknown>) => unknown;
};

export function trackEvent(name: string, params: AnalyticsParams = {}) {
  if (typeof window === 'undefined') return;
  const w = window as typeof window & {
    gtag?: (command: string, eventName: string, params?: Record<string, unknown>) => void;
    fbq?: (command: string, eventName: string, params?: Record<string, unknown>) => void;
    ttq?: { track?: (eventName: string, params?: Record<string, unknown>) => void };
    klaviyo?: KlaviyoQueue;
  };

  const { klaviyo, ...shared } = params;

  void fetch('/api/analytics/event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event: metaEventName(name), path: window.location.pathname, params: shared }),
    keepalive: true
  }).catch(() => undefined);

  w.gtag?.('event', gaEventName(name), shared);
  w.fbq?.('track', metaEventName(name), shared);
  w.ttq?.track?.(tiktokEventName(name), shared);
  trackKlaviyo(w.klaviyo, klaviyoEventName(name), klaviyo || shared);
}

export function identifyEmail(email: string, properties: Record<string, unknown> = {}) {
  if (typeof window === 'undefined' || !email) return;
  const w = window as typeof window & { klaviyo?: KlaviyoQueue };
  const payload = { email, ...properties };
  if (typeof w.klaviyo?.identify === 'function') {
    void w.klaviyo.identify(payload);
    return;
  }
  if (Array.isArray(w.klaviyo)) w.klaviyo.push(['identify', payload]);
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
  return ({ ViewContent: 'view_item', AddToCart: 'add_to_cart', InitiateCheckout: 'begin_checkout', Purchase: 'purchase', Lead: 'generate_lead' } as Record<string, string>)[name] || name;
}

function metaEventName(name: string) {
  return ({ view_item: 'ViewContent', add_to_cart: 'AddToCart', begin_checkout: 'InitiateCheckout', purchase: 'Purchase', generate_lead: 'Lead' } as Record<string, string>)[name] || name;
}

function tiktokEventName(name: string) {
  return ({ ViewContent: 'ViewContent', AddToCart: 'AddToCart', InitiateCheckout: 'InitiateCheckout', Purchase: 'CompletePayment', Lead: 'SubmitForm' } as Record<string, string>)[name] || name;
}

function klaviyoEventName(name: string) {
  return ({ ViewContent: 'Viewed Product', AddToCart: 'Added to Cart', InitiateCheckout: 'Started Checkout', Purchase: 'Placed Order', Lead: 'Signed Up' } as Record<string, string>)[name];
}
