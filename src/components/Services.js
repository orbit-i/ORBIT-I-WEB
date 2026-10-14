'use client'

import { motion } from 'framer-motion'
import TiltCard from './TiltCard'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.7, delay, ease: [0.76, 0, 0.24, 1] },
})

const services = [
  {
    id: 'ai', featured: true,
    category: 'Autonomous Systems',
    title: 'Enterprise AI & Machine Learning Solutions',
    description: 'Custom LLMs, autonomous operational agents, enterprise RAG, and predictive intelligence. Production-grade AI built into your business workflows.',
    features: [
      'Enterprise RAG with strict on-premise/VPC data governance',
      'Autonomous multi-step agents that execute business actions',
      'Domain-adapted model fine-tuning for specialized vocabulary',
      'Sub-100ms vector search with hybrid semantic scaling',
    ],
    tags: ['LangChain', 'Python', 'FastAPI', 'pgvector'],
  },
  {
    id: 'web', category: 'Core Engineering', title: 'Web Application Development',
    description: 'Fast, secure, and maintainable enterprise web applications built on modern frameworks with strict type safety.',
    features: ['Type-safety across client and server', 'Modular design systems', 'Sub-second load times', 'Automated testing pipelines'],
    tags: ['React', 'Next.js', 'TypeScript', 'Node.js'], icon: '⬡',
  },
  {
    id: 'mobile', category: 'Core Engineering', title: 'Mobile Application Development',
    description: 'High-performance cross-platform apps for iOS and Android from a unified codebase with native hardware integration.',
    features: ['Single codebase for iOS & Android', 'Offline-first sync', '60fps animations', 'App Store compliance'],
    tags: ['React Native', 'Flutter', 'iOS', 'Android'], icon: '◎',
  },
  {
    id: 'custom', category: 'Core Engineering', title: 'Custom Software Solutions',
    description: 'Tailor-made internal platforms that automate complex workflows with complete IP ownership.',
    features: ['Exact alignment with your processes', 'No recurring SaaS costs', 'Full IP ownership', 'Legacy ERP integration'],
    tags: ['Java', 'Spring Boot', 'MySQL', 'Docker'], icon: '◆',
  },
  {
    id: 'uiux', category: 'Core Engineering', title: 'UI/UX Design Systems',
    description: 'Human-centered interfaces engineered for cognitive clarity and high task completion rates.',
    features: ['WCAG AA/AAA accessibility', 'Figma component libraries', 'Design token systems', 'Pixel-accurate CSS'],
    tags: ['Figma', 'Design Tokens', 'TailwindCSS'], icon: '◇',
  },
  {
    id: 'cloud', category: 'Core Engineering', title: 'Cloud & DevOps Engineering',
    description: 'Resilient cloud infrastructure, automated CI/CD pipelines, and zero-downtime deployments.',
    features: ['Zero-downtime CI/CD', 'Isolated staging/production', 'Automated backups', 'Real-time monitoring'],
    tags: ['Docker', 'Linux', 'AWS', 'Cloudflare'], icon: '⬢',
  },
  {
    id: 'api', category: 'Core Engineering', title: 'Enterprise API & Integrations',
    description: 'Secure payment gateways, banking APIs, ERP connectors, and webhooks with full compliance.',
    features: ['Idempotent webhook handlers', 'Cryptographic verification', 'High-throughput rate limiting', 'Audit logging'],
    tags: ['Node.js', 'TypeScript', 'REST', 'Webhooks'], icon: '◉',
  },
]

export default function Services() {
  const scroll = () => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section id="services" style={{ paddingTop: 56, paddingBottom: 80, background: 'var(--bg)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 48 }}>
          <motion.div {...fadeUp(0)}>
            <div className="tag"><span className="dot" />Full-Spectrum Engineering & Applied AI</div>
          </motion.div>
          <motion.h2 {...fadeUp(0.1)} style={{ fontSize: 'clamp(28px, 5vw, 52px)', lineHeight: 1.1, letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
            Enterprise Services &{' '}<span className="gradient-text-blue">AI Solutions</span>
          </motion.h2>
          <motion.p {...fadeUp(0.2)} style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.65, maxWidth: 480 }}>
            From autonomous LLM agents and custom ML pipelines to mission-critical web platforms and cross-platform mobile apps.
          </motion.p>
        </div>

        {/* Featured AI card */}
        <motion.div {...fadeUp(0.1)} style={{ marginBottom: 14 }}>
          <div onClick={scroll} style={{
            borderRadius: 20, padding: '32px 28px',
            background: 'var(--bg-card)', border: '1px solid var(--border-hover)',
            position: 'relative', overflow: 'hidden', cursor: 'pointer',
            transition: 'border-color 0.2s, box-shadow 0.2s',
          }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.boxShadow = '0 24px 48px var(--card-shadow)' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.boxShadow = 'none' }}
          >
            <div style={{ position: 'absolute', top: -80, right: -80, width: 280, height: 280, background: 'radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 10, padding: '5px 12px', background: 'var(--accent-glow)', border: '1px solid var(--border-hover)', borderRadius: 100, color: 'var(--accent-light)', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase' }}>✦ Flagship AI Service</span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>Autonomous Systems</span>
              </div>
              <h3 style={{ fontFamily: 'Space Grotesk', fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                {services[0].title}
              </h3>
              <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{services[0].description}</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 8 }}>
                {services[0].features.map((f) => (
                  <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <span style={{ color: 'var(--accent)', fontSize: 13, marginTop: 1, flexShrink: 0 }}>✓</span>
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{f}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                {services[0].tags.map((t) => (
                  <span key={t} style={{ fontSize: 11, padding: '4px 10px', background: 'var(--accent-glow)', border: '1px solid var(--border-hover)', borderRadius: 100, color: 'var(--accent-light)', fontWeight: 500 }}>{t}</span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button className="btn-primary" style={{ fontSize: 13 }} onClick={(e) => { e.stopPropagation(); scroll() }}>Inquire →</button>
                <button className="btn-outline" style={{ fontSize: 13 }} onClick={(e) => { e.stopPropagation(); scroll() }}>Architecture & Specs</button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Service cards grid — 1 col mobile, 2 col tablet, 3 col desktop */}
        <div className="services-grid">
          {services.slice(1).map((s, i) => (
            <motion.div key={s.id} {...fadeUp(0.04 * i)}>
              <TiltCard onClick={scroll} style={{
                height: '100%', borderRadius: 18, padding: '24px',
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                display: 'flex', flexDirection: 'column', gap: 14,
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 11, background: 'var(--accent-glow)', border: '1px solid var(--border-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, color: 'var(--accent)', flexShrink: 0 }}>{s.icon}</div>
                  <span style={{ fontSize: 9, padding: '3px 8px', background: 'var(--accent-glow)', border: '1px solid var(--border-hover)', borderRadius: 100, color: 'var(--accent)', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{s.category}</span>
                </div>
                <h3 style={{ fontFamily: 'Space Grotesk', fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.3 }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65, flex: 1 }}>{s.description}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {s.features.slice(0, 3).map((f) => (
                    <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 7 }}>
                      <span style={{ color: 'var(--accent)', fontSize: 11, marginTop: 2, flexShrink: 0 }}>✓</span>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.45 }}>{f}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {s.tags.map((t) => (
                    <span key={t} style={{ fontSize: 10, padding: '3px 8px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 100, color: 'var(--text-muted)' }}>{t}</span>
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>⬡ Specs</span>
                  <button onClick={(e) => { e.stopPropagation(); scroll() }} style={{ fontSize: 11, fontWeight: 600, padding: '5px 12px', borderRadius: 100, background: 'var(--accent-glow)', border: '1px solid var(--border-hover)', color: 'var(--accent-light)', cursor: 'pointer', fontFamily: 'Space Grotesk', transition: 'all 0.15s' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.color = '#fff' }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--accent-glow)'; e.currentTarget.style.color = 'var(--accent-light)' }}
                  >Inquire →</button>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="separator" style={{ marginTop: 80 }} />
    </section>
  )
}
