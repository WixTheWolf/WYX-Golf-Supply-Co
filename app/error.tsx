'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('[app-error]', error);
  }, [error]);

  return (
    <section className="page-hero">
      <p className="eyebrow">Something Went Wrong</p>
      <h1>This Page Hit A Snag.</h1>
      <p>Something on our end didn&apos;t load right. Try again, or head back to shopping.</p>
      <div className="actions">
        <button className="button primary" onClick={() => reset()}>Try Again</button>
        <Link className="button secondary dark" href="/products">Shop All Gear</Link>
        <Link className="button secondary dark" href="/">Back To Home</Link>
      </div>
    </section>
  );
}
