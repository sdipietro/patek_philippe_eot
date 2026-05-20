'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { RECORDS } from '@/lib/records';
import { searchRecords } from '@/lib/search';
import { useSearch } from '@/components/SearchProvider/SearchProvider';
import styles from './SearchOverlay.module.css';

const SUGGESTIONS = ["Calibre 89", "Graves", "Beyer", "Antiquorum", "Sotheby's", "Minute Repeater", "1925", "962/1"];
const FEATURED = [...RECORDS]
  .filter((r) => r.priceRealizedUSD)
  .sort((a, b) => (b.priceRealizedUSD ?? 0) - (a.priceRealizedUSD ?? 0))
  .slice(0, 3);

function highlight(text: string, query: string): React.ReactNode {
  if (!query || !text) return text;
  const q = query.trim();
  if (!q) return text;
  const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = String(text).split(re);
  return parts.map((p, i) => (re.test(p) ? <mark key={i} className={styles.hl}>{p}</mark> : p));
}

export default function SearchOverlay() {
  const { isOpen, closeSearch } = useSearch();
  const [q, setQ] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 40);
    } else {
      setQ('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeSearch(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, closeSearch]);

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const query = q.trim().toLowerCase();
  const hits = searchRecords(RECORDS, query);

  const navigate = (slug: string) => {
    closeSearch();
    router.push(`/archive/${slug}`);
  };

  return (
    <div className={styles.overlay} onClick={closeSearch} role="dialog" aria-modal="true" aria-label="Search the archive">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Search header */}
        <div className={styles.header}>
          <div className={styles.inputWrap}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={styles.searchIcon} aria-hidden="true">
              <circle cx="11" cy="11" r="7" /><path d="m20 20-4.3-4.3" />
            </svg>
            <input
              ref={inputRef}
              className={styles.input}
              placeholder="Search by movement number, reference, retailer, year, complication…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              autoComplete="off"
              spellCheck="false"
            />
            <button className={styles.closeBtn} onClick={closeSearch} aria-label="Close search">
              <span className={styles.escLabel}>ESC</span>
            </button>
          </div>
          <div className={styles.meta}>
            {query
              ? <>{hits.length} {hits.length === 1 ? 'match' : 'matches'} in {RECORDS.length} records</>
              : <>{RECORDS.length} records indexed</>}
          </div>
        </div>

        {/* Results */}
        <div className={styles.results}>
          {!query && (
            <>
              <div className={styles.sectionLabel}>Highest realized at auction</div>
              {FEATURED.map((r) => (
                <SearchRow key={r.slug} rec={r} query="" onSelect={navigate} />
              ))}
              <div className={styles.sectionLabel} style={{ marginTop: 20 }}>Try searching</div>
              <div className={styles.suggestions}>
                {SUGGESTIONS.map((s) => (
                  <button key={s} className={styles.suggChip} onClick={() => setQ(s)}>{s}</button>
                ))}
              </div>
            </>
          )}

          {query && hits.length === 0 && (
            <div className={styles.empty}>
              <div className={styles.emptyGlyph}>◆</div>
              <div className={styles.emptyTitle}>No records match &ldquo;{q}&rdquo;.</div>
              <div className={styles.emptySub}>Try a movement number, reference, retailer, or complication.</div>
            </div>
          )}

          {query && hits.map(({ record }) => (
            <SearchRow key={record.slug} rec={record} query={q} onSelect={navigate} />
          ))}
        </div>
      </div>
    </div>
  );
}

function SearchRow({ rec, query, onSelect }: { rec: typeof RECORDS[number]; query: string; onSelect: (slug: string) => void }) {
  const photo = rec.photos[0];
  return (
    <Link
      href={`/archive/${rec.slug}`}
      className={styles.row}
      onClick={(e) => { e.preventDefault(); onSelect(rec.slug); }}
    >
      <div className={`${styles.rowThumb} ${rec.imgKind === 'archival' ? styles.rowThumbArchival : ''}`}>
        {photo ? (
          <Image src={`/watches/${photo}`} alt="" width={44} height={44} className={styles.rowThumbImg} />
        ) : (
          <span className={styles.rowThumbEmpty}>—</span>
        )}
      </div>

      <div className={styles.rowBody}>
        <div className={styles.rowEye}>
          {rec.movement
            ? <>Movement {highlight(rec.movement, query)}</>
            : <>Reference {highlight(rec.ref ?? '', query)}</>}
          <span className={styles.rowSep}>·</span>
          <span>{rec.mnfctYear ?? 'Undated'}</span>
          {rec.ref && rec.movement && (
            <><span className={styles.rowSep}>·</span><span>Ref. {highlight(rec.ref, query)}</span></>
          )}
        </div>
        <div className={styles.rowTitle}>{highlight(rec.title, query)}</div>
        <div className={styles.rowNotes}>
          {highlight((rec.notes ?? '').slice(0, 110) + ((rec.notes?.length ?? 0) > 110 ? '…' : ''), query)}
        </div>
      </div>

      <div className={styles.rowArrow} aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M13 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}
