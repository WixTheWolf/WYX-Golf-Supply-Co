'use client';

import { ArrowRight, Pause, Play, Wind, X } from '@phosphor-icons/react';
import { AnimatePresence, m, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { motionTokens } from '@/lib/motion';
import { useCart } from './CartProvider';

type Props = {
  productTitle: string;
  productPrice: string;
  productHref: string;
  variantId?: string;
};

const entrance = { duration: motionTokens.duration.cinematic, ease: motionTokens.ease.out };
const sceneTimes = [0.15, 3.8, 7.15];
const scenes = [
  { number: '01', label: 'Bag detail' },
  { number: '02', label: 'First tee' },
  { number: '03', label: 'Current edit' },
];

export function EditorialHero({ productTitle, productPrice, productHref, variantId }: Props) {
  const heroRef = useRef<HTMLElement>(null);
  const fieldFilmRef = useRef<HTMLVideoElement>(null);
  const filmTriggerRef = useRef<HTMLButtonElement>(null);
  const filmCloseRef = useRef<HTMLButtonElement>(null);
  const filmWasOpenRef = useRef(false);
  const reducedMotion = useReducedMotion();
  const { add } = useCart();
  const [activeScene, setActiveScene] = useState(0);
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [filmOpen, setFilmOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1, 1.075]);
  const copyY = useTransform(scrollYProgress, [0, 1], ['0%', '-7%']);

  useEffect(() => {
    const connection = navigator as Navigator & { connection?: { saveData?: boolean } };
    setVideoEnabled(!reducedMotion && !connection.connection?.saveData);
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

  function syncScene() {
    const time = fieldFilmRef.current?.currentTime ?? 0;
    setActiveScene(time < 3.4 ? 0 : time < 6.8 ? 1 : 2);
  }

  async function selectScene(index: number) {
    setActiveScene(index);
    const video = fieldFilmRef.current;
    if (!video || !videoEnabled) return;
    video.currentTime = sceneTimes[index];
    try {
      await video.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  }

  async function toggleFilm() {
    const video = fieldFilmRef.current;
    if (!video) return;
    if (video.paused) {
      try {
        await video.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
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
    <section className="film-hero" ref={heroRef} aria-labelledby="film-hero-title">
      <m.div className="film-hero__media" style={{ scale: mediaScale }} aria-hidden="true">
        <Image src="/images/walking-golfer-lifestyle..png" alt="" fill priority fetchPriority="high" sizes="100vw" />
        {videoEnabled && (
          <video
            ref={fieldFilmRef}
            className={videoReady ? 'is-ready' : ''}
            src="/video/wyx-field-film-v2.mp4"
            poster="/images/walking-golfer-lifestyle..png"
            muted
            autoPlay
            loop
            playsInline
            preload="metadata"
            onCanPlay={() => setVideoReady(true)}
            onTimeUpdate={syncScene}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
        )}
      </m.div>
      <div className="film-hero__veil" aria-hidden="true" />

      <div className="film-hero__safe">
        <m.div className="film-hero__copy" style={{ y: copyY }}>
          <m.p className="film-hero__kicker" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ ...entrance, delay: 0.08 }}>
            WYX Field Notes <span>/ Film 004</span>
          </m.p>
          <h1 id="film-hero-title">
            <span><m.i initial={{ y: '108%' }} animate={{ y: 0 }} transition={{ ...entrance, delay: 0.12 }}>The round</m.i></span>
            <span><m.i initial={{ y: '108%' }} animate={{ y: 0 }} transition={{ ...entrance, delay: 0.2 }}>starts here.</m.i></span>
          </h1>
          <m.p className="film-hero__lede" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ ...entrance, delay: 0.32 }}>
            Golf&apos;s best stuff. One sharp edit. Built for the walk, the flight, and whatever happens after eighteen.
          </m.p>
          <m.div className="film-hero__actions" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ ...entrance, delay: 0.4 }}>
            <Link href="#current-edit">Enter the edit <ArrowRight size={17} weight="bold" /></Link>
            <button ref={filmTriggerRef} type="button" onClick={() => setFilmOpen(true)}><Play size={12} weight="fill" /> Watch field film</button>
          </m.div>
        </m.div>

        <m.aside className="film-hero__product" initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} transition={{ ...entrance, delay: 0.46 }} aria-label="Current WYX edit">
          <div className="film-hero__product-status"><span>Current edit / 03</span><b>Available now</b></div>
          <Link className="film-hero__product-title" href={productHref}>{productTitle}</Link>
          <p>Picked for the texture, the color, and the clean trip from first tee to post-round.</p>
          {variantId ? (
            <button className="film-hero__product-buy" type="button" onClick={addFeaturedProduct} disabled={adding}>
              <span>{added ? 'Added to bag' : adding ? 'Adding…' : 'Add to bag'}</span><b>{productPrice}</b><ArrowRight size={17} weight="bold" />
            </button>
          ) : (
            <Link className="film-hero__product-buy" href={productHref}><span>Choose options</span><b>{productPrice}</b><ArrowRight size={17} weight="bold" /></Link>
          )}
        </m.aside>

        <m.div className="film-hero__rail" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ...entrance, delay: 0.52 }}>
          <div className="film-hero__conditions"><Wind size={15} /><span>Golden hour</span><b>7 MPH</b></div>
          <div className="film-hero__scenes" aria-label="Field film scenes">
            {scenes.map((scene, index) => (
              <button type="button" key={scene.number} onClick={() => selectScene(index)} aria-pressed={activeScene === index}>
                <span>{scene.number}</span><b>{scene.label}</b><i aria-hidden="true" />
              </button>
            ))}
          </div>
          {videoEnabled && <button type="button" className="film-hero__toggle" onClick={toggleFilm} aria-label={isPlaying ? 'Pause field film' : 'Play field film'}>{isPlaying ? <Pause size={14} weight="fill" /> : <Play size={14} weight="fill" />}</button>}
        </m.div>
      </div>

      <AnimatePresence>
        {filmOpen && (
          <m.div className="cine-film-modal" role="dialog" aria-modal="true" aria-label="WYX field film" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <m.div className="cine-film-modal__media" initial={{ clipPath: 'inset(50% 0 50% 0)' }} animate={{ clipPath: 'inset(0% 0 0% 0)' }} exit={{ clipPath: 'inset(50% 0 50% 0)' }} transition={{ duration: 0.72, ease: motionTokens.ease.inOut }}>
              <video src="/video/wyx-field-film-v2.mp4" poster="/video/wyx-field-film-poster.webp" autoPlay muted loop playsInline />
            </m.div>
            <div className="cine-film-modal__chrome">
              <p>WYX Field Film <span>/ 00:10</span></p>
              <button ref={filmCloseRef} type="button" onClick={() => setFilmOpen(false)} aria-label="Close field film"><X size={22} /></button>
              <strong>The round<br />starts here.</strong>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </section>
  );
}
