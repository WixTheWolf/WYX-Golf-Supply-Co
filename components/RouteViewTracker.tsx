'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { trackEvent } from '@/lib/analytics';

export function RouteViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  const hasMounted = useRef(false);

  useEffect(() => {
    // The third-party scripts record the initial page load. This component
    // records subsequent App Router navigations, including filter changes.
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    const pagePath = `${pathname}${query ? `?${query}` : ''}`;
    trackEvent('PageView', { page_path: pagePath, page_title: document.title });
  }, [pathname, query]);

  return null;
}
