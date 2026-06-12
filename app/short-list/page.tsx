import type { Metadata } from 'next';
import curatedPicks from '@/data/curated-picks.json';
import { CuratedPickCard } from '@/components/CuratedPickCard';
import type { CuratedPick } from '@/types/curated';

export const metadata: Metadata = {
  title: 'The Short List',
  description: 'A manually curated WYX Golf Co. watchlist of golf gifts, trip gear, and bag upgrades worth reviewing.',
  robots: { index: false, follow: true }
};

export default function ShortListPage() {
  const picks = curatedPicks as CuratedPick[];
  return (
    <>
      <section className="page-hero compact">
        <p className="eyebrow">The Short List</p>
        <h1>Golf Gear We Are Watching.</h1>
        <p>External finds, supplier candidates, and future WYX drop ideas. These are recommendations and sourcing targets, not Shopify inventory unless they appear in the main shop.</p>
      </section>
      <section className="section product-section">
        <div className="results-heading">
          <p className="eyebrow">Curated Picks</p>
          <span>{picks.length} recommended</span>
        </div>
        <div className="product-grid">{picks.map((pick) => <CuratedPickCard key={pick.url} pick={pick} />)}</div>
      </section>
    </>
  );
}

