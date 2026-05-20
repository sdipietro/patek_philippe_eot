import type { Metadata } from 'next';
import { RECORDS } from '@/lib/records';
import WatchCard from '@/components/WatchCard/WatchCard';
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
            All {RECORDS.length} known Patek Philippe pocket watches bearing the{' '}
            <em>équation du temps</em> complication, from 1865 through the Star Calibre 2000.
          </p>
        </div>
      </div>

      <div className="section">
        <div className="container">
          {/* Filters, sort, and table/grid view will be implemented in Milestone 3 */}
          <div className={styles.grid}>
            {RECORDS.map((record) => (
              <WatchCard key={record.slug} record={record} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
