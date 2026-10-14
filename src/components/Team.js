'use client'
'use client'

import { motion } from 'framer-motion'
import TiltCard from './TiltCard'
import Image from 'next/image'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.7, delay, ease: [0.76, 0, 0.24, 1] },
})

const founders = [
  {
    name: 'Abdul Samad Rind',
    role: 'Founder & CEO',
    category: 'Executive Leadership',
    bio: 'Steering ORBIT-I Private Limited with focus on high-performance systems, sustainable architecture, and digital engineering partnerships across Pakistan and internationally.',
    initials: 'AS',
    photo: '/team/samad rind.jpeg',
    objectPosition: 'center 10%',
    linkedin: 'https://www.linkedin.com/company/orbit-i-private-limited/',
    email: 'mailto:contactus@orbit-i.tech',
  },
  {
    name: 'Maria Almani',
    role: 'Co-Founder & COO',
    category: 'Operations & Strategy',
    bio: 'Overseeing client operations, sprint delivery management, team coordination, and strategic business growth for all ORBIT-I engagements.',
    initials: 'MA',
    photo: '/team/female avatar.png',
    objectPosition: 'center center',
    linkedin: 'https://www.linkedin.com/company/orbit-i-private-limited/',
    email: 'mailto:contactus@orbit-i.tech',
  },
  {
    name: 'Muhammad Muneeb Ur Rahman',
    role: 'Co-Founder & CTO',
    category: 'Engineering & Technology',
    bio: 'Orchestrating technical architecture, cloud scalability, secure database design, and engineering standards across all ORBIT-I products.',
    initials: 'MM',
    photo: '/team/Muneeb ur rehman.jpeg',
    objectPosition: 'center 10%',
    linkedin: 'https://www.linkedin.com/company/orbit-i-private-limited/',
    email: 'mailto:contactus@orbit-i.tech',
  },
]

const team = [
  {
    name: 'Hassan Ansar',
    role: 'Web Developer',
    category: 'Web Engineering',
    initials: 'HA',
    photo: '/team/hassan anser.jpeg',
    objectPosition: 'center 20%',
  },
  {
    name: 'Waleed Ahmed',
    role: 'Digital Marketing Expert',
    category: 'Marketing & Growth',
    initials: 'WA',
    photo: '/team/waleed.jpeg',
    objectPosition: 'center 10%',
  },
  {
    name: 'Rashid Ali Channa',
    role: 'AI/ML Engineer',
    category: 'AI & Research',
    initials: 'RC',
    photo: '/team/rashid channa.jpeg',
    objectPosition: 'center 15%',
  },
  {
    name: 'Laiba',
    role: 'Backend Developer',
    category: 'Backend & Systems',
    initials: 'LA',
    photo: '/team/female avatar.png',
    objectPosition: 'center center',
  },
  {
    name: 'Abdul Rehman',
    role: '.NET Developer',
    category: 'Enterprise Systems',
    initials: 'AR',
    photo: '/team/abdul rehman.png',
    objectPosition: 'center 10%',
  },
  {
    name: 'Chander',
    role: 'Software Engineer',
    category: 'Software Engineering',
    initials: 'CH',
    photo: '/team/chander.jpeg',
    objectPosition: 'center top',
  },
  {
    name: 'Umar Farooque',
    role: 'Frontend Developer',
    category: 'Web Engineering',
    initials: 'UF',
    photo: '/team/umar farooque.jpeg',
    objectPosition: 'center 10%',
  },
  {
    name: 'Ahsan Ali',
    role: 'DevOps Engineer',
    category: 'Cloud & Infrastructure',
    initials: 'AA',
    photo: '/team/Ahsan ali.jpeg',
    objectPosition: 'center 10%',
  },
  {
    name: 'Hamnah',
    role: 'UI/UX Designer',
    category: 'Design Systems',
    initials: 'HN',
    photo: '/team/female avatar.png',
    objectPosition: 'center center',
  },
]

function FounderCard({ member, index }) {
  return (
    <motion.div
      {...fadeUp(index * 0.08)}
      style={{
        borderRadius: 20,
        overflow: 'hidden',
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <TiltCard style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Top accent bar */}
      <div style={{ height: 2, background: 'linear-gradient(90deg, var(--accent), transparent)', width: '100%' }} />

      {/* Avatar section */}
      <div style={{
        height: 180,
        background: 'linear-gradient(135deg, var(--bg-elevated) 0%, var(--bg) 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative',
      }}>
        {member.photo ? (
          <Image
            src={member.photo}
            alt={member.name}
            width={84}
            height={84}
            style={{ width: 84, height: 84, borderRadius: '50%', objectFit: 'cover', objectPosition: member.objectPosition || 'center 10%', border: '2px solid var(--border-hover)' }}
          />
        ) : (
          <div style={{
            width: 84, height: 84, borderRadius: '50%',
            background: 'var(--bg)',
            border: '2px solid var(--border-hover)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 32px var(--accent-glow)',
          }}>
            <span style={{
              fontFamily: 'Space Grotesk', fontSize: 28, fontWeight: 800,
              color: 'var(--accent-light)',
            }}>
              {member.initials}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '20px 24px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div>
          <p style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 4 }}>
            {member.category}
          </p>
          <h3 style={{ fontFamily: 'Space Grotesk', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
            {member.name}
          </h3>
          <p style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600, marginTop: 2 }}>
            {member.role}
          </p>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          {member.bio}
        </p>
        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          {[
            { label: 'Email', href: member.email || '#' },
            { label: 'LinkedIn', href: member.linkedin || '#' },
          ].map((s) => (
            <a key={s.label} href={s.href} target={s.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" style={{
              fontSize: 11, padding: '5px 12px',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              borderRadius: 100, color: 'var(--text-muted)',
              cursor: 'pointer', fontFamily: 'Inter',
              textDecoration: 'none', display: 'inline-block',
              transition: 'all 0.15s',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'var(--border-hover)' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border)' }}
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
      </TiltCard>
    </motion.div>
  )
}

function TeamCard({ member }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      style={{
        width: 220,
        flexShrink: 0,
        borderRadius: 16,
        overflow: 'hidden',
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        transition: 'border-color 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-hover)'
        e.currentTarget.style.boxShadow = '0 16px 32px rgba(7,13,26,0.4)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Avatar */}
      <div style={{
        height: 160,
        background: 'linear-gradient(135deg, var(--bg-elevated) 0%, var(--bg) 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        {member.photo ? (
          <Image
            src={member.photo}
            alt={member.name}
            width={240}
            height={160}
            style={{ width: '100%', height: 160, objectFit: 'cover', objectPosition: member.objectPosition || 'center 15%' }}
          />
        ) : (
          <div style={{
            width: 60, height: 60, borderRadius: '50%',
            background: 'var(--bg)',
            border: '1.5px solid var(--border-hover)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontFamily: 'Space Grotesk', fontSize: 20, fontWeight: 800, color: 'var(--accent-light)' }}>
              {member.initials}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '14px 16px 16px' }}>
        <p style={{ fontSize: 9, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 4 }}>
          {member.category}
        </p>
        <h4 style={{ fontFamily: 'Space Grotesk', fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
          {member.name}
        </h4>
        <p style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600, marginTop: 2 }}>
          {member.role}
        </p>
        <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
          {['✉', 'in'].map((s) => (
            <button key={s} style={{
              fontSize: 10, padding: '3px 8px',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              borderRadius: 100, color: 'var(--text-muted)',
              cursor: 'pointer', fontFamily: 'Inter',
            }}>
              {s}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default function Team() {
  const doubled = [...team, ...team]

  return (
    <section id="team" style={{ paddingTop: 100, paddingBottom: 100, background: 'var(--bg)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 64 }}>
          <motion.div {...fadeUp(0)}>
            <div className="tag">
              <span className="dot" style={{ background: 'var(--accent)' }} />
              ORBIT-I Core Team & Leadership
            </div>
          </motion.div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20 }}>
            <motion.h2 {...fadeUp(0.1)} style={{
              fontSize: 'clamp(32px, 4vw, 52px)',
              lineHeight: 1.1, letterSpacing: '-0.03em',
              color: 'var(--text-primary)', maxWidth: 480,
            }}>
              Meet the{' '}
              <span className="gradient-text-blue">ORBIT-I Team</span>
            </motion.h2>
            <motion.p {...fadeUp(0.2)} style={{ fontSize: 15, color: 'var(--text-secondary)', maxWidth: 380, lineHeight: 1.6 }}>
              The visionary founders, engineers, AI specialists, and designers building
              dependable enterprise technology at ORBIT-I.
            </motion.p>
          </div>
        </div>

        {/* Founders */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, whiteSpace: 'nowrap' }}>
              Executive Governance
            </span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            <span style={{ fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>3 Principals</span>
          </div>

          <div className="founders-grid">
            {founders.map((f, i) => <FounderCard key={f.name} member={f} index={i} />)}
          </div>
        </div>

        {/* Core team label */}
        <motion.div {...fadeUp(0.1)} style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <span style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, whiteSpace: 'nowrap' }}>
            Engineering & Creative
          </span>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          <span style={{ fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>7 Specialists</span>
        </motion.div>
      </div>

      {/* Marquee — full width */}
      <motion.div
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
        viewport={{ once: true }} transition={{ duration: 0.5 }}
        style={{ overflow: 'hidden', position: 'relative' }}
      >
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 120, background: 'linear-gradient(90deg, var(--bg), transparent)', zIndex: 10, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 120, background: 'linear-gradient(270deg, var(--bg), transparent)', zIndex: 10, pointerEvents: 'none' }} />
        <div className="marquee-track" style={{ display: 'flex', gap: 14, width: 'max-content', paddingLeft: 32, paddingRight: 32 }}>
          {doubled.map((m, i) => <TeamCard key={`${m.name}-${i}`} member={m} />)}
        </div>
      </motion.div>

      <div className="separator" style={{ marginTop: 100 }} />
    </section>
  )
}
