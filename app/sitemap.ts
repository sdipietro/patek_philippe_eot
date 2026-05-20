import type { MetadataRoute } from 'next';
import { RECORDS } from '@/lib/records';

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://patek-philippe-eot.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: `${BASE}/archive`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/timeline`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.7 },
    { url: `${BASE}/observatory`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.7 },
  ];

  const recordRoutes: MetadataRoute.Sitemap = RECORDS.map((r) => ({
    url: `${BASE}/archive/${r.slug}`,
    lastModified: new Date(),
    changeFrequency: 'yearly' as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...recordRoutes];
}
