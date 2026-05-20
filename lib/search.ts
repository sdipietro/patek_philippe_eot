import type { WatchRecord } from './types';

export type SearchHit = { record: WatchRecord; score: number };

export function searchRecords(records: WatchRecord[], query: string): SearchHit[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  return records
    .map((r) => {
      const haystack = [
        r.movement,
        r.case,
        r.ref,
        r.title,
        r.caseMetal,
        r.notes,
        r.knownFrom,
        r.lastSaleHouse,
        r.hb,
        String(r.mnfctYear ?? ''),
        String(r.yearSold ?? ''),
        ...r.complications.map((c) => c.label),
        ...(r.provenance ?? []).map((p) => p.text),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      let score = 0;
      if (haystack.includes(q)) score += 10;
      q.split(/\s+/).forEach((token) => {
        if (token && haystack.includes(token)) score += 1;
      });
      // Movement number: strongest signal — strip typographic apostrophes for matching
      if ((r.movement ?? '').toLowerCase().replace(/['’]/g, '').includes(q.replace(/['’]/g, '')))
        score += 20;
      if ((r.ref ?? '').toLowerCase().includes(q)) score += 10;
      return { record: r, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);
}
