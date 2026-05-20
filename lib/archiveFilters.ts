import type { WatchRecord } from './types';

export type SortKey = 'mnfctYear' | 'yearSold' | 'priceRealizedUSD' | 'movement' | 'ref' | 'lastSaleHouse';
export type SortDir = 'asc' | 'desc';
export type ViewMode = 'grid' | 'table';

export type ArchiveParams = {
  periods: string[];
  complications: string[];
  knowns: string[];
  hasPhoto: boolean;
  hasSold: boolean;
  sort: SortKey;
  dir: SortDir;
  view: ViewMode;
};

export const PERIODS = ['1860–1899', '1900–1949', '1950–1999', '2000+'] as const;

export function periodOf(year: number | null): string | null {
  if (!year) return null;
  if (year < 1900) return '1860–1899';
  if (year < 1950) return '1900–1949';
  if (year < 2000) return '1950–1999';
  return '2000+';
}

export function parseParams(raw: Record<string, string | undefined>): ArchiveParams {
  const list = (key: string) => (raw[key] ?? '').split(',').filter(Boolean);
  return {
    periods: list('period'),
    complications: list('comp'),
    knowns: list('known'),
    hasPhoto: raw['photo'] === '1',
    hasSold: raw['sold'] === '1',
    sort: (raw['sort'] as SortKey) || 'mnfctYear',
    dir: (raw['dir'] as SortDir) || 'asc',
    view: (raw['view'] as ViewMode) || 'grid',
  };
}

export function filterRecords(records: WatchRecord[], p: ArchiveParams): WatchRecord[] {
  const xs = records.filter((r) => {
    if (p.periods.length && !p.periods.includes(periodOf(r.mnfctYear) ?? '')) return false;
    if (p.knowns.length && !p.knowns.includes(r.knownFrom)) return false;
    if (p.hasPhoto && !r.photos.length) return false;
    if (p.hasSold && !r.priceRealizedUSD) return false;
    if (p.complications.length) {
      const labels = r.complications.map((c) => c.label);
      if (!p.complications.every((c) => labels.includes(c))) return false;
    }
    return true;
  });

  const cmp: Record<string, (a: WatchRecord, b: WatchRecord) => number> = {
    mnfctYear: (a, b) => (a.mnfctYear ?? 9999) - (b.mnfctYear ?? 9999),
    yearSold: (a, b) => (a.yearSold ?? 0) - (b.yearSold ?? 0),
    priceRealizedUSD: (a, b) => (a.priceRealizedUSD ?? 0) - (b.priceRealizedUSD ?? 0),
    movement: (a, b) => String(a.movement ?? '').localeCompare(String(b.movement ?? '')),
    ref: (a, b) => String(a.ref ?? '').localeCompare(String(b.ref ?? '')),
    lastSaleHouse: (a, b) => String(a.lastSaleHouse ?? '').localeCompare(String(b.lastSaleHouse ?? '')),
  };
  const fn = cmp[p.sort] ?? cmp['mnfctYear'];
  xs.sort((a, b) => (p.dir === 'asc' ? fn(a, b) : fn(b, a)));
  return xs;
}

export function buildCompList(records: WatchRecord[]): [string, number][] {
  const m = new Map<string, number>();
  records.forEach((r) => r.complications.forEach((c) => m.set(c.label, (m.get(c.label) ?? 0) + 1)));
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
}
