import { servicesList } from '@/data/servicesData'
import { blogPosts } from '@/data/blogData'

export default function sitemap() {
  const baseUrl = 'https://orbit-i.tech'
  const now = new Date()

  const staticPages = [
    { url: baseUrl, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/services`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/locations`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/verify`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/portal`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  ]

  const servicePages = servicesList.map((s) => ({
    url: `${baseUrl}/services/${s.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.85,
  }))

  const blogPages = blogPosts.map((b) => ({
    url: `${baseUrl}/blog/${b.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.75,
  }))

  return [...staticPages, ...servicePages, ...blogPages]
}
