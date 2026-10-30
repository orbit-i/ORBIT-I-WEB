import Link from 'next/link'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { careerPositions } from '@/data/careersData'
import { getCareersJobs } from '@/server/utils/cmsStorage'
import RoleDetailsClient from './RoleDetailsClient'

// Revalidate or dynamic
export const revalidate = 60

async function getRoleBySlug(slug) {
  if (!slug) return null
  const cleanSlug = slug.toLowerCase().trim()

  // 1. Check predefined career positions
  const staticMatch = careerPositions.find(
    (p) => (p.slug && p.slug.toLowerCase() === cleanSlug) || String(p.id).toLowerCase() === cleanSlug
  )
  if (staticMatch) {
    return {
      ...staticMatch,
      requirements: Array.isArray(staticMatch.requirements)
        ? staticMatch.requirements
        : String(staticMatch.requirements || '')
            .split(/[,;\n]/)
            .map((s) => s.trim())
            .filter(Boolean),
      responsibilities: Array.isArray(staticMatch.responsibilities)
        ? staticMatch.responsibilities
        : String(staticMatch.responsibilities || '')
            .split(/[,;\n]/)
            .map((s) => s.trim())
            .filter(Boolean),
      perks: Array.isArray(staticMatch.perks)
        ? staticMatch.perks
        : String(staticMatch.perks || '')
            .split(/[,;\n]/)
            .map((s) => s.trim())
            .filter(Boolean),
    }
  }

  // 2. Check dynamic jobs from CMS storage / DB
  try {
    const dynamicJobs = await getCareersJobs()
    const dynamicMatch = dynamicJobs.find(
      (j) => (j.slug && j.slug.toLowerCase() === cleanSlug) || String(j.id) === cleanSlug
    )
    if (dynamicMatch) {
      return {
        ...dynamicMatch,
        requirements: Array.isArray(dynamicMatch.requirements)
          ? dynamicMatch.requirements
          : String(dynamicMatch.requirements || '')
              .split(/[,;\n]/)
              .map((s) => s.trim())
              .filter(Boolean),
        responsibilities: Array.isArray(dynamicMatch.responsibilities)
          ? dynamicMatch.responsibilities
          : String(dynamicMatch.responsibilities || '')
              .split(/[,;\n]/)
              .map((s) => s.trim())
              .filter(Boolean),
        perks: Array.isArray(dynamicMatch.perks)
          ? dynamicMatch.perks
          : String(dynamicMatch.perks || '')
              .split(/[,;\n]/)
              .map((s) => s.trim())
              .filter(Boolean),
      }
    }
  } catch (err) {
    console.warn('Could not query dynamic career jobs:', err.message)
  }

  return null
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const role = await getRoleBySlug(slug)

  if (!role) {
    return {
      title: 'Opportunity Not Found | ORBIT-I Careers',
      description: 'The requested job or internship posting could not be located.',
    }
  }

  const roleTitle = `${role.title} (${role.type || 'Opportunity'})`
  const metaDesc =
    role.summary ||
    `Apply for the ${role.title} position at ORBIT-I Private Limited. ${role.mode || 'Remote'} · ${role.duration || '2 Months'} · ${role.department || 'Engineering'}.`
  const canonicalUrl = `https://orbit-i.tech/careers/${role.slug || slug}`

  return {
    title: `${roleTitle} | ORBIT-I Careers`,
    description: metaDesc.slice(0, 160),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${role.title} | ORBIT-I Careers`,
      description: metaDesc.slice(0, 200),
      url: canonicalUrl,
      siteName: 'ORBIT-I Private Limited',
      type: 'article',
      images: [
        {
          url: '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: `${role.title} - ORBIT-I Careers`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${role.title} | ORBIT-I Careers`,
      description: metaDesc.slice(0, 200),
      images: ['/og-image.jpg'],
    },
  }
}

export default async function CareerRolePage({ params }) {
  const { slug } = await params
  const role = await getRoleBySlug(slug)

  if (!role) {
    notFound()
  }

  return (
    <>
      <Navbar />
      <RoleDetailsClient role={role} />
      <Footer />
    </>
  )
}

