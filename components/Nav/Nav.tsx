'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import Icon from '@/components/Icon/Icon';
import { useSearch } from '@/components/SearchProvider/SearchProvider';
import styles from './Nav.module.css';

const NAV_LINKS = [
  { href: '/archive', label: 'Archive' },
  { href: '/timeline', label: 'Timeline' },
  { href: '/observatory', label: 'Observatory' },
];

export default function Nav() {
  const pathname = usePathname();
  const { openSearch } = useSearch();

  return (
    <nav className={styles.nav} aria-label="Main navigation">
      <div className="container">
      <div className={styles.navInner}>
        <Link
          href="/"
          className={styles.brand}
          aria-label="Patek Philippe Equation of Time Archive — Home"
        >
          <Icon id="seal" size={42} className={styles.seal} />
          <div>
            <div className={styles.name}>PATEK PHILIPPE</div>
            <div className={styles.sub}>EQUATION OF TIME ARCHIVE</div>
          </div>
        </Link>

        <div className={styles.links}>
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={clsx(styles.link, pathname.startsWith(href) && styles.active)}
            >
              {label}
            </Link>
          ))}

          <button
            type="button"
            className={styles.searchBtn}
            onClick={openSearch}
            aria-label="Search the archive — press ⌘K"
          >
            <Icon id="search" size={16} />
            <span className={styles.searchLabel}>Search</span>
            <kbd className={styles.searchKbd}>⌘K</kbd>
          </button>
        </div>
      </div>
      </div>
    </nav>
  );
}
