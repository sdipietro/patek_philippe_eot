'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { RECORDS } from '@/lib/records';
import Tag from '@/components/Tag/Tag';
import styles from './TimelineScrubber.module.css';

const MIN_Y = 1860;
const MAX_Y = 2005;
const DECADES = Array.from({ length: 16 }, (_, i) => 1860 + i * 10);

function pct(y: number) {
  return ((y - MIN_Y) / (MAX_Y - MIN_Y)) * 100;
}

export default function TimelineScrubber() {
  const records = useMemo(
    () => [...RECORDS].filter((r) => r.mnfctYear).sort((a, b) => (a.mnfctYear ?? 0) - (b.mnfctYear ?? 0)),
    [],
  );

  const [year, setYear] = useState(MIN_Y);
  const [playing, setPlaying] = useState(false);
  const railRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  // Auto-play
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setYear((y) => {
        const next = y + 0.6;
        if (next >= MAX_Y) { setPlaying(false); return MAX_Y; }
        return next;
      });
    }, 35);
    return () => clearInterval(id);
  }, [playing]);

  const yearAtEvent = useCallback((clientX: number) => {
    const rail = railRef.current;
    if (!rail) return MIN_Y;
    const rect = rail.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    return MIN_Y + (x / rect.width) * (MAX_Y - MIN_Y);
  }, []);

  // Pointer drag on the rail
  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      setPlaying(false);
      dragging.current = true;
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      setYear(yearAtEvent(e.clientX));
    },
    [yearAtEvent],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current) return;
      setYear(yearAtEvent(e.clientX));
    },
    [yearAtEvent],
  );

  const onPointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  // Active record: latest with mnfctYear ≤ year
  const active = useMemo(() => {
    const candidates = records.filter((r) => (r.mnfctYear ?? 0) <= year);
    if (!candidates.length) return records[0];
    return candidates.reduce((best, r) =>
      (r.mnfctYear ?? 0) >= (best.mnfctYear ?? 0) ? r : best,
    );
  }, [year, records]);

  const activePhoto = active.photos[0];

  return (
    <div className={styles.scrubber}>
      {/* Readout bar */}
      <div className={styles.readout}>
        <button
          className={`${styles.playBtn} ${playing ? styles.playing : ''}`}
          onClick={() => {
            if (year >= MAX_Y) setYear(MIN_Y);
            setPlaying((p) => !p);
          }}
          aria-label={playing ? 'Pause' : 'Play'}
        >
          {playing ? (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <rect x="6" y="5" width="4" height="14" /><rect x="14" y="5" width="4" height="14" />
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M6 4l14 8-14 8z" />
            </svg>
          )}
        </button>

        <div className={styles.yearDisplay}>{Math.floor(year)}</div>

        <div className={styles.readoutLabel}>
          <div className={styles.readoutLabelText}>Latest movement at this date</div>
          <Link href={`/archive/${active.slug}`} className={styles.activeTitle}>
            {active.movement ? `Movement ${active.movement}` : `Reference ${active.ref}`}
            <span className={styles.sep}>&middot;</span>
            <span className={styles.activeYear}>{active.mnfctYear}</span>
          </Link>
        </div>

        <button
          className={styles.resetBtn}
          onClick={() => { setPlaying(false); setYear(MIN_Y); }}
        >
          Reset
        </button>
      </div>

      {/* Rail */}
      <div
        className={styles.rail}
        ref={railRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        role="slider"
        aria-label="Timeline year"
        aria-valuemin={MIN_Y}
        aria-valuemax={MAX_Y}
        aria-valuenow={Math.floor(year)}
      >
        <div className={styles.railTrack} />
        <div className={styles.fill} style={{ width: `${pct(year)}%` }} />

        {/* Decade ticks */}
        {DECADES.map((d) => (
          <div key={d} className={styles.tick} style={{ left: `${pct(d)}%` }}>
            <span className={styles.tickLine} />
            <span className={styles.tickLabel}>{d}</span>
          </div>
        ))}

        {/* Watch nodes */}
        {records.map((r) => {
          const isActive = r.slug === active.slug;
          const isPast = (r.mnfctYear ?? 0) <= year;
          return (
            <button
              key={r.slug}
              className={`${styles.node} ${isPast ? styles.nodePast : ''} ${isActive ? styles.nodeActive : ''}`}
              style={{ left: `${pct(r.mnfctYear ?? MIN_Y)}%` }}
              onClick={(e) => { e.stopPropagation(); setPlaying(false); setYear(r.mnfctYear ?? MIN_Y); }}
              title={`${r.mnfctYear} — ${r.movement ?? r.ref ?? r.slug}`}
              aria-label={`Select ${r.mnfctYear}: ${r.title}`}
            />
          );
        })}

        {/* Scrubber marker */}
        <div className={styles.marker} style={{ left: `${pct(year)}%` }}>
          <span className={styles.markerStem} />
          <span className={styles.markerHead} />
        </div>
      </div>

      {/* Feature card */}
      <div className={styles.feature}>
        <div className={`${styles.featurePhoto} ${active.imgKind === 'archival' ? styles.featurePhotoArchival : ''}`}>
          {activePhoto ? (
            <Image
              src={`/watches/${activePhoto}`}
              alt={active.title}
              width={280}
              height={280}
              className={styles.featureImg}
            />
          ) : (
            <div className={styles.featureNoImg}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="13" r="7" /><path d="M12 9.5v3.5l2.4 1.6" /><path d="M9.5 3.5h5l-.8 2.5h-3.4z" />
              </svg>
              <div>No photograph recorded</div>
            </div>
          )}
        </div>

        <div className={styles.featureBody}>
          <div className="eyebrow">At year {Math.floor(year)}</div>
          <hr className="gold-rule" style={{ margin: '10px 0 14px' }} />
          <h3 className={styles.featureTitle}>{active.title}</h3>
          <p className={styles.featureNotes}>{active.notes}</p>
          <div className={styles.featureMeta}>
            {active.movement && (
              <span><span className={styles.metaLabel}>Movement</span> <span className={styles.metaMono}>{active.movement}</span></span>
            )}
            {active.ref && (
              <span><span className={styles.metaLabel}>Ref.</span> <span className={styles.metaMono}>{active.ref}</span></span>
            )}
            <span><span className={styles.metaLabel}>Made</span> <span className={styles.metaMono}>{active.mnfctYear}</span></span>
          </div>
          <div className={styles.tags}>
            {active.complications.slice(0, 5).map((t, i) => (
              <Tag key={i} kind={t.kind} label={t.label} />
            ))}
          </div>
          <div className={styles.featureLink}>
            <Link href={`/archive/${active.slug}`} className={styles.openLink}>
              Open full record →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
