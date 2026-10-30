import { servicesList } from '@/data/servicesData'
import { careerPositions } from '@/data/careersData'
import { getBlogPosts, getCmsPages, getCareersJobs } from '@/server/utils/cmsStorage'

export default async function sitemap() {
  const baseUrl = 'https://orbit-i.tech'
  const now = new Date()

  const staticPages = [
    { url: baseUrl, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/services`, lastModified: now, changeFrequency: 'daily', priority: 0.95 },
    { url: `${baseUrl}/team`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/locations`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/careers`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/security`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/terms`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/verify`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
  ]

  const servicePages = servicesList.map((s) => ({
    url: `${baseUrl}/services/${s.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.92,
  }))

  let blogPages = []
  try {
    const posts = await getBlogPosts()
    blogPages = (posts || [])
      .filter((p) => p.status === 'published')
      .map((p) => ({
        url: `${baseUrl}/blog/${p.slug}`,
        lastModified: new Date(p.updated_at || p.created_at || now),
        changeFrequency: 'weekly',
        priority: 0.88,
      }))
  } catch {}

  let cmsPages = []
  try {
    const pages = await getCmsPages()
    cmsPages = (pages || [])
      .filter((p) => p.status === 'published')
      .map((p) => ({
        url: `${baseUrl}/p/${p.slug}`,
        lastModified: new Date(p.updated_at || p.created_at || now),
        changeFrequency: 'monthly',
        priority: 0.75,
      }))
  } catch {}

  let careerRolePages = careerPositions.map((c) => ({
    url: `${baseUrl}/careers/${c.slug || c.id}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.85,
  }))

  try {
    const jobs = await getCareersJobs()
    const dynamicRoles = (jobs || []).map((j) => ({
      url: `${baseUrl}/careers/${j.slug || j.id}`,
      lastModified: new Date(j.updated_at || j.created_at || now),
      changeFrequency: 'weekly',
      priority: 0.85,
    }))
    const seen = new Set(careerRolePages.map((c) => c.url))
    for (const d of dynamicRoles) {
      if (!seen.has(d.url)) careerRolePages.push(d)
    }
  } catch {}

  return [...staticPages, ...servicePages, ...blogPages, ...cmsPages, ...careerRolePages]
}
