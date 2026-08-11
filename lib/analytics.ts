export function trackEvent(name: string, params: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return;
  const w = window as typeof window & {
    gtag?: (command: string, eventName: string, params?: Record<string, unknown>) => void;
    fbq?: (command: string, eventName: string, params?: Record<string, unknown>) => void;
    ttq?: { track?: (eventName: string, params?: Record<string, unknown>) => void };
  };

  void fetch('/api/analytics/event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event: metaEventName(name), path: window.location.pathname, params }),
    keepalive: true
  }).catch(() => undefined);

  w.gtag?.('event', gaEventName(name), params);
  w.fbq?.('track', metaEventName(name), params);
  w.ttq?.track?.(tiktokEventName(name), params);
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
