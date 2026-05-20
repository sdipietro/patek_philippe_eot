import Link from 'next/link';
import styles from './Footer.module.css';

const NAVIGATE = [
  { href: '/', label: 'Home' },
  { href: '/archive', label: 'Archive' },
  { href: '/timeline', label: 'Timeline' },
  { href: '/observatory', label: 'Observatory' },
];

const TECHNICAL = [
  { href: 'https://en.wikipedia.org/wiki/Equation_of_time', label: 'Equation of time', external: true },
  { href: 'https://gml.noaa.gov/grad/solcalc/', label: 'Spencer formula', external: true },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <img
        src="/equation-curve.svg"
        alt=""
        aria-hidden="true"
        className={styles.equationRule}
        width={1240}
        height={64}
      />

      <div className="container">
        <div className={styles.footerInner}>
          <div>
            <div className={styles.colHead}>Equation of Time Archive</div>
            <p className={styles.colophon}>
              A scholarly census of all known Patek Philippe pocket watches
              bearing the équation du temps complication, from 1865 through
              the Star Calibre 2000. An independent research project.
            </p>
            <p className={styles.colophon} style={{ marginTop: 8 }}>
              Photographs are reproduced for research purposes only.
            </p>
          </div>

          <div>
            <div className={styles.colHead}>Navigate</div>
            <nav aria-label="Footer navigation">
              {NAVIGATE.map(({ href, label }) => (
                <Link key={href} href={href} className={styles.link}>
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <div className={styles.colHead}>Technical</div>
            {TECHNICAL.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className={styles.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        <div className={styles.baseline}>
          <span>© {year} Equation of Time Archive. Independent research; not affiliated with Patek Philippe SA.</span>
          <span>Built with Next.js · Deployed on Vercel</span>
        </div>
      </div>
    </footer>
  );
}
