'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { WatchRecord } from '@/lib/types';
import type { SortKey, SortDir } from '@/lib/archiveFilters';
import styles from './ArchiveTable.module.css';

const ABBR: Record<string, string> = {
  'Equation of Time': 'EoT',
  'Equation Sector': 'EqS',
  'Equation Table': 'EqT',
  'Perpetual Calendar': 'PC',
  'Moon Phase': 'MP',
  'Minute Repeater': 'MR',
  '24-Hour Indication': '24h',
  'Sidereal Time': 'SId',
};
const abbr = (label: string) =>
  ABBR[label] ?? label.split(' ').map((w) => w[0]).join('').slice(0, 3);

const KIND: Record<string, string> = {
  eot: styles.compEot,
  rep: styles.compRep,
  pc: styles.compPc,
  mp: styles.compMp,
  h24: styles.compH24,
  sid: styles.compSid,
};

const HEADERS: { key: SortKey | null; label: string; align?: 'right' }[] = [
  { key: null, label: '' },
  { key: 'mnfctYear', label: 'Mnfct' },
  { key: 'yearSold', label: 'Sold' },
  { key: 'movement', label: 'Movement' },
  { key: null, label: 'Case' },
  { key: 'ref', label: 'Ref.' },
  { key: 'lastSaleHouse', label: 'Most Recent Sale' },
  { key: 'priceRealizedUSD', label: 'Price (USD)', align: 'right' },
  { key: null, label: 'Known From' },
  { key: null, label: 'Complications' },
];

type Props = {
  records: WatchRecord[];
  sort: SortKey;
  dir: SortDir;
  onSort: (key: SortKey, dir: SortDir) => void;
};

export default function ArchiveTable({ records, sort, dir, onSort }: Props) {
  const handleSort = (key: SortKey | null) => {
    if (!key) return;
    if (sort === key) onSort(key, dir === 'asc' ? 'desc' : 'asc');
    else onSort(key, key === 'priceRealizedUSD' ? 'desc' : 'asc');
  };

  return (
    <div className={styles.wrap}>
      <table className={styles.table}>
        <caption className={styles.caption}>All catalogued records, table view</caption>
        <thead>
          <tr>
            {HEADERS.map((h, i) => (
              <th
                key={i}
                className={[h.align === 'right' ? styles.num : '', h.key ? styles.sortable : ''].join(' ')}
                onClick={() => handleSort(h.key)}
                aria-sort={
                  sort === h.key
                    ? dir === 'asc' ? 'ascending' : 'descending'
                    : h.key ? 'none' : undefined
                }
              >
                {h.label}
                {h.key && (
                  <span className={`${styles.sortGlyph} ${sort === h.key ? styles.sortGlyphActive : ''}`}>
                    {sort === h.key ? (dir === 'asc' ? '↑' : '↓') : '↕'}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {records.map((rec) => {
            const photo = rec.photos[0];
            return (
              <tr key={rec.slug}>
                <td className={styles.thumbCell}>
                  <Link href={`/archive/${rec.slug}`} tabIndex={-1} aria-hidden="true">
                    {photo ? (
                      <Image
                        src={`/watches/${photo}`}
                        alt=""
                        width={32}
                        height={32}
                        className={`${styles.thumb} ${rec.imgKind === 'archival' ? styles.thumbArchival : ''}`}
                      />
                    ) : (
                      <span className={styles.thumbEmpty}>—</span>
                    )}
                  </Link>
                </td>
                <td className={styles.mono}>{rec.mnfctYear ?? '—'}</td>
                <td className={styles.mono}>{rec.yearSold ?? '—'}</td>
                <td className={`${styles.mono} ${styles.strong}`}>
                  <Link href={`/archive/${rec.slug}`} className={styles.rowLink}>
                    {rec.movement ?? <em className={styles.muted}>n/r</em>}
                  </Link>
                </td>
                <td className={styles.mono}>{rec.case ?? <em className={styles.muted}>n/r</em>}</td>
                <td className={styles.mono}>{rec.ref ?? <em className={styles.muted}>—</em>}</td>
                <td>{rec.lastSaleHouse ?? <em className={styles.muted}>—</em>}</td>
                <td className={`${styles.mono} ${styles.num}`}>
                  {rec.priceRealizedUSD
                    ? rec.priceRealizedUSD.toLocaleString('en-US')
                    : <em className={styles.muted}>—</em>}
                </td>
                <td className={styles.small}>{rec.knownFrom}</td>
                <td>
                  <div className={styles.compRow}>
                    {rec.complications.slice(0, 4).map((t, i) => (
                      <span
                        key={i}
                        className={`${styles.compPill} ${KIND[t.kind] ?? styles.compDefault}`}
                        title={t.label}
                      >
                        {abbr(t.label)}
                      </span>
                    ))}
                    {rec.complications.length > 4 && (
                      <span className={styles.compMore}>+{rec.complications.length - 4}</span>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
