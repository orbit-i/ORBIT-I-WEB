'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { getMyProjects, getToken, getUser, logout, isLoggedIn } from '@/lib/orbitApi'

const statusColors = {
  PLANNING: { bg: 'rgba(99,140,210,0.1)', color: '#60a5fa', label: 'Planning' },
  IN_PROGRESS: { bg: 'rgba(251,191,36,0.1)', color: '#fbbf24', label: 'In Progress' },
  ON_HOLD: { bg: 'rgba(239,68,68,0.1)', color: '#ef4444', label: 'On Hold' },
  COMPLETED: { bg: 'rgba(34,197,94,0.1)', color: '#22c55e', label: 'Completed' },
  CANCELLED: { bg: 'rgba(107,114,128,0.1)', color: '#9ca3af', label: 'Cancelled' },
}

const milestoneIcons = { COMPLETED: '✓', IN_PROGRESS: '⏳', PENDING: '○' }
const milestoneColors = { COMPLETED: '#22c55e', IN_PROGRESS: '#fbbf24', PENDING: 'var(--text-muted)' }

export default function DashboardPage() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const router = useRouter()
  const user = getUser()

  useEffect(() => {
    if (!isLoggedIn()) { router.push('/portal'); return }
    const u = getUser()
    if (u?.role === 'ADMIN') { router.push('/portal/admin'); return }

    getMyProjects(getToken())
      .then(data => { setProjects(data); if (data.length > 0) setSelected(data[0]) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleLogout = () => { logout(); router.push('/portal') }

  const activeProject = selected || projects[0]

  return (
    <>
      <style>{`
        .dash-page { min-height: 100vh; background: var(--bg); display: flex; flex-direction: column; }
        .dash-header { padding: 16px 32px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; background: var(--bg-card); }
        .dash-body { display: flex; flex: 1; }
        .dash-sidebar { width: 280px; border-right: 1px solid var(--border); padding: 24px 16px; display: flex; flex-direction: column; gap: 8px; background: var(--bg-card); }
        .dash-main { flex: 1; padding: 32px; overflow-y: auto; }
        .project-item { padding: 14px 16px; borderRadius: 12px; cursor: pointer; transition: all 0.15s; border: 1px solid transparent; }
        .project-item:hover { background: var(--bg-elevated); border-color: var(--border); }
        .project-item.active { background: var(--accent-glow); border-color: var(--border-hover); }
        @media (max-width: 768px) {
          .dash-sidebar { width: 100%; border-right: none; border-bottom: 1px solid var(--border); }
          .dash-body { flex-direction: column; }
        }
      `}</style>

      <div className="dash-page">
        {/* Header */}
        <header className="dash-header">
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <Image src="/orbitlogo-removebg-preview.png" alt="ORBIT-I" width={32} height={32} style={{ objectFit: 'contain' }} />
            <div style={{ fontFamily: 'Space Grotesk', fontSize: 14, fontWeight: 800, color: 'var(--text-primary)' }}>ORBIT-I</div>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'Space Grotesk' }}>{user?.name}</p>
              <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{user?.email}</p>
            </div>
            <button onClick={handleLogout} className="btn-outline" style={{ fontSize: 12, padding: '7px 14px' }}>
              Sign Out
            </button>
          </div>
        </header>

        <div className="dash-body">
          {/* Sidebar — project list */}
          <aside className="dash-sidebar">
            <p style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8, paddingLeft: 4 }}>
              Your Projects
            </p>

            {loading ? (
              <div style={{ padding: 16, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>Loading...</div>
            ) : projects.length === 0 ? (
              <div style={{ padding: 16, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>No projects yet.</div>
            ) : (
              projects.map((p) => {
                const s = statusColors[p.status] || statusColors.PLANNING
                return (
                  <div key={p.id} className={`project-item ${activeProject?.id === p.id ? 'active' : ''}`}
                    onClick={() => setSelected(p)}
                    style={{ borderRadius: 12, cursor: 'pointer', transition: 'all 0.15s', border: `1px solid ${activeProject?.id === p.id ? 'var(--border-hover)' : 'transparent'}`, background: activeProject?.id === p.id ? 'var(--accent-glow)' : 'transparent', padding: '12px 14px' }}
                  >
                    <p style={{ fontFamily: 'Space Grotesk', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{p.title}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 10, padding: '2px 8px', background: s.bg, borderRadius: 100, color: s.color, fontWeight: 600 }}>{s.label}</span>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.progress}%</span>
                    </div>
                  </div>
                )
              })
            )}
          </aside>

          {/* Main content */}
          <main className="dash-main">
            {!activeProject ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 16, color: 'var(--text-muted)' }}>
                <span style={{ fontSize: 48 }}>◎</span>
                <p style={{ fontSize: 15 }}>No projects assigned yet.</p>
                <p style={{ fontSize: 13 }}>Contact ORBIT-I to get started.</p>
              </div>
            ) : (
              <motion.div key={activeProject.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
                style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                {/* Project header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <h1 style={{ fontFamily: 'Space Grotesk', fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: 6 }}>
                      {activeProject.title}
                    </h1>
                    <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: 600 }}>{activeProject.description}</p>
                  </div>
                  {(() => {
                    const s = statusColors[activeProject.status] || statusColors.PLANNING
                    return <span style={{ fontSize: 12, padding: '6px 14px', background: s.bg, borderRadius: 100, color: s.color, fontWeight: 600, flexShrink: 0 }}>{s.label}</span>
                  })()}
                </div>

                {/* Progress bar */}
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <span style={{ fontFamily: 'Space Grotesk', fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Overall Progress</span>
                    <span style={{ fontFamily: 'Space Grotesk', fontSize: 20, fontWeight: 800, color: 'var(--accent)' }}>{activeProject.progress}%</span>
                  </div>
                  <div style={{ height: 8, background: 'var(--bg-elevated)', borderRadius: 100, overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${activeProject.progress}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      style={{ height: '100%', background: 'linear-gradient(90deg, var(--accent), #818cf8)', borderRadius: 100 }}
                    />
                  </div>
                </div>

                {/* Project details grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
                  {[
                    { label: 'Start Date', value: activeProject.startDate || 'TBD' },
                    { label: 'Deadline', value: activeProject.deadline || 'TBD' },
                    { label: 'Completed', value: activeProject.completedAt || 'In Progress' },
                    { label: 'Milestones', value: `${activeProject.milestones?.filter(m => m.status === 'COMPLETED').length || 0} / ${activeProject.milestones?.length || 0}` },
                  ].map((item) => (
                    <div key={item.label} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '16px' }}>
                      <p style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.label}</p>
                      <p style={{ fontFamily: 'Space Grotesk', fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{item.value}</p>
                    </div>
                  ))}
                </div>

                {/* Milestones */}
                {activeProject.milestones?.length > 0 && (
                  <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '24px' }}>
                    <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20 }}>
                      Project Milestones
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                      {activeProject.milestones.sort((a, b) => a.sequenceNumber - b.sequenceNumber).map((m, i) => (
                        <div key={m.id} style={{ display: 'flex', gap: 16, paddingBottom: i < activeProject.milestones.length - 1 ? 20 : 0 }}>
                          {/* Timeline */}
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                            <div style={{
                              width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                              background: m.status === 'COMPLETED' ? 'rgba(34,197,94,0.1)' : m.status === 'IN_PROGRESS' ? 'rgba(251,191,36,0.1)' : 'var(--bg-elevated)',
                              border: `2px solid ${milestoneColors[m.status]}`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: 13, color: milestoneColors[m.status],
                            }}>
                              {milestoneIcons[m.status]}
                            </div>
                            {i < activeProject.milestones.length - 1 && (
                              <div style={{ width: 2, flex: 1, minHeight: 20, background: m.status === 'COMPLETED' ? '#22c55e' : 'var(--border)', marginTop: 4 }} />
                            )}
                          </div>
                          {/* Content */}
                          <div style={{ flex: 1, paddingBottom: 8 }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                              <h3 style={{ fontFamily: 'Space Grotesk', fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{m.title}</h3>
                              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                                {m.status === 'COMPLETED' ? `✓ ${m.completedAt || 'Done'}` : m.dueDate ? `Due: ${m.dueDate}` : ''}
                              </span>
                            </div>
                            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4, lineHeight: 1.5 }}>{m.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </main>
        </div>
      </div>
    </>
  )
}
