'use client';

import { ArrowDown, ArrowUpRight, Pause, Play } from '@phosphor-icons/react';
import { m, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState, type PointerEvent } from 'react';
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const reducedMotion = useReducedMotion();
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const copyY = useTransform(scrollYProgress, [0, 1], ['0%', '-7%']);
  const mediaY = useTransform(scrollYProgress, [0, 1], ['0%', '5%']);
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1, 1.055]);
  const insetX = useMotionValue(0);
  const insetY = useMotionValue(0);
  const insetSpringX = useSpring(insetX, motionTokens.spring.soft);
  const insetSpringY = useSpring(insetY, motionTokens.spring.soft);

  useEffect(() => {
    const connection = navigator as Navigator & { connection?: { saveData?: boolean } };
    const wideViewport = window.matchMedia('(min-width: 761px)');
    const sync = () => setVideoEnabled(!reducedMotion && wideViewport.matches && !connection.connection?.saveData);
    sync();
    wideViewport.addEventListener('change', sync);
    return () => wideViewport.removeEventListener('change', sync);
  }, [reducedMotion]);

  function reactToPointer(event: PointerEvent<HTMLElement>) {
    if (reducedMotion || event.pointerType === 'touch') return;
    const bounds = event.currentTarget.getBoundingClientRect();
    insetX.set(((event.clientX - bounds.left) / bounds.width - .5) * 12);
    insetY.set(((event.clientY - bounds.top) / bounds.height - .5) * 10);
  }

  function resetPointer() {
    insetX.set(0);
    insetY.set(0);
  }

  async function toggleFilm() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      await video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }

  return (
    <section className="lux-hero" ref={ref} onPointerMove={reactToPointer} onPointerLeave={resetPointer}>
      <m.div className="lux-hero__image" style={{ y: mediaY, scale: mediaScale }}>
        <Image src={mainImage} alt="A golfer wearing a selection from the WYX edit" fill priority fetchPriority="high" sizes="(max-width: 900px) 100vw, 78vw" style={{ objectPosition: position }} />
        {videoEnabled && (
          <video
            ref={videoRef}
            className={videoReady ? 'lux-hero__film is-ready' : 'lux-hero__film'}
            src="/video/wyx-field-film.mp4"
            poster="/video/wyx-field-film-poster.webp"
            muted
            autoPlay
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
            onCanPlay={() => setVideoReady(true)}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
        )}
      </m.div>
      <div className="lux-hero__shade" />
      <m.div className="lux-hero__inset" style={{ x: insetSpringX, y: insetSpringY }} initial={{ opacity: 0, scale: .9, clipPath: 'inset(0 100% 0 0)' }} animate={{ opacity: 1, scale: 1, clipPath: 'inset(0 0% 0 0)' }} transition={{ delay: .48, duration: .78, ease: motionTokens.ease.out }}>
        <Image src={insetImage} alt="A close-up from the current WYX edit" fill sizes="(max-width: 900px) 38vw, 18vw" />
      </m.div>
      <m.div className="lux-hero__copy" style={{ y: copyY }}>
        <m.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .18, duration: .5, ease: motionTokens.ease.out }}>WYX Golf Supply Co. / The Edit</m.p>
        <h1 aria-label="Golf's best stuff. One place.">
          <span className="lux-hero__line"><m.span initial={{ y: '112%' }} animate={{ y: 0 }} transition={{ delay: .1, duration: .82, ease: motionTokens.ease.out }}>Golf&apos;s best stuff.</m.span></span>
          <span className="lux-hero__line"><m.span initial={{ y: '112%' }} animate={{ y: 0 }} transition={{ delay: .18, duration: .82, ease: motionTokens.ease.out }}>One place.</m.span></span>
        </h1>
        <m.p className="lux-hero__lede" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .54, duration: .58, ease: motionTokens.ease.out }}>Polos worth wearing. Bag details worth showing off. WYX cuts through the noise and keeps the golf products worth knowing about.</m.p>
        <m.div className="lux-hero__actions" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .64, duration: .55, ease: motionTokens.ease.out }}><Link href="/products">Shop the edit <ArrowUpRight size={14} weight="bold" /></Link><Link href="/apparel">Explore apparel</Link></m.div>
      </m.div>
      <m.aside className="lux-hero__rail" initial={{ x: '100%' }} animate={{ x: 0 }} transition={{ delay: .18, duration: .82, ease: motionTokens.ease.out }}>
        <div className="lux-hero__rail-top"><span>Available now</span><span>01 — 04</span></div>
        <div>
          <p>WYX Pick / 001</p>
          <h2>{productTitle}</h2>
          <p>{productDescription}</p>
          <Link href={productHref}>Shop the pick <ArrowUpRight size={14} weight="bold" /></Link>
        </div>
        <a className="lux-hero__scroll" href="#current-edit"><ArrowDown size={15} /> Scroll to explore</a>
      </m.aside>
      {videoEnabled && (
        <m.button className="lux-hero__film-control" type="button" onClick={toggleFilm} aria-label={isPlaying ? 'Pause field film' : 'Play field film'} initial={{ opacity: 0 }} animate={{ opacity: videoReady ? 1 : 0 }} transition={{ duration: .35 }}>
          {isPlaying ? <Pause size={12} weight="fill" /> : <Play size={12} weight="fill" />}
          <span>Field film / 00:09</span>
        </m.button>
      )}
    </section>
  );
}
