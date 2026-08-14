'use client';

import { ArrowRight, ArrowsOut, Pause, Play, Wind, X } from '@phosphor-icons/react';
import { AnimatePresence, m, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { motionTokens } from '@/lib/motion';
import { useCart } from './CartProvider';

type Props = {
  productImage: string;
  productTitle: string;
  productPrice: string;
  productHref: string;
  variantId?: string;
};

const frameTransition = { duration: motionTokens.duration.cinematic, ease: motionTokens.ease.out };

export function EditorialHero({ productImage, productTitle, productPrice, productHref, variantId }: Props) {
  const heroRef = useRef<HTMLElement>(null);
  const fieldFilmRef = useRef<HTMLVideoElement>(null);
  const filmTriggerRef = useRef<HTMLButtonElement>(null);
  const filmCloseRef = useRef<HTMLButtonElement>(null);
  const filmWasOpenRef = useRef(false);
  const reducedMotion = useReducedMotion();
  const { add } = useCart();
  const [activeFrame, setActiveFrame] = useState(1);
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [filmOpen, setFilmOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const deckX = useSpring(pointerX, motionTokens.spring.glide);
  const deckY = useSpring(pointerY, motionTokens.spring.glide);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const titleY = useTransform(scrollYProgress, [0, 1], ['0%', '-12%']);
  const framesY = useTransform(scrollYProgress, [0, 1], ['0%', '5%']);
  const framesScale = useTransform(scrollYProgress, [0, 1], [1, 1.025]);

  useEffect(() => {
    const connection = navigator as Navigator & { connection?: { saveData?: boolean } };
    const wideViewport = window.matchMedia('(min-width: 761px)');
    const sync = () => setVideoEnabled(!reducedMotion && wideViewport.matches && !connection.connection?.saveData);
    sync();
    wideViewport.addEventListener('change', sync);
    return () => wideViewport.removeEventListener('change', sync);
  }, [reducedMotion]);

  useEffect(() => {
    if (!filmOpen) {
      if (filmWasOpenRef.current) filmTriggerRef.current?.focus();
      filmWasOpenRef.current = false;
      return;
    }
    filmWasOpenRef.current = true;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setFilmOpen(false);
    };
    document.body.style.overflow = 'hidden';
    window.requestAnimationFrame(() => filmCloseRef.current?.focus());
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [filmOpen]);

  useEffect(() => {
    if (!added) return;
    const timer = window.setTimeout(() => setAdded(false), 2200);
    return () => window.clearTimeout(timer);
  }, [added]);

  function reactToPointer(event: PointerEvent<HTMLElement>) {
    if (reducedMotion || event.pointerType === 'touch') return;
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 8);
    pointerY.set(((event.clientY - bounds.top) / bounds.height - 0.5) * 6);
  }

  function resetPointer() {
    pointerX.set(0);
    pointerY.set(0);
  }

  async function toggleFilm() {
    const video = fieldFilmRef.current;
    if (!video) return;
    if (video.paused) {
      await video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }

  async function addFeaturedProduct() {
    if (!variantId || adding) return;
    setAdding(true);
    const success = await add(variantId);
    setAdding(false);
    if (success) setAdded(true);
  }

  return (
    <section className="cine-hero" ref={heroRef} onPointerMove={reactToPointer} onPointerLeave={resetPointer} aria-labelledby="cine-hero-title">
      <m.div className="cine-title" style={{ y: titleY }} aria-hidden="true">
        {['The', 'Round', 'Starts', 'Here.'].map((line, index) => (
          <span key={line}><m.i initial={{ y: '112%' }} animate={{ y: 0 }} transition={{ ...frameTransition, delay: 0.08 + index * 0.07 }}>{line}</m.i></span>
        ))}
      </m.div>

      <h1 className="sr-only" id="cine-hero-title">The round starts here.</h1>

      <m.div className="cine-deck" style={{ x: deckX, y: deckY }}>
        <div className="cine-deck__labels" aria-hidden="true"><span>01</span><span>02</span><span>03</span><em>WYX 400 / Field film</em></div>

        <m.div className="cine-frames" style={{ y: framesY, scale: framesScale }}>
          <m.article className={`cine-frame cine-frame--detail ${activeFrame === 0 ? 'is-active' : ''}`} initial={{ opacity: 0, clipPath: 'inset(0 100% 0 0)' }} animate={{ opacity: 1, clipPath: 'inset(0 0% 0 0)' }} transition={{ ...frameTransition, delay: 0.16 }} onPointerEnter={() => setActiveFrame(0)}>
            <button type="button" className="cine-frame__hit" onClick={() => setActiveFrame(0)} aria-label="Focus on WYX bag details"><Image src="/images/leather-bag-detail.png" alt="Forest leather WYX golf bag with brass hardware" fill priority fetchPriority="high" sizes="(max-width: 760px) 82vw, 31vw" /></button>
            <span className="cine-frame__note">WYX Field Notes</span><span className="cine-frame__stock">400 / 11</span>
          </m.article>

          <m.article className={`cine-frame cine-frame--field ${activeFrame === 1 ? 'is-active' : ''}`} initial={{ opacity: 0, clipPath: 'inset(100% 0 0 0)' }} animate={{ opacity: 1, clipPath: 'inset(0% 0 0 0)' }} transition={{ ...frameTransition, delay: 0.24 }} onPointerEnter={() => setActiveFrame(1)}>
            <button ref={filmTriggerRef} type="button" className="cine-frame__hit" onClick={() => setFilmOpen(true)} aria-label="Open the WYX field film">
              <Image src="/images/walking-golfer-lifestyle..png" alt="Golfer walking toward a coastal first tee at golden hour" fill priority fetchPriority="high" sizes="(max-width: 760px) 82vw, 32vw" />
              {videoEnabled && <video ref={fieldFilmRef} className={videoReady ? 'cine-frame__film is-ready' : 'cine-frame__film'} src="/video/wyx-first-tee-loop.mp4" poster="/images/walking-golfer-lifestyle..png" muted autoPlay loop playsInline preload="metadata" aria-hidden="true" onCanPlay={() => setVideoReady(true)} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} />}
              <span className="cine-frame__play"><Play size={13} weight="fill" /> Play field film</span><ArrowsOut className="cine-frame__expand" size={17} aria-hidden="true" />
            </button>
            <span className="cine-frame__stock">400 / 12</span>
          </m.article>

          <m.article className={`cine-frame cine-frame--product ${activeFrame === 2 ? 'is-active' : ''}`} initial={{ opacity: 0, clipPath: 'inset(0 0 0 100%)' }} animate={{ opacity: 1, clipPath: 'inset(0 0 0 0%)' }} transition={{ ...frameTransition, delay: 0.32 }} onPointerEnter={() => setActiveFrame(2)}>
            <Link className="cine-frame__hit" href={productHref} aria-label={`View ${productTitle}`}><Image src={productImage} alt={productTitle} fill priority sizes="(max-width: 760px) 82vw, 25vw" /><span className="cine-frame__product-copy"><small>Current edit / 03</small><strong>{productTitle}</strong><b>{productPrice}</b></span></Link>
            <span className="cine-frame__stock">400 / 12</span>
          </m.article>
        </m.div>
      </m.div>

      <m.div className="cine-meta" initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ ...frameTransition, delay: 0.42 }}>
        <div className="cine-meta__notes"><p>WYX Field Notes / Vol. 04</p><div><span>Tee time <strong>6:42 PM</strong></span><span>Hole 01 <strong>418 YDS</strong></span><span><Wind size={15} /> Wind <strong>7 MPH</strong></span></div></div>
        <div className="cine-meta__buy">
          <small>Shop the edit</small><Link href={productHref}>{productTitle} <span>/ {productPrice}</span></Link>
          {variantId ? <button type="button" onClick={addFeaturedProduct} disabled={adding}>{added ? 'Added to bag' : adding ? 'Adding…' : `Add to bag — ${productPrice}`} <ArrowRight size={17} weight="bold" /></button> : <Link className="cine-meta__buy-link" href={productHref}>Choose options <ArrowRight size={17} weight="bold" /></Link>}
        </div>
        <div className="cine-scrub"><span>Drag to scrub</span><input aria-label="Scrub through WYX field notes" type="range" min="0" max="2" step="1" value={activeFrame} onChange={(event) => setActiveFrame(Number(event.target.value))} /><b>0{activeFrame + 1}</b>{videoEnabled && <button type="button" className="cine-meta__film-toggle" onClick={toggleFilm} aria-label={isPlaying ? 'Pause field film' : 'Play field film'}>{isPlaying ? <Pause size={13} weight="fill" /> : <Play size={13} weight="fill" />}</button>}</div>
      </m.div>

      <AnimatePresence>
        {filmOpen && <m.div className="cine-film-modal" role="dialog" aria-modal="true" aria-label="WYX field film" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <m.div className="cine-film-modal__media" initial={{ clipPath: 'inset(50% 0 50% 0)' }} animate={{ clipPath: 'inset(0% 0 0% 0)' }} exit={{ clipPath: 'inset(50% 0 50% 0)' }} transition={{ duration: 0.72, ease: motionTokens.ease.inOut }}><video src="/video/wyx-field-film-v2.mp4" poster="/video/wyx-field-film-poster.webp" autoPlay muted loop playsInline /></m.div>
          <div className="cine-film-modal__chrome"><p>WYX Field Film <span>/ 00:10</span></p><button ref={filmCloseRef} type="button" onClick={() => setFilmOpen(false)} aria-label="Close field film"><X size={22} /></button><strong>The round<br />starts here.</strong></div>
        </m.div>}
      </AnimatePresence>
    </section>
  );
}
