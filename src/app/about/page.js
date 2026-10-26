'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import TiltCard from '@/components/TiltCard'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'

export default function AboutPage() {
  const milestones = [
    { year: '2026', title: 'Official Inception & SECP Incorporation', desc: 'ORBIT-I Private Limited was formally founded and registered under the Securities and Exchange Commission of Pakistan (SECP) with its corporate headquarters in Nawabshah, Sindh and an active branch office in Karachi.' },
    { year: '2026', title: 'Enterprise AI & Cloud Expansion', desc: 'Launched proprietary autonomous agent frameworks, enterprise RAG microservices, and high-concurrency Node.js and Next.js architectures for corporate clients across Pakistan and overseas.' },
    { year: '2026', title: 'Sindh-to-Global Tech Corridor', desc: 'Pioneered dependable software engineering delivering to clients across Nawabshah, Hyderabad, Karachi, Sukkur, Lahore, Islamabad, Sibi, and international hubs in the GCC, UK, and North America.' }
  ]

  const offices = [
    {
      city: 'Nawabshah, Sindh',
      type: 'Corporate Headquarters',
      desc: 'Our primary software engineering laboratory, corporate administration, and core research facility.',
      address: 'Nawabshah, Sindh, Pakistan',
      badge: 'HQ & Engineering Hub'
    },
    {
      city: 'Karachi, Sindh',
      type: 'Executive Branch Office',
      desc: 'Client relationship management, enterprise integrations, and metropolitan delivery operations.',
      address: 'Karachi, Sindh, Pakistan',
      badge: 'Commercial & Client Branch'
    }
  ]

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', background: 'var(--bg)' }}>
        {/* Hero Section */}
        <section style={{ padding: '48px 0 64px', position: 'relative', overflow: 'hidden' }}>
          <div className="grid-bg" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
          <div className="container" style={{ position: 'relative' }}>
            <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
                <span className="tag"><span className="dot" />Est. 2026</span>
                <span className="tag">SECP Active Pvt. Ltd.</span>
                <span className="tag">Nawabshah & Karachi</span>
              </div>
              <h1 style={{ fontFamily: 'Space Grotesk', fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 800, lineHeight: 1.1, color: 'var(--text-primary)' }}>
                About <span className="gradient-text-blue">ORBIT-I Private Limited</span>
              </h1>
              <p style={{ fontSize: 16, lineHeight: 1.8, color: 'var(--text-secondary)' }}>
                Founded in <strong>2026</strong>, ORBIT-I Private Limited is an SECP-registered technology firm headquartered in <strong>Nawabshah, Sindh</strong> with an executive branch office in <strong>Karachi</strong>. We engineer production-grade enterprise software, autonomous AI systems, cross-platform mobile apps, and robust cloud platforms.
              </p>
            </div>
          </div>
        </section>

        {/* Corporate Offices Grid */}
        <section style={{ padding: '0 0 64px' }}>
          <div className="container">
            <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 24, textAlign: 'center' }}>
              Our Strategic Presence: Nawabshah & Karachi
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
              {offices.map((off) => (
                <TiltCard key={off.city} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: 32 }}>
                  <span style={{ fontSize: 10, padding: '4px 10px', background: 'var(--accent-glow)', border: '1px solid var(--border-hover)', borderRadius: 100, color: 'var(--accent-light)', fontWeight: 700, textTransform: 'uppercase' }}>
                    {off.badge}
                  </span>
                  <h3 style={{ fontFamily: 'Space Grotesk', fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginTop: 14, marginBottom: 8 }}>
                    {off.city}
                  </h3>
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)', marginBottom: 12 }}>{off.type}</p>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>{off.desc}</p>
                  <div style={{ padding: '12px 16px', background: 'var(--bg-elevated)', borderRadius: 10, fontSize: 13, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <MapPin size={16} color="var(--accent)" style={{ flexShrink: 0 }} /> <span><strong>Address:</strong> {off.address}</span>
                  </div>
                </TiltCard>
              ))}
            </div>
          </div>
        </section>

        {/* Company History & Timeline */}
        <section style={{ padding: '48px 0 80px', background: 'var(--bg-elevated)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
          <div className="container" style={{ maxWidth: 900 }}>
            <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 32, textAlign: 'center' }}>
              Corporate Inception (2026) & Trajectory
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {milestones.map((m, i) => (
                <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '24px 28px', display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                  <div style={{ width: 56, height: 56, borderRadius: 12, background: 'var(--accent-glow)', border: '1px solid var(--border-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Space Grotesk', fontSize: 18, fontWeight: 800, color: 'var(--accent)', flexShrink: 0 }}>
                    {m.year}
                  </div>
                  <div>
                    <h3 style={{ fontFamily: 'Space Grotesk', fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>{m.title}</h3>
                    <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section style={{ padding: '64px 0 80px' }}>
          <div className="container" style={{ textAlign: 'center' }}>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-hover)', borderRadius: 24, padding: '48px 32px', maxWidth: 800, margin: '0 auto' }}>
              <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>
                Partner With an SECP Registered Technology Pioneer
              </h2>
              <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 24, maxWidth: 600, margin: '0 auto 24px' }}>
                Whether you are based in Nawabshah, Karachi, Hyderabad, Lahore, Islamabad, or internationally, we deliver software that accelerates your growth.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
                <Link href="/contact" className="btn-primary" style={{ textDecoration: 'none' }}>
                  Start a Project Discussion →
                </Link>
                <Link href="/services" className="btn-outline" style={{ textDecoration: 'none' }}>
                  Browse All Services
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
