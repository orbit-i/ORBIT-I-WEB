import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import TiltCard from '@/components/TiltCard'
import Link from 'next/link'
import { CheckCircle2, Sparkles, MapPin, ArrowRight, ArrowLeft, Clock } from 'lucide-react'
import { servicesList, getServiceBySlug } from '@/data/servicesData'
import ExpandableFaq from '@/components/ExpandableFaq'

export function generateStaticParams() {
  return servicesList.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const service = getServiceBySlug(slug)
  if (!service) return { title: 'Service Not Found' }

  return {
    title: `${service.title} | Top Rated in Nawabshah, Karachi & Hyderabad | ORBIT-I`,
    description: service.metaDesc,
    keywords: [
      ...service.keywords,
      `${service.title} Nawabshah`,
      `${service.title} Karachi`,
      `${service.title} Hyderabad`,
      'ORBIT-I Private Limited',
      'SECP registered software company',
    ],
    openGraph: {
      title: `${service.title} | ORBIT-I Private Limited`,
      description: service.metaDesc,
      url: `https://orbit-i.tech/services/${service.slug}`,
      siteName: 'ORBIT-I Private Limited',
      images: [
        {
          url: '/orbitlogo-removebg-preview.png',
          width: 512,
          height: 512,
          alt: service.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${service.title} | ORBIT-I Private Limited`,
      description: service.metaDesc,
      images: ['/orbitlogo-removebg-preview.png'],
    },
    alternates: {
      canonical: `https://orbit-i.tech/services/${service.slug}`,
    },
  }
}

export default async function ServiceDetailPage({ params }) {
  const { slug } = await params
  const service = getServiceBySlug(slug)

  if (!service) {
    notFound()
  }

  // Schema.org structured data for this service
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: service.title,
    provider: {
      '@type': 'LocalBusiness',
      name: 'ORBIT-I Private Limited',
      url: 'https://orbit-i.tech',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Nawabshah',
        addressRegion: 'Sindh',
        addressCountry: 'PK',
      },
    },
    areaServed: service.citiesCovered.map((c) => ({
      '@type': 'City',
      name: c,
    })),
    description: service.shortDesc,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: service.title,
      itemListElement: service.deliverables.map((d, idx) => ({
        '@type': 'Offer',
        position: idx + 1,
        itemOffered: {
          '@type': 'Service',
          name: d,
        },
      })),
    },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://orbit-i.tech',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Services',
        item: 'https://orbit-i.tech/services',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: service.title,
        item: `https://orbit-i.tech/services/${service.slug}`,
      },
    ],
  }

  const faqSchema = service.faqs && service.faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: service.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.a,
      },
    })),
  } : null

  return (
    <>
      <Navbar />
      {/* AISEO Structured Data Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <main style={{ paddingTop: 100, minHeight: '100vh', background: 'var(--bg)' }}>
        {/* Breadcrumb Header */}
        <section style={{ padding: '32px 0 48px', position: 'relative', overflow: 'hidden' }}>
          <div className="grid-bg" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
          <div className="container" style={{ position: 'relative' }}>
            {/* Breadcrumbs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>
              <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</Link>
              <span>/</span>
              <Link href="/services" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Services</Link>
              <span>/</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{service.title}</span>
            </div>

            <div style={{ maxWidth: 880, display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                <span className="tag"><span className="dot" />{service.category}</span>
                <span className="tag">SECP Verified Enterprise Delivery</span>
                <span className="tag" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <Clock size={12} /> Last Updated: October 2026
                </span>
              </div>

              <h1 style={{ fontFamily: 'Space Grotesk', fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.15 }}>
                {service.title}
              </h1>

              <p style={{ fontSize: 17, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                {service.shortDesc}
              </p>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 12 }}>
                <Link href={`/contact?service=${encodeURIComponent(service.title)}`} className="btn-primary" style={{ textDecoration: 'none', padding: '12px 24px' }}>
                  Request Consultation & Scope Proposal →
                </Link>
                <Link href="/services" className="btn-outline" style={{ textDecoration: 'none', padding: '12px 20px' }}>
                  ← All Services
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Core Capabilities & Deliverables */}
        <section style={{ padding: '48px 0 64px', background: 'var(--bg-elevated)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32 }}>
              {/* Features Card */}
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: 32 }}>
                <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20 }}>
                  Key Capabilities & Features
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {service.features.map((f, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                      <CheckCircle2 size={16} color="var(--accent)" style={{ flexShrink: 0, marginTop: 3 }} />
                      <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{f}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deliverables Card */}
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: 32 }}>
                <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20 }}>
                  Enterprise Deliverables
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {service.deliverables.map((d, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                      <Sparkles size={16} color="var(--accent-light)" style={{ flexShrink: 0, marginTop: 3 }} />
                      <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{d}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Architecture & Tech Stack */}
        <section style={{ padding: '60px 0', borderBottom: '1px solid var(--border)' }}>
          <div className="container" style={{ maxWidth: 980 }}>
            <div style={{ textAlign: 'center', marginBottom: 36 }}>
              <span className="tag" style={{ marginBottom: 12 }}>Technical Blueprint</span>
              <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 26, fontWeight: 700, color: 'var(--text-primary)' }}>
                System Architecture & Tech Stack
              </h2>
            </div>

            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: 32, marginBottom: 32 }}>
              <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 24 }}>
                {service.architecture}
              </p>
              <div>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, display: 'block', marginBottom: 12 }}>
                  Production Technologies Deployed
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {service.tags.map((t) => (
                    <span key={t} style={{ fontSize: 12, padding: '5px 12px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 100, color: 'var(--accent)' }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Coverage Cities for Local Ranking */}
            <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 20, padding: 28, marginBottom: 32 }}>
              <h3 style={{ fontFamily: 'Space Grotesk', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>
                Regional Hubs & Local Delivery Coverage
              </h3>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 16 }}>
                We deliver this service with on-ground technical support and remote enterprise consulting across Pakistan and globally:
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {service.citiesCovered.map((c) => (
                  <span key={c} style={{ fontSize: 12, padding: '5px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 100, color: 'var(--accent-light)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <MapPin size={12} color="var(--accent)" /> {c}
                  </span>
                ))}
              </div>
            </div>

            {/* Expandable FAQs */}
            {service.faqs && service.faqs.length > 0 && (
              <ExpandableFaq
                faqs={service.faqs}
                title="Frequently Asked Questions"
                subtitle={`Common architectural, deployment, and SLA inquiries regarding ${service.title}.`}
                showLastUpdated={true}
                lastUpdatedDate="October 2026"
              />
            )}
          </div>
        </section>

        {/* Bottom CTA */}
        <section style={{ padding: '32px 0 80px' }}>
          <div className="container" style={{ textAlign: 'center' }}>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-hover)', borderRadius: 24, padding: '48px 32px', maxWidth: 800, margin: '0 auto' }}>
              <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 26, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>
                Ready to Deploy {service.title}?
              </h2>
              <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 24 }}>
                Connect with our senior engineering leads in Nawabshah or Karachi for a technical scoping call.
              </p>
              <Link href={`/contact?service=${encodeURIComponent(service.title)}`} className="btn-primary" style={{ textDecoration: 'none', padding: '12px 28px' }}>
                Book Your Scoping Session →
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
