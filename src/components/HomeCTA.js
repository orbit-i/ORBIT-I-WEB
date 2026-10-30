'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import TiltCard from './TiltCard'
import {
  Users,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Mail,
  Phone,
  Sparkles,
  CheckCircle2,
} from 'lucide-react'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 35 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.7, delay, ease: [0.76, 0, 0.24, 1] },
})

export default function HomeCTA() {
  return (
    <section id="connect" style={{ padding: '70px 0 90px', background: 'var(--bg)', position: 'relative' }}>
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
      <div className="container" style={{ position: 'relative' }}>
        
        {/* Section Heading */}
        <div style={{ textAlign: 'center', maxWidth: 780, margin: '0 auto 48px' }}>
          <motion.div {...fadeUp(0)}>
            <span className="tag"><span className="dot" />Get Started with ORBIT-I</span>
          </motion.div>
          <motion.h2 {...fadeUp(0.1)} style={{ fontFamily: 'Space Grotesk', fontSize: 'clamp(28px, 4.5vw, 46px)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2, marginTop: 14, marginBottom: 16 }}>
            Collaborate With Our <span className="gradient-text-blue">Software &amp; AI Engineering Firm</span>
          </motion.h2>
          <motion.p {...fadeUp(0.2)} style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            Headquartered in <strong>Nawabshah</strong> with executive branch operations in <strong>Karachi</strong>. Explore our team or launch your enterprise project with us today.
          </motion.p>
        </div>

        {/* Dual High-Conversion CTA Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 28, maxWidth: 1100, margin: '0 auto' }}>
          
          {/* Card 1: Meet the Team CTA */}
          <motion.div {...fadeUp(0.15)}>
            <TiltCard style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-hover)',
              borderRadius: 24,
              padding: '36px 32px',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
              
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 14, background: 'var(--accent-glow)', border: '1px solid var(--border-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
                    <Users size={22} />
                  </div>
                  <span style={{ fontSize: 11, padding: '4px 10px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 100, color: 'var(--text-muted)', fontWeight: 600 }}>
                    12+ Engineers, Designers &amp; Specialists
                  </span>
                </div>

                <h3 style={{ fontFamily: 'Space Grotesk', fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>
                  Meet Our Engineering &amp; Leadership Team
                </h3>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 24 }}>
                  Led by system architects, AI researchers, and cloud DevOps specialists in Nawabshah and Karachi. Discover their credentials, bios, and technical domain specializations.
                </p>

                {/* Team Avatars Preview */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
                  <div style={{ display: 'flex', marginLeft: 8 }}>
                    {[
                      { name: 'Samad', img: '/team/samad-rind.jpeg' },
                      { name: 'Muneeb', img: '/team/muneeb-ur-rehman.jpeg' },
                      { name: 'Hassan', img: '/team/hassan-anser.jpeg' },
                      { name: 'Rashid', img: '/team/rashid-channa.jpeg' },
                    ].map((m, idx) => (
                      <div key={idx} style={{
                        position: 'relative',
                        width: 38,
                        height: 38,
                        borderRadius: '50%',
                        overflow: 'hidden',
                        border: '2px solid var(--bg-card)',
                        marginLeft: -8,
                      }}>
                        <Image src={m.img} alt={m.name} fill sizes="38px" style={{ objectFit: 'cover' }} />
                      </div>
                    ))}
                  </div>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>
                    Executive Founders &amp; Lead Developers
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link
                  href="/team"
                  className="btn-primary"
                  style={{
                    flex: 1,
                    textDecoration: 'none',
                    padding: '13px 20px',
                    fontSize: 14,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    textAlign: 'center',
                  }}
                >
                  View Full Team Profiles <ArrowRight size={16} />
                </Link>
                <Link
                  href="/careers"
                  className="btn-outline"
                  style={{
                    textDecoration: 'none',
                    padding: '13px 18px',
                    fontSize: 13,
                    textAlign: 'center',
                  }}
                >
                  Careers
                </Link>
              </div>
            </TiltCard>
          </motion.div>

          {/* Card 2: Contact Us & Quick Access CTA */}
          <motion.div {...fadeUp(0.25)}>
            <TiltCard style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-hover)',
              borderRadius: 24,
              padding: '36px 32px',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, background: 'radial-gradient(circle, rgba(56,189,248,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
              
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 14, background: 'rgba(56,189,248,0.12)', border: '1px solid rgba(56,189,248,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
                    <MessageSquare size={22} />
                  </div>
                  <span style={{ fontSize: 11, padding: '4px 10px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 100, color: '#22c55e', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} /> 24hr Response SLA
                  </span>
                </div>

                <h3 style={{ fontFamily: 'Space Grotesk', fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>
                  Start Your Next Enterprise Project
                </h3>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 20 }}>
                  Have an AI system, web platform, or custom ERP to build? Fill out our project inquiry form or talk directly with our engineering advisors in Nawabshah and Karachi.
                </p>

                {/* Quick Info Badges */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
                    <MapPin size={15} color="var(--accent)" style={{ flexShrink: 0 }} />
                    <span>Nawabshah HQ (Core Labs) • Karachi Branch (Enterprise)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
                    <Mail size={15} color="var(--accent)" style={{ flexShrink: 0 }} />
                    <a href="mailto:contactus@orbit-i.tech" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 600 }}>
                      contactus@orbit-i.tech
                    </a>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
                    <Phone size={15} color="var(--accent)" style={{ flexShrink: 0 }} />
                    <a href="https://wa.me/923190375751" target="_blank" rel="noreferrer" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 600 }}>
                      +92 319 0375751 (WhatsApp &amp; Phone)
                    </a>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link
                  href="/contact"
                  className="btn-primary"
                  style={{
                    flex: 1,
                    textDecoration: 'none',
                    padding: '13px 20px',
                    fontSize: 14,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    textAlign: 'center',
                  }}
                >
                  Open Contact &amp; Inquiry Page <ArrowRight size={16} />
                </Link>
                <a
                  href="https://wa.me/923190375751"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-outline"
                  style={{
                    textDecoration: 'none',
                    padding: '13px 18px',
                    fontSize: 13,
                    textAlign: 'center',
                    color: '#22c55e',
                    borderColor: 'rgba(34,197,94,0.3)',
                  }}
                >
                  WhatsApp
                </a>
              </div>
            </TiltCard>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
