'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import TiltCard from '@/components/TiltCard'
import Link from 'next/link'
import { MapPin, ArrowRight } from 'lucide-react'

const locations = [
  {
    city: 'Nawabshah, Sindh',
    address: 'Nawabshah, Sindh, Pakistan',
    role: 'Corporate Headquarters & Core Engineering Lab',
    desc: 'Our registered headquarters under SECP. Nawabshah serves as our primary engineering facility where our core architecture, autonomous AI frameworks, and foundational software systems are researched, prototyped, and tested.',
    servicesOffered: ['Enterprise AI & Machine Learning', 'Custom Web Platforms', 'Full-Stack Software Architecture', 'Mobile Apps (iOS & Android)', 'SECP Verifiable Software Solutions'],
    badge: 'Headquarters',
    highlight: true,
  },
  {
    city: 'Karachi, Sindh',
    address: 'Karachi, Sindh, Pakistan',
    role: 'Executive Branch & Metropolitan Commercial Office',
    desc: 'Our Karachi branch leads corporate enterprise partnerships, high-volume fintech integrations, client accounts, and metropolitan tech implementations for startups and corporations.',
    servicesOffered: ['Fintech & Payment Gateways (JazzCash, EasyPaisa, Stripe)', 'Enterprise ERP & CRM Systems', 'High-Traffic Web Applications', 'Cloud & DevOps Infrastructures'],
    badge: 'Regional Branch',
    highlight: true,
  },
  {
    city: 'Sukkur, Sindh',
    role: 'Upper Sindh Commercial & Industrial Automation',
    desc: 'Delivering supply-chain trackers, agricultural inventory management systems, and custom software systems for commercial enterprises across Sukkur, Rohri, and upper Sindh.',
    servicesOffered: ['Inventory ERP Systems', 'Custom Software Solutions', 'Cloud Infrastructure', 'API Integrations'],
    badge: 'Regional Delivery',
    highlight: false,
  },
  {
    city: 'Sibi, Balochistan',
    role: 'Digital Enablement & Business Management Software',
    desc: 'Supporting business digitalization, regional trade portals, and custom automated accounting platforms for businesses and public sector projects across Sibi and surrounding districts.',
    servicesOffered: ['Management Information Systems', 'Cross-Platform Mobile Apps', 'Custom Software'],
    badge: 'Regional Delivery',
    highlight: false,
  },
  {
    city: 'Lahore, Punjab',
    role: 'Tech Hub & High-Growth Startup Partnerships',
    desc: 'Partnering with startups, SaaS innovators, and established manufacturing industries in Lahore for Next.js, Node.js, and autonomous AI system integrations.',
    servicesOffered: ['SaaS Platform Engineering', 'Applied AI & RAG Pipelines', 'Cloud Native DevOps', 'Mobile App Development'],
    badge: 'National Tech Corridor',
    highlight: false,
  },
  {
    city: 'Islamabad / Rawalpindi',
    role: 'Corporate, Public Sector & Export Solutions',
    desc: 'Engineering high-security web platforms, governmental-grade data architectures, and export-focused tech solutions with strict compliance and cryptographic security.',
    servicesOffered: ['Enterprise API & Banking Integrations', 'AI Autonomous Workflows', 'Custom Cloud Architecture', 'Zero-Downtime Microservices'],
    badge: 'National Tech Corridor',
    highlight: false,
  },
  {
    city: 'International Markets (USA, UK, UAE & Global)',
    role: 'Global Software Export & Dedicated Remote Teams',
    desc: 'Delivering world-class software engineering with 100% intellectual property ownership to international clients across North America, the United Kingdom, and the GCC region.',
    servicesOffered: ['Autonomous LLM & AI Agents', 'Full-Stack Next.js & React Native Systems', 'Enterprise API Gateways', 'Cloud DevOps Architecture'],
    badge: 'International Reach',
    highlight: true,
  },
]

export default function LocationsPage() {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', background: 'var(--bg)' }}>
        <section style={{ padding: '48px 0 60px', position: 'relative' }}>
          <div className="grid-bg" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
          <div className="container" style={{ position: 'relative', textAlign: 'center', maxWidth: 880 }}>
            <span className="tag"><span className="dot" />Local Impact · Global Reach</span>
            <h1 style={{ fontFamily: 'Space Grotesk', fontSize: 'clamp(32px, 5vw, 54px)', fontWeight: 800, color: 'var(--text-primary)', marginTop: 14, marginBottom: 18 }}>
              Local & International <span className="gradient-text-blue">Service Coverage</span>
            </h1>
            <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.75 }}>
              Operating from our corporate headquarters in <strong>Nawabshah</strong> and regional branch in <strong>Karachi</strong> — ORBIT-I Private Limited delivers verified, SECP-compliant software engineering across Pakistan and globally (USA, UK, UAE, EU).
            </p>
          </div>
        </section>

        <section style={{ padding: '0 0 80px' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24 }}>
              {locations.map((loc) => (
                <TiltCard key={loc.city} style={{
                  background: 'var(--bg-card)',
                  border: `1px solid ${loc.highlight ? 'var(--border-hover)' : 'var(--border)'}`,
                  borderRadius: 20,
                  padding: 30,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 10, padding: '4px 10px', background: loc.highlight ? 'var(--accent-glow)' : 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 100, color: loc.highlight ? 'var(--accent-light)' : 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                      {loc.badge}
                    </span>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--accent-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <MapPin size={16} color="var(--accent)" />
                    </div>
                  </div>

                  <div>
                    <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                      {loc.city}
                    </h2>
                    {loc.address && (
                      <p style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600, marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span>📍</span> {loc.address}
                      </p>
                    )}
                  </div>

                  <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>
                    {loc.role}
                  </p>

                  <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, flex: 1 }}>
                    {loc.desc}
                  </p>

                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>
                      Key Focus Deliverables:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {loc.servicesOffered.map((s) => (
                        <span key={s} style={{ fontSize: 11, padding: '3px 8px', background: 'var(--bg-elevated)', borderRadius: 6, color: 'var(--text-primary)' }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Link href="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--accent)', textDecoration: 'none', fontWeight: 600, marginTop: 8 }}>
                    <span>Inquire for {loc.city.split(',')[0]} Projects</span>
                    <ArrowRight size={14} />
                  </Link>
                </TiltCard>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
