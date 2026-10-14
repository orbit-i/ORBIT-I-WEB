'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { getToken, getUser, logout, isLoggedIn } from '@/lib/orbitApi'

const BASE = process.env.NEXT_PUBLIC_ORBIT_API || ''

async function adminReq(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}`, ...options.headers },
    ...options,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || 'Request failed')
  return data
}

const TABS = ['clients', 'certificates', 'projects', 'milestones', 'progress']

// ── Defined OUTSIDE AdminPage so React never remounts it on re-render ──
const inputStyle = {
  width: '100%', padding: '11px 14px',
  background: 'var(--bg-elevated)', border: '1px solid var(--border)',
  borderRadius: 10, color: 'var(--text-primary)',
  fontSize: 13, fontFamily: 'Inter', outline: 'none',
  transition: 'all 0.2s',
}

const labelStyle = {
  display: 'block', fontSize: 11, fontWeight: 600,
  color: 'var(--text-secondary)', marginBottom: 5,
  textTransform: 'uppercase', letterSpacing: '0.05em',
}

function SectionCard({ title, subtitle, children, onSubmit }) {
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '24px', marginBottom: 16 }}>
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontFamily: 'Space Grotesk', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{title}</h3>
        {subtitle && <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{subtitle}</p>}
      </div>
      {onSubmit ? <form onSubmit={onSubmit}>{children}</form> : children}
    </div>
  )
}

const STATUS_COLORS = {
  PLANNING:    { bg: 'rgba(251,191,36,0.1)',  text: '#fbbf24' },
  IN_PROGRESS: { bg: 'rgba(99,102,241,0.1)',  text: '#6366f1' },
  ON_HOLD:     { bg: 'rgba(156,163,175,0.1)', text: '#9ca3af' },
  COMPLETED:   { bg: 'rgba(34,197,94,0.1)',   text: '#22c55e' },
  CANCELLED:   { bg: 'rgba(239,68,68,0.1)',   text: '#ef4444' },
}

export default function AdminPage() {
  const [tab, setTab] = useState('clients')
  const [clients, setClients] = useState([])
  const [projects, setProjects] = useState([])
  const [projectsLoading, setProjectsLoading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState({ text: '', type: 'success' })
  const [currentUser, setCurrentUser] = useState(null)
  const router = useRouter()

  // Forms
  const [certForm, setCertForm] = useState({ name: '', role: '', department: '', duration: '', startDate: '', endDate: '', certificateCode: '' })
  const [projectForm, setProjectForm] = useState({ title: '', description: '', deadline: '', clientId: '' })
  const [milestoneForm, setMilestoneForm] = useState({ title: '', description: '', dueDate: '', sequenceNumber: '', projectId: '' })
  const [progressForm, setProgressForm] = useState({ projectId: '', progress: '', status: 'IN_PROGRESS' })

  useEffect(() => {
    if (!isLoggedIn()) { router.push('/portal'); return }
    const u = getUser()
    if (u?.role !== 'ADMIN') { router.push('/portal/dashboard'); return }
    setCurrentUser(u)
    fetchData()
  }, [])

  // Load projects when switching to the projects tab
  useEffect(() => {
    if (tab === 'projects' || tab === 'milestones' || tab === 'progress') {
      fetchProjects()
    }
  }, [tab])

  const fetchData = async () => {
    try {
      const [c] = await Promise.all([adminReq('/api/admin/clients')])
      setClients(c)
    } catch { } finally { setLoading(false) }
  }

  const fetchProjects = async () => {
    setProjectsLoading(true)
    try {
      const data = await adminReq('/api/admin/projects')
      setProjects(Array.isArray(data) ? data : data.content ?? [])
    } catch {
      // silently fail — backend may not have this endpoint yet
    } finally {
      setProjectsLoading(false)
    }
  }

  const showMsg = (text, type = 'success') => {
    setMessage({ text, type })
    setTimeout(() => setMessage({ text: '', type: 'success' }), 4000)
  }

  const approveClient = async (id) => {
    try {
      await adminReq(`/api/admin/clients/${id}/approve`, { method: 'PUT' })
      showMsg('Client approved successfully')
      fetchData()
    } catch (e) { showMsg(e.message, 'error') }
  }

  const issueCertificate = async (e) => {
    e.preventDefault()
    try {
      await adminReq('/api/certificates/admin/create', { method: 'POST', body: JSON.stringify(certForm) })
      showMsg('Certificate issued: ' + certForm.certificateCode.toUpperCase())
      setCertForm({ name: '', role: '', department: '', duration: '', startDate: '', endDate: '', certificateCode: '' })
    } catch (e) { showMsg(e.message, 'error') }
  }

  const createProject = async (e) => {
    e.preventDefault()
    try {
      await adminReq('/api/projects/admin/create', { method: 'POST', body: JSON.stringify({ ...projectForm, clientId: Number(projectForm.clientId) }) })
      showMsg('Project created successfully')
      setProjectForm({ title: '', description: '', deadline: '', clientId: '' })
      fetchProjects() // refresh list after creating
    } catch (e) { showMsg(e.message, 'error') }
  }

  const addMilestone = async (e) => {
    e.preventDefault()
    try {
      await adminReq('/api/projects/admin/milestone', {
        method: 'POST',
        body: JSON.stringify({
          ...milestoneForm,
          projectId: Number(milestoneForm.projectId),
          sequenceNumber: Number(milestoneForm.sequenceNumber),
        }),
      })
      showMsg('Milestone added successfully')
      setMilestoneForm({ title: '', description: '', dueDate: '', sequenceNumber: '', projectId: '' })
    } catch (e) { showMsg(e.message, 'error') }
  }

  const updateProgress = async (e) => {
    e.preventDefault()
    try {
      await adminReq(`/api/projects/admin/${progressForm.projectId}/progress`, {
        method: 'PATCH',
        body: JSON.stringify({ progress: Number(progressForm.progress), status: progressForm.status }),
      })
      showMsg(`Project ${progressForm.projectId} updated to ${progressForm.progress}%`)
      setProgressForm({ projectId: '', progress: '', status: 'IN_PROGRESS' })
      fetchProjects()
    } catch (e) { showMsg(e.message, 'error') }
  }

  // Quick-fill project ID into milestone / progress forms by clicking a project row
  const fillProjectId = (id) => {
    if (tab === 'milestones') setMilestoneForm(f => ({ ...f, projectId: String(id) }))
    if (tab === 'progress')   setProgressForm(f => ({ ...f, projectId: String(id) }))
  }

  return (
    <>
      <style>{`
        .admin-page { min-height: 100vh; background: var(--bg); display: flex; flex-direction: column; }
        .admin-header { padding: 14px 28px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; background: var(--bg-card); position: sticky; top: 0; z-index: 10; }
        .admin-body { display: flex; flex: 1; min-height: 0; }
        .admin-sidebar { width: 200px; border-right: 1px solid var(--border); padding: 20px 12px; background: var(--bg-card); display: flex; flex-direction: column; gap: 4px; position: sticky; top: 57px; height: calc(100vh - 57px); overflow-y: auto; flex-shrink: 0; }
        .admin-main { flex: 1; padding: 28px; overflow-y: auto; }
        .sidebar-btn { width: 100%; padding: 10px 12px; border: none; border-radius: 10px; cursor: pointer; font-family: Space Grotesk; font-size: 13px; font-weight: 600; text-align: left; transition: all 0.15s; text-transform: capitalize; }
        .project-row { background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px; padding: 14px 18px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10; transition: border-color 0.15s; }
        .project-row:hover { border-color: var(--border-hover); }
        @media (max-width: 768px) { .admin-sidebar { display: none; } .admin-main { padding: 16px; } }
      `}</style>

      <div className="admin-page">
        {/* Header */}
        <header className="admin-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Image src="/orbitlogo-removebg-preview.png" alt="ORBIT-I" width={32} height={32} style={{ objectFit: 'contain' }} />
            <div>
              <div style={{ fontFamily: 'Space Grotesk', fontSize: 14, fontWeight: 800, color: 'var(--text-primary)' }}>ORBIT-I</div>
              <div style={{ fontSize: 9, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>Admin Panel</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{currentUser?.name}</span>
            <Link href="/" style={{ fontSize: 12, color: 'var(--text-muted)', textDecoration: 'none' }}>← Website</Link>
            <button onClick={() => { logout(); router.push('/portal') }} className="btn-outline" style={{ fontSize: 12, padding: '7px 14px' }}>Sign Out</button>
          </div>
        </header>

        <div className="admin-body">
          {/* Sidebar */}
          <aside className="admin-sidebar">
            <p style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '4px 4px 8px' }}>Menu</p>
            {TABS.map((t) => (
              <button key={t} onClick={() => setTab(t)} className="sidebar-btn"
                style={{
                  background: tab === t ? 'var(--accent-glow)' : 'transparent',
                  color: tab === t ? 'var(--accent)' : 'var(--text-muted)',
                  border: tab === t ? '1px solid var(--border-hover)' : '1px solid transparent',
                }}>
                {t === 'clients'      ? '👥 Clients' :
                 t === 'certificates' ? '🎓 Certificates' :
                 t === 'projects'     ? '📁 Projects' :
                 t === 'milestones'   ? '🎯 Milestones' :
                                        '📊 Progress'}
              </button>
            ))}
          </aside>

          {/* Main */}
          <main className="admin-main">
            {/* Toast */}
            <AnimatePresence>
              {message.text && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  style={{
                    padding: '12px 16px', borderRadius: 12, marginBottom: 20,
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    background: message.type === 'error' ? 'rgba(239,68,68,0.08)' : 'rgba(34,197,94,0.08)',
                    border: `1px solid ${message.type === 'error' ? 'rgba(239,68,68,0.2)' : 'rgba(34,197,94,0.2)'}`,
                  }}>
                  <p style={{ fontSize: 13, color: message.type === 'error' ? '#ef4444' : '#22c55e' }}>{message.text}</p>
                  <button onClick={() => setMessage({ text: '', type: 'success' })} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 16 }}>✕</button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── CLIENTS ── */}
            {tab === 'clients' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20 }}>Client Accounts</h2>
                {loading ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Loading...</p>
                ) : clients.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>No clients registered yet.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {clients.map((c) => (
                      <div key={c.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                            <p style={{ fontFamily: 'Space Grotesk', fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{c.name}</p>
                            <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 100, fontWeight: 600, background: c.approved ? 'rgba(34,197,94,0.1)' : 'rgba(251,191,36,0.1)', color: c.approved ? '#22c55e' : '#fbbf24' }}>
                              {c.approved ? '✓ Approved' : '⏳ Pending'}
                            </span>
                          </div>
                          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                            {c.email} {c.company ? `· ${c.company}` : ''} {c.phone ? `· ${c.phone}` : ''}
                          </p>
                          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>ID: {c.id} · Role: {c.role}</p>
                        </div>
                        {!c.approved && (
                          <button onClick={() => approveClient(c.id)} className="btn-primary" style={{ fontSize: 12, padding: '8px 16px' }}>
                            Approve Client
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* ── CERTIFICATES ── */}
            {tab === 'certificates' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20 }}>Issue Intern Certificate</h2>
                <SectionCard title="New Certificate" subtitle="Fill all fields. Certificate code must be unique." onSubmit={issueCertificate}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
                    {[
                      { key: 'name',            label: 'Intern Full Name', placeholder: 'Muhammad Ahmed' },
                      { key: 'role',            label: 'Role',             placeholder: 'Backend Developer Intern' },
                      { key: 'department',      label: 'Department',       placeholder: 'Software Engineering' },
                      { key: 'duration',        label: 'Duration',         placeholder: '3 Months' },
                      { key: 'startDate',       label: 'Start Date',       placeholder: 'January 2026' },
                      { key: 'endDate',         label: 'End Date',         placeholder: 'April 2026' },
                      { key: 'certificateCode', label: 'Certificate Code', placeholder: 'ORBIT-2026-001' },
                    ].map((f) => (
                      <div key={f.key}>
                        <label style={labelStyle}>{f.label} *</label>
                        <input
                          type="text"
                          placeholder={f.placeholder}
                          value={certForm[f.key]}
                          required
                          onChange={(e) => setCertForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                          style={inputStyle}
                          onFocus={(e) => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px var(--accent-glow)' }}
                          onBlur={(e)  => { e.target.style.borderColor = 'var(--border)';  e.target.style.boxShadow = 'none' }}
                        />
                      </div>
                    ))}
                  </div>
                  <button type="submit" className="btn-primary" style={{ marginTop: 16, fontSize: 13 }}>
                    🎓 Issue Certificate
                  </button>
                </SectionCard>
              </motion.div>
            )}

            {/* ── PROJECTS ── */}
            {tab === 'projects' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20 }}>Projects</h2>

                {/* ── All Projects List ── */}
                <SectionCard title="All Projects" subtitle="Every project in the system — use these IDs when adding milestones or updating progress.">
                  {projectsLoading ? (
                    <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Loading projects...</p>
                  ) : projects.length === 0 ? (
                    <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>No projects yet. Create one below.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {projects.map((p) => {
                        const sc = STATUS_COLORS[p.status] ?? STATUS_COLORS.PLANNING
                        const clientName = clients.find(c => c.id === p.clientId)?.name ?? `Client #${p.clientId}`
                        return (
                          <div key={p.id} className="project-row">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1, minWidth: 0 }}>
                              {/* ID badge */}
                              <div style={{ minWidth: 48, height: 40, background: 'var(--accent-glow)', border: '1px solid var(--border-hover)', borderRadius: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ fontSize: 8, color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>ID</span>
                                <span style={{ fontFamily: 'Space Grotesk', fontSize: 16, fontWeight: 800, color: 'var(--accent)', lineHeight: 1 }}>{p.id}</span>
                              </div>
                              <div style={{ minWidth: 0 }}>
                                <div style={{ fontFamily: 'Space Grotesk', fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.title}</div>
                                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                                  {clientName}
                                  {p.deadline ? ` · Due ${new Date(p.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}` : ''}
                                </div>
                              </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                              {/* Progress bar */}
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                                <span style={{ fontFamily: 'Space Grotesk', fontSize: 12, fontWeight: 700, color: 'var(--accent)' }}>{p.progress ?? 0}%</span>
                                <div style={{ width: 80, height: 4, background: 'var(--bg-elevated)', borderRadius: 100, overflow: 'hidden' }}>
                                  <div style={{ height: '100%', width: `${Math.min(p.progress ?? 0, 100)}%`, background: 'linear-gradient(90deg, var(--accent), #818cf8)', borderRadius: 100 }} />
                                </div>
                              </div>
                              {/* Status badge */}
                              <span style={{ fontSize: 10, padding: '3px 10px', borderRadius: 100, fontWeight: 600, background: sc.bg, color: sc.text, whiteSpace: 'nowrap' }}>
                                {p.status?.replace('_', ' ')}
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </SectionCard>

                {/* ── Create Project ── */}
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 14 }}>
                  Approved clients: {clients.filter(c => c.approved).map(c => `${c.name} (ID: ${c.id})`).join(' · ') || 'None yet'}
                </p>
                <SectionCard title="Create New Project" subtitle="Assign a project to an approved client." onSubmit={createProject}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
                    <div>
                      <label style={labelStyle}>Project Title *</label>
                      <input
                        type="text"
                        placeholder="e.g. E-Commerce Platform"
                        value={projectForm.title}
                        required
                        onChange={(e) => setProjectForm((prev) => ({ ...prev, title: e.target.value }))}
                        style={inputStyle}
                        onFocus={(e) => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px var(--accent-glow)' }}
                        onBlur={(e)  => { e.target.style.borderColor = 'var(--border)';  e.target.style.boxShadow = 'none' }}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Client ID *</label>
                      <input
                        type="number"
                        placeholder="e.g. 1"
                        value={projectForm.clientId}
                        required
                        onChange={(e) => setProjectForm((prev) => ({ ...prev, clientId: e.target.value }))}
                        style={inputStyle}
                        onFocus={(e) => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px var(--accent-glow)' }}
                        onBlur={(e)  => { e.target.style.borderColor = 'var(--border)';  e.target.style.boxShadow = 'none' }}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Deadline *</label>
                      <input
                        type="date"
                        value={projectForm.deadline}
                        required
                        onChange={(e) => setProjectForm((prev) => ({ ...prev, deadline: e.target.value }))}
                        style={inputStyle}
                        onFocus={(e) => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px var(--accent-glow)' }}
                        onBlur={(e)  => { e.target.style.borderColor = 'var(--border)';  e.target.style.boxShadow = 'none' }}
                      />
                    </div>
                  </div>
                  <div style={{ marginTop: 14 }}>
                    <label style={labelStyle}>Description *</label>
                    <textarea
                      placeholder="Describe the project scope and objectives..."
                      value={projectForm.description}
                      required
                      rows={3}
                      onChange={(e) => setProjectForm((prev) => ({ ...prev, description: e.target.value }))}
                      style={{ ...inputStyle, resize: 'vertical' }}
                      onFocus={(e) => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px var(--accent-glow)' }}
                      onBlur={(e)  => { e.target.style.borderColor = 'var(--border)';  e.target.style.boxShadow = 'none' }}
                    />
                  </div>
                  <button type="submit" className="btn-primary" style={{ marginTop: 16, fontSize: 13 }}>
                    📁 Create Project
                  </button>
                </SectionCard>
              </motion.div>
            )}

            {/* ── MILESTONES ── */}
            {tab === 'milestones' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20 }}>Add Project Milestone</h2>

                {/* Quick project reference */}
                {projects.length > 0 && (
                  <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '16px 20px', marginBottom: 16 }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>Click a project to fill its ID</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {projects.map((p) => (
                        <button key={p.id} onClick={() => fillProjectId(p.id)}
                          style={{ background: milestoneForm.projectId === String(p.id) ? 'var(--accent-glow)' : 'var(--bg-elevated)', border: `1px solid ${milestoneForm.projectId === String(p.id) ? 'var(--border-hover)' : 'var(--border)'}`, borderRadius: 8, padding: '6px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontFamily: 'Space Grotesk', fontSize: 13, fontWeight: 700, color: 'var(--accent)' }}>#{p.id}</span>
                          <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{p.title}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <SectionCard title="New Milestone" subtitle="Add a milestone checkpoint to a project. Sequence number determines display order." onSubmit={addMilestone}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
                    <div>
                      <label style={labelStyle}>Project ID *</label>
                      <input
                        type="number"
                        placeholder="e.g. 1"
                        value={milestoneForm.projectId}
                        required
                        onChange={(e) => setMilestoneForm((prev) => ({ ...prev, projectId: e.target.value }))}
                        style={inputStyle}
                        onFocus={(e) => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px var(--accent-glow)' }}
                        onBlur={(e)  => { e.target.style.borderColor = 'var(--border)';  e.target.style.boxShadow = 'none' }}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Milestone Title *</label>
                      <input
                        type="text"
                        placeholder="e.g. Backend APIs Complete"
                        value={milestoneForm.title}
                        required
                        onChange={(e) => setMilestoneForm((prev) => ({ ...prev, title: e.target.value }))}
                        style={inputStyle}
                        onFocus={(e) => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px var(--accent-glow)' }}
                        onBlur={(e)  => { e.target.style.borderColor = 'var(--border)';  e.target.style.boxShadow = 'none' }}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Sequence Number *</label>
                      <input
                        type="number"
                        placeholder="e.g. 1"
                        min="1"
                        value={milestoneForm.sequenceNumber}
                        required
                        onChange={(e) => setMilestoneForm((prev) => ({ ...prev, sequenceNumber: e.target.value }))}
                        style={inputStyle}
                        onFocus={(e) => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px var(--accent-glow)' }}
                        onBlur={(e)  => { e.target.style.borderColor = 'var(--border)';  e.target.style.boxShadow = 'none' }}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Due Date</label>
                      <input
                        type="date"
                        value={milestoneForm.dueDate}
                        onChange={(e) => setMilestoneForm((prev) => ({ ...prev, dueDate: e.target.value }))}
                        style={inputStyle}
                        onFocus={(e) => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px var(--accent-glow)' }}
                        onBlur={(e)  => { e.target.style.borderColor = 'var(--border)';  e.target.style.boxShadow = 'none' }}
                      />
                    </div>
                  </div>
                  <div style={{ marginTop: 14 }}>
                    <label style={labelStyle}>Description *</label>
                    <textarea
                      placeholder="What will be delivered in this milestone?"
                      value={milestoneForm.description}
                      required
                      rows={2}
                      onChange={(e) => setMilestoneForm((prev) => ({ ...prev, description: e.target.value }))}
                      style={{ ...inputStyle, resize: 'vertical' }}
                      onFocus={(e) => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px var(--accent-glow)' }}
                      onBlur={(e)  => { e.target.style.borderColor = 'var(--border)';  e.target.style.boxShadow = 'none' }}
                    />
                  </div>
                  <button type="submit" className="btn-primary" style={{ marginTop: 16, fontSize: 13 }}>
                    🎯 Add Milestone
                  </button>
                </SectionCard>

                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px' }}>
                  <h4 style={{ fontFamily: 'Space Grotesk', fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>How Milestones Work</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[
                      '1. Create a project first — note its ID',
                      '2. Add milestones with sequence numbers (1, 2, 3...)',
                      '3. Client sees milestones in order on their dashboard',
                      '4. Update milestone status via Progress tab',
                    ].map((tip) => (
                      <div key={tip} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                        <span style={{ color: 'var(--accent)', fontSize: 12, marginTop: 1 }}>→</span>
                        <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── PROGRESS ── */}
            {tab === 'progress' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20 }}>Update Project Progress</h2>

                {/* Quick project reference */}
                {projects.length > 0 && (
                  <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '16px 20px', marginBottom: 16 }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>Click a project to fill its ID</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {projects.map((p) => {
                        const sc = STATUS_COLORS[p.status] ?? STATUS_COLORS.PLANNING
                        return (
                          <button key={p.id} onClick={() => fillProjectId(p.id)}
                            style={{ background: progressForm.projectId === String(p.id) ? 'var(--accent-glow)' : 'var(--bg-elevated)', border: `1px solid ${progressForm.projectId === String(p.id) ? 'var(--border-hover)' : 'var(--border)'}`, borderRadius: 8, padding: '6px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontFamily: 'Space Grotesk', fontSize: 13, fontWeight: 700, color: 'var(--accent)' }}>#{p.id}</span>
                            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{p.title}</span>
                            <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 100, fontWeight: 600, background: sc.bg, color: sc.text }}>{p.progress ?? 0}%</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                <SectionCard title="Update Progress" subtitle="Change the progress percentage and status of any project." onSubmit={updateProgress}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
                    <div>
                      <label style={labelStyle}>Project ID *</label>
                      <input
                        type="number"
                        placeholder="e.g. 1"
                        value={progressForm.projectId}
                        required
                        onChange={(e) => setProgressForm((prev) => ({ ...prev, projectId: e.target.value }))}
                        style={inputStyle}
                        onFocus={(e) => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px var(--accent-glow)' }}
                        onBlur={(e)  => { e.target.style.borderColor = 'var(--border)';  e.target.style.boxShadow = 'none' }}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Progress % *</label>
                      <input
                        type="number"
                        placeholder="0 - 100"
                        min="0"
                        max="100"
                        value={progressForm.progress}
                        required
                        onChange={(e) => setProgressForm((prev) => ({ ...prev, progress: e.target.value }))}
                        style={inputStyle}
                        onFocus={(e) => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px var(--accent-glow)' }}
                        onBlur={(e)  => { e.target.style.borderColor = 'var(--border)';  e.target.style.boxShadow = 'none' }}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Project Status *</label>
                      <select
                        value={progressForm.status}
                        required
                        onChange={(e) => setProgressForm((prev) => ({ ...prev, status: e.target.value }))}
                        style={{ ...inputStyle, cursor: 'pointer' }}
                        onFocus={(e) => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px var(--accent-glow)' }}
                        onBlur={(e)  => { e.target.style.borderColor = 'var(--border)';  e.target.style.boxShadow = 'none' }}
                      >
                        <option value="PLANNING">Planning</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="ON_HOLD">On Hold</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  {/* Live preview */}
                  {progressForm.progress && (
                    <div style={{ marginTop: 16, padding: '14px', background: 'var(--bg-elevated)', borderRadius: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Preview</span>
                        <span style={{ fontFamily: 'Space Grotesk', fontSize: 14, fontWeight: 700, color: 'var(--accent)' }}>{progressForm.progress}%</span>
                      </div>
                      <div style={{ height: 6, background: 'var(--bg-card)', borderRadius: 100, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${Math.min(progressForm.progress, 100)}%`, background: 'linear-gradient(90deg, var(--accent), #818cf8)', borderRadius: 100, transition: 'width 0.3s' }} />
                      </div>
                    </div>
                  )}

                  <button type="submit" className="btn-primary" style={{ marginTop: 16, fontSize: 13 }}>
                    📊 Update Progress
                  </button>
                </SectionCard>

                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px' }}>
                  <h4 style={{ fontFamily: 'Space Grotesk', fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>Progress Guide</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10 }}>
                    {[
                      { range: '0%',    label: 'Not Started',  status: 'PLANNING' },
                      { range: '1-25%', label: 'Just Started', status: 'IN_PROGRESS' },
                      { range: '25-50%',label: 'Quarter Done', status: 'IN_PROGRESS' },
                      { range: '50-75%',label: 'Halfway',      status: 'IN_PROGRESS' },
                      { range: '75-99%',label: 'Almost Done',  status: 'IN_PROGRESS' },
                      { range: '100%',  label: 'Completed',    status: 'COMPLETED' },
                    ].map((g) => (
                      <div key={g.range} style={{ padding: '10px 12px', background: 'var(--bg-elevated)', borderRadius: 10 }}>
                        <div style={{ fontFamily: 'Space Grotesk', fontSize: 14, fontWeight: 700, color: 'var(--accent)' }}>{g.range}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-primary)', fontWeight: 600, marginTop: 2 }}>{g.label}</div>
                        <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{g.status}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </main>
        </div>
      </div>
    </>
  )
}
