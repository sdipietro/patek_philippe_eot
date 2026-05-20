import type { Metadata } from 'next';
import { TIMELINE } from '@/lib/records';
import TimelineScrubber from '@/components/TimelineScrubber/TimelineScrubber';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Timeline',
  description: 'Trace the 158-year history of the equation-of-time complication at Patek Philippe, from 1865 to 2000.',
};

export default function TimelinePage() {
  return (
    <div>
      <div className={`section-tight ${styles.header}`}>
        <div className="container">
          <div className="eyebrow">History</div>
          <h1 className={styles.h1}>158 Years of Solar Reckoning</h1>
          <p className={styles.lede}>
            From the first known example of 1865 to the Star Calibre 2000, the equation-of-time
            complication at Patek Philippe. Drag the scrubber or press play to animate.
          </p>
        </div>
      </div>

      <div className="section">
        <div className="container">
          <TimelineScrubber />

          {/* Milestone entries */}
          <div className={styles.timeline}>
            {TIMELINE.map((entry) => (
              <div key={entry.year} className={`${styles.entry} ${entry.key ? styles.entryKey : ''}`}>
                <div className={styles.year}>{entry.year}</div>
                <div className={styles.dot} aria-hidden="true" />
                <div className={styles.body}>
                  <h3 className={styles.entryTitle}>{entry.title}</h3>
                  <p className={styles.entryDesc}>{entry.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
