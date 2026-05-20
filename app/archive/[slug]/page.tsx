import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { RECORDS, getRecord } from '@/lib/records';
import type { WatchRecord } from '@/lib/types';
import Gallery from '@/components/Gallery/Gallery';
import Tag from '@/components/Tag/Tag';
import WatchCard from '@/components/WatchCard/WatchCard';
import styles from './page.module.css';

type Props = { params: Promise<{ slug: string }> };

function getRelated(current: WatchRecord): WatchRecord[] {
  const currentKinds = new Set(current.complications.map((c) => c.kind));
  return RECORDS.filter((r) => r.slug !== current.slug)
    .map((r) => ({
      record: r,
      score: r.complications.filter((c) => currentKinds.has(c.kind)).length,
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ record }) => record);
}

export async function generateStaticParams() {
  return RECORDS.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const record = getRecord(slug);
  if (!record) return {};

  const firstPhoto = record.photos[0] ?? null;
  const description = record.notes.slice(0, 155).trimEnd() + (record.notes.length > 155 ? '…' : '');

  return {
    title: record.title,
    description,
    openGraph: {
      title: record.title,
      description,
      type: 'article',
      ...(firstPhoto && {
        images: [
          {
            url: `/watches/${firstPhoto}`,
            width: 1200,
            height: 900,
            alt: record.title,
          },
        ],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: record.title,
      description,
      ...(firstPhoto && { images: [`/watches/${firstPhoto}`] }),
    },
  };
}

export default async function DetailPage({ params }: Props) {
  const { slug } = await params;
  const record = getRecord(slug);
  if (!record) notFound();

  const {
    title, caseMetal, movement, case: caseNum, ref,
    mnfctYear, yearSold, priceRealizedUSD, lastSaleHouse,
    knownFrom, notes, note, hb, photos, imgKind,
    complications, provenance, links,
  } = record;

  const related = getRelated(record);

  const provDotClass: Record<string, string | undefined> = {
    manufacture: styles.provManufacture,
    auction: styles.provAuction,
    retail: undefined,
    private: undefined,
  };

  return (
    <>
      {/* ── Breadcrumb + head ─────────────────────────────────── */}
      <div className={`section-tight ${styles.head}`}>
        <div className="container">
          <nav className={styles.crumb} aria-label="Breadcrumb">
            <Link href="/archive">Archive</Link>
            <span className={styles.crumbSep} aria-hidden="true">›</span>
            <span aria-current="page">{title}</span>
          </nav>
          <div className={styles.eyebrow}>{caseMetal}</div>
          <h1 className={styles.h1}>{title}</h1>
          {complications.length > 0 && (
            <div className={styles.tags}>
              {complications.map((tag) => (
                <Tag key={tag.kind} {...tag} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Detail grid ───────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className={styles.grid}>
            {/* Gallery column */}
            <Gallery
              photos={photos}
              title={title}
              imgKind={imgKind}
              caption={hb}
            />

            {/* Sidebar column */}
            <div className={styles.sidebar}>
              {/* Key metadata */}
              <dl className={styles.metaBlock}>
                {movement && (
                  <div className={styles.metaRow}>
                    <dt>Movement</dt>
                    <dd className="mono">{movement}</dd>
                  </div>
                )}
                {caseNum && (
                  <div className={styles.metaRow}>
                    <dt>Case</dt>
                    <dd className="mono">{caseNum}</dd>
                  </div>
                )}
                {ref && (
                  <div className={styles.metaRow}>
                    <dt>Reference</dt>
                    <dd>{ref}</dd>
                  </div>
                )}
                {mnfctYear && (
                  <div className={styles.metaRow}>
                    <dt>Manufactured</dt>
                    <dd>{mnfctYear}</dd>
                  </div>
                )}
                {yearSold && (
                  <div className={styles.metaRow}>
                    <dt>Year sold</dt>
                    <dd>{yearSold}</dd>
                  </div>
                )}
                {lastSaleHouse && (
                  <div className={styles.metaRow}>
                    <dt>Auction house</dt>
                    <dd>{lastSaleHouse}</dd>
                  </div>
                )}
                {priceRealizedUSD != null && (
                  <div className={styles.metaRow}>
                    <dt>Price realized</dt>
                    <dd className="mono">
                      USD {priceRealizedUSD.toLocaleString('en-US')}
                    </dd>
                  </div>
                )}
                <div className={styles.metaRow}>
                  <dt>Known from</dt>
                  <dd>{knownFrom}</dd>
                </div>
                <div className={styles.metaRow}>
                  <dt>Image source</dt>
                  <dd>{imgKind === 'archival' ? 'Archival photograph' : 'Auction catalogue'}</dd>
                </div>
              </dl>

              {/* Curator note (if present) */}
              {note && (
                <div className={styles.noteBlock}>
                  <div className={styles.noteEyebrow}>Note</div>
                  <p className={styles.noteText}>{note}</p>
                </div>
              )}

              {/* Descriptive notes */}
              {notes && (
                <div className={styles.notesBlock}>
                  <div className="eyebrow">Description</div>
                  <p className={styles.notes}>{notes}</p>
                </div>
              )}

              {/* Provenance timeline */}
              {provenance.length > 0 && (
                <div className={styles.provBlock}>
                  <div className="eyebrow">Provenance</div>
                  <ol className={styles.provList}>
                    {provenance.map((p, i) => (
                      <li
                        key={i}
                        className={`${styles.provRow} ${provDotClass[p.kind] ?? ''}`}
                      >
                        <span className={styles.provYear}>{p.year ?? '—'}</span>
                        <span className={styles.provDot} aria-hidden="true" />
                        <div className={styles.provBody}>
                          <span className={styles.provText}>{p.text}</span>
                          {p.price && (
                            <span className={styles.provPrice}>{p.price}</span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* External links */}
              {links.length > 0 && (
                <div className={styles.linksBlock}>
                  <div className="eyebrow">External links</div>
                  <div className={styles.linksGrid}>
                    {links.map((link, i) => (
                      <a
                        key={i}
                        href={link.href}
                        className={styles.linkCard}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span className={styles.linkYear}>{link.year ?? '—'}</span>
                        <div>
                          <div className={styles.linkLabel}>{link.label}</div>
                          <div className={styles.linkHost}>
                            {new URL(link.href).hostname.replace('www.', '')}
                          </div>
                        </div>
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                          style={{ flexShrink: 0, color: 'var(--gold-600)' }}
                        >
                          <path d="M10 4h-5v15h15v-5" />
                          <path d="M14 4h6v6" />
                          <path d="M11 13l9-9" />
                        </svg>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Related records ───────────────────────────────────── */}
      {related.length > 0 && (
        <section className={`section-tight ${styles.relatedSection}`}>
          <div className="container">
            <div className="section-head">
              <div className="eyebrow">Archive</div>
              <h2>Related Records</h2>
              <p>Other equation-of-time watches sharing complications with this example.</p>
            </div>
            <div className={styles.relatedGrid}>
              {related.map((r) => (
                <WatchCard key={r.slug} record={r} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Back navigation ───────────────────────────────────── */}
      <div className={styles.backRow}>
        <div className="container">
          <Link href="/archive" className={styles.backLink}>
            ← Back to Archive
          </Link>
        </div>
      </div>
    </>
  );
}
