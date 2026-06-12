'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';

export function MetaLandingTracker({
  contentName,
  contentIds
}: {
  contentName: string;
  contentIds: string[];
}) {
  useEffect(() => {
    trackEvent('ViewContent', {
      content_name: contentName,
      content_type: 'landing_page',
      content_ids: contentIds.slice(0, 6)
    });
  }, [contentName, contentIds]);

  return null;
}