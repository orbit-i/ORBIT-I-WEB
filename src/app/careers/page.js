'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { careerPositions } from '@/data/careersData'
import {
  Briefcase,
  Globe,
  Clock,
  Users,
  Award,
  Shield,
  Search,
  Laptop,
  Handshake,
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertTriangle,
  X,
  ArrowRight,
  DollarSign,
  GraduationCap,
  Trash2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'

export default function CareersPage() {
  const [filter, setFilter] = useState('all') // 'all' | 'internship' | 'freelance'
  const [positions, setPositions] = useState(careerPositions)
  const [selectedRole, setSelectedRole] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    roleId: '',
    linkedin: '',
    coverNote: '',
  })
  const [cvFile, setCvFile] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [expandedCard, setExpandedCard] = useState(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    fetch('/api/careers/jobs')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const formatted = data.map((j) => ({
            ...j,
            requirements: Array.isArray(j.requirements)
              ? j.requirements
              : typeof j.requirements === 'string'
              ? j.requirements.split(/[,;\n]/).map((s) => s.trim()).filter(Boolean)
              : [],
            responsibilities: Array.isArray(j.responsibilities)
              ? j.responsibilities
              : typeof j.responsibilities === 'string'
              ? j.responsibilities.split(/[,;\n]/).map((s) => s.trim()).filter(Boolean)
              : [],
            perks: Array.isArray(j.perks)
              ? j.perks
              : typeof j.perks === 'string'
              ? j.perks.split(/[,;\n]/).map((s) => s.trim()).filter(Boolean)
              : [],
          }))
          setPositions(formatted)
        }
      })
      .catch(() => {})
  }, [])

  const filteredRoles = positions.filter((role) => {
    if (filter === 'all') return true
    return role.category === filter
  })

  const handleOpenModal = (role) => {
    setSelectedRole(role)
    setFormData((prev) => ({ ...prev, roleId: role.id }))
    setCvFile(null)
    setSubmitted(false)
    setErrorMessage('')
  }

  const handleCloseModal = () => {
    setSelectedRole(null)
    setCvFile(null)
    setSubmitted(false)
    setErrorMessage('')
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileSelect = (file) => {
    if (!file) return
    const allowed = ['.pdf', '.doc', '.docx']
    const ext = '.' + file.name.split('.').pop().toLowerCase()
    if (!allowed.includes(ext)) {
      setErrorMessage('Please select a valid CV file (.pdf, .doc, or .docx).')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('CV file size exceeds 10MB limit.')
      return
    }
    setErrorMessage('')
    setCvFile(file)
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

    if (!cvFile) {
      setErrorMessage('Please upload your CV / Resume document (.pdf, .doc, or .docx).')
      setSubmitting(false)
      return
    }

    const currentRole = positions.find((r) => r.id === formData.roleId) || selectedRole

    try {
      const payload = new FormData()
      payload.append('name', formData.name.trim())
      payload.append('email', formData.email.trim())
      payload.append('phone', formData.phone.trim())
      payload.append('city', formData.city.trim() || 'Not specified')
      payload.append('roleId', formData.roleId || currentRole?.id || 'general')
      payload.append('roleTitle', currentRole ? currentRole.title : 'General Position')
      payload.append('category', currentRole ? currentRole.category : 'internship')
      payload.append('linkedin', formData.linkedin.trim())
      payload.append('coverNote', formData.coverNote.trim())
      payload.append('cv', cvFile)

      const res = await fetch('/api/careers/apply', {
        method: 'POST',
        body: payload,
      })

      const data = await res.json().catch(() => ({}))

      if (res.ok && data.success) {
        setSubmitted(true)
      } else {
        setErrorMessage(data.error || 'Failed to submit application. Please try again.')
      }
    } catch {
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
            <Briefcase size={14} color="#818cf8" />
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
              width: 40,
              height: 40,
              borderRadius: 10,
              background: 'rgba(56,189,248,0.12)',
              border: '1px solid rgba(56,189,248,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Shield size={20} color="#38bdf8" />
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#38bdf8', marginBottom: 4, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Zero Fake Jobs Guarantee — 100% Genuine Openings
              </p>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                At ORBIT-I Private Limited, we strictly reject ghost job listings and deceptive corporate posts. Every opening here is actively reviewed by our engineering leadership. Our <strong>2-Month Remote Internships</strong> are structured learning apprenticeships with official SECP-registered digital certificates authenticable on <Link href="/verify" style={{ color: '#818cf8', textDecoration: 'underline' }}>/verify</Link>. Our <strong>Freelance Project Roles</strong> feature guaranteed commissions paid immediately when deals are closed and client projects are delivered.
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
              { id: 'all', label: `All Openings (${positions.length})` },
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
                        {role.compensationBadge || (isFreelance ? 'Project Commission' : '2 Mo Unpaid')}
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
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
                      <span style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                        <Globe size={13} color="#818cf8" /> {role.mode}
                      </span>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>•</span>
                      <span style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                        <Clock size={13} color="#818cf8" /> {role.duration}
                      </span>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>•</span>
                      <span style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                        <Users size={13} color="#818cf8" /> {role.openings}
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
                        {isFreelance ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                            <DollarSign size={13} color="#4ade80" /> Earning & Payout Model:
                          </span>
                        ) : (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                            <GraduationCap size={13} color="#38bdf8" /> Credentials & Deliverables:
                          </span>
                        )}
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
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        background: isFreelance ? 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)' : undefined,
                      }}
                    >
                      Apply Now <ArrowRight size={14} />
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
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      {isExpanded ? (
                        <>Show Less <ChevronUp size={13} /></>
                      ) : (
                        <>Details <ChevronDown size={13} /></>
                      )}
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
                  icon: <Award size={26} color="#818cf8" />,
                  title: 'SECP Registered Credentials',
                  desc: 'Internships and contracts are officially backed by ORBIT-I Private Limited (Est. 2026), recognized by national regulatory authorities.',
                },
                {
                  icon: <Search size={26} color="#38bdf8" />,
                  title: 'Instant Online Verification',
                  desc: 'Every certificate issued includes a tamper-proof certificate ID authenticable on orbit-i.tech/verify for academic and corporate credit.',
                },
                {
                  icon: <Laptop size={26} color="#818cf8" />,
                  title: 'Production Systems (No Dummies)',
                  desc: 'Work on live Next.js 16 platforms, Node.js microservices, and AI models serving real enterprise clients.',
                },
                {
                  icon: <Handshake size={26} color="#38bdf8" />,
                  title: 'Direct Paid Pathways',
                  desc: 'High-performing 2-month interns are invited directly to paid client milestone contracts and revenue-share freelance roles.',
                },
              ].map((feat, i) => (
                <div key={i} style={{
                  padding: '24px 22px',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  borderRadius: 18,
                }}>
                  <div style={{
                    width: 46,
                    height: 46,
                    borderRadius: 12,
                    background: 'rgba(99,102,241,0.08)',
                    border: '1px solid rgba(99,102,241,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 16,
                  }}>
                    {feat.icon}
                  </div>
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
      {/* APPLICATION MODAL POPUP WITH DIRECT CV FILE UPLOAD */}
      {/* ======================================================== */}
      {selectedRole && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 100,
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20,
          overflowY: 'auto',
        }}>
          <div style={{
            maxWidth: 620,
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
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s',
              }}
              title="Close modal"
            >
              <X size={18} />
            </button>

            {!submitted ? (
              <>
                <div style={{ marginBottom: 24, paddingRight: 32 }}>
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
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                    Upload your official CV. Direct attachments are delivered securely to our engineering team and archived in our admin portal.
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
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}>
                    <AlertTriangle size={16} style={{ flexShrink: 0 }} />
                    <span>{errorMessage}</span>
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
                        {positions.map((r) => (
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
                      placeholder="https://github.com/yourhandle or https://linkedin.com/in/..."
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

                  {/* DIRECT CV FILE UPLOAD (NO GOOGLE DRIVE URLS) */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>
                        Upload CV / Resume Document *
                      </label>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                        PDF, DOC, DOCX (Max 10MB)
                      </span>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      style={{ display: 'none' }}
                      onChange={(e) => handleFileSelect(e.target.files?.[0])}
                    />

                    {!cvFile ? (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={(e) => {
                          e.preventDefault()
                          setIsDragging(true)
                        }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={(e) => {
                          e.preventDefault()
                          setIsDragging(false)
                          handleFileSelect(e.dataTransfer.files?.[0])
                        }}
                        style={{
                          border: isDragging ? '2px dashed var(--accent)' : '1px dashed var(--border)',
                          borderRadius: 14,
                          padding: '24px 16px',
                          textAlign: 'center',
                          cursor: 'pointer',
                          background: isDragging ? 'rgba(99,102,241,0.08)' : 'var(--bg-elevated)',
                          transition: 'all 0.2s',
                        }}
                      >
                        <div style={{
                          width: 44,
                          height: 44,
                          borderRadius: '50%',
                          background: 'rgba(99,102,241,0.12)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 10px',
                        }}>
                          <UploadCloud size={22} color="#818cf8" />
                        </div>
                        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 4px' }}>
                          Click to browse or drag and drop your CV file here
                        </p>
                        <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>
                          Accepted formats: PDF, DOC, DOCX • Automatically attached in mail & admin portal
                        </p>
                      </div>
                    ) : (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 16px',
                        borderRadius: 14,
                        background: 'rgba(99,102,241,0.08)',
                        border: '1px solid rgba(99,102,241,0.3)',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, overflow: 'hidden' }}>
                          <div style={{
                            width: 38,
                            height: 38,
                            borderRadius: 10,
                            background: 'rgba(99,102,241,0.15)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}>
                            <FileText size={20} color="#818cf8" />
                          </div>
                          <div style={{ overflow: 'hidden' }}>
                            <p style={{
                              fontSize: 13,
                              fontWeight: 600,
                              color: 'var(--text-primary)',
                              margin: 0,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}>
                              {cvFile.name}
                            </p>
                            <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '2px 0 0' }}>
                              {(cvFile.size / 1024 / 1024).toFixed(2)} MB • Ready for upload
                            </p>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            style={{
                              padding: '6px 12px',
                              borderRadius: 8,
                              background: 'var(--bg-elevated)',
                              border: '1px solid var(--border)',
                              color: 'var(--text-secondary)',
                              fontSize: 12,
                              fontWeight: 500,
                              cursor: 'pointer',
                            }}
                          >
                            Replace
                          </button>
                          <button
                            type="button"
                            onClick={() => setCvFile(null)}
                            style={{
                              padding: '6px 8px',
                              borderRadius: 8,
                              background: 'rgba(239,68,68,0.1)',
                              border: '1px solid rgba(239,68,68,0.3)',
                              color: '#f87171',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                            }}
                            title="Remove file"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                      Cover Statement / Why ORBIT-I?
                    </label>
                    <textarea
                      name="coverNote"
                      rows={3}
                      placeholder="Tell us briefly about your technical background and why you want to join our team..."
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
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      marginTop: 8,
                      opacity: submitting ? 0.7 : 1,
                      cursor: submitting ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {submitting ? (
                      'Uploading & Submitting Application...'
                    ) : (
                      <>Submit Application Now <ArrowRight size={15} /></>
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '24px 12px' }}>
                <div style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: 'rgba(34,197,94,0.15)',
                  border: '1px solid rgba(34,197,94,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                }}>
                  <CheckCircle2 size={36} color="#22c55e" />
                </div>
                <h3 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'Space Grotesk', marginBottom: 12 }}>
                  Application Dispatched
                </h3>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 24 }}>
                  Thank you, <strong>{formData.name}</strong>! Your application and attached CV for <strong>{selectedRole.title}</strong> have been received by ORBIT-I engineering human resources. A copy has been delivered to our administrative team and we will reach out within 48 business hours.
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
