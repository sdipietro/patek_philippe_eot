'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './HeroCarousel.module.css';

const SLIDES = [
  {
    slug: '198385',
    src: '/watches/198385_1.png',
    title: 'Henry Graves Jr., 1925–33',
    sub: 'Mvt. 198’385 · USD 24,092,122',
  },
  {
    slug: '198023',
    src: '/watches/198023_1.jpg',
    title: 'James Ward Packard, 1925',
    sub: 'Mvt. 198’023',
  },
  {
    slug: '3200005',
    src: '/watches/3200005_1.jpg',
    title: 'Star Calibre 2000, ref. 990/1',
    sub: 'Mvt. 3’200’005 · USD 3,263,700',
  },
  {
    slug: '844400',
    src: '/watches/844400_2.jpg',
    title: 'Calibre 89, yellow gold',
    sub: 'Mvt. 844’400 · USD 5,048,313',
  },
  {
    slug: '866714',
    src: '/watches/866714_1.jpeg',
    title: 'Reference 881/1, Beyer, 1982',
    sub: 'Mvt. 866’714 · USD 154,440',
  },
  {
    slug: '80772',
    src: '/watches/80772_1.jpg',
    title: '80’772 — 1890',
    sub: 'Mvt. 80’772 · USD 527,345',
  },
  {
    slug: '866595',
    src: '/watches/866595_1.jpeg',
    title: 'Reference 962/1',
    sub: 'Mvt. 866’595 · USD 191,932',
  },
];

const INTERVAL = 3500;

export default function HeroCarousel() {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % SLIDES.length), INTERVAL);
    return () => clearInterval(id);
  }, [paused]);

  const slide = SLIDES[idx];

  return (
    <div
      className={styles.wrap}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className={styles.photo}>
        {SLIDES.map((s, i) => (
          <div
            key={s.slug}
            className={`${styles.imgWrap} ${i === idx ? styles.imgWrapActive : ''}`}
          >
            <Image
              src={s.src}
              alt={s.title}
              fill
              sizes="(max-width: 880px) 100vw, 55vw"
              style={{ objectFit: 'contain' }}
              priority={i === 0}
            />
          </div>
        ))}

        <div className={styles.caption}>
          <div className="eyebrow on-navy">Featured</div>
          <div className={styles.captionTitle}>{slide.title}</div>
          <div className={styles.captionSub}>{slide.sub}</div>
          <div className={styles.dots}>
            {SLIDES.map((_, i) => (
              <button
                key={i}
                className={`${styles.dot} ${i === idx ? styles.dotActive : ''}`}
                onClick={() => { setIdx(i); setPaused(true); }}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
