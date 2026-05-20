import clsx from 'clsx';
import type { Tag as TagType } from '@/lib/types';
import styles from './Tag.module.css';

export default function Tag({ kind, label }: TagType) {
  return (
    <span className={clsx(styles.tag, styles[kind])}>
      {label}
    </span>
  );
}
