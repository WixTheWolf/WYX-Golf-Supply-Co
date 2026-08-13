'use client';

import { AnimatePresence, m, useMotionValueEvent, useScroll } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { ArrowUpRight } from '@phosphor-icons/react';
import { motionTokens } from '@/lib/motion';

export type StoryItem = { number: string; kicker: string; title: string; body: string; href: string; image: string };

export function EditorialStory({ items }: { items: StoryItem[] }) {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    const next = Math.min(items.length - 1, Math.floor(progress * items.length));
    setActive((current) => current === next ? current : next);
  });

  if (!items.length) return null;

  return (
    <section className="lux-story" ref={ref} style={{ '--story-count': items.length } as React.CSSProperties}>
      <div className="lux-story__sticky">
        <div className="lux-story__copy">
          <p className="lux-kicker">The WYX standard / In practice</p>
          <AnimatePresence mode="wait">
            <m.div key={items[active].number} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} transition={{ duration: motionTokens.duration.standard, ease: motionTokens.ease.out }}>
              <span>{items[active].number} / {String(items.length).padStart(2, '0')}</span>
              <p>{items[active].kicker}</p>
              <h2>{items[active].title}</h2>
              <p>{items[active].body}</p>
              <Link href={items[active].href}>Explore the pick <ArrowUpRight size={15} weight="bold" /></Link>
            </m.div>
          </AnimatePresence>
          <div className="lux-story__progress">{items.map((item, index) => <span key={item.number} className={index === active ? 'active' : ''} />)}</div>
        </div>
        <div className="lux-story__visual">
          <AnimatePresence mode="popLayout" initial={false}>
            <m.div key={items[active].image} initial={{ opacity: 0, scale: 1.035 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .985 }} transition={{ duration: .55, ease: motionTokens.ease.out }}>
              <Image src={items[active].image} alt={items[active].title} fill sizes="(max-width: 900px) 100vw, 55vw" />
            </m.div>
          </AnimatePresence>
          <p>{items[active].number} / Selected because it earns the space.</p>
        </div>
      </div>
    </section>
  );
}
