'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import TiltCard from '@/components/TiltCard'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Mail, Users } from 'lucide-react'

const founders = [
  {
    name: 'Abdul Samad Rind',
    role: 'Founder & CEO',
    category: 'Executive Leadership',
    bio: 'Steering ORBIT-I Private Limited with relentless focus on high-performance enterprise systems, sustainable digital architecture, and strategic engineering partnerships across Pakistan, the Middle East, and global markets.',
    initials: 'AS',
    photo: '/team/samad rind.jpeg',
    objectPosition: 'center 10%',
    linkedin: 'https://www.linkedin.com/company/orbit-i-private-limited/',
    email: 'contactus@orbit-i.tech',
    location: 'Nawabshah & Karachi',
  },
  {
    name: 'Maria Almani',
    role: 'Co-Founder & COO',
    category: 'Operations & Strategy',
    bio: 'Orchestrating commercial client operations, agile sprint deliveries, talent incubation, and corporate enterprise expansion across both domestic and international client accounts.',
    initials: 'MA',
    photo: '/team/female avatar.png',
    objectPosition: 'center center',
    linkedin: 'https://www.linkedin.com/company/orbit-i-private-limited/',
    email: 'contactus@orbit-i.tech',
    location: 'Karachi & Hyderabad',
  },
  {
    name: 'Muhammad Muneeb Ur Rahman',
    role: 'Co-Founder & CTO',
    category: 'Engineering & Technology',
    bio: 'Pioneering technical system architecture, cloud DevOps scalability, zero-trust security hardening, and autonomous AI pipelines across all ORBIT-I production software.',
    initials: 'MM',
    photo: '/team/Muneeb ur rehman.jpeg',
    objectPosition: 'center 10%',
    linkedin: 'https://www.linkedin.com/company/orbit-i-private-limited/',
    email: 'contactus@orbit-i.tech',
    location: 'Nawabshah & Karachi',
  },
]

const baseTeam = [
  {
    name: 'Hassan Ansar',
    role: 'Lead Web Engineer',
    category: 'Web Engineering',
    initials: 'HA',
    photo: '/team/hassan anser.jpeg',
    objectPosition: 'center 20%',
    skills: 'Next.js, React, Tailwind CSS, TypeScript',
  },
  {
    name: 'Waleed Ahmed',
    role: 'Digital Marketing & Growth Specialist',
    category: 'Marketing & Growth',
    initials: 'WA',
    photo: '/team/waleed.jpeg',
    objectPosition: 'center 10%',
    skills: 'Technical SEO, AI-SEO, SEM, Brand Engineering',
  },
  {
    name: 'Rashid Ali Channa',
    role: 'AI / Machine Learning Engineer',
    category: 'AI & Data Science',
    initials: 'RC',
    photo: '/team/rashid channa.jpeg',
    objectPosition: 'center 15%',
    skills: 'PyTorch, LangChain, RAG Systems, FastAPI',
  },
  {
    name: 'Laiba',
    role: 'Backend & Cloud Systems Engineer',
    category: 'Backend & Cloud',
    initials: 'LA',
    photo: '/team/female avatar.png',
    objectPosition: 'center center',
    skills: 'Node.js, PostgreSQL, Docker, Microservices',
  },
  {
    name: 'Abdul Rehman',
    role: '.NET & Enterprise Systems Developer',
    category: 'Enterprise Systems',
    initials: 'AR',
    photo: '/team/abdul rehman.png',
    objectPosition: 'center 10%',
    skills: 'C#, .NET Core, SQL Server, Clean Architecture',
  },
  {
    name: 'Chander',
    role: 'Full-Stack Software Engineer',
    category: 'Web Engineering',
    initials: 'CH',
    photo: '/team/chander.jpeg',
    objectPosition: 'center top',
    skills: 'React Native, Express, MongoDB, UI Ergonomics',
  },
]

const departments = [
  'All Departments',
  'Executive Leadership',
  'Web Engineering',
  'AI & Data Science',
  'Backend & Cloud',
  'Enterprise Systems',
  'Marketing & Growth',
]

export default function TeamPage() {
  const [filter, setFilter] = useState('All Departments')
  const [dynamicMembers, setDynamicMembers] = useState([])

  useEffect(() => {
    fetch('/api/team/members')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setDynamicMembers(data)
      })
      .catch(() => {})
  }, [])

  // Combine static and dynamic team members
  const allTeamList = [
    ...baseTeam,
    ...dynamicMembers.map((m) => ({
      name: m.name,
      role: m.designation,
      category: m.department || 'Engineering',
      initials: m.name.substring(0, 2).toUpperCase(),
      photo: m.avatar_url || '/orbitlogo-removebg-preview.png',
      skills: m.skills || '',
      linkedin: m.linkedin_url,
    })),
  ]

  const filteredFounders = founders.filter(
    (f) => filter === 'All Departments' || filter === 'Executive Leadership'
  )

  const filteredTeam = allTeamList.filter((m) => {
    if (filter === 'All Departments') return true
    return m.category.toLowerCase().includes(filter.toLowerCase()) || filter.toLowerCase().includes(m.category.toLowerCase())
  })

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', background: 'var(--bg)', paddingTop: 0, paddingBottom: 100 }}>
        {/* Header Section */}
        <section style={{ padding: '48px 0 60px', position: 'relative', overflow: 'hidden' }}>
          <div className="grid-bg" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
          <div className="container" style={{ position: 'relative', textAlign: 'center', maxWidth: 860, margin: '0 auto' }}>
            <div className="tag" style={{ display: 'inline-flex', marginBottom: 16 }}>
              <span className="dot" />World-Class Engineering Talent
            </div>
            <h1 style={{ fontFamily: 'Space Grotesk', fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.15, marginBottom: 18 }}>
              Meet the Engineers & Architects <span className="gradient-text-blue">Behind ORBIT-I</span>
            </h1>
            <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 680, margin: '0 auto' }}>
              From corporate headquarters in <strong>Nawabshah</strong> to commercial offices in <strong>Karachi</strong> and regional engineering clusters in <strong>Hyderabad</strong> — our SECP-governed software leaders build scalable digital futures.
            </p>

            {/* Stats row */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 36, flexWrap: 'wrap', marginTop: 36 }}>
              <div>
                <div style={{ fontFamily: 'Space Grotesk', fontSize: 28, fontWeight: 800, color: 'var(--accent)' }}>3</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Founding Executives</div>
              </div>
              <div style={{ width: 1, background: 'var(--border)' }} />
              <div>
                <div style={{ fontFamily: 'Space Grotesk', fontSize: 28, fontWeight: 800, color: 'var(--accent)' }}>12+</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Engineers & Researchers</div>
              </div>
              <div style={{ width: 1, background: 'var(--border)' }} />
              <div>
                <div style={{ fontFamily: 'Space Grotesk', fontSize: 28, fontWeight: 800, color: 'var(--accent)' }}>100%</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>In-House IP Engineering</div>
              </div>
            </div>
          </div>
        </section>

        {/* Filter Pills */}
        <section style={{ padding: '0 0 40px' }}>
          <div className="container" style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 8 }}>
            {departments.map((dep) => (
              <button
                key={dep}
                onClick={() => setFilter(dep)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 100,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: filter === dep ? '1px solid var(--accent)' : '1px solid var(--border)',
                  background: filter === dep ? 'var(--accent-glow)' : 'var(--bg-card)',
                  color: filter === dep ? 'var(--accent)' : 'var(--text-secondary)',
                  transition: 'all 0.2s',
                }}
              >
                {dep}
              </button>
            ))}
          </div>
        </section>

        {/* Executive Founders Section */}
        {filteredFounders.length > 0 && (
          <section style={{ padding: '20px 0 60px' }}>
            <div className="container">
              <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <span className="tag" style={{ fontSize: 10, padding: '4px 10px' }}>Executive Council</span>
                <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 26, fontWeight: 700, color: 'var(--text-primary)', marginTop: 8 }}>
                  Founding Leadership
                </h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, maxWidth: 1100, margin: '0 auto' }}>
                {filteredFounders.map((f) => (
                  <TiltCard
                    key={f.name}
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-hover)',
                      borderRadius: 24,
                      padding: 28,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 18 }}>
                        <div style={{ position: 'relative', width: 72, height: 72, borderRadius: 20, overflow: 'hidden', border: '2px solid var(--accent)', flexShrink: 0 }}>
                          <Image
                            src={f.photo}
                            alt={f.name}
                            fill
                            style={{ objectFit: 'cover', objectPosition: f.objectPosition || 'center' }}
                          />
                        </div>
                        <div>
                          <span style={{ fontSize: 10, padding: '3px 8px', background: 'var(--accent-glow)', border: '1px solid var(--border-hover)', borderRadius: 100, color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase' }}>
                            {f.category}
                          </span>
                          <h3 style={{ fontFamily: 'Space Grotesk', fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginTop: 6, marginBottom: 2 }}>
                            {f.name}
                          </h3>
                          <p style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600 }}>{f.role}</p>
                        </div>
                      </div>

                      <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 18 }}>
                        {f.bio}
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)' }}>
                        <MapPin size={13} color="var(--accent)" /> {f.location}
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <a
                          href={f.linkedin}
                          target="_blank"
                          rel="noreferrer"
                          style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--bg-elevated)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                        </a>
                        <a
                          href={`mailto:${f.email}`}
                          style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--bg-elevated)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}
                        >
                          <Mail size={15} />
                        </a>
                      </div>
                    </div>
                  </TiltCard>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Engineering & Specialists Grid */}
        {filter !== 'Executive Leadership' && (
          <section style={{ padding: '20px 0 80px' }}>
            <div className="container">
              <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <span className="tag" style={{ fontSize: 10, padding: '4px 10px' }}>Core Engineering Unit</span>
                <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginTop: 8 }}>
                  Specialists & Systems Engineers
                </h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, maxWidth: 1100, margin: '0 auto' }}>
                {filteredTeam.map((m, i) => (
                  <TiltCard
                    key={m.name + i}
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                      borderRadius: 20,
                      padding: 22,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                      <div style={{ position: 'relative', width: 56, height: 56, borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border)', flexShrink: 0 }}>
                        <Image
                          src={m.photo}
                          alt={m.name}
                          fill
                          style={{ objectFit: 'cover', objectPosition: m.objectPosition || 'center' }}
                        />
                      </div>
                      <div>
                        <span style={{ fontSize: 9, padding: '2px 7px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 100, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                          {m.category}
                        </span>
                        <h4 style={{ fontFamily: 'Space Grotesk', fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginTop: 4, marginBottom: 1 }}>
                          {m.name}
                        </h4>
                        <p style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 500 }}>{m.role}</p>
                      </div>
                    </div>

                    {m.skills && (
                      <div style={{ padding: '8px 12px', background: 'var(--bg-elevated)', borderRadius: 10, border: '1px solid var(--border)', fontSize: 11, color: 'var(--text-secondary)' }}>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Core Competencies: </span>
                        {m.skills}
                      </div>
                    )}
                  </TiltCard>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Join the Team CTA Banner */}
        <section style={{ padding: '0 0 40px' }}>
          <div className="container" style={{ maxWidth: 960 }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(56,189,248,0.06) 100%)',
              border: '1px solid var(--border-hover)',
              borderRadius: 24,
              padding: '36px 32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 20,
            }}>
              <div>
                <span className="tag" style={{ marginBottom: 10 }}>Career Openings</span>
                <h3 style={{ fontFamily: 'Space Grotesk', fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
                  Want to Engineer the Future with ORBIT-I?
                </h3>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', maxWidth: 520 }}>
                  We are actively recruiting passionate developers, AI researchers, and engineering interns across Pakistan and remotely.
                </p>
              </div>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link href="/careers" className="btn-primary" style={{ textDecoration: 'none', padding: '12px 24px', fontSize: 13 }}>
                  Explore Career Openings →
                </Link>
                <Link href="/contact" className="btn-outline" style={{ textDecoration: 'none', padding: '12px 20px', fontSize: 13 }}>
                  Get In Touch
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
