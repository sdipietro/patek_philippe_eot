import { describe, it, expect } from 'vitest';
import { searchRecords } from '../search';
import type { WatchRecord } from '../types';

const makeRecord = (overrides: Partial<WatchRecord> = {}): WatchRecord => ({
  slug: 'test',
  movement: '198’385',
  case: null,
  ref: null,
  mnfctYear: 1925,
  yearSold: 1999,
  caseMetal: '18k gold',
  title: 'Test record',
  knownFrom: 'Test',
  lastSaleHouse: 'Sotheby’s Geneva',
  priceRealizedUSD: 23_000_000,
  notes: 'Henry Graves Jr. commissioned this watch.',
  hb: null,
  photos: [],
  imgKind: 'auction',
  complications: [{ kind: 'eot', label: 'Equation of Time' }],
  links: [],
  provenance: [],
  ...overrides,
});

describe('searchRecords', () => {
  it('returns empty array for empty query', () => {
    expect(searchRecords([makeRecord()], '')).toHaveLength(0);
  });

  it('finds by movement number (typographic apostrophe stripped)', () => {
    const hits = searchRecords([makeRecord()], "198385");
    expect(hits).toHaveLength(1);
    expect(hits[0].record.slug).toBe('test');
  });

  it('finds by provenance text keyword', () => {
    const hits = searchRecords([makeRecord()], 'Graves');
    expect(hits.length).toBeGreaterThan(0);
  });

  it('scores movement match higher than keyword match', () => {
    const byMovement = makeRecord({ movement: 'test’123', slug: 'a' });
    const byNotes = makeRecord({ movement: null, notes: 'test123', slug: 'b' });
    const hits = searchRecords([byNotes, byMovement], 'test123');
    expect(hits[0].record.slug).toBe('a');
  });

  it('returns empty for no matches', () => {
    expect(searchRecords([makeRecord()], 'xyzzy_nomatch')).toHaveLength(0);
  });
});
