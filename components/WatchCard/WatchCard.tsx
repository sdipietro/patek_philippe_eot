import Link from 'next/link';
import Image from 'next/image';
import clsx from 'clsx';
import type { WatchRecord } from '@/lib/types';
import Tag from '@/components/Tag/Tag';
import styles from './WatchCard.module.css';

const MAX_TAGS = 3;

export default function WatchCard({ record }: { record: WatchRecord }) {
  const { slug, title, caseMetal, mnfctYear, movement, case: caseNum, photos, imgKind, complications } = record;

  const firstPhoto = photos[0] ?? null;
  const visibleTags = complications.slice(0, MAX_TAGS);
  const extraCount = complications.length - visibleTags.length;

  return (
    <Link href={`/archive/${slug}`} className={styles.wc}>
      <div className={clsx(styles.media, imgKind === 'archival' && styles.mediaArchival)}>
        {firstPhoto ? (
          <Image
            src={`/watches/${firstPhoto}`}
            alt={title}
            width={480}
            height={360}
            className={clsx(styles.photo, imgKind === 'archival' && styles.photoArchival)}
            style={{ width: 'auto', height: 'auto', maxWidth: '78%', maxHeight: '88%' }}
          />
        ) : (
          <div className={styles.noImage} aria-label="No photograph available">
            <span className={styles.noImageLbl}>No photograph</span>
          </div>
        )}
      </div>
      <div className={styles.body}>
        <div className={styles.eyebrow}>{caseMetal}</div>
        <div className={styles.title}>{title}</div>
        <div className={styles.meta}>
          {movement && <span><b>{movement}</b></span>}
          {caseNum && <span>{caseNum}</span>}
          {mnfctYear && <span>{mnfctYear}</span>}
        </div>
        {visibleTags.length > 0 && (
          <div className={styles.tags}>
            {visibleTags.map((tag) => (
              <Tag key={tag.kind} {...tag} />
            ))}
            {extraCount > 0 && (
              <span className={styles.more}>+{extraCount}</span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
