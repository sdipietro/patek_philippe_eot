'use client';

import { useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { RECORDS } from '@/lib/records';
import {
  parseParams,
  filterRecords,
  buildCompList,
  periodOf,
  PERIODS,
} from '@/lib/archiveFilters';
import type { SortKey } from '@/lib/archiveFilters';
import WatchCard from '@/components/WatchCard/WatchCard';
import ArchiveTable from '@/components/ArchiveTable/ArchiveTable';
import styles from './ArchiveFilters.module.css';

export default function ArchiveFilters() {
  const router = useRouter();
  const sp = useSearchParams();

  const params = useMemo(() => parseParams(Object.fromEntries(sp.entries())), [sp]);
  const filtered = useMemo(() => filterRecords(RECORDS, params), [params]);
  const compList = useMemo(() => buildCompList(RECORDS), []);
  const knowns = useMemo(
    () => [...new Set(RECORDS.map((r) => r.knownFrom).filter(Boolean))],
    [],
  );

  const set = useCallback(
    (key: string, value: string | null) => {
      const next = new URLSearchParams(sp.toString());
      if (!value) next.delete(key);
      else next.set(key, value);
      const qs = next.toString();
      router.replace(qs ? `?${qs}` : location.pathname, { scroll: false });
    },
    [router, sp],
  );

  const toggle = useCallback(
    (key: string, value: string, current: string[]) => {
      const next = current.includes(value)
        ? current.filter((x) => x !== value)
        : [...current, value];
      set(key, next.join(',') || null);
    },
    [set],
  );

  const resetAll = () => router.replace(location.pathname, { scroll: false });

  const totalActive =
    params.periods.length +
    params.complications.length +
    params.knowns.length +
    (params.hasPhoto ? 1 : 0) +
    (params.hasSold ? 1 : 0);

  return (
    <div className={styles.layout}>
      {/* ── Filter rail ───────────────────────────── */}
      <aside className={styles.rail}>
        <div className={styles.filterGroup}>
          <h4 className={styles.filterHead}>Period</h4>
          {PERIODS.map((p) => {
            const count = RECORDS.filter((r) => periodOf(r.mnfctYear) === p).length;
            return (
              <label key={p} className={styles.filterOpt}>
                <input
                  type="checkbox"
                  checked={params.periods.includes(p)}
                  onChange={() => toggle('period', p, params.periods)}
                />
                <span>{p}</span>
                <span className={styles.optCount}>{count}</span>
              </label>
            );
          })}
        </div>

        <div className={styles.filterGroup}>
          <h4 className={styles.filterHead}>Complication</h4>
          {compList.map(([label, count]) => (
            <label key={label} className={styles.filterOpt}>
              <input
                type="checkbox"
                checked={params.complications.includes(label)}
                onChange={() => toggle('comp', label, params.complications)}
              />
              <span className={styles.filterOptLabel}>{label}</span>
              <span className={styles.optCount}>{count}</span>
            </label>
          ))}
        </div>

        <div className={styles.filterGroup}>
          <h4 className={styles.filterHead}>Provenance</h4>
          <label className={styles.filterOpt}>
            <input
              type="checkbox"
              checked={params.hasPhoto}
              onChange={() => set('photo', params.hasPhoto ? null : '1')}
            />
            <span>Has photograph</span>
            <span className={styles.optCount}>{RECORDS.filter((r) => r.photos.length > 0).length}</span>
          </label>
          <label className={styles.filterOpt}>
            <input
              type="checkbox"
              checked={params.hasSold}
              onChange={() => set('sold', params.hasSold ? null : '1')}
            />
            <span>Public sale</span>
            <span className={styles.optCount}>{RECORDS.filter((r) => !!r.priceRealizedUSD).length}</span>
          </label>
          {knowns.map((k) => {
            const count = RECORDS.filter((r) => r.knownFrom === k).length;
            return (
              <label key={k} className={styles.filterOpt}>
                <input
                  type="checkbox"
                  checked={params.knowns.includes(k)}
                  onChange={() => toggle('known', k, params.knowns)}
                />
                <span className={styles.filterOptLabel}>{k}</span>
                <span className={styles.optCount}>{count}</span>
              </label>
            );
          })}
        </div>

        {totalActive > 0 && (
          <div className={styles.filterReset}>
            <button className={styles.resetLink} onClick={resetAll}>
              Reset {totalActive} filter{totalActive !== 1 ? 's' : ''}
            </button>
          </div>
        )}
      </aside>

      {/* ── Results pane ──────────────────────────── */}
      <div>
        {/* Toolbar */}
        <div className={styles.toolbar}>
          <span className={styles.toolbarCount}>
            {filtered.length} of {RECORDS.length} records
          </span>

          <div className={styles.chips}>
            {params.periods.map((p) => (
              <button key={p} className={styles.chip} onClick={() => toggle('period', p, params.periods)}>
                {p} ×
              </button>
            ))}
            {params.complications.map((c) => (
              <button key={c} className={styles.chip} onClick={() => toggle('comp', c, params.complications)}>
                {c} ×
              </button>
            ))}
            {params.knowns.map((k) => (
              <button key={k} className={styles.chip} onClick={() => toggle('known', k, params.knowns)}>
                {k.split(' / ')[0].trim()} ×
              </button>
            ))}
            {params.hasPhoto && (
              <button className={styles.chip} onClick={() => set('photo', null)}>Has photo ×</button>
            )}
            {params.hasSold && (
              <button className={styles.chip} onClick={() => set('sold', null)}>Public sale ×</button>
            )}
          </div>

          <div className={styles.toolbarRight}>
            <div className={styles.viewToggle} role="group" aria-label="View mode">
              <button
                className={`${styles.viewBtn} ${params.view === 'grid' ? styles.viewBtnActive : ''}`}
                onClick={() => set('view', 'grid')}
                aria-pressed={params.view === 'grid'}
              >
                Grid
              </button>
              <button
                className={`${styles.viewBtn} ${params.view === 'table' ? styles.viewBtnActive : ''}`}
                onClick={() => set('view', 'table')}
                aria-pressed={params.view === 'table'}
              >
                Table
              </button>
            </div>

            {params.view === 'grid' && (
              <select
                className={styles.sortSelect}
                value={`${params.sort}:${params.dir}`}
                onChange={(e) => {
                  const [key, dir] = e.target.value.split(':');
                  const next = new URLSearchParams(sp.toString());
                  next.set('sort', key);
                  next.set('dir', dir);
                  router.replace(`?${next.toString()}`, { scroll: false });
                }}
              >
                <option value="mnfctYear:asc">Manufacture (oldest first)</option>
                <option value="mnfctYear:desc">Manufacture (newest first)</option>
                <option value="yearSold:desc">Last sold (recent)</option>
                <option value="priceRealizedUSD:desc">Price (highest)</option>
              </select>
            )}
          </div>
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyGlyph}>◆</div>
            <h3 className={styles.emptyTitle}>No records match these filters.</h3>
            <p className={styles.emptySub}>
              Try widening the period range or removing a complication filter.
            </p>
            <button className={styles.resetBtn} onClick={resetAll}>Reset all filters</button>
          </div>
        ) : params.view === 'grid' ? (
          <div className={styles.grid}>
            {filtered.map((record) => (
              <WatchCard key={record.slug} record={record} />
            ))}
          </div>
        ) : (
          <ArchiveTable
            records={filtered}
            sort={params.sort}
            dir={params.dir}
            onSort={(key: SortKey, dir) => {
              const next = new URLSearchParams(sp.toString());
              next.set('sort', key);
              next.set('dir', dir);
              router.replace(`?${next.toString()}`, { scroll: false });
            }}
          />
        )}
      </div>
    </div>
  );
}
