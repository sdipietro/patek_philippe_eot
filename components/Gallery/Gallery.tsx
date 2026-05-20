'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import styles from './Gallery.module.css';

type GalleryProps = {
  photos: string[];
  title: string;
  imgKind: 'auction' | 'archival';
  caption?: string | null;
};

export default function Gallery({ photos, title, imgKind, caption }: GalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);
  const isArchival = imgKind === 'archival';

  const openLightbox = useCallback((idx: number) => {
    setLightboxIdx(idx);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => setLightboxOpen(false), []);

  const lbPrev = useCallback(
    () => setLightboxIdx((i) => (i - 1 + photos.length) % photos.length),
    [photos.length],
  );

  const lbNext = useCallback(
    () => setLightboxIdx((i) => (i + 1) % photos.length),
    [photos.length],
  );

  useEffect(() => {
    if (!lightboxOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') lbPrev();
      if (e.key === 'ArrowRight') lbNext();
    };
    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [lightboxOpen, closeLightbox, lbPrev, lbNext]);

  if (photos.length === 0) {
    return (
      <div className={styles.galleryMain}>
        <div className={styles.noPhoto}>
          <span className={styles.noPhotoTitle}>No photograph available</span>
          <span className={styles.noPhotoSub}>
            Photographs will be added as licensed substitutes are obtained.
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={styles.gallery}>
        {/* Main photo — click opens lightbox */}
        <button
          type="button"
          className={clsx(styles.galleryMain, isArchival && styles.galleryMainArchival)}
          onClick={() => openLightbox(activeIdx)}
          aria-label={`Enlarge photograph ${activeIdx + 1} of ${photos.length}`}
        >
          <Image
            src={`/watches/${photos[activeIdx]}`}
            alt={`${title} — photograph ${activeIdx + 1}`}
            width={700}
            height={525}
            className={clsx(styles.galleryImg, isArchival && styles.galleryImgArchival)}
            style={{ maxWidth: '92%', maxHeight: '92%', objectFit: 'contain', mixBlendMode: 'multiply' }}
            priority
          />
          <div className={styles.galleryOverlay} aria-hidden="true">
            <span className={styles.galleryCounter}>
              {activeIdx + 1} / {photos.length}
            </span>
            <span className={styles.galleryZoom}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="6.5" />
                <path d="M16 16l4.5 4.5" />
                <path d="M8 11h6M11 8v6" />
              </svg>
              Enlarge
            </span>
          </div>
        </button>

        {/* Thumbnail strip */}
        {photos.length > 1 && (
          <div className={styles.thumbs} role="list" aria-label="Additional photographs">
            {photos.map((photo, i) => (
              <button
                key={photo}
                type="button"
                role="listitem"
                className={clsx(styles.thumb, i === activeIdx && styles.thumbActive)}
                onClick={() => setActiveIdx(i)}
                aria-label={`Photograph ${i + 1}`}
                aria-pressed={i === activeIdx}
              >
                <Image
                  src={`/watches/${photo}`}
                  alt=""
                  width={120}
                  height={120}
                  className={clsx(styles.thumbImg, isArchival && styles.thumbImgArchival)}
                  style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain', mixBlendMode: 'multiply' }}
                />
              </button>
            ))}
          </div>
        )}

        {/* Source caption */}
        {caption && <p className={styles.caption}>{caption}</p>}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          aria-label={`Photograph ${lightboxIdx + 1} of ${photos.length}: ${title}`}
          onClick={closeLightbox}
        >
          {/* Inner — stop propagation so clicking image doesn't close */}
          <div
            className={styles.lightboxInner}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={`/watches/${photos[lightboxIdx]}`}
              alt={`${title} — photograph ${lightboxIdx + 1} of ${photos.length}`}
              width={1400}
              height={1050}
              className={clsx(styles.lightboxImg, isArchival && styles.lightboxImgArchival)}
              style={{
                maxWidth: '88vw',
                maxHeight: '80vh',
                width: 'auto',
                height: 'auto',
                objectFit: 'contain',
              }}
            />
          </div>

          {/* Controls bar — separate from inner so clicking it doesn't propagate to backdrop */}
          <div className={styles.lightboxBar} onClick={(e) => e.stopPropagation()}>
            <span className={styles.lightboxCounter}>
              {lightboxIdx + 1} / {photos.length}
            </span>
            <div className={styles.lightboxControls}>
              {photos.length > 1 && (
                <>
                  <button
                    type="button"
                    className={styles.lightboxNav}
                    onClick={lbPrev}
                    aria-label="Previous photograph"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    className={styles.lightboxNav}
                    onClick={lbNext}
                    aria-label="Next photograph"
                  >
                    →
                  </button>
                </>
              )}
              <button
                type="button"
                className={styles.lightboxClose}
                onClick={closeLightbox}
                aria-label="Close lightbox"
              >
                <span aria-hidden="true">✕</span>
                <kbd className={styles.lightboxKbd}>ESC</kbd>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
