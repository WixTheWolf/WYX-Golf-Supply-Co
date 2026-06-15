'use client';

import { useRef } from 'react';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  label: string;
};

export function ProductCarousel({ children, label }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);

  function scroll(direction: 'left' | 'right') {
    const el = trackRef.current;
    if (!el) return;
    const amount = Math.round(el.clientWidth * 0.85);
    el.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
  }

  return (
    <div className="product-carousel" aria-label={label}>
      <div className="product-carousel-controls">
        <button type="button" className="carousel-btn" onClick={() => scroll('left')} aria-label="Scroll left">←</button>
        <button type="button" className="carousel-btn" onClick={() => scroll('right')} aria-label="Scroll right">→</button>
      </div>
      <div className="product-carousel-track" ref={trackRef}>
        {children}
      </div>
    </div>
  );
}