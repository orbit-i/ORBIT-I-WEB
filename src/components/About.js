'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import TiltCard from './TiltCard'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.7, delay, ease: [0.76, 0, 0.24, 1] },
})

const values = [
  { icon: '⬡', title: 'Precision Engineering', description: 'We simulate real-world concurrency and data workloads to ensure your systems are fault-tolerant before they go live.' },
  { icon: '◈', title: 'Modular Architecture', description: 'Every system is designed for maintainability — clean separation of concerns, clear ownership, zero magic.' },
  { icon: '◎', title: 'Long-Term Reliability', description: 'We engineer production systems that your team can maintain and scale for years, not just prototypes.' },
  { icon: '◆', title: 'Applied AI', description: 'From autonomous LLM agents to enterprise RAG systems, we bring cutting-edge AI into practical deployable products.' },
]

const metrics = [
  { value: '7+', label: 'Services', sub: 'AI, Web, Mobile & Cloud' },
  { value: '2024', label: 'Founded', sub: 'SECP Registered' },
  { value: '100%', label: 'IP Owned', sub: 'No recurring costs' },
  { value: 'Global', label: 'Delivery', sub: 'Sindh HQ' },
]

const infoCards = [
  { label: 'Java & Spring Boot', sub: 'Enterprise Backend' },
  { label: 'React & Next.js', sub: 'Frontend Development' },
  { label: 'Python & FastAPI', sub: 'AI/ML Systems' },
  { label: 'LangChain & RAG', sub: 'AI Integration' },
  { label: 'AWS & Docker', sub: 'Cloud Infrastructure' },
  { label: 'React Native', sub: 'Mobile Development' },
  { label: 'PostgreSQL & Redis', sub: 'Data Layer' },
  { label: 'TypeScript', sub: 'Type-Safe Development' },
  { label: 'CI/CD Pipelines', sub: 'DevOps Engineering' },
  { label: 'Figma & TailwindCSS', sub: 'UI/UX Design' },
]

export default function About() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const doubled = [...infoCards, ...infoCards]

  return (
    <section id="about" style={{ paddingTop: 0, paddingBottom: 80, background: 'var(--bg)' }}>
      <div className="separator" style={{ marginBottom: 48 }} />

      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 48 }}>
          <motion.div {...fadeUp(0)}>
            <div className="tag"><span className="dot" />About ORBIT-I</div>
          </motion.div>

          <motion.h2 {...fadeUp(0.1)} style={{
            fontSize: 'clamp(28px, 5vw, 52px)', lineHeight: 1.1,
            letterSpacing: '-0.03em', color: 'var(--text-primary)',
          }}>
            Strong engineering is the foundation of every{' '}
            <span className="gradient-text-blue">successful business</span>
          </motion.h2>

          <motion.p {...fadeUp(0.2)} style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.65, maxWidth: 500 }}>
            At ORBIT-I, we believe digital systems need software that performs reliably under
            peak demand — not just during demos.
          </motion.p>
        </div>

        {/* Two column — stacks on mobile */}
        <div className="about-grid" style={{ marginBottom: 14 }}>
          {/* Who we are */}
          <motion.div {...fadeUp(0.1)}>
            <TiltCard style={{
              borderRadius: 20, padding: '28px',
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              display: 'flex', flexDirection: 'column', gap: 18,
            }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--accent-glow)', border: '1px solid var(--border-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: 'var(--accent)' }}>◎</div>
              <h3 style={{ fontFamily: 'Space Grotesk', fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Who We Are</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  'Our team of experienced software engineers, cloud architects, and AI specialists focuses on custom software solutions, enterprise web platforms, cross-platform mobile apps, cloud infrastructure, and secure API integrations.',
                  "We don't build basic prototypes — we engineer production systems, uncover operational bottlenecks, and provide clear, practical code that your team can maintain and scale.",
                  'What makes us different is our hands-on engineering approach. We simulate real-world concurrency and data workloads to ensure your systems are fault-tolerant.',
                ].map((p, i) => <p key={i} style={{ fontSize: 14, lineHeight: 1.75, color: 'var(--text-secondary)' }}>{p}</p>)}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                {['Java', 'Spring Boot', 'React', 'Next.js', 'Python', 'FastAPI', 'AWS', 'Docker', 'LangChain'].map((t) => (
                  <span key={t} style={{ fontSize: 11, padding: '4px 10px', background: 'var(--bg-elevated)', border: '1px solid var(--border-hover)', borderRadius: 100, color: 'var(--text-secondary)', fontWeight: 500 }}>{t}</span>
                ))}
              </div>
            </TiltCard>
          </motion.div>

          {/* Values grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
            {values.map((v, i) => (
              <motion.div key={v.title} {...fadeUp(0.06 + i * 0.05)}>
                <TiltCard style={{ borderRadius: 16, padding: '20px', background: 'var(--bg-card)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 10, height: '100%' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--accent-glow)', border: '1px solid var(--border-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, color: 'var(--accent)' }}>{v.icon}</div>
                  <h4 style={{ fontFamily: 'Space Grotesk', fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>{v.title}</h4>
                  <p style={{ fontSize: 12, lineHeight: 1.6, color: 'var(--text-secondary)' }}>{v.description}</p>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Metrics */}
        <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <TiltCard style={{ borderRadius: 20, padding: '28px 24px', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="about-metrics">
              {metrics.map((m, i) => (
                <div key={m.label} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <span style={{ fontFamily: 'Space Grotesk', fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: 1 }}>{m.value}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', fontFamily: 'Space Grotesk' }}>{m.label}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{m.sub}</span>
                </div>
              ))}
            </div>
          </TiltCard>
        </motion.div>
      </div>

      {/* Running tech marquee */}
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}
        style={{ overflow: 'hidden', position: 'relative', marginTop: 48 }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 80, background: 'linear-gradient(90deg, var(--bg), transparent)', zIndex: 10, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 80, background: 'linear-gradient(270deg, var(--bg), transparent)', zIndex: 10, pointerEvents: 'none' }} />
        <div className="marquee-track" style={{ display: 'flex', gap: 10, width: 'max-content', paddingLeft: 24 }}>
          {doubled.map((card, i) => (
            <div key={i} style={{ flexShrink: 0, padding: '12px 18px', background: 'var(--bg-card)', border: '1px solid var(--border-hover)', borderRadius: 14, display: 'flex', alignItems: 'center', gap: 10, minWidth: 180 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
              <div>
                <div style={{ fontFamily: 'Space Grotesk', fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>{card.label}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>{card.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="separator" style={{ marginTop: 56 }} />

      <style>{`
        @media (min-width: 1024px) {
          #about-grid { display: grid !important; grid-template-columns: 1fr 1fr !important; }
          #metrics-grid { grid-template-columns: repeat(4, 1fr) !important; }
        }
      `}</style>
    </section>
  )
}
