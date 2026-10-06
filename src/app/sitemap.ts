import type { MetadataRoute } from 'next';
import { stayRepository } from '@/lib/stays';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, changeFrequency: 'weekly', priority: 1 },
    { url: `${siteUrl}/stays`, changeFrequency: 'weekly', priority: 0.9 },
    ...stayRepository.list().map((stay) => ({
      url: `${siteUrl}/stays/${stay.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];
}
