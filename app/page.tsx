import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { RECORDS, AUCTION_COUNT, YEAR_RANGE, getRecord } from '@/lib/records';
import WatchCard from '@/components/WatchCard/WatchCard';
import Button from '@/components/Button/Button';
import Tag from '@/components/Tag/Tag';
import ObservatoryWidget from '@/components/ObservatoryWidget/ObservatoryWidget';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Patek Philippe Equation of Time Archive',
  description:
    'A scholarly census of all known Patek Philippe pocket watches bearing the équation du temps complication, from 1865 through the Star Calibre 2000.',
};

const FEATURED_SLUG = '198385';
const RECENT_SLUGS = ['24919', '866714', '3200005'];

export default function HomePage() {
  const featured = getRecord(FEATURED_SLUG)!;
  const recent = RECENT_SLUGS.map((s) => getRecord(s)!);
  const knownCount = RECORDS.length;

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className={`section ${styles.hero}`}>
        <div className="container">
          <div className={styles.heroInner}>
            <div className={styles.heroText}>
              <div className="eyebrow">Research Archive ◆ Equation of Time</div>
              <h1 className={styles.heroH1}>
                The Equation of Time Watches of Patek Philippe
              </h1>
              <p className={styles.heroLede}>
                A scholarly census of all known pocket watches bearing the{' '}
                <em>équation du temps</em> complication produced by the Firm
                from 1865 through the Star Calibre 2000. {knownCount} survivors.{' '}
                {AUCTION_COUNT} documented auction records. A century and a half
                of solar reckoning.
              </p>
              <div className={styles.heroCta}>
                <Button href="/archive" kind="primary" trailingArrow>
                  Browse the Archive
                </Button>
                <Button href="/observatory" kind="secondary">
                  Observatory
                </Button>
              </div>

              <div className={styles.heroMeta}>
                <div>
                  <div className={styles.heroMetaNum}>{knownCount}</div>
                  <div className={styles.heroMetaLbl}>Known examples</div>
                </div>
                <div className={styles.heroMetaSep}>◆</div>
                <div>
                  <div className={styles.heroMetaNum}>{YEAR_RANGE}</div>
                  <div className={styles.heroMetaLbl}>Year range</div>
                </div>
                <div className={styles.heroMetaSep}>◆</div>
                <div>
                  <div className={styles.heroMetaNum}>{AUCTION_COUNT}</div>
                  <div className={styles.heroMetaLbl}>Auction records</div>
                </div>
              </div>
            </div>

            <div className={styles.heroPhotoWrap}>
              <div className={styles.heroPhoto}>
                <Image
                  src="/watches/198385_1.png"
                  alt="Movement 198'385 — the Henry Graves Jr. pocket watch, circa 1925–33"
                  width={600}
                  height={750}
                  className={styles.heroPhotoImg}
                  priority
                  style={{ width: 'auto', height: 'auto', maxWidth: '92%', maxHeight: '92%' }}
                />
                <div className={styles.heroCaption}>
                  <div className="eyebrow on-navy">Featured</div>
                  <div className={styles.heroCaptionTitle}>
                    Henry Graves Jr., 1925–33
                  </div>
                  <div className={styles.heroCaptionSub}>
                    Mvt. 198&lsquo;385 · USD 23,237,000
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Observatory teaser ───────────────────────────────── */}
      <section className={`section section-navy ${styles.obsSection}`}>
        <div className="container">
          <div className={styles.obsGrid}>
            <div>
              <div className="eyebrow on-navy">Live Calculation</div>
              <h2 className={styles.obsH}>The Equation of Time, Now</h2>
              <p className={styles.obsLede}>
                The difference between mean solar time and apparent solar time —
                the very quantity these extraordinary watches were made to
                display — calculated in real time for today&rsquo;s date.
              </p>
              <Button href="/observatory" kind="text" onNavy trailingArrow>
                Open the Observatory
              </Button>
            </div>
            <div>
              <ObservatoryWidget compact />
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured record ──────────────────────────────────── */}
      <section className={`section ${styles.featuredSection}`}>
        <div className="container">
          <div className="section-head">
            <div className="eyebrow">Featured</div>
            <h2>The Graves Supercomplication</h2>
            <p>
              The most complicated pocket watch in the world at the time of its
              delivery, and the most expensive wristwatch ever sold at auction
              for two decades.
            </p>
          </div>

          <div className={styles.featureRecord}>
            <div className={styles.featurePhoto}>
              <Image
                src="/watches/198385_1.png"
                alt="Movement 198'385 — the Henry Graves Jr. Supercomplication"
                width={700}
                height={700}
                className={styles.featureImg}
                style={{ maxWidth: '70%', maxHeight: '80%', objectFit: 'contain', mixBlendMode: 'multiply' }}
              />
            </div>
            <div className={styles.featureBody}>
              <div className="eyebrow">{featured.caseMetal}</div>
              <h3 className={styles.featureTitle}>{featured.title}</h3>
              <p className={styles.featureNotes}>{featured.notes}</p>
              <div className={styles.featureTags}>
                {featured.complications.map((tag) => (
                  <Tag key={tag.kind} {...tag} />
                ))}
              </div>
              <dl className={styles.featureMeta}>
                <div>
                  <dt>Movement</dt>
                  <dd className="mono">{featured.movement}</dd>
                </div>
                <div>
                  <dt>Case</dt>
                  <dd className="mono">{featured.case}</dd>
                </div>
                <div>
                  <dt>Manufactured</dt>
                  <dd>{featured.mnfctYear}</dd>
                </div>
                <div>
                  <dt>Last sale</dt>
                  <dd>
                    {featured.priceRealizedUSD
                      ? `USD ${(featured.priceRealizedUSD / 1_000_000).toFixed(2)}M`
                      : '—'}
                  </dd>
                </div>
              </dl>
              <Button href={`/archive/${featured.slug}`} kind="primary" trailingArrow>
                View full record
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Recent records ───────────────────────────────────── */}
      <section className={`section-tight ${styles.recentSection}`}>
        <div className="container">
          <div className="section-head section-head-row">
            <div>
              <div className="eyebrow">Archive</div>
              <h2>More from the Census</h2>
            </div>
            <Button href="/archive" kind="text" trailingArrow>
              View all {knownCount} records
            </Button>
          </div>

          <div className={styles.cardGrid}>
            {recent.map((record) => (
              <WatchCard key={record.slug} record={record} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline teaser ──────────────────────────────────── */}
      <section className={`section ${styles.tlSection}`}>
        <div className="container">
          <div className="section-head">
            <div className="eyebrow">History</div>
            <h2>158 Years of Solar Reckoning</h2>
            <p>
              From the first known example of 1865 to the Star Calibre 2000,
              trace the evolution of the equation-of-time complication at
              Patek Philippe.
            </p>
          </div>
          <Button href="/timeline" kind="secondary" trailingArrow>
            Explore the Timeline
          </Button>
        </div>
      </section>
    </>
  );
}
