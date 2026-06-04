import Image from 'next/image';
import type { CuratedPick } from '@/types/curated';

export function CuratedPickCard({ pick }: { pick: CuratedPick }) {
  return (
    <article className="product-card curated-card">
      <a href={pick.url} className="product-image-link" aria-label={`Shop ${pick.title}`} target="_blank" rel="noopener noreferrer sponsored">
        <Image src={pick.image} alt={pick.title} width={900} height={675} />
        <span className="product-status">{pick.label || 'Recommended'}</span>
      </a>
      <div className="product-card-body">
        <p className="product-meta">{pick.source || 'External'}</p>
        <h3><a href={pick.url} target="_blank" rel="noopener noreferrer sponsored">{pick.title}</a></h3>
        {pick.description && <p>{pick.description}</p>}
        <div className="product-card-footer">
          <span className="price">{pick.price}</span>
          <a className="text-link" href={pick.url} target="_blank" rel="noopener noreferrer sponsored">Shop Now</a>
        </div>
      </div>
    </article>
  );
}

