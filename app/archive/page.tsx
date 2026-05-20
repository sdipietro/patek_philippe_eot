import { Suspense } from 'react';
import type { Metadata } from 'next';
import { RECORDS } from '@/lib/records';
import ArchiveFilters from '@/components/ArchiveFilters/ArchiveFilters';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Archive',
  description: 'Complete census of all 21 known Patek Philippe equation-of-time pocket watches.',
};

export default function ArchivePage() {
  return (
    <div>
      <div className={`section-tight ${styles.header}`}>
        <div className="container">
          <div className="eyebrow">Census</div>
          <h1 className={styles.h1}>The Archive</h1>
          <p className={styles.lede}>
            {RECORDS.length} records catalogued — drawn from manufacture registers, the Huber &amp;
            Banbery reference, published auction catalogues, and reported private collections. Filter
            by period, complication, photographic record, or provenance source.
          </p>
        </div>
      </div>

      <div className="container">
        <Suspense>
          <ArchiveFilters />
        </Suspense>
      </div>
    </div>
  );
}
