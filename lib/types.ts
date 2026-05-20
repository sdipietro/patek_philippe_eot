export type TagKind = 'eot' | 'rep' | 'pc' | 'mp' | 'h24' | 'sid';

export type Tag = {
  kind: TagKind;
  label: string;
};

export type ProvenanceKind = 'manufacture' | 'retail' | 'auction' | 'private';

export type Provenance = {
  year: number | null;
  kind: ProvenanceKind;
  text: string;
  price?: string;
};

export type ExternalLink = {
  year: number | null;
  label: string;
  href: string;
};

export type WatchRecord = {
  slug: string;
  movement: string | null;
  case: string | null;
  ref: string | null;
  mnfctYear: number | null;
  yearSold: number | null;
  caseMetal: string;
  title: string;
  knownFrom: string;
  lastSaleHouse: string | null;
  priceRealizedUSD: number | null;
  notes: string;
  hb: string | null;
  // TODO: photos listed here are unlicensed catalogue captures. See LICENSING.md.
  photos: string[];
  imgKind: 'auction' | 'archival';
  complications: Tag[];
  links: ExternalLink[];
  provenance: Provenance[];
  note?: string;
};

export type TimelineEntry = {
  year: number;
  key?: boolean;
  title: string;
  desc: string;
};
