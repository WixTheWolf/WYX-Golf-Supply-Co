'use client';

import { ArrowLeft, ArrowRight } from '@phosphor-icons/react';
import { AnimatePresence, m } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import { motionTokens } from '@/lib/motion';
import type { ShopifyImage } from '@/types/shopify';

export function ProductGallery({ images, title }: { images: ShopifyImage[]; title: string }) {
  const [active, setActive] = useState(0);
  const current = images[active];

  if (!current) return <div className="lux-gallery__empty">Product imagery is being prepared.</div>;

  function step(delta: number) {
    setActive((index) => (index + delta + images.length) % images.length);
  }

  return (
    <div className="lux-gallery">
      <div className="lux-gallery__stage">
        <AnimatePresence mode="wait" initial={false}>
          <m.div key={current.url} initial={{ opacity: 0, scale: 1.015 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .99 }} transition={{ duration: .45, ease: motionTokens.ease.out }}>
            <Image src={current.url} alt={current.altText || title} fill priority={active === 0} sizes="(max-width: 900px) 100vw, 58vw" style={{ viewTransitionName: `product-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}` }} />
          </m.div>
        </AnimatePresence>
        {images.length > 1 && <div className="lux-gallery__arrows"><button onClick={() => step(-1)} aria-label="Previous image"><ArrowLeft size={18} /></button><button onClick={() => step(1)} aria-label="Next image"><ArrowRight size={18} /></button></div>}
        <span className="lux-gallery__count">{String(active + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}</span>
      </div>
      {images.length > 1 && <div className="lux-gallery__thumbs" aria-label="Product images">{images.map((image, index) => <button key={`${image.url}-${index}`} className={index === active ? 'active' : ''} onClick={() => setActive(index)} aria-label={`View product image ${index + 1}`} aria-current={index === active}><Image src={image.url} alt="" fill sizes="100px" /></button>)}</div>}
    </div>
  );
}
