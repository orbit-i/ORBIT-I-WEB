import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import TiltCard from '@/components/TiltCard'
import Link from 'next/link'
import { servicesList, getServiceBySlug } from '@/data/servicesData'

export function generateStaticParams() {
  return servicesList.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const service = getServiceBySlug(slug)
  if (!service) return { title: 'Service Not Found' }

  return {
    title: service.metaTitle,
    description: service.metaDesc,
    keywords: service.keywords,
    openGraph: {
      title: service.metaTitle,
      description: service.metaDesc,
      url: `https://orbit-i.tech/services/${service.slug}`,
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

  return (
    <>
      <Navbar />
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
              </div>

              <h1 style={{ fontFamily: 'Space Grotesk', fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.15 }}>
                {service.title}
              </h1>

              <p style={{ fontSize: 17, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                {service.shortDesc}
              </p>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 12 }}>
                <Link href="/contact" className="btn-primary" style={{ textDecoration: 'none', padding: '12px 24px' }}>
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
                      <span style={{ color: 'var(--accent)', fontWeight: 800, fontSize: 16 }}>✓</span>
                      <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{f}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deliverables Card */}
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: 32 }}>
                <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20 }}>
                  Production Deliverables
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {service.deliverables.map((d, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                      <span style={{ color: '#22c55e', fontWeight: 800, fontSize: 16 }}>★</span>
                      <p style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: 500, lineHeight: 1.6 }}>{d}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Architecture & Tech Stack */}
        <section style={{ padding: '64px 0' }}>
          <div className="container" style={{ maxWidth: 900 }}>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: 36, marginBottom: 40 }}>
              <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 14 }}>
                Engineering Architecture & Methodology
              </h2>
              <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 24 }}>
                {service.architecture}
              </p>
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>
                  Technology Stack Employed:
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {service.tags.map((t) => (
                    <span key={t} style={{ fontSize: 13, padding: '6px 14px', background: 'var(--bg-elevated)', border: '1px solid var(--border-hover)', borderRadius: 8, color: 'var(--text-primary)', fontWeight: 600 }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Geographical Service Coverage */}
            <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 20, padding: 32, marginBottom: 40 }}>
              <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>
                Local & International Service Availability
              </h2>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 16 }}>
                We deliver this service with on-ground technical support and remote enterprise consulting across Pakistan and globally:
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {service.citiesCovered.map((c) => (
                  <span key={c} style={{ fontSize: 12, padding: '5px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 100, color: 'var(--accent-light)' }}>
                    📍 {c}
                  </span>
                ))}
              </div>
            </div>

            {/* FAQs */}
            {service.faqs && service.faqs.length > 0 && (
              <div style={{ marginTop: 40 }}>
                <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 24, textAlign: 'center' }}>
                  Frequently Asked Questions
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {service.faqs.map((faq, i) => (
                    <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: 24 }}>
                      <h3 style={{ fontFamily: 'Space Grotesk', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
                        {faq.q}
                      </h3>
                      <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                        {faq.a}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
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
              <Link href="/contact" className="btn-primary" style={{ textDecoration: 'none', padding: '12px 28px' }}>
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
