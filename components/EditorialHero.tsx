'use client';

import { ArrowDown, ArrowUpRight } from '@phosphor-icons/react';
import { m, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import { motionTokens } from '@/lib/motion';

type Props = {
  mainImage: string;
  insetImage: string;
  productTitle: string;
  productDescription: string;
  productHref: string;
  position?: string;
};

export function EditorialHero({ mainImage, insetImage, productTitle, productDescription, productHref, position = '50% 50%' }: Props) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const copyY = useTransform(scrollYProgress, [0, 1], ['0%', '-7%']);

  return (
    <section className="lux-hero" ref={ref}>
      <div className="lux-hero__image">
        <Image src={mainImage} alt="A golfer wearing a selection from the WYX edit" fill priority fetchPriority="high" sizes="(max-width: 900px) 100vw, 78vw" style={{ objectPosition: position }} />
      </div>
      <div className="lux-hero__shade" />
      <m.div className="lux-hero__inset" initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: .28, duration: .7, ease: motionTokens.ease.out }}>
        <Image src={insetImage} alt="A close-up from the current WYX edit" fill sizes="(max-width: 900px) 38vw, 18vw" />
      </m.div>
      <m.div className="lux-hero__copy" style={{ y: copyY }} initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .12, duration: .72, ease: motionTokens.ease.out }}>
        <p>WYX Golf Supply Co. / The Edit</p>
        <h1>Golf&apos;s best stuff.<br />One place.</h1>
        <p className="lux-hero__lede">Polos worth wearing. Bag details worth showing off. WYX cuts through the noise and keeps the golf products worth knowing about.</p>
        <div className="lux-hero__actions"><Link href="/products">Shop the edit <ArrowUpRight size={14} weight="bold" /></Link><Link href="/apparel">Explore apparel</Link></div>
      </m.div>
      <aside className="lux-hero__rail">
        <div className="lux-hero__rail-top"><span>Available now</span><span>01 — 04</span></div>
        <div>
          <p>WYX Pick / 001</p>
          <h2>{productTitle}</h2>
          <p>{productDescription}</p>
          <Link href={productHref}>Shop the pick <ArrowUpRight size={14} weight="bold" /></Link>
        </div>
        <a className="lux-hero__scroll" href="#current-edit"><ArrowDown size={15} /> Scroll to explore</a>
      </aside>
    </section>
  );
}
