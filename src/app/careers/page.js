'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import OrbitLogo from '@/components/OrbitLogo'
import { careerPositions } from '@/data/careersData'
import Link from 'next/link'

export default function CareersPage() {
  const [filter, setFilter] = useState('all') // 'all' | 'internship' | 'freelance'
  const [selectedRole, setSelectedRole] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    roleId: '',
    linkedin: '',
    resumeLink: '',
    coverNote: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [expandedCard, setExpandedCard] = useState(null)

  const filteredRoles = careerPositions.filter((role) => {
    if (filter === 'all') return true
    return role.category === filter
  })

  const handleOpenModal = (role) => {
    setSelectedRole(role)
    setFormData((prev) => ({ ...prev, roleId: role.id }))
    setSubmitted(false)
    setErrorMessage('')
  }

  const handleCloseModal = () => {
    setSelectedRole(null)
    setSubmitted(false)
    setErrorMessage('')
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setErrorMessage('')

    if (!formData.name || !formData.email || !formData.phone) {
      setErrorMessage('Please fill in your name, email, and contact number.')
      setSubmitting(false)
      return
    }

    const currentRole = careerPositions.find((r) => r.id === formData.roleId) || selectedRole

    const fullMessage = `
--- CAREER APPLICATION SUBMISSION ---
Position: ${currentRole ? currentRole.title : formData.roleId} (${currentRole ? currentRole.category.toUpperCase() : ''})
Candidate Name: ${formData.name}
Email: ${formData.email}
Phone / WhatsApp: ${formData.phone}
City / Location: ${formData.city || 'Not specified'}
LinkedIn / Portfolio: ${formData.linkedin || 'None'}
Resume / CV Link: ${formData.resumeLink || 'None'}

Candidate Note / Cover Statement:
${formData.coverNote || 'No additional note provided.'}
-------------------------------------
    `.trim()

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.city || 'Applicant',
          service: `Career Application: ${currentRole ? currentRole.title : 'General'}`,
          message: fullMessage,
        }),
      })

      if (res.ok) {
        setSubmitted(true)
      } else {
        const data = await res.json().catch(() => ({}))
        setErrorMessage(data.error || 'Failed to submit application. Please try again.')
      }
    } catch (err) {
      setErrorMessage('Network error occurred. Please contact us via email or WhatsApp.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Navbar />
      <main style={{ minHeight: '100vh', background: 'var(--bg)', paddingTop: 110, paddingBottom: 80 }}>
        
        {/* HERO SECTION */}
        <section className="container" style={{ textAlign: 'center', marginBottom: 56, position: 'relative' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 16px',
            borderRadius: 100,
            background: 'rgba(99,102,241,0.1)',
            border: '1px solid rgba(99,102,241,0.25)',
            color: '#818cf8',
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: 20,
          }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#818cf8', display: 'inline-block' }} />
            Authentic Careers & Internships • Est. 2026
          </div>

          <h1 style={{
            fontSize: 'clamp(32px, 5.5vw, 54px)',
            fontWeight: 800,
            color: 'var(--text-primary)',
            fontFamily: 'Space Grotesk',
            lineHeight: 1.15,
            marginBottom: 20,
            letterSpacing: '-0.02em',
          }}>
            Engineering Software That <span className="gradient-text">Stays in Orbit</span>
          </h1>

          <p style={{
            fontSize: 16,
            color: 'var(--text-secondary)',
            maxWidth: 720,
            margin: '0 auto 28px',
            lineHeight: 1.7,
          }}>
            Launch your career with an SECP-registered technology firm headquartered in <strong style={{ color: 'var(--text-primary)' }}>Nawabshah</strong> with a branch in <strong style={{ color: 'var(--text-primary)' }}>Karachi</strong>. Gain authentic hands-on engineering mastery or earn transparent, high-value commissions through commercial freelance partnerships.
          </p>

          {/* AUTHENTICITY / TRANSPARENCY NOTICE */}
          <div style={{
            maxWidth: 820,
            margin: '0 auto',
            padding: '20px 24px',
            background: 'rgba(13,22,39,0.7)',
            border: '1px solid rgba(56,189,248,0.25)',
            borderRadius: 20,
            backdropFilter: 'blur(16px)',
            textAlign: 'left',
            display: 'flex',
            gap: 16,
            alignItems: 'flex-start',
            boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
          }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: 'rgba(56,189,248,0.12)',
              border: '1px solid rgba(56,189,248,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              flexShrink: 0,
            }}>
              🛡️
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#38bdf8', marginBottom: 4, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Zero Fake Jobs Guarantee — 100% Genuine Openings
              </p>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                At ORBIT-I Private Limited, we strictly reject ghost job postings and deceptive corporate listings. Every opening here is actively reviewed by our engineering leadership. Our <strong>2-Month Remote Internships</strong> are structured unpaid learning apprenticeships with official SECP-registered digital certificates authenticable on <Link href="/verify" style={{ color: '#818cf8', textDecoration: 'underline' }}>/verify</Link>. Our <strong>Freelance Project Roles</strong> feature guaranteed commissions paid immediately when deals are closed and client projects are delivered.
              </p>
            </div>
          </div>
        </section>

        {/* FILTER CONTROLS */}
        <section className="container" style={{ marginBottom: 36 }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 10,
            flexWrap: 'wrap',
          }}>
            {[
              { id: 'all', label: `All Openings (${careerPositions.length})` },
              { id: 'internship', label: `Remote Internships — 2 Mo Unpaid (6)` },
              { id: 'freelance', label: `Freelance / Project-Based Paid (2)` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                style={{
                  padding: '10px 22px',
                  borderRadius: 100,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: filter === tab.id ? '1px solid var(--accent)' : '1px solid var(--border)',
                  background: filter === tab.id ? 'var(--accent)' : 'var(--bg-card)',
                  color: filter === tab.id ? '#ffffff' : 'var(--text-secondary)',
                  transition: 'all 0.2s',
                  boxShadow: filter === tab.id ? '0 4px 18px var(--accent-glow)' : 'none',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </section>

        {/* JOB CARDS GRID */}
        <section className="container" style={{ marginBottom: 64 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 24 }}>
            {filteredRoles.map((role) => {
              const isExpanded = expandedCard === role.id
              const isFreelance = role.category === 'freelance'

              return (
                <div
                  key={role.id}
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: 24,
                    padding: '28px 26px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'all 0.25s ease',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = isFreelance ? 'rgba(34,197,94,0.4)' : 'rgba(99,102,241,0.4)'
                    e.currentTarget.style.transform = 'translateY(-4px)'
                    e.currentTarget.style.boxShadow = isFreelance
                      ? '0 12px 36px rgba(34,197,94,0.1)'
                      : '0 12px 36px rgba(99,102,241,0.12)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)'
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  {/* Top Badges */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
                      <span style={{
                        fontSize: 11,
                        fontWeight: 600,
                        padding: '4px 10px',
                        borderRadius: 100,
                        background: 'var(--bg-elevated)',
                        color: 'var(--text-muted)',
                        border: '1px solid var(--border)',
                      }}>
                        {role.department}
                      </span>

                      <span style={{
                        fontSize: 11,
                        fontWeight: 700,
                        padding: '4px 12px',
                        borderRadius: 100,
                        background: isFreelance ? 'rgba(34,197,94,0.12)' : 'rgba(99,102,241,0.12)',
                        border: isFreelance ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(99,102,241,0.3)',
                        color: isFreelance ? '#4ade80' : '#818cf8',
                      }}>
                        {role.compensationBadge}
                      </span>
                    </div>

                    <h2 style={{
                      fontSize: 20,
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      fontFamily: 'Space Grotesk',
                      marginBottom: 10,
                      lineHeight: 1.3,
                    }}>
                      {role.title}
                    </h2>

                    {/* Metadata pill row */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                      <span style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        🌐 {role.mode}
                      </span>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>•</span>
                      <span style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        ⏳ {role.duration}
                      </span>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>•</span>
                      <span style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        👥 {role.openings}
                      </span>
                    </div>

                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 18 }}>
                      {role.summary}
                    </p>

                    {/* Key Perks preview */}
                    <div style={{
                      padding: '12px 14px',
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border)',
                      borderRadius: 14,
                      marginBottom: 18,
                    }}>
                      <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                        {isFreelance ? '💰 Earning & Payout Model:' : '🎓 Credentials & Deliverables:'}
                      </p>
                      <p style={{ fontSize: 12, color: isFreelance ? '#4ade80' : '#38bdf8', margin: 0, fontWeight: 500, lineHeight: 1.5 }}>
                        {role.compensation}
                      </p>
                    </div>

                    {/* Expandable details */}
                    {isExpanded && (
                      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, marginTop: 16 }}>
                        <div style={{ marginBottom: 16 }}>
                          <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
                            What You Will Do:
                          </p>
                          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                            {role.responsibilities.map((resp, i) => (
                              <li key={i} style={{ marginBottom: 4 }}>{resp}</li>
                            ))}
                          </ul>
                        </div>

                        <div style={{ marginBottom: 16 }}>
                          <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
                            Requirements & Qualifications:
                          </p>
                          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                            {role.requirements.map((req, i) => (
                              <li key={i} style={{ marginBottom: 4 }}>{req}</li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
                            Benefits & Growth:
                          </p>
                          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                            {role.perks.map((p, i) => (
                              <li key={i} style={{ marginBottom: 4 }}>{p}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions Bottom Bar */}
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, marginTop: 20, display: 'flex', gap: 10, alignItems: 'center' }}>
                    <button
                      onClick={() => handleOpenModal(role)}
                      className="btn-primary"
                      style={{
                        flex: 1,
                        padding: '11px 18px',
                        fontSize: 13,
                        fontWeight: 600,
                        justifyContent: 'center',
                        background: isFreelance ? 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)' : undefined,
                      }}
                    >
                      Apply Now →
                    </button>

                    <button
                      onClick={() => setExpandedCard(isExpanded ? null : role.id)}
                      style={{
                        padding: '10px 14px',
                        borderRadius: 100,
                        background: 'transparent',
                        border: '1px solid var(--border)',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        fontSize: 12,
                        fontWeight: 500,
                        transition: 'all 0.15s',
                      }}
                    >
                      {isExpanded ? 'Show Less' : 'Details'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* WHY ORBIT-I SECTION */}
        <section className="container" style={{ marginBottom: 40 }}>
          <div style={{
            background: 'rgba(13,22,39,0.7)',
            border: '1px solid var(--border)',
            borderRadius: 28,
            padding: '48px 36px',
            backdropFilter: 'blur(20px)',
          }}>
            <div style={{ textAlign: 'center', marginBottom: 36 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Why Join Our Orbit?
              </span>
              <h2 style={{
                fontSize: 'clamp(24px, 4vw, 36px)',
                fontWeight: 800,
                color: 'var(--text-primary)',
                fontFamily: 'Space Grotesk',
                marginTop: 8,
              }}>
                A Rigorous, Authentic Launchpad
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
              {[
                {
                  icon: '📜',
                  title: 'SECP Registered Credentials',
                  desc: 'Internships and contracts are officially backed by ORBIT-I Private Limited (Est. 2026), recognized by national regulatory authorities.',
                },
                {
                  icon: '🔍',
                  title: 'Instant Online Verification',
                  desc: 'Every certificate issued includes a tamper-proof certificate ID authenticable on orbit-i.tech/verify for academic and corporate credit.',
                },
                {
                  icon: '💻',
                  title: 'Production Systems (No Dummies)',
                  desc: 'Work on live Next.js 16 platforms, Node.js microservices, and AI models serving real enterprise clients.',
                },
                {
                  icon: '🤝',
                  title: 'Direct Paid Pathways',
                  desc: 'High-performing 2-month interns are invited directly to paid client milestone contracts and revenue-share freelance roles.',
                },
              ].map((feat, i) => (
                <div key={i} style={{
                  padding: '22px 20px',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  borderRadius: 18,
                }}>
                  <div style={{ fontSize: 28, marginBottom: 12 }}>{feat.icon}</div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8, fontFamily: 'Space Grotesk' }}>
                    {feat.title}
                  </h3>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                    {feat.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      {/* ======================================================== */}
      {/* APPLICATION MODAL POPUP */}
      {/* ======================================================== */}
      {selectedRole && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 100,
          background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20,
          overflowY: 'auto',
        }}>
          <div style={{
            maxWidth: 600,
            width: '100%',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-hover)',
            borderRadius: 24,
            padding: '36px 32px',
            position: 'relative',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
          }}>
            {/* Close button */}
            <button
              onClick={handleCloseModal}
              style={{
                position: 'absolute',
                top: 20,
                right: 20,
                width: 34,
                height: 34,
                borderRadius: '50%',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
              }}
            >
              ✕
            </button>

            {!submitted ? (
              <>
                <div style={{ marginBottom: 24 }}>
                  <span style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: selectedRole.category === 'freelance' ? '#4ade80' : '#818cf8',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}>
                    {selectedRole.category === 'freelance' ? 'Freelance / Project-Based Role' : 'Remote 2-Month Internship'}
                  </span>
                  <h2 style={{
                    fontSize: 22,
                    fontWeight: 800,
                    color: 'var(--text-primary)',
                    fontFamily: 'Space Grotesk',
                    marginTop: 4,
                    marginBottom: 8,
                  }}>
                    Apply for {selectedRole.title}
                  </h2>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>
                    Please fill out this form accurately. Our engineering hiring panel reviews all submissions within 48 business hours.
                  </p>
                </div>

                {errorMessage && (
                  <div style={{
                    padding: '12px 16px',
                    borderRadius: 12,
                    background: 'rgba(239,68,68,0.1)',
                    border: '1px solid rgba(239,68,68,0.3)',
                    color: '#f87171',
                    fontSize: 13,
                    marginBottom: 20,
                  }}>
                    ⚠️ {errorMessage}
                  </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. Ali Khan"
                      value={formData.name}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        borderRadius: 12,
                        background: 'var(--bg-elevated)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-primary)',
                        fontSize: 14,
                        fontFamily: 'Inter',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="you@domain.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '11px 14px',
                          borderRadius: 12,
                          background: 'var(--bg-elevated)',
                          border: '1px solid var(--border)',
                          color: 'var(--text-primary)',
                          fontSize: 14,
                          fontFamily: 'Inter',
                          outline: 'none',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                        WhatsApp / Phone *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        placeholder="+92 300 0000000"
                        value={formData.phone}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '11px 14px',
                          borderRadius: 12,
                          background: 'var(--bg-elevated)',
                          border: '1px solid var(--border)',
                          color: 'var(--text-primary)',
                          fontSize: 14,
                          fontFamily: 'Inter',
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                        City & Country *
                      </label>
                      <input
                        type="text"
                        name="city"
                        placeholder="Nawabshah, Karachi, Lahore..."
                        value={formData.city}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '11px 14px',
                          borderRadius: 12,
                          background: 'var(--bg-elevated)',
                          border: '1px solid var(--border)',
                          color: 'var(--text-primary)',
                          fontSize: 14,
                          fontFamily: 'Inter',
                          outline: 'none',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                        Role Position
                      </label>
                      <select
                        name="roleId"
                        value={formData.roleId}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '11px 14px',
                          borderRadius: 12,
                          background: 'var(--bg-elevated)',
                          border: '1px solid var(--border)',
                          color: 'var(--text-primary)',
                          fontSize: 13,
                          fontFamily: 'Inter',
                          outline: 'none',
                        }}
                      >
                        {careerPositions.map((r) => (
                          <option key={r.id} value={r.id} style={{ background: '#0d1627', color: '#fff' }}>
                            {r.title} ({r.category === 'freelance' ? 'Paid' : 'Unpaid 2 Mo'})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                      Portfolio / GitHub / LinkedIn URL
                    </label>
                    <input
                      type="url"
                      name="linkedin"
                      placeholder="https://github.com/yourhandle or linkedin"
                      value={formData.linkedin}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        borderRadius: 12,
                        background: 'var(--bg-elevated)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-primary)',
                        fontSize: 14,
                        fontFamily: 'Inter',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                      Resume / CV Link (Google Drive / Dropbox)
                    </label>
                    <input
                      type="url"
                      name="resumeLink"
                      placeholder="https://drive.google.com/file/d/..."
                      value={formData.resumeLink}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        borderRadius: 12,
                        background: 'var(--bg-elevated)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-primary)',
                        fontSize: 14,
                        fontFamily: 'Inter',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                      Cover Statement / Why ORBIT-I?
                    </label>
                    <textarea
                      name="coverNote"
                      rows={3}
                      placeholder="Tell us briefly about your technical background and why you want to join our flight crew..."
                      value={formData.coverNote}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        borderRadius: 12,
                        background: 'var(--bg-elevated)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-primary)',
                        fontSize: 13,
                        fontFamily: 'Inter',
                        outline: 'none',
                        resize: 'vertical',
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary"
                    style={{
                      padding: '14px',
                      fontSize: 14,
                      fontWeight: 700,
                      justifyContent: 'center',
                      marginTop: 8,
                      opacity: submitting ? 0.7 : 1,
                      cursor: submitting ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {submitting ? 'Submitting Application...' : 'Submit Application Now →'}
                  </button>
                </form>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '24px 12px' }}>
                <div style={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  background: 'rgba(34,197,94,0.15)',
                  border: '1px solid rgba(34,197,94,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 28,
                  margin: '0 auto 20px',
                }}>
                  ✅
                </div>
                <h3 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'Space Grotesk', marginBottom: 12 }}>
                  Application Dispatched
                </h3>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 24 }}>
                  Thank you, <strong>{formData.name}</strong>! Your application for <strong>{selectedRole.title}</strong> has been received by ORBIT-I engineering human resources. We will reach out to you via email or WhatsApp within 48 business hours.
                </p>
                <button
                  onClick={handleCloseModal}
                  className="btn-primary"
                  style={{ padding: '12px 28px', fontSize: 13, margin: '0 auto' }}
                >
                  Return to Careers
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}
