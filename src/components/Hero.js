'use client'

import { motion } from 'framer-motion'
import TiltCard from './TiltCard'
import Image from 'next/image'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay: 2.8 + delay, ease: [0.76, 0, 0.24, 1] },
})

export default function Hero() {
  const scroll = (id) => document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <>
      <style>{`
        .hero-section {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding-top: 100px;
          padding-bottom: 64px;
          position: relative;
          overflow: hidden;
          background: var(--bg);
        }
        .hero-inner {
          display: flex;
          flex-direction: column;
          gap: 48px;
          align-items: center;
        }
        .hero-text {
          display: flex;
          flex-direction: column;
          gap: 24px;
          width: 100%;
        }
        .hero-card {
          width: 100%;
          max-width: 400px;
        }
        @media (min-width: 1024px) {
          .hero-inner {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            gap: 48px;
          }
          .hero-text {
            max-width: 560px;
            flex: 1;
          }
          .hero-card {
            flex-shrink: 0;
            width: 340px;
          }
        }
      `}</style>

      <section id="home" className="hero-section">
        <div className="grid-bg" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '35%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 400, background: 'radial-gradient(ellipse, rgba(59,130,246,0.07) 0%, transparent 65%)', pointerEvents: 'none' }} />

        <div className="container" style={{ position: 'relative' }}>
          <div className="hero-inner">

            {/* Left text */}
            <div className="hero-text">
              <motion.div {...fadeUp(0)}>
                <div className="tag"><span className="dot" />Engineering HQ · Nawabshah, Sindh</div>
              </motion.div>

              <motion.h1 {...fadeUp(0.1)} style={{ fontSize: 'clamp(38px, 7vw, 70px)', lineHeight: 1.04, letterSpacing: '-0.03em', color: 'var(--text-primary)', fontFamily: 'Space Grotesk', fontWeight: 800 }}>
                ORBIT-I{' '}
                <span className="gradient-text-blue" style={{ display: 'block' }}>Private Limited</span>
              </motion.h1>

              <motion.h2 {...fadeUp(0.15)} style={{ fontSize: 'clamp(15px, 2.5vw, 22px)', fontWeight: 500, color: 'var(--text-secondary)', fontFamily: 'Space Grotesk', letterSpacing: '-0.02em', lineHeight: 1.4 }}>
                Engineering Software That Stays in{' '}
                <span className="gradient-text-blue">Orbit</span>{' '}
                Around Your Business
              </motion.h2>

              <motion.p {...fadeUp(0.2)} style={{ fontSize: 15, lineHeight: 1.75, color: 'var(--text-secondary)' }}>
                We engineer custom software systems, scalable cloud platforms, and modern enterprise applications with strict type safety, modular architecture, and long-term production reliability.
              </motion.p>

              <motion.div {...fadeUp(0.25)} style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button onClick={() => scroll('#services')} className="btn-primary" style={{ fontSize: 13 }}>
                  Our Services
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7H11M11 7L7.5 3.5M11 7L7.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                <button onClick={() => scroll('#team')} className="btn-outline" style={{ fontSize: 13 }}>Meet the Team</button>
                <button onClick={() => scroll('#contact')} className="btn-outline" style={{ fontSize: 13 }}>Contact Us</button>
              </motion.div>

              <motion.div {...fadeUp(0.3)} style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                {[{ icon: '✓', text: 'Production-Grade Architecture' }, { icon: '✓', text: 'SECP Registered Pvt. Ltd.' }, { icon: '●', text: 'Global Delivery', green: true }].map((b) => (
                  <div key={b.text} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>
                    <span style={{ color: b.green ? '#22c55e' : 'var(--accent)', fontSize: 10 }}>{b.icon}</span>
                    {b.text}
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right emblem card */}
            <motion.div
              className="hero-card"
              initial={{ opacity: 0, x: 30, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 3.1, ease: [0.76, 0, 0.24, 1] }}
            >
              <TiltCard style={{ borderRadius: 24, padding: '32px 24px', background: 'var(--bg-card)', border: '1px solid var(--border-hover)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: -60, left: '50%', transform: 'translateX(-50%)', width: 240, height: 200, background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

                <div style={{ position: 'relative', width: 110, height: 110, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                    style={{ position: 'absolute', width: 110, height: 110, borderRadius: '50%', border: '1px solid rgba(59,130,246,0.2)' }}>
                    <div style={{ position: 'absolute', top: -4, left: '50%', transform: 'translateX(-50%)', width: 8, height: 8, borderRadius: '50%', background: '#3b82f6' }} />
                  </motion.div>
                  <motion.div animate={{ rotate: -360 }} transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
                    style={{ position: 'absolute', width: 72, height: 72, borderRadius: '50%', border: '1px solid rgba(99,140,210,0.15)' }}>
                    <div style={{ position: 'absolute', bottom: -3, left: '50%', transform: 'translateX(-50%)', width: 6, height: 6, borderRadius: '50%', background: 'rgba(99,140,210,0.5)' }} />
                  </motion.div>
                  <Image src="/orbitlogo-removebg-preview.png" alt="ORBIT-I" width={56} height={56}
                    style={{ objectFit: 'contain', filter: 'drop-shadow(0 0 12px rgba(59,130,246,0.5))' }} />
                </div>

                <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <p style={{ fontSize: 10, letterSpacing: '0.12em', color: 'var(--accent)', textTransform: 'uppercase', fontWeight: 600 }}>Official Corporate Emblem</p>
                  <h3 style={{ fontFamily: 'Space Grotesk', fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>ORBIT-I Private Limited</h3>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>Engineering software, custom platforms, and verifiable cloud architectures from Nawabshah, Sindh.</p>
                </div>

                <div style={{ width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderTop: '1px solid var(--border)' }}>
                  {[['EST. 2024', 'Founded'], ['SECP', 'Active'], ['SINDH', 'HQ']].map(([v, l], i) => (
                    <div key={l} style={{ padding: '12px 6px', textAlign: 'center', borderLeft: i > 0 ? '1px solid var(--border)' : 'none' }}>
                      <div style={{ fontFamily: 'Space Grotesk', fontSize: 11, fontWeight: 700, color: 'var(--text-primary)' }}>{v}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{l}</div>
                    </div>
                  ))}
                </div>
              </TiltCard>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
                {[{ label: 'Production-Grade', sub: 'Architecture' }, { label: 'SECP Verified', sub: 'Private Limited' }].map((item) => (
                  <TiltCard key={item.label} style={{ borderRadius: 16, padding: '16px', background: 'var(--bg-card)', border: '1px solid var(--border-hover)' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', marginBottom: 8 }} />
                    <div style={{ fontFamily: 'Space Grotesk', fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>{item.label}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>{item.sub}</div>
                  </TiltCard>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 3.4 }}
            style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              onClick={() => scroll('#about')}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <span style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Scroll</span>
              <div style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid var(--border-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M6 2V10M6 10L3 7M6 10L9 7" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
