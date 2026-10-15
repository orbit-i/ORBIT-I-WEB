'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users,
  Award,
  FolderKanban,
  Target,
  BarChart3,
  FileText,
  PenTool,
  Briefcase,
  UserCheck,
  Star,
  Inbox,
  Plus,
  Save,
  Trash2,
  Edit3,
  ExternalLink,
  CheckCircle2,
  Clock,
  Search,
  FileDown,
  Globe,
  Building2,
  Mail,
  Calendar,
  Shield,
  Layers,
  Sparkles,
  ArrowRight,
  X,
  FileCheck,
  Eye,
  LogOut,
  Check,
  SlidersHorizontal,
  Lock,
  Key,
  RefreshCw,
  AlertTriangle,
  Server,
  Activity,
} from 'lucide-react'
import { getToken, getUser, logout, isLoggedIn, saveToken } from '@/lib/orbitApi'
import SuperAdminGateway from '@/components/SuperAdminGateway'

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

const inputStyle = {
  width: '100%',
  padding: '11px 14px',
  background: 'var(--bg-elevated)',
  border: '1px solid var(--border)',
  borderRadius: 10,
  color: 'var(--text-primary)',
  fontSize: 13,
  fontFamily: 'Inter',
  outline: 'none',
  transition: 'all 0.2s',
}

const labelStyle = {
  display: 'block',
  fontSize: 11,
  fontWeight: 600,
  color: 'var(--text-secondary)',
  marginBottom: 5,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
}

function SectionCard({ title, subtitle, children, onSubmit, actionButton }) {
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '24px', marginBottom: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h3 style={{ fontFamily: 'Space Grotesk', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{title}</h3>
          {subtitle && <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{subtitle}</p>}
        </div>
        {actionButton && <div>{actionButton}</div>}
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

export default function SecretAdminPortalPage() {
  const router = useRouter()
  const [tab, setTab] = useState('clients')
  const [currentUser, setCurrentUser] = useState(() => (typeof window !== 'undefined' ? getUser() : null))
  const [authChecked, setAuthChecked] = useState(false)
  const [setupRequired, setSetupRequired] = useState(false)
  const [message, setMessage] = useState({ text: '', type: 'success' })

  // Services & Local SEO state
  const [services, setServices] = useState([])
  const [servicesLoading, setServicesLoading] = useState(false)
  const [isEditingService, setIsEditingService] = useState(false)
  const [serviceForm, setServiceForm] = useState({
    slug: '',
    title: '',
    category: '',
    shortDesc: '',
    metaTitle: '',
    metaDesc: '',
    keywords: '',
    architecture: '',
    citiesCovered: '',
  })

  // Security telemetry state
  const [securityStats, setSecurityStats] = useState(null)
  const [secLoading, setSecLoading] = useState(false)

  // Master Admin Account state
  const [accountForm, setAccountForm] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  // Operations state
  const [clients, setClients] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [projectsLoading, setProjectsLoading] = useState(false)

  // Operations Forms
  const [certForm, setCertForm] = useState({ name: '', role: '', department: '', duration: '', startDate: '', endDate: '', certificateCode: '' })
  const [projectForm, setProjectForm] = useState({ title: '', description: '', deadline: '', clientId: '' })
  const [milestoneForm, setMilestoneForm] = useState({ title: '', description: '', dueDate: '', sequenceNumber: '', projectId: '' })
  const [progressForm, setProgressForm] = useState({ projectId: '', progress: '', status: 'IN_PROGRESS' })

  // CMS state
  const [cmsPages, setCmsPages] = useState([])
  const [cmsLoading, setCmsLoading] = useState(false)
  const [isEditingCms, setIsEditingCms] = useState(false)
  const [cmsActiveTab, setCmsActiveTab] = useState('editor')
  const [cmsSearch, setCmsSearch] = useState('')
  const [cmsForm, setCmsForm] = useState({
    id: null,
    title: '',
    slug: '',
    excerpt: '',
    content_html: '<h2>Corporate Standards</h2><p>Describe your corporate policies or standards here...</p>',
    status: 'published',
    meta_title: '',
    meta_description: '',
    keywords: '',
    schema_type: 'WebPage',
  })

  // Blog state
  const [blogPosts, setBlogPosts] = useState([])
  const [blogLoading, setBlogLoading] = useState(false)
  const [isEditingBlog, setIsEditingBlog] = useState(false)
  const [blogActiveTab, setBlogActiveTab] = useState('editor')
  const [blogCategoryFilter, setBlogCategoryFilter] = useState('ALL')
  const [blogForm, setBlogForm] = useState({
    id: null,
    title: '',
    slug: '',
    excerpt: '',
    content: '<h2>Introduction</h2><p>Draft your high-impact technical article here...</p>',
    category: 'Artificial Intelligence',
    tags: 'AI, LLM, Cloud, Next.js',
    author: 'ORBIT-I Editorial',
    featured_image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    read_time: '5 min read',
    status: 'published',
    seo_title: '',
    seo_description: '',
    focus_keyword: '',
  })

  // Careers state
  const [careerJobs, setCareerJobs] = useState([])
  const [careerLoading, setCareerLoading] = useState(false)
  const [isEditingCareer, setIsEditingCareer] = useState(false)
  const [careerForm, setCareerForm] = useState({
    id: null,
    title: '',
    slug: '',
    department: 'Artificial Intelligence & Data',
    category: 'internship',
    location: 'Remote (All Pakistan / Global)',
    type: 'Internship',
    mode: '100% Remote',
    duration: '2 Months',
    openings: '3 Seats',
    compensation: 'Unpaid (Verifiable Certificate & LOR)',
    experience: 'Fresh / Students / Self-Taught',
    summary: '',
    requirements: '',
    responsibilities: '',
    perks: 'Verifiable Digital Certificate, Performance LOR, Founders Mentorship',
    is_open: 1,
  })

  // Teams state
  const [teamMembers, setTeamMembers] = useState([])
  const [teamLoading, setTeamLoading] = useState(false)
  const [isEditingTeam, setIsEditingTeam] = useState(false)
  const [teamForm, setTeamForm] = useState({
    id: null,
    name: '',
    designation: '',
    department: 'Leadership',
    bio: '',
    avatar_url: '/orbitlogo-removebg-preview.png',
    skills: '',
    linkedin_url: 'https://linkedin.com',
    github_url: 'https://github.com',
    order_index: 0,
    is_published: 1,
  })

  // Testimonials state
  const [testimonials, setTestimonials] = useState([])
  const [testimonialsLoading, setTestimonialsLoading] = useState(false)
  const [isEditingTestimonial, setIsEditingTestimonial] = useState(false)
  const [testimonialForm, setTestimonialForm] = useState({
    id: null,
    client_name: '',
    designation: '',
    company: '',
    content: '',
    rating: 5,
    avatar_url: '',
    is_published: 1,
  })

  // Inquiries state
  const [inquiries, setInquiries] = useState([])
  const [inquiriesLoading, setInquiriesLoading] = useState(false)
  const [inquiryFilter, setInquiryFilter] = useState('ALL')
  const [selectedInquiry, setSelectedInquiry] = useState(null)

  const showMsg = (text, type = 'success') => {
    setMessage({ text, type })
    setTimeout(() => setMessage({ text: '', type: 'success' }), 4000)
  }

  const fetchClients = useCallback(async () => {
    try {
      const data = await adminReq('/api/admin/clients')
      setClients(data)
    } catch {
      // offline
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchProjects = useCallback(async () => {
    setProjectsLoading(true)
    try {
      const data = await adminReq('/api/admin/projects')
      setProjects(Array.isArray(data) ? data : data.content ?? [])
    } catch {
      // ignore
    } finally {
      setProjectsLoading(false)
    }
  }, [])

  const fetchCmsPages = useCallback(async () => {
    setCmsLoading(true)
    try {
      const res = await fetch('/api/cms/pages')
      const data = await res.json()
      if (Array.isArray(data)) setCmsPages(data)
    } catch {
      // ignore
    } finally {
      setCmsLoading(false)
    }
  }, [])

  const fetchBlogPosts = useCallback(async () => {
    setBlogLoading(true)
    try {
      const res = await fetch('/api/blog/posts')
      const data = await res.json()
      if (Array.isArray(data)) setBlogPosts(data)
    } catch {
      // ignore
    } finally {
      setBlogLoading(false)
    }
  }, [])

  const fetchCareerJobs = useCallback(async () => {
    setCareerLoading(true)
    try {
      const res = await fetch('/api/careers/jobs')
      const data = await res.json()
      if (Array.isArray(data)) setCareerJobs(data)
    } catch {
      // ignore
    } finally {
      setCareerLoading(false)
    }
  }, [])

  const fetchTeamMembers = useCallback(async () => {
    setTeamLoading(true)
    try {
      const res = await fetch('/api/team/members')
      const data = await res.json()
      if (Array.isArray(data)) setTeamMembers(data)
    } catch {
      // ignore
    } finally {
      setTeamLoading(false)
    }
  }, [])

  const fetchTestimonials = useCallback(async () => {
    setTestimonialsLoading(true)
    try {
      const res = await fetch('/api/testimonials')
      const data = await res.json()
      if (Array.isArray(data)) setTestimonials(data)
    } catch {
      // ignore
    } finally {
      setTestimonialsLoading(false)
    }
  }, [])

  const fetchInquiries = useCallback(async () => {
    setInquiriesLoading(true)
    try {
      const data = await adminReq('/api/admin/inquiries')
      if (Array.isArray(data)) setInquiries(data)
    } catch {
      // ignore
    } finally {
      setInquiriesLoading(false)
    }
  }, [])

  // Check auth and initial load
  useEffect(() => {
    let ignore = false
    async function checkAuth() {
      if (isLoggedIn()) {
        const u = getUser()
        if (u?.role === 'ADMIN') {
          if (!ignore) {
            setCurrentUser(u)
            setAuthChecked(true)
            fetchClients()
          }
          return
        }
      }

      // Not logged in as admin: check if initial SuperAdmin setup is required
      try {
        const res = await fetch('/api/admin/setup-status')
        const data = await res.json()
        if (!ignore) {
          setSetupRequired(Boolean(data.setupRequired))
          setAuthChecked(true)
        }
      } catch {
        if (!ignore) {
          setSetupRequired(true)
          setAuthChecked(true)
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    checkAuth()
    return () => {
      ignore = true
    }
  }, [fetchClients])

  // Tab change triggers
  useEffect(() => {
    let ignore = false
    const loadTabData = async () => {
      if (tab === 'projects' || tab === 'milestones' || tab === 'progress') {
        try {
          const data = await adminReq('/api/admin/projects')
          if (!ignore) setProjects(Array.isArray(data) ? data : data.content ?? [])
        } catch {}
      } else if (tab === 'cms') {
        try {
          const res = await fetch('/api/cms/pages')
          const data = await res.json()
          if (!ignore && Array.isArray(data)) setCmsPages(data)
        } catch {}
      } else if (tab === 'blog') {
        try {
          const res = await fetch('/api/blog/posts')
          const data = await res.json()
          if (!ignore && Array.isArray(data)) setBlogPosts(data)
        } catch {}
      } else if (tab === 'careers') {
        try {
          const res = await fetch('/api/careers/jobs')
          const data = await res.json()
          if (!ignore && Array.isArray(data)) setCareerJobs(data)
        } catch {}
      } else if (tab === 'teams') {
        try {
          const res = await fetch('/api/team/members')
          const data = await res.json()
          if (!ignore && Array.isArray(data)) setTeamMembers(data)
        } catch {}
      } else if (tab === 'testimonials') {
        try {
          const res = await fetch('/api/testimonials')
          const data = await res.json()
          if (!ignore && Array.isArray(data)) setTestimonials(data)
        } catch {}
      } else if (tab === 'inquiries') {
        try {
          const data = await adminReq('/api/admin/inquiries')
          if (!ignore && Array.isArray(data)) setInquiries(data)
        } catch {}
      } else if (tab === 'services') {
        setServicesLoading(true)
        try {
          const res = await fetch('/api/services')
          const data = await res.json()
          if (!ignore && Array.isArray(data)) setServices(data)
        } catch {} finally {
          if (!ignore) setServicesLoading(false)
        }
      } else if (tab === 'security') {
        setSecLoading(true)
        try {
          const data = await adminReq('/api/admin/security/stats')
          if (!ignore) setSecurityStats(data)
        } catch {} finally {
          if (!ignore) setSecLoading(false)
        }
      } else if (tab === 'account') {
        const u = getUser()
        if (u) {
          setAccountForm((prev) => ({ ...prev, name: u.name || '', email: u.email || '' }))
        }
      }
    }

    loadTabData()
    return () => {
      ignore = true
    }
  }, [tab])

  const approveClient = async (id) => {
    try {
      await adminReq(`/api/admin/clients/${id}/approve`, { method: 'PUT' })
      showMsg('Client approved successfully')
      fetchClients()
    } catch (e) {
      showMsg(e.message, 'error')
    }
  }

  const issueCertificate = async (e) => {
    e.preventDefault()
    try {
      await adminReq('/api/certificates/admin/create', { method: 'POST', body: JSON.stringify(certForm) })
      showMsg(`Certificate issued: ${certForm.certificateCode.toUpperCase()}`)
      setCertForm({ name: '', role: '', department: '', duration: '', startDate: '', endDate: '', certificateCode: '' })
    } catch (e) {
      showMsg(e.message, 'error')
    }
  }

  const createProject = async (e) => {
    e.preventDefault()
    try {
      await adminReq('/api/projects/admin/create', {
        method: 'POST',
        body: JSON.stringify({ ...projectForm, clientId: Number(projectForm.clientId) }),
      })
      showMsg('Project created successfully')
      setProjectForm({ title: '', description: '', deadline: '', clientId: '' })
      fetchProjects()
    } catch (e) {
      showMsg(e.message, 'error')
    }
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
    } catch (e) {
      showMsg(e.message, 'error')
    }
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
    } catch (e) {
      showMsg(e.message, 'error')
    }
  }

  const fillProjectId = (id) => {
    if (tab === 'milestones') setMilestoneForm((f) => ({ ...f, projectId: String(id) }))
    if (tab === 'progress') setProgressForm((f) => ({ ...f, projectId: String(id) }))
  }

  // CMS Handlers
  const openNewCms = () => {
    setCmsForm({
      id: null,
      title: '',
      slug: '',
      excerpt: '',
      content_html: '<h2>Heading 2</h2><p>Write standard paragraph content here...</p>',
      status: 'published',
      meta_title: '',
      meta_description: '',
      keywords: '',
      schema_type: 'WebPage',
    })
    setIsEditingCms(true)
    setCmsActiveTab('editor')
  }

  const openEditCms = (p) => {
    setCmsForm({
      id: p.id,
      title: p.title || '',
      slug: p.slug || '',
      excerpt: p.excerpt || '',
      content_html: p.content_html || '',
      status: p.status || 'published',
      meta_title: p.meta_title || '',
      meta_description: p.meta_description || '',
      keywords: p.keywords || '',
      schema_type: p.schema_type || 'WebPage',
    })
    setIsEditingCms(true)
    setCmsActiveTab('editor')
  }

  const saveCmsHandler = async (e) => {
    e.preventDefault()
    if (!cmsForm.title.trim() || !cmsForm.slug.trim()) {
      showMsg('Title and Slug are required', 'error')
      return
    }

    try {
      const isUpdate = Boolean(cmsForm.id)
      const url = isUpdate ? `/api/cms/pages/${cmsForm.id}` : '/api/cms/pages'
      const method = isUpdate ? 'PUT' : 'POST'
      await adminReq(url, { method, body: JSON.stringify(cmsForm) })
      showMsg(isUpdate ? 'CMS Page updated successfully' : 'CMS Page published successfully')
      setIsEditingCms(false)
      fetchCmsPages()
    } catch (err) {
      showMsg(err.message, 'error')
    }
  }

  const deleteCmsHandler = async (id) => {
    if (!confirm('Are you sure you want to delete this CMS page?')) return
    try {
      await adminReq(`/api/cms/pages/${id}`, { method: 'DELETE' })
      showMsg('CMS page deleted successfully')
      fetchCmsPages()
    } catch (err) {
      showMsg(err.message, 'error')
    }
  }

  const insertCmsTag = (openTag, closeTag) => {
    setCmsForm((prev) => ({
      ...prev,
      content_html: `${prev.content_html}\n${openTag}Text${closeTag}`,
    }))
  }

  // Blog Handlers
  const openNewBlog = () => {
    setBlogForm({
      id: null,
      title: '',
      slug: '',
      excerpt: '',
      content: '<h2>Introduction</h2><p>Share technical engineering breakthroughs...</p>',
      category: 'Artificial Intelligence',
      tags: 'AI, LLM, Cloud, Next.js',
      author: 'ORBIT-I Editorial',
      featured_image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      read_time: '5 min read',
      status: 'published',
      seo_title: '',
      seo_description: '',
      focus_keyword: '',
    })
    setIsEditingBlog(true)
    setBlogActiveTab('editor')
  }

  const openEditBlog = (b) => {
    setBlogForm({
      id: b.id,
      title: b.title || '',
      slug: b.slug || '',
      excerpt: b.excerpt || '',
      content: b.content || '',
      category: b.category || 'Artificial Intelligence',
      tags: b.tags || '',
      author: b.author || 'ORBIT-I Editorial',
      featured_image: b.featured_image || '',
      read_time: b.read_time || '5 min read',
      status: b.status || 'published',
      seo_title: b.seo_title || '',
      seo_description: b.seo_description || '',
      focus_keyword: b.focus_keyword || '',
    })
    setIsEditingBlog(true)
    setBlogActiveTab('editor')
  }

  const saveBlogHandler = async (e) => {
    e.preventDefault()
    if (!blogForm.title.trim() || !blogForm.slug.trim()) {
      showMsg('Title and slug are required', 'error')
      return
    }

    try {
      const isUpdate = Boolean(blogForm.id)
      const url = isUpdate ? `/api/blog/posts/${blogForm.id}` : '/api/blog/posts'
      const method = isUpdate ? 'PUT' : 'POST'
      await adminReq(url, { method, body: JSON.stringify(blogForm) })
      showMsg(isUpdate ? 'Article updated successfully' : 'Article published successfully')
      setIsEditingBlog(false)
      fetchBlogPosts()
    } catch (err) {
      showMsg(err.message, 'error')
    }
  }

  const deleteBlogHandler = async (id) => {
    if (!confirm('Are you sure you want to delete this article?')) return
    try {
      await adminReq(`/api/blog/posts/${id}`, { method: 'DELETE' })
      showMsg('Article deleted successfully')
      fetchBlogPosts()
    } catch (err) {
      showMsg(err.message, 'error')
    }
  }

  const insertBlogTag = (openTag, closeTag) => {
    setBlogForm((prev) => ({
      ...prev,
      content: `${prev.content}\n${openTag}Text${closeTag}`,
    }))
  }

  // Careers Handlers
  const openNewCareer = () => {
    setCareerForm({
      id: null,
      title: '',
      slug: '',
      department: 'Artificial Intelligence & Data',
      category: 'internship',
      location: 'Remote (All Pakistan / Global)',
      type: 'Internship',
      mode: '100% Remote',
      duration: '2 Months',
      openings: '3 Seats',
      compensation: 'Unpaid (Verifiable Certificate & LOR)',
      experience: 'Fresh / Students / Self-Taught',
      summary: '',
      requirements: '',
      responsibilities: '',
      perks: 'Verifiable Digital Certificate, Performance LOR, Mentorship',
      is_open: 1,
    })
    setIsEditingCareer(true)
  }

  const openEditCareer = (j) => {
    setCareerForm({
      id: j.id,
      title: j.title || '',
      slug: j.slug || '',
      department: j.department || '',
      category: j.category || 'internship',
      location: j.location || 'Remote (All Pakistan / Global)',
      type: j.type || 'Internship',
      mode: j.mode || '100% Remote',
      duration: j.duration || '2 Months',
      openings: j.openings || '3 Seats',
      compensation: j.compensation || 'Unpaid (Verifiable Certificate & LOR)',
      experience: j.experience || 'Fresh / Students',
      summary: j.summary || '',
      requirements: typeof j.requirements === 'string' ? j.requirements : (j.requirements || []).join(', '),
      responsibilities: typeof j.responsibilities === 'string' ? j.responsibilities : (j.responsibilities || []).join(', '),
      perks: typeof j.perks === 'string' ? j.perks : (j.perks || []).join(', '),
      is_open: j.is_open ? 1 : 0,
    })
    setIsEditingCareer(true)
  }

  const saveCareerHandler = async (e) => {
    e.preventDefault()
    if (!careerForm.title.trim() || !careerForm.department.trim()) {
      showMsg('Job title and department are required', 'error')
      return
    }

    try {
      const isUpdate = Boolean(careerForm.id)
      const url = isUpdate ? `/api/careers/jobs/${careerForm.id}` : '/api/careers/jobs'
      const method = isUpdate ? 'PUT' : 'POST'
      await adminReq(url, { method, body: JSON.stringify(careerForm) })
      showMsg(isUpdate ? 'Job posting updated' : 'New role published')
      setIsEditingCareer(false)
      fetchCareerJobs()
    } catch (err) {
      showMsg(err.message, 'error')
    }
  }

  const toggleJobOpen = async (j) => {
    try {
      await adminReq(`/api/careers/jobs/${j.id}`, {
        method: 'PUT',
        body: JSON.stringify({ ...j, is_open: j.is_open ? 0 : 1 }),
      })
      showMsg(`Position ${j.is_open ? 'closed' : 'opened'}`)
      fetchCareerJobs()
    } catch (err) {
      showMsg(err.message, 'error')
    }
  }

  const deleteCareerHandler = async (id) => {
    if (!confirm('Are you sure you want to delete this job posting?')) return
    try {
      await adminReq(`/api/careers/jobs/${id}`, { method: 'DELETE' })
      showMsg('Job posting deleted')
      fetchCareerJobs()
    } catch (err) {
      showMsg(err.message, 'error')
    }
  }

  // Team Handlers
  const openNewTeam = () => {
    setTeamForm({
      id: null,
      name: '',
      designation: '',
      department: 'Leadership',
      bio: '',
      avatar_url: '/orbitlogo-removebg-preview.png',
      skills: '',
      linkedin_url: 'https://linkedin.com',
      github_url: 'https://github.com',
      order_index: teamMembers.length + 1,
      is_published: 1,
    })
    setIsEditingTeam(true)
  }

  const openEditTeam = (m) => {
    setTeamForm({
      id: m.id,
      name: m.name || '',
      designation: m.designation || '',
      department: m.department || 'Leadership',
      bio: m.bio || '',
      avatar_url: m.avatar_url || '/orbitlogo-removebg-preview.png',
      skills: m.skills || '',
      linkedin_url: m.linkedin_url || '',
      github_url: m.github_url || '',
      order_index: m.order_index ?? 0,
      is_published: m.is_published ? 1 : 0,
    })
    setIsEditingTeam(true)
  }

  const saveTeamHandler = async (e) => {
    e.preventDefault()
    if (!teamForm.name.trim() || !teamForm.designation.trim()) {
      showMsg('Name and designation are required', 'error')
      return
    }

    try {
      const isUpdate = Boolean(teamForm.id)
      const url = isUpdate ? `/api/team/members/${teamForm.id}` : '/api/team/members'
      const method = isUpdate ? 'PUT' : 'POST'
      await adminReq(url, { method, body: JSON.stringify(teamForm) })
      showMsg(isUpdate ? 'Team member updated' : 'Team profile added')
      setIsEditingTeam(false)
      fetchTeamMembers()
    } catch (err) {
      showMsg(err.message, 'error')
    }
  }

  const deleteTeamHandler = async (id) => {
    if (!confirm('Are you sure you want to delete this team member?')) return
    try {
      await adminReq(`/api/team/members/${id}`, { method: 'DELETE' })
      showMsg('Team member deleted')
      fetchTeamMembers()
    } catch (err) {
      showMsg(err.message, 'error')
    }
  }

  // Testimonials Handlers
  const openNewTestimonial = () => {
    setTestimonialForm({
      id: null,
      client_name: '',
      designation: '',
      company: '',
      content: '',
      rating: 5,
      avatar_url: '',
      is_published: 1,
    })
    setIsEditingTestimonial(true)
  }

  const openEditTestimonial = (t) => {
    setTestimonialForm({
      id: t.id,
      client_name: t.client_name || '',
      designation: t.designation || '',
      company: t.company || '',
      content: t.content || '',
      rating: t.rating ?? 5,
      avatar_url: t.avatar_url || '',
      is_published: t.is_published ? 1 : 0,
    })
    setIsEditingTestimonial(true)
  }

  const saveTestimonialHandler = async (e) => {
    e.preventDefault()
    if (!testimonialForm.client_name.trim() || !testimonialForm.content.trim()) {
      showMsg('Client name and content are required', 'error')
      return
    }

    try {
      const isUpdate = Boolean(testimonialForm.id)
      const url = isUpdate ? `/api/testimonials/${testimonialForm.id}` : '/api/testimonials'
      const method = isUpdate ? 'PUT' : 'POST'
      await adminReq(url, { method, body: JSON.stringify(testimonialForm) })
      showMsg(isUpdate ? 'Testimonial updated' : 'Testimonial added')
      setIsEditingTestimonial(false)
      fetchTestimonials()
    } catch (err) {
      showMsg(err.message, 'error')
    }
  }

  const deleteTestimonialHandler = async (id) => {
    if (!confirm('Are you sure you want to delete this review?')) return
    try {
      await adminReq(`/api/testimonials/${id}`, { method: 'DELETE' })
      showMsg('Testimonial deleted')
      fetchTestimonials()
    } catch (err) {
      showMsg(err.message, 'error')
    }
  }

  // Inquiries Handlers
  const markInquiryStatus = async (id, status) => {
    try {
      await adminReq(`/api/admin/inquiries/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      })
      showMsg(`Inquiry marked as ${status}`)
      fetchInquiries()
      if (selectedInquiry?.id === id) {
        setSelectedInquiry((prev) => ({ ...prev, status }))
      }
    } catch (err) {
      showMsg(err.message, 'error')
    }
  }

  const deleteInquiryHandler = async (id) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return
    try {
      await adminReq(`/api/admin/inquiries/${id}`, { method: 'DELETE' })
      showMsg('Inquiry deleted')
      if (selectedInquiry?.id === id) setSelectedInquiry(null)
      fetchInquiries()
    } catch (err) {
      showMsg(err.message, 'error')
    }
  }

  // Helper to extract CV URL if message contains it
  const extractCvUrl = (messageText) => {
    if (!messageText) return null
    const match = messageText.match(/CV File:\s*(\S+)/i) || messageText.match(/(\/uploads\/cvs\/\S+)/i)
    return match ? match[1] : null
  }

  // Services Handlers
  const openEditService = (s) => {
    setServiceForm({
      slug: s.slug,
      title: s.title || '',
      category: s.category || '',
      shortDesc: s.shortDesc || '',
      metaTitle: s.metaTitle || '',
      metaDesc: s.metaDesc || '',
      keywords: Array.isArray(s.keywords) ? s.keywords.join(', ') : s.keywords || '',
      architecture: s.architecture || '',
      citiesCovered: Array.isArray(s.citiesCovered) ? s.citiesCovered.join(', ') : s.citiesCovered || '',
    })
    setIsEditingService(true)
  }

  const saveServiceHandler = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        ...serviceForm,
        keywords: serviceForm.keywords.split(',').map((k) => k.trim()).filter(Boolean),
        citiesCovered: serviceForm.citiesCovered.split(',').map((c) => c.trim()).filter(Boolean),
      }
      await adminReq('/api/services', { method: 'PUT', body: JSON.stringify(payload) })
      showMsg('Service & Local SEO metadata updated successfully!')
      setIsEditingService(false)
      const res = await fetch('/api/services')
      const data = await res.json()
      if (Array.isArray(data)) setServices(data)
    } catch (err) {
      showMsg(err.message, 'error')
    }
  }

  // Security Telemetry Handlers
  const handleUnbanIp = async (ip) => {
    try {
      await adminReq('/api/admin/security/unban', { method: 'POST', body: JSON.stringify({ ip }) })
      showMsg(`IP restriction for [${ip}] lifted`)
      const data = await adminReq('/api/admin/security/stats')
      setSecurityStats(data)
    } catch (err) {
      showMsg(err.message, 'error')
    }
  }

  const handleClearCache = async () => {
    try {
      await adminReq('/api/admin/cache/clear', { method: 'POST' })
      showMsg('High-speed balance loader memory cache flushed successfully!')
      const data = await adminReq('/api/admin/security/stats')
      setSecurityStats(data)
    } catch (err) {
      showMsg(err.message, 'error')
    }
  }

  // Account Settings Handler
  const handleUpdateAccount = async (e) => {
    e.preventDefault()
    if (accountForm.newPassword && accountForm.newPassword !== accountForm.confirmPassword) {
      showMsg('New passwords do not match', 'error')
      return
    }

    try {
      await adminReq('/api/admin/account', {
        method: 'PUT',
        body: JSON.stringify({
          name: accountForm.name,
          email: accountForm.email,
          currentPassword: accountForm.currentPassword,
          newPassword: accountForm.newPassword,
        }),
      })
      showMsg('SuperAdmin master credentials updated successfully!')
      setAccountForm((prev) => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }))
    } catch (err) {
      showMsg(err.message, 'error')
    }
  }

  // SuperAdmin Authentication & Setup Gateway Guard
  if (!authChecked) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Initializing Cyber Shield...</p>
      </div>
    )
  }

  if (!currentUser || currentUser.role !== 'ADMIN') {
    return (
      <SuperAdminGateway
        setupRequired={setupRequired}
        onAuthenticated={(user) => {
          setCurrentUser(user)
          fetchClients()
        }}
      />
    )
  }

  return (
    <>
      <style>{`
        .secret-admin-page { min-height: 100vh; background: var(--bg); display: flex; flex-direction: column; }
        .secret-admin-header { padding: 14px 28px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; background: var(--bg-card); position: sticky; top: 0; z-index: 20; backdrop-filter: blur(10px); }
        .secret-admin-body { display: flex; flex: 1; min-height: 0; }
        .secret-admin-sidebar { width: 235px; border-right: 1px solid var(--border); padding: 18px 12px; background: var(--bg-card); display: flex; flex-direction: column; gap: 3px; position: sticky; top: 57px; height: calc(100vh - 57px); overflow-y: auto; flex-shrink: 0; }
        .secret-admin-main { flex: 1; padding: 28px; overflow-y: auto; }
        .sidebar-btn { width: 100%; padding: 9px 12px; border: none; border-radius: 9px; cursor: pointer; font-family: 'Space Grotesk', sans-serif; font-size: 13px; font-weight: 600; text-align: left; transition: all 0.15s; display: flex; align-items: center; gap: 9px; }
        .sidebar-btn:hover { background: var(--bg-elevated); color: var(--text-primary); }
        .sidebar-section-title { font-size: 10px; color: var(--text-muted); font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; padding: 14px 8px 6px; }
        .project-row { background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px; padding: 14px 18px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; transition: border-color 0.15s; }
        .project-row:hover { border-color: var(--border-hover); }
        .editor-toolbar-btn { background: var(--bg-card); border: 1px solid var(--border); color: var(--text-secondary); border-radius: 6px; padding: 4px 10px; font-size: 11px; font-weight: 600; cursor: pointer; transition: all 0.15s; }
        .editor-toolbar-btn:hover { border-color: var(--accent); color: var(--accent); background: var(--accent-glow); }
        .table-badge { font-size: 10px; padding: 3px 8px; border-radius: 100px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; display: inline-flex; align-items: center; gap: 4px; }
        .cv-download-btn { display: inline-flex; align-items: center; gap: 6px; background: rgba(99,102,241,0.12); border: 1px solid rgba(99,102,241,0.3); color: #818cf8; border-radius: 8px; padding: 6px 12px; font-size: 12px; font-weight: 600; text-decoration: none; transition: all 0.15s; }
        .cv-download-btn:hover { background: rgba(99,102,241,0.22); border-color: #818cf8; color: #fff; }
        @media (max-width: 900px) { .secret-admin-sidebar { width: 190px; } }
        @media (max-width: 768px) { .secret-admin-sidebar { display: none; } .secret-admin-main { padding: 16px; } }
      `}</style>

      <div className="secret-admin-page">
        {/* Header */}
        <header className="secret-admin-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Image src="/orbitlogo-removebg-preview.png" alt="ORBIT-I" width={32} height={32} style={{ objectFit: 'contain' }} />
            <div>
              <div style={{ fontFamily: 'Space Grotesk', fontSize: 14, fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>ORBIT-I</span>
                <span style={{ fontSize: 10, background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#818cf8', padding: '1px 6px', borderRadius: 4, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                  <Shield style={{ width: 10, height: 10 }} /> SECURE VAULT
                </span>
              </div>
              <div style={{ fontSize: 9, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
                Enterprise Operations & Content Management
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{currentUser?.name || 'Authorized Admin'}</span>
            <Link href="/" target="_blank" style={{ fontSize: 12, color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Globe style={{ width: 12, height: 12 }} />
              <span>Website</span>
              <ExternalLink style={{ width: 11, height: 11 }} />
            </Link>
            <button onClick={() => { logout(); router.push('/portal') }} className="btn-outline" style={{ fontSize: 12, padding: '7px 14px', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <LogOut style={{ width: 12, height: 12 }} />
              <span>Sign Out</span>
            </button>
          </div>
        </header>

        <div className="secret-admin-body">
          {/* Sidebar */}
          <aside className="secret-admin-sidebar">
            <p className="sidebar-section-title">Operations & Deliveries</p>
            {[
              { id: 'clients', label: 'Clients', icon: Users },
              { id: 'certificates', label: 'Certificates', icon: Award },
              { id: 'projects', label: 'Projects', icon: FolderKanban },
              { id: 'milestones', label: 'Milestones', icon: Target },
              { id: 'progress', label: 'Progress', icon: BarChart3 },
            ].map((t) => {
              const IconComp = t.icon
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className="sidebar-btn"
                  style={{
                    background: tab === t.id ? 'var(--accent-glow)' : 'transparent',
                    color: tab === t.id ? 'var(--accent)' : 'var(--text-muted)',
                    border: tab === t.id ? '1px solid var(--border-hover)' : '1px solid transparent',
                  }}
                >
                  <IconComp style={{ width: 15, height: 15 }} />
                  <span>{t.label}</span>
                </button>
              )
            })}

            <p className="sidebar-section-title">Content Studio & CMS</p>
            {[
              { id: 'cms', label: 'All Pages CMS', icon: FileText },
              { id: 'blog', label: 'Blog & Articles', icon: PenTool },
              { id: 'careers', label: 'Careers & Jobs', icon: Briefcase },
              { id: 'teams', label: 'Team Profiles', icon: UserCheck },
              { id: 'testimonials', label: 'Testimonials', icon: Star },
              { id: 'inquiries', label: 'Inquiries & CVs', icon: Inbox },
            ].map((t) => {
              const IconComp = t.icon
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className="sidebar-btn"
                  style={{
                    background: tab === t.id ? 'var(--accent-glow)' : 'transparent',
                    color: tab === t.id ? 'var(--accent)' : 'var(--text-muted)',
                    border: tab === t.id ? '1px solid var(--border-hover)' : '1px solid transparent',
                  }}
                >
                  <IconComp style={{ width: 15, height: 15 }} />
                  <span>{t.label}</span>
                </button>
              )
            })}

            <p className="sidebar-section-title">System & Security</p>
            {[
              { id: 'services', label: 'Services & Local SEO', icon: Globe },
              { id: 'security', label: 'Cyber Shield & WAF', icon: Shield },
              { id: 'account', label: 'Admin Account', icon: SlidersHorizontal },
            ].map((t) => {
              const IconComp = t.icon
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className="sidebar-btn"
                  style={{
                    background: tab === t.id ? 'var(--accent-glow)' : 'transparent',
                    color: tab === t.id ? 'var(--accent)' : 'var(--text-muted)',
                    border: tab === t.id ? '1px solid var(--border-hover)' : '1px solid transparent',
                  }}
                >
                  <IconComp style={{ width: 15, height: 15 }} />
                  <span>{t.label}</span>
                </button>
              )
            })}
          </aside>

          {/* Main Content Area */}
          <main className="secret-admin-main">
            {/* Toast Feedback */}
            <AnimatePresence>
              {message.text && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  style={{
                    padding: '12px 18px',
                    borderRadius: 12,
                    marginBottom: 20,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: message.type === 'error' ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)',
                    border: `1px solid ${message.type === 'error' ? 'rgba(239,68,68,0.25)' : 'rgba(34,197,94,0.25)'}`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {message.type === 'error' ? <X style={{ width: 16, height: 16, color: '#ef4444' }} /> : <CheckCircle2 style={{ width: 16, height: 16, color: '#22c55e' }} />}
                    <p style={{ fontSize: 13, color: message.type === 'error' ? '#ef4444' : '#22c55e', fontWeight: 500 }}>{message.text}</p>
                  </div>
                  <button onClick={() => setMessage({ text: '', type: 'success' })} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    <X style={{ width: 14, height: 14 }} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── CLIENTS ── */}
            {tab === 'clients' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20 }}>Client Accounts</h2>
                {loading ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Loading clients...</p>
                ) : clients.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>No clients registered yet.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {clients.map((c) => (
                      <div key={c.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                            <p style={{ fontFamily: 'Space Grotesk', fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{c.name}</p>
                            <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 100, fontWeight: 600, background: c.approved ? 'rgba(34,197,94,0.1)' : 'rgba(251,191,36,0.1)', color: c.approved ? '#22c55e' : '#fbbf24', display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                              {c.approved ? <Check style={{ width: 10, height: 10 }} /> : <Clock style={{ width: 10, height: 10 }} />}
                              {c.approved ? 'Approved' : 'Pending'}
                            </span>
                          </div>
                          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                            {c.email} {c.company ? `· ${c.company}` : ''} {c.phone ? `· ${c.phone}` : ''}
                          </p>
                          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>ID: {c.id} · Role: {c.role}</p>
                        </div>
                        {!c.approved && (
                          <button onClick={() => approveClient(c.id)} className="btn-primary" style={{ fontSize: 12, padding: '8px 16px', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                            <CheckCircle2 style={{ width: 14, height: 14 }} />
                            <span>Approve Client</span>
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
                <SectionCard title="New Certificate" subtitle="Official experience certificate verifiable on /verify." onSubmit={issueCertificate}>
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
                        />
                      </div>
                    ))}
                  </div>
                  <button type="submit" className="btn-primary" style={{ marginTop: 16, fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <Award style={{ width: 14, height: 14 }} />
                    <span>Issue Certificate</span>
                  </button>
                </SectionCard>
              </motion.div>
            )}

            {/* ── PROJECTS ── */}
            {tab === 'projects' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20 }}>Projects</h2>
                <SectionCard title="All Projects" subtitle="System projects and client milestones.">
                  {projectsLoading ? (
                    <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Loading projects...</p>
                  ) : projects.length === 0 ? (
                    <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>No projects found. Create one below.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {projects.map((p) => {
                        const sc = STATUS_COLORS[p.status] ?? STATUS_COLORS.PLANNING
                        const clientName = clients.find((c) => c.id === p.clientId)?.name ?? `Client #${p.clientId}`
                        return (
                          <div key={p.id} className="project-row">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1, minWidth: 0 }}>
                              <div style={{ minWidth: 44, height: 38, background: 'var(--accent-glow)', border: '1px solid var(--border-hover)', borderRadius: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ fontSize: 8, color: 'var(--accent)', fontWeight: 700 }}>ID</span>
                                <span style={{ fontFamily: 'Space Grotesk', fontSize: 15, fontWeight: 800, color: 'var(--accent)', lineHeight: 1 }}>{p.id}</span>
                              </div>
                              <div>
                                <div style={{ fontFamily: 'Space Grotesk', fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{p.title}</div>
                                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                                  {clientName} {p.deadline ? ` · Due ${new Date(p.deadline).toLocaleDateString()}` : ''}
                                </div>
                              </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <span style={{ fontFamily: 'Space Grotesk', fontSize: 12, fontWeight: 700, color: 'var(--accent)' }}>{p.progress ?? 0}%</span>
                              <span style={{ fontSize: 10, padding: '3px 10px', borderRadius: 100, fontWeight: 600, background: sc.bg, color: sc.text }}>
                                {p.status?.replace('_', ' ')}
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </SectionCard>

                <SectionCard title="Create New Project" subtitle="Assign a project scope to an approved client." onSubmit={createProject}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
                    <div>
                      <label style={labelStyle}>Project Title *</label>
                      <input type="text" placeholder="e.g. Enterprise AI Portal" value={projectForm.title} required onChange={(e) => setProjectForm((prev) => ({ ...prev, title: e.target.value }))} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Client ID *</label>
                      <input type="number" placeholder="e.g. 1" value={projectForm.clientId} required onChange={(e) => setProjectForm((prev) => ({ ...prev, clientId: e.target.value }))} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Deadline *</label>
                      <input type="date" value={projectForm.deadline} required onChange={(e) => setProjectForm((prev) => ({ ...prev, deadline: e.target.value }))} style={inputStyle} />
                    </div>
                  </div>
                  <div style={{ marginTop: 14 }}>
                    <label style={labelStyle}>Description *</label>
                    <textarea placeholder="Describe the project scope and deliverables..." value={projectForm.description} required rows={3} onChange={(e) => setProjectForm((prev) => ({ ...prev, description: e.target.value }))} style={{ ...inputStyle, resize: 'vertical' }} />
                  </div>
                  <button type="submit" className="btn-primary" style={{ marginTop: 16, fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <FolderKanban style={{ width: 14, height: 14 }} />
                    <span>Create Project</span>
                  </button>
                </SectionCard>
              </motion.div>
            )}

            {/* ── MILESTONES ── */}
            {tab === 'milestones' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20 }}>Project Milestones</h2>
                {projects.length > 0 && (
                  <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '16px 20px', marginBottom: 16 }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>Click project to autofill ID</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {projects.map((p) => (
                        <button key={p.id} type="button" onClick={() => fillProjectId(p.id)} style={{ background: milestoneForm.projectId === String(p.id) ? 'var(--accent-glow)' : 'var(--bg-elevated)', border: `1px solid ${milestoneForm.projectId === String(p.id) ? 'var(--border-hover)' : 'var(--border)'}`, borderRadius: 8, padding: '6px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontFamily: 'Space Grotesk', fontSize: 12, fontWeight: 700, color: 'var(--accent)' }}>#{p.id}</span>
                          <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{p.title}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <SectionCard title="Add Milestone" subtitle="Deliverable checkpoint in project lifecycle." onSubmit={addMilestone}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
                    <div>
                      <label style={labelStyle}>Project ID *</label>
                      <input type="number" placeholder="e.g. 1" value={milestoneForm.projectId} required onChange={(e) => setMilestoneForm((prev) => ({ ...prev, projectId: e.target.value }))} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Milestone Title *</label>
                      <input type="text" placeholder="e.g. Core API Architecture" value={milestoneForm.title} required onChange={(e) => setMilestoneForm((prev) => ({ ...prev, title: e.target.value }))} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Sequence # *</label>
                      <input type="number" placeholder="1" min="1" value={milestoneForm.sequenceNumber} required onChange={(e) => setMilestoneForm((prev) => ({ ...prev, sequenceNumber: e.target.value }))} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Due Date</label>
                      <input type="date" value={milestoneForm.dueDate} onChange={(e) => setMilestoneForm((prev) => ({ ...prev, dueDate: e.target.value }))} style={inputStyle} />
                    </div>
                  </div>
                  <div style={{ marginTop: 14 }}>
                    <label style={labelStyle}>Description *</label>
                    <textarea placeholder="Deliverables included in this milestone..." value={milestoneForm.description} required rows={2} onChange={(e) => setMilestoneForm((prev) => ({ ...prev, description: e.target.value }))} style={{ ...inputStyle, resize: 'vertical' }} />
                  </div>
                  <button type="submit" className="btn-primary" style={{ marginTop: 16, fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <Target style={{ width: 14, height: 14 }} />
                    <span>Add Milestone</span>
                  </button>
                </SectionCard>
              </motion.div>
            )}

            {/* ── PROGRESS ── */}
            {tab === 'progress' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20 }}>Project Progress</h2>
                <SectionCard title="Update Progress" subtitle="Update completion percentage and status." onSubmit={updateProgress}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
                    <div>
                      <label style={labelStyle}>Project ID *</label>
                      <input type="number" placeholder="e.g. 1" value={progressForm.projectId} required onChange={(e) => setProgressForm((prev) => ({ ...prev, projectId: e.target.value }))} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Progress % (0 - 100) *</label>
                      <input type="number" min="0" max="100" value={progressForm.progress} required onChange={(e) => setProgressForm((prev) => ({ ...prev, progress: e.target.value }))} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Status *</label>
                      <select value={progressForm.status} onChange={(e) => setProgressForm((prev) => ({ ...prev, status: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }}>
                        <option value="PLANNING">Planning</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="ON_HOLD">On Hold</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </div>
                  </div>
                  <button type="submit" className="btn-primary" style={{ marginTop: 16, fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <BarChart3 style={{ width: 14, height: 14 }} />
                    <span>Update Progress</span>
                  </button>
                </SectionCard>
              </motion.div>
            )}

            {/* ── ALL PAGES CMS (CRUD) ── */}
            {tab === 'cms' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}>All Pages CMS Management</h2>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Publish corporate and technical documentation pages with full SEO metadata.</p>
                  </div>
                  <button onClick={openNewCms} className="btn-primary" style={{ fontSize: 13, padding: '9px 18px', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <Plus style={{ width: 14, height: 14 }} />
                    <span>Create New Page</span>
                  </button>
                </div>

                {isEditingCms ? (
                  <SectionCard
                    title={cmsForm.id ? `Edit Page: ${cmsForm.title}` : 'Create New CMS Page'}
                    subtitle="Format web pages with semantic HTML tags and schema configurations."
                    actionButton={
                      <button onClick={() => setIsEditingCms(false)} className="btn-outline" style={{ fontSize: 12, padding: '6px 12px', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                        <X style={{ width: 13, height: 13 }} />
                        <span>Cancel</span>
                      </button>
                    }
                    onSubmit={saveCmsHandler}
                  >
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 16 }}>
                      <div>
                        <label style={labelStyle}>Page Title *</label>
                        <input
                          type="text"
                          placeholder="e.g. Enterprise Architecture Standards"
                          value={cmsForm.title}
                          required
                          onChange={(e) => {
                            const val = e.target.value
                            setCmsForm((prev) => ({
                              ...prev,
                              title: val,
                              slug: prev.id ? prev.slug : val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
                            }))
                          }}
                          style={inputStyle}
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>URL Slug * (/p/slug)</label>
                        <input
                          type="text"
                          placeholder="enterprise-architecture-standards"
                          value={cmsForm.slug}
                          required
                          onChange={(e) => setCmsForm((prev) => ({ ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') }))}
                          style={inputStyle}
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>Status *</label>
                        <select value={cmsForm.status} onChange={(e) => setCmsForm((prev) => ({ ...prev, status: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }}>
                          <option value="published">Published</option>
                          <option value="draft">Draft</option>
                          <option value="archived">Archived</option>
                        </select>
                      </div>
                      <div>
                        <label style={labelStyle}>Schema Type</label>
                        <select value={cmsForm.schema_type} onChange={(e) => setCmsForm((prev) => ({ ...prev, schema_type: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }}>
                          <option value="WebPage">WebPage</option>
                          <option value="TechArticle">TechArticle</option>
                          <option value="AboutPage">AboutPage</option>
                          <option value="ContactPage">ContactPage</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ marginBottom: 16 }}>
                      <label style={labelStyle}>Page Excerpt / Summary</label>
                      <input
                        type="text"
                        placeholder="Brief summary used in card snippets and search results..."
                        value={cmsForm.excerpt}
                        onChange={(e) => setCmsForm((prev) => ({ ...prev, excerpt: e.target.value }))}
                        style={inputStyle}
                      />
                    </div>

                    {/* Toolbar */}
                    <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        <button type="button" onClick={() => insertCmsTag('<h2>', '</h2>')} className="editor-toolbar-btn">H2</button>
                        <button type="button" onClick={() => insertCmsTag('<h3>', '</h3>')} className="editor-toolbar-btn">H3</button>
                        <button type="button" onClick={() => insertCmsTag('<strong>', '</strong>')} className="editor-toolbar-btn">Bold</button>
                        <button type="button" onClick={() => insertCmsTag('<em>', '</em>')} className="editor-toolbar-btn">Italic</button>
                        <button type="button" onClick={() => insertCmsTag('<blockquote>', '</blockquote>')} className="editor-toolbar-btn">Quote</button>
                        <button type="button" onClick={() => insertCmsTag('<code>', '</code>')} className="editor-toolbar-btn">Code</button>
                        <button type="button" onClick={() => insertCmsTag('<ul>\n  <li>', '</li>\n</ul>')} className="editor-toolbar-btn">List</button>
                      </div>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button type="button" onClick={() => setCmsActiveTab('editor')} style={{ fontSize: 11, padding: '4px 10px', borderRadius: 6, background: cmsActiveTab === 'editor' ? 'var(--accent)' : 'var(--bg-elevated)', color: cmsActiveTab === 'editor' ? '#fff' : 'var(--text-muted)', border: 'none', cursor: 'pointer' }}>Editor</button>
                        <button type="button" onClick={() => setCmsActiveTab('preview')} style={{ fontSize: 11, padding: '4px 10px', borderRadius: 6, background: cmsActiveTab === 'preview' ? 'var(--accent)' : 'var(--bg-elevated)', color: cmsActiveTab === 'preview' ? '#fff' : 'var(--text-muted)', border: 'none', cursor: 'pointer' }}>Preview</button>
                      </div>
                    </div>

                    {cmsActiveTab === 'editor' ? (
                      <div style={{ marginBottom: 18 }}>
                        <textarea
                          rows={12}
                          value={cmsForm.content_html}
                          onChange={(e) => setCmsForm((prev) => ({ ...prev, content_html: e.target.value }))}
                          style={{ ...inputStyle, fontFamily: 'monospace', fontSize: 13, resize: 'vertical' }}
                          required
                        />
                      </div>
                    ) : (
                      <div style={{ marginBottom: 18, background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 12, padding: 24 }}>
                        <h1 style={{ fontFamily: 'Space Grotesk', fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>{cmsForm.title || 'Untitled Page'}</h1>
                        <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 16 }}>{cmsForm.excerpt}</p>
                        <div dangerouslySetInnerHTML={{ __html: cmsForm.content_html }} style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text-secondary)' }} />
                      </div>
                    )}

                    {/* SEO Meta Box */}
                    <div style={{ background: 'var(--bg-elevated)', borderRadius: 12, padding: 16, marginBottom: 20, border: '1px solid var(--border)' }}>
                      <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Search style={{ width: 13, height: 13 }} />
                        <span>Search Engine Optimization (SEO)</span>
                      </p>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                        <div>
                          <label style={labelStyle}>Meta Title</label>
                          <input type="text" placeholder="Title for Google search..." value={cmsForm.meta_title} onChange={(e) => setCmsForm((prev) => ({ ...prev, meta_title: e.target.value }))} style={inputStyle} />
                        </div>
                        <div>
                          <label style={labelStyle}>Keywords</label>
                          <input type="text" placeholder="e.g. enterprise, architecture, security" value={cmsForm.keywords} onChange={(e) => setCmsForm((prev) => ({ ...prev, keywords: e.target.value }))} style={inputStyle} />
                        </div>
                      </div>
                      <div style={{ marginTop: 10 }}>
                        <label style={labelStyle}>Meta Description</label>
                        <textarea rows={2} placeholder="Meta description for search engine ranking..." value={cmsForm.meta_description} onChange={(e) => setCmsForm((prev) => ({ ...prev, meta_description: e.target.value }))} style={{ ...inputStyle, resize: 'vertical' }} />
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 10 }}>
                      <button type="submit" className="btn-primary" style={{ fontSize: 13, padding: '9px 20px', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        <Save style={{ width: 14, height: 14 }} />
                        <span>{cmsForm.id ? 'Save Changes' : 'Publish Page'}</span>
                      </button>
                      <button type="button" onClick={() => setIsEditingCms(false)} className="btn-outline" style={{ fontSize: 13 }}>
                        Cancel
                      </button>
                    </div>
                  </SectionCard>
                ) : (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, gap: 12, flexWrap: 'wrap' }}>
                      <div style={{ position: 'relative', maxWidth: 320, width: '100%' }}>
                        <Search style={{ width: 14, height: 14, position: 'absolute', left: 12, top: 13, color: 'var(--text-muted)' }} />
                        <input
                          type="text"
                          placeholder="Search pages..."
                          value={cmsSearch}
                          onChange={(e) => setCmsSearch(e.target.value)}
                          style={{ ...inputStyle, paddingLeft: 34 }}
                        />
                      </div>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                        Total Pages: <strong style={{ color: 'var(--text-primary)' }}>{cmsPages.length}</strong>
                      </span>
                    </div>

                    {cmsLoading ? (
                      <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Loading CMS pages...</p>
                    ) : cmsPages.length === 0 ? (
                      <SectionCard title="No CMS Pages" subtitle="Create your first corporate documentation or policy page.">
                        <button onClick={openNewCms} className="btn-primary" style={{ fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                          <Plus style={{ width: 14, height: 14 }} />
                          <span>Create Page</span>
                        </button>
                      </SectionCard>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {cmsPages
                          .filter((p) => p.title.toLowerCase().includes(cmsSearch.toLowerCase()) || p.slug.toLowerCase().includes(cmsSearch.toLowerCase()))
                          .map((p) => (
                            <div key={p.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                              <div style={{ flex: 1, minWidth: 260 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                  <h4 style={{ fontFamily: 'Space Grotesk', fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{p.title}</h4>
                                  <span className="table-badge" style={{ background: p.status === 'published' ? 'rgba(34,197,94,0.1)' : 'rgba(251,191,36,0.1)', color: p.status === 'published' ? '#22c55e' : '#fbbf24' }}>
                                    {p.status}
                                  </span>
                                  <span style={{ fontSize: 10, background: 'var(--bg-elevated)', color: 'var(--text-muted)', padding: '2px 6px', borderRadius: 4 }}>
                                    {p.schema_type || 'WebPage'}
                                  </span>
                                </div>
                                <p style={{ fontSize: 12, color: 'var(--accent)', fontFamily: 'monospace' }}>
                                  /p/{p.slug}
                                </p>
                                {p.excerpt && (
                                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, maxWidth: 600 }}>{p.excerpt}</p>
                                )}
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Link href={`/p/${p.slug}`} target="_blank" className="btn-outline" style={{ fontSize: 12, padding: '6px 12px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                  <ExternalLink style={{ width: 12, height: 12 }} />
                                  <span>View</span>
                                </Link>
                                <button onClick={() => openEditCms(p)} className="btn-outline" style={{ fontSize: 12, padding: '6px 12px', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                  <Edit3 style={{ width: 12, height: 12 }} />
                                  <span>Edit</span>
                                </button>
                                <button onClick={() => deleteCmsHandler(p.id)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', borderRadius: 8, padding: '6px 10px', fontSize: 12, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                  <Trash2 style={{ width: 12, height: 12 }} />
                                  <span>Delete</span>
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            )}

            {/* ── BLOG & ARTICLES (CRUD) ── */}
            {tab === 'blog' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}>Blog & Technical Articles Studio</h2>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Publish thought leadership, AI research deep-dives, and engineering updates.</p>
                  </div>
                  <button onClick={openNewBlog} className="btn-primary" style={{ fontSize: 13, padding: '9px 18px', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <Plus style={{ width: 14, height: 14 }} />
                    <span>Write Article</span>
                  </button>
                </div>

                {isEditingBlog ? (
                  <SectionCard
                    title={blogForm.id ? `Edit Article: ${blogForm.title}` : 'Write New Technical Article'}
                    subtitle="Draft content with SEO snippet validation."
                    actionButton={
                      <button onClick={() => setIsEditingBlog(false)} className="btn-outline" style={{ fontSize: 12, padding: '6px 12px', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                        <X style={{ width: 13, height: 13 }} />
                        <span>Cancel</span>
                      </button>
                    }
                    onSubmit={saveBlogHandler}
                  >
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 16 }}>
                      <div>
                        <label style={labelStyle}>Article Title *</label>
                        <input
                          type="text"
                          placeholder="e.g. Building Autonomous AI Agents with Next.js"
                          value={blogForm.title}
                          required
                          onChange={(e) => {
                            const val = e.target.value
                            setBlogForm((prev) => ({
                              ...prev,
                              title: val,
                              slug: prev.id ? prev.slug : val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
                            }))
                          }}
                          style={inputStyle}
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>URL Slug * (/blog/slug)</label>
                        <input
                          type="text"
                          placeholder="building-autonomous-ai-agents"
                          value={blogForm.slug}
                          required
                          onChange={(e) => setBlogForm((prev) => ({ ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') }))}
                          style={inputStyle}
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>Category *</label>
                        <select value={blogForm.category} onChange={(e) => setBlogForm((prev) => ({ ...prev, category: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }}>
                          <option value="Artificial Intelligence">Artificial Intelligence</option>
                          <option value="Web Engineering">Web Engineering</option>
                          <option value="Data Science">Data Science</option>
                          <option value="Cyber Security">Cyber Security</option>
                          <option value="Cloud Architecture">Cloud Architecture</option>
                          <option value="Company News">Company News</option>
                        </select>
                      </div>
                      <div>
                        <label style={labelStyle}>Status *</label>
                        <select value={blogForm.status} onChange={(e) => setBlogForm((prev) => ({ ...prev, status: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }}>
                          <option value="published">Published</option>
                          <option value="draft">Draft</option>
                          <option value="archived">Archived</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 16 }}>
                      <div>
                        <label style={labelStyle}>Author</label>
                        <input type="text" placeholder="e.g. ORBIT-I AI Team" value={blogForm.author} onChange={(e) => setBlogForm((prev) => ({ ...prev, author: e.target.value }))} style={inputStyle} />
                      </div>
                      <div>
                        <label style={labelStyle}>Read Time</label>
                        <input type="text" placeholder="e.g. 5 min read" value={blogForm.read_time} onChange={(e) => setBlogForm((prev) => ({ ...prev, read_time: e.target.value }))} style={inputStyle} />
                      </div>
                      <div>
                        <label style={labelStyle}>Featured Image URL</label>
                        <input type="text" placeholder="https://..." value={blogForm.featured_image} onChange={(e) => setBlogForm((prev) => ({ ...prev, featured_image: e.target.value }))} style={inputStyle} />
                      </div>
                      <div>
                        <label style={labelStyle}>Tags (comma-separated)</label>
                        <input type="text" placeholder="AI, RAG, Next.js, FastAPI" value={blogForm.tags} onChange={(e) => setBlogForm((prev) => ({ ...prev, tags: e.target.value }))} style={inputStyle} />
                      </div>
                    </div>

                    <div style={{ marginBottom: 16 }}>
                      <label style={labelStyle}>Article Excerpt / Lead Paragraph</label>
                      <textarea rows={2} placeholder="Hook your audience with an insightful lead summary..." value={blogForm.excerpt} onChange={(e) => setBlogForm((prev) => ({ ...prev, excerpt: e.target.value }))} style={{ ...inputStyle, resize: 'vertical' }} />
                    </div>

                    {/* Toolbar */}
                    <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        <button type="button" onClick={() => insertBlogTag('<h2>', '</h2>')} className="editor-toolbar-btn">H2</button>
                        <button type="button" onClick={() => insertBlogTag('<h3>', '</h3>')} className="editor-toolbar-btn">H3</button>
                        <button type="button" onClick={() => insertBlogTag('<strong>', '</strong>')} className="editor-toolbar-btn">Bold</button>
                        <button type="button" onClick={() => insertBlogTag('<em>', '</em>')} className="editor-toolbar-btn">Italic</button>
                        <button type="button" onClick={() => insertBlogTag('<blockquote>', '</blockquote>')} className="editor-toolbar-btn">Quote</button>
                        <button type="button" onClick={() => insertBlogTag('<pre><code>', '</code></pre>')} className="editor-toolbar-btn">Code Block</button>
                        <button type="button" onClick={() => insertBlogTag('<ul>\n  <li>', '</li>\n</ul>')} className="editor-toolbar-btn">Bullets</button>
                      </div>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button type="button" onClick={() => setBlogActiveTab('editor')} style={{ fontSize: 11, padding: '4px 10px', borderRadius: 6, background: blogActiveTab === 'editor' ? 'var(--accent)' : 'var(--bg-elevated)', color: blogActiveTab === 'editor' ? '#fff' : 'var(--text-muted)', border: 'none', cursor: 'pointer' }}>Editor</button>
                        <button type="button" onClick={() => setBlogActiveTab('preview')} style={{ fontSize: 11, padding: '4px 10px', borderRadius: 6, background: blogActiveTab === 'preview' ? 'var(--accent)' : 'var(--bg-elevated)', color: blogActiveTab === 'preview' ? '#fff' : 'var(--text-muted)', border: 'none', cursor: 'pointer' }}>Preview</button>
                      </div>
                    </div>

                    {blogActiveTab === 'editor' ? (
                      <div style={{ marginBottom: 18 }}>
                        <textarea
                          rows={14}
                          value={blogForm.content}
                          onChange={(e) => setBlogForm((prev) => ({ ...prev, content: e.target.value }))}
                          style={{ ...inputStyle, fontFamily: 'monospace', fontSize: 13, resize: 'vertical' }}
                          required
                        />
                      </div>
                    ) : (
                      <div style={{ marginBottom: 18, background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 12, padding: 24 }}>
                        <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, background: 'var(--accent-glow)', color: 'var(--accent)', fontWeight: 600 }}>{blogForm.category}</span>
                        <h1 style={{ fontFamily: 'Space Grotesk', fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', marginTop: 8, marginBottom: 8 }}>{blogForm.title || 'Untitled Article'}</h1>
                        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>By {blogForm.author} • {blogForm.read_time}</p>
                        {blogForm.featured_image && (
                          <Image src={blogForm.featured_image} alt="" width={600} height={240} style={{ width: '100%', maxHeight: 240, objectFit: 'cover', borderRadius: 8, marginBottom: 16 }} unoptimized />
                        )}
                        <div dangerouslySetInnerHTML={{ __html: blogForm.content }} style={{ fontSize: 14, lineHeight: 1.75, color: 'var(--text-secondary)' }} />
                      </div>
                    )}

                    {/* SEO Search Result Snippet */}
                    <div style={{ background: 'var(--bg-elevated)', borderRadius: 12, padding: 18, marginBottom: 20, border: '1px solid var(--border)' }}>
                      <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Globe style={{ width: 13, height: 13 }} />
                        <span>Google Search Snippet Preview</span>
                      </p>
                      <div style={{ background: '#1c1c1c', border: '1px solid #333', borderRadius: 10, padding: '14px 16px', marginBottom: 14 }}>
                        <div style={{ fontSize: 11, color: '#9aa0a6', marginBottom: 2 }}>orbit-i.tech &gt; blog &gt; {blogForm.slug || 'article-slug'}</div>
                        <div style={{ fontSize: 16, color: '#8ab4f8', fontWeight: 600, marginBottom: 4 }}>{blogForm.seo_title || blogForm.title || 'Article Title'} | ORBIT-I Blog</div>
                        <div style={{ fontSize: 12, color: '#bdc1c6', lineHeight: 1.5 }}>
                          {blogForm.seo_description || blogForm.excerpt || 'Technical article published by ORBIT-I exploring engineering best practices.'}
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                        <div>
                          <label style={labelStyle}>SEO Title</label>
                          <input type="text" placeholder="Title for Google search..." value={blogForm.seo_title} onChange={(e) => setBlogForm((prev) => ({ ...prev, seo_title: e.target.value }))} style={inputStyle} />
                        </div>
                        <div>
                          <label style={labelStyle}>Focus Keyword</label>
                          <input type="text" placeholder="e.g. autonomous AI agents" value={blogForm.focus_keyword} onChange={(e) => setBlogForm((prev) => ({ ...prev, focus_keyword: e.target.value }))} style={inputStyle} />
                        </div>
                      </div>
                      <div style={{ marginTop: 10 }}>
                        <label style={labelStyle}>Meta Description</label>
                        <textarea rows={2} placeholder="Meta description for search engine ranking..." value={blogForm.seo_description} onChange={(e) => setBlogForm((prev) => ({ ...prev, seo_description: e.target.value }))} style={{ ...inputStyle, resize: 'vertical' }} />
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 10 }}>
                      <button type="submit" className="btn-primary" style={{ fontSize: 13, padding: '9px 20px', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        <Save style={{ width: 14, height: 14 }} />
                        <span>{blogForm.id ? 'Save Article' : 'Publish Article'}</span>
                      </button>
                      <button type="button" onClick={() => setIsEditingBlog(false)} className="btn-outline" style={{ fontSize: 13 }}>
                        Cancel
                      </button>
                    </div>
                  </SectionCard>
                ) : (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, gap: 12, flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {['ALL', 'Artificial Intelligence', 'Web Engineering', 'Data Science', 'Cyber Security'].map((cat) => (
                          <button
                            key={cat}
                            onClick={() => setBlogCategoryFilter(cat)}
                            style={{
                              fontSize: 11,
                              padding: '5px 12px',
                              borderRadius: 100,
                              border: '1px solid var(--border)',
                              background: blogCategoryFilter === cat ? 'var(--accent-glow)' : 'var(--bg-elevated)',
                              color: blogCategoryFilter === cat ? 'var(--accent)' : 'var(--text-muted)',
                              cursor: 'pointer',
                              fontWeight: 600,
                            }}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                        Total Articles: <strong style={{ color: 'var(--text-primary)' }}>{blogPosts.length}</strong>
                      </span>
                    </div>

                    {blogLoading ? (
                      <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Loading articles...</p>
                    ) : blogPosts.length === 0 ? (
                      <SectionCard title="No Articles Published Yet" subtitle="Start publishing tech blogs to boost organic traffic and demonstrate thought leadership.">
                        <button onClick={openNewBlog} className="btn-primary" style={{ fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                          <Plus style={{ width: 14, height: 14 }} />
                          <span>Write First Article</span>
                        </button>
                      </SectionCard>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: 16 }}>
                        {blogPosts
                          .filter((b) => blogCategoryFilter === 'ALL' || b.category === blogCategoryFilter)
                          .map((b) => (
                            <div key={b.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                              {b.featured_image && (
                                <Image src={b.featured_image} alt="" width={400} height={140} style={{ height: 140, width: '100%', objectFit: 'cover' }} unoptimized />
                              )}
                              <div style={{ padding: 18, flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                  <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, background: 'var(--accent-glow)', color: 'var(--accent)', fontWeight: 600 }}>{b.category}</span>
                                  <span className="table-badge" style={{ background: b.status === 'published' ? 'rgba(34,197,94,0.1)' : 'rgba(251,191,36,0.1)', color: b.status === 'published' ? '#22c55e' : '#fbbf24' }}>{b.status}</span>
                                </div>
                                <h4 style={{ fontFamily: 'Space Grotesk', fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8, lineHeight: 1.4 }}>{b.title}</h4>
                                <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 14, flex: 1 }}>{b.excerpt}</p>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid var(--border)', gap: 8 }}>
                                  <Link href={`/blog/${b.slug}`} target="_blank" style={{ fontSize: 12, color: 'var(--accent)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                    <span>Read</span>
                                    <ExternalLink style={{ width: 11, height: 11 }} />
                                  </Link>
                                  <div style={{ display: 'flex', gap: 6 }}>
                                    <button onClick={() => openEditBlog(b)} className="btn-outline" style={{ fontSize: 11, padding: '4px 10px', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                      <Edit3 style={{ width: 11, height: 11 }} />
                                      <span>Edit</span>
                                    </button>
                                    <button onClick={() => deleteBlogHandler(b.id)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', borderRadius: 6, padding: '4px 8px', fontSize: 11, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                      <Trash2 style={{ width: 11, height: 11 }} />
                                      <span>Delete</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            )}

            {/* ── CAREERS & JOBS (CRUD) ── */}
            {tab === 'careers' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}>Careers & Job Postings CRUD</h2>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Manage open internships, remote freelance contracts, and vacancies shown on /careers.</p>
                  </div>
                  <button onClick={openNewCareer} className="btn-primary" style={{ fontSize: 13, padding: '9px 18px', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <Plus style={{ width: 14, height: 14 }} />
                    <span>Post New Opening</span>
                  </button>
                </div>

                {isEditingCareer ? (
                  <SectionCard
                    title={careerForm.id ? `Edit Role: ${careerForm.title}` : 'Post New Career Opportunity'}
                    subtitle="Specify requirements, department, stipend/perks, and application criteria."
                    actionButton={
                      <button onClick={() => setIsEditingCareer(false)} className="btn-outline" style={{ fontSize: 12, padding: '6px 12px', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                        <X style={{ width: 13, height: 13 }} />
                        <span>Cancel</span>
                      </button>
                    }
                    onSubmit={saveCareerHandler}
                  >
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 16 }}>
                      <div>
                        <label style={labelStyle}>Job Title *</label>
                        <input
                          type="text"
                          placeholder="e.g. AI Research Intern"
                          value={careerForm.title}
                          required
                          onChange={(e) => {
                            const val = e.target.value
                            setCareerForm((prev) => ({
                              ...prev,
                              title: val,
                              slug: prev.id ? prev.slug : val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
                            }))
                          }}
                          style={inputStyle}
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>Department *</label>
                        <input type="text" placeholder="e.g. Artificial Intelligence & Data" value={careerForm.department} required onChange={(e) => setCareerForm((prev) => ({ ...prev, department: e.target.value }))} style={inputStyle} />
                      </div>
                      <div>
                        <label style={labelStyle}>Category *</label>
                        <select value={careerForm.category} onChange={(e) => setCareerForm((prev) => ({ ...prev, category: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }}>
                          <option value="internship">Remote Internship</option>
                          <option value="freelance">Freelance / Contract</option>
                          <option value="fulltime">Full-Time Direct</option>
                        </select>
                      </div>
                      <div>
                        <label style={labelStyle}>Location *</label>
                        <input type="text" placeholder="Remote (All Pakistan / Global)" value={careerForm.location} required onChange={(e) => setCareerForm((prev) => ({ ...prev, location: e.target.value }))} style={inputStyle} />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 16 }}>
                      <div>
                        <label style={labelStyle}>Openings (Seats)</label>
                        <input type="text" placeholder="e.g. 3 Seats" value={careerForm.openings} onChange={(e) => setCareerForm((prev) => ({ ...prev, openings: e.target.value }))} style={inputStyle} />
                      </div>
                      <div>
                        <label style={labelStyle}>Duration</label>
                        <input type="text" placeholder="e.g. 2 Months" value={careerForm.duration} onChange={(e) => setCareerForm((prev) => ({ ...prev, duration: e.target.value }))} style={inputStyle} />
                      </div>
                      <div>
                        <label style={labelStyle}>Compensation</label>
                        <input type="text" placeholder="Unpaid (Verifiable Certificate)" value={careerForm.compensation} onChange={(e) => setCareerForm((prev) => ({ ...prev, compensation: e.target.value }))} style={inputStyle} />
                      </div>
                      <div>
                        <label style={labelStyle}>Status</label>
                        <select value={careerForm.is_open} onChange={(e) => setCareerForm((prev) => ({ ...prev, is_open: Number(e.target.value) }))} style={{ ...inputStyle, cursor: 'pointer' }}>
                          <option value={1}>Open for Applications</option>
                          <option value={0}>Closed</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ marginBottom: 14 }}>
                      <label style={labelStyle}>Role Summary *</label>
                      <textarea rows={2} placeholder="High-level overview of the role..." value={careerForm.summary} required onChange={(e) => setCareerForm((prev) => ({ ...prev, summary: e.target.value }))} style={{ ...inputStyle, resize: 'vertical' }} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14, marginBottom: 16 }}>
                      <div>
                        <label style={labelStyle}>Key Requirements (comma or newline separated)</label>
                        <textarea rows={3} placeholder="Python, Git, basic PyTorch, 15 hrs/week" value={careerForm.requirements} onChange={(e) => setCareerForm((prev) => ({ ...prev, requirements: e.target.value }))} style={{ ...inputStyle, resize: 'vertical' }} />
                      </div>
                      <div>
                        <label style={labelStyle}>Responsibilities</label>
                        <textarea rows={3} placeholder="Develop prototypes, benchmark models, write API endpoints" value={careerForm.responsibilities} onChange={(e) => setCareerForm((prev) => ({ ...prev, responsibilities: e.target.value }))} style={{ ...inputStyle, resize: 'vertical' }} />
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 10 }}>
                      <button type="submit" className="btn-primary" style={{ fontSize: 13, padding: '9px 20px', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        <Save style={{ width: 14, height: 14 }} />
                        <span>{careerForm.id ? 'Save Job Posting' : 'Post Opening'}</span>
                      </button>
                      <button type="button" onClick={() => setIsEditingCareer(false)} className="btn-outline" style={{ fontSize: 13 }}>
                        Cancel
                      </button>
                    </div>
                  </SectionCard>
                ) : (
                  <>
                    {careerLoading ? (
                      <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Loading career postings...</p>
                    ) : careerJobs.length === 0 ? (
                      <SectionCard title="No Postings Available" subtitle="Create your first role to begin accepting applications.">
                        <button onClick={openNewCareer} className="btn-primary" style={{ fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                          <Plus style={{ width: 14, height: 14 }} />
                          <span>Post Opening</span>
                        </button>
                      </SectionCard>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {careerJobs.map((j) => (
                          <div key={j.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                <h4 style={{ fontFamily: 'Space Grotesk', fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{j.title}</h4>
                                <span className="table-badge" style={{ background: j.is_open ? 'rgba(34,197,94,0.1)' : 'rgba(156,163,175,0.1)', color: j.is_open ? '#22c55e' : '#9ca3af' }}>
                                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: j.is_open ? '#22c55e' : '#9ca3af' }} />
                                  {j.is_open ? 'Open' : 'Closed'}
                                </span>
                                <span style={{ fontSize: 10, background: 'var(--bg-elevated)', color: 'var(--accent)', padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}>
                                  {j.category?.toUpperCase()}
                                </span>
                              </div>
                              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                                {j.department} · {j.location} · {j.openings || 'Active'} · {j.duration}
                              </p>
                              {j.summary && <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4, maxWidth: 650 }}>{j.summary}</p>}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <button onClick={() => toggleJobOpen(j)} className="btn-outline" style={{ fontSize: 11, padding: '6px 12px' }}>
                                {j.is_open ? 'Close' : 'Reopen'}
                              </button>
                              <button onClick={() => openEditCareer(j)} className="btn-outline" style={{ fontSize: 11, padding: '6px 12px', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                <Edit3 style={{ width: 11, height: 11 }} />
                                <span>Edit</span>
                              </button>
                              <button onClick={() => deleteCareerHandler(j.id)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', borderRadius: 8, padding: '6px 10px', fontSize: 11, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                <Trash2 style={{ width: 11, height: 11 }} />
                                <span>Delete</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            )}

            {/* ── TEAM PROFILES (CRUD) ── */}
            {tab === 'teams' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}>Team Profiles Management</h2>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Showcase executive leadership, architects, AI researchers, and engineers.</p>
                  </div>
                  <button onClick={openNewTeam} className="btn-primary" style={{ fontSize: 13, padding: '9px 18px', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <Plus style={{ width: 14, height: 14 }} />
                    <span>Add Member</span>
                  </button>
                </div>

                {isEditingTeam ? (
                  <SectionCard
                    title={teamForm.id ? `Edit Member: ${teamForm.name}` : 'Add New Team Member'}
                    subtitle="Set designation, department, bio, social links, and display order."
                    actionButton={
                      <button onClick={() => setIsEditingTeam(false)} className="btn-outline" style={{ fontSize: 12, padding: '6px 12px', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                        <X style={{ width: 13, height: 13 }} />
                        <span>Cancel</span>
                      </button>
                    }
                    onSubmit={saveTeamHandler}
                  >
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 16 }}>
                      <div>
                        <label style={labelStyle}>Full Name *</label>
                        <input type="text" placeholder="e.g. Abdul Samad" value={teamForm.name} required onChange={(e) => setTeamForm((prev) => ({ ...prev, name: e.target.value }))} style={inputStyle} />
                      </div>
                      <div>
                        <label style={labelStyle}>Designation *</label>
                        <input type="text" placeholder="e.g. Founder & CEO" value={teamForm.designation} required onChange={(e) => setTeamForm((prev) => ({ ...prev, designation: e.target.value }))} style={inputStyle} />
                      </div>
                      <div>
                        <label style={labelStyle}>Department</label>
                        <select value={teamForm.department} onChange={(e) => setTeamForm((prev) => ({ ...prev, department: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }}>
                          <option value="Leadership">Leadership</option>
                          <option value="Operations & Strategy">Operations & Strategy</option>
                          <option value="AI & Data Science">AI & Data Science</option>
                          <option value="Web Engineering">Web Engineering</option>
                          <option value="Cyber Security">Cyber Security</option>
                        </select>
                      </div>
                      <div>
                        <label style={labelStyle}>Display Order</label>
                        <input type="number" min="0" value={teamForm.order_index} onChange={(e) => setTeamForm((prev) => ({ ...prev, order_index: Number(e.target.value) }))} style={inputStyle} />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 16 }}>
                      <div>
                        <label style={labelStyle}>Avatar Image URL</label>
                        <input type="text" placeholder="/orbitlogo-removebg-preview.png" value={teamForm.avatar_url} onChange={(e) => setTeamForm((prev) => ({ ...prev, avatar_url: e.target.value }))} style={inputStyle} />
                      </div>
                      <div>
                        <label style={labelStyle}>LinkedIn URL</label>
                        <input type="text" placeholder="https://linkedin.com/in/..." value={teamForm.linkedin_url} onChange={(e) => setTeamForm((prev) => ({ ...prev, linkedin_url: e.target.value }))} style={inputStyle} />
                      </div>
                      <div>
                        <label style={labelStyle}>GitHub URL</label>
                        <input type="text" placeholder="https://github.com/..." value={teamForm.github_url} onChange={(e) => setTeamForm((prev) => ({ ...prev, github_url: e.target.value }))} style={inputStyle} />
                      </div>
                      <div>
                        <label style={labelStyle}>Skills (comma-separated)</label>
                        <input type="text" placeholder="PyTorch, Next.js, Cloud" value={teamForm.skills} onChange={(e) => setTeamForm((prev) => ({ ...prev, skills: e.target.value }))} style={inputStyle} />
                      </div>
                    </div>

                    <div style={{ marginBottom: 16 }}>
                      <label style={labelStyle}>Professional Bio</label>
                      <textarea rows={3} placeholder="Background, achievements, and technical focus..." value={teamForm.bio} onChange={(e) => setTeamForm((prev) => ({ ...prev, bio: e.target.value }))} style={{ ...inputStyle, resize: 'vertical' }} />
                    </div>

                    <div style={{ display: 'flex', gap: 10 }}>
                      <button type="submit" className="btn-primary" style={{ fontSize: 13, padding: '9px 20px', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        <Save style={{ width: 14, height: 14 }} />
                        <span>{teamForm.id ? 'Save Member' : 'Add Member'}</span>
                      </button>
                      <button type="button" onClick={() => setIsEditingTeam(false)} className="btn-outline" style={{ fontSize: 13 }}>
                        Cancel
                      </button>
                    </div>
                  </SectionCard>
                ) : (
                  <>
                    {teamLoading ? (
                      <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Loading team profiles...</p>
                    ) : teamMembers.length === 0 ? (
                      <SectionCard title="No Team Profiles" subtitle="Add your leadership and engineering team profiles.">
                        <button onClick={openNewTeam} className="btn-primary" style={{ fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                          <Plus style={{ width: 14, height: 14 }} />
                          <span>Add Member</span>
                        </button>
                      </SectionCard>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                        {teamMembers.map((m) => (
                          <div key={m.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                              <Image src={m.avatar_url || '/orbitlogo-removebg-preview.png'} alt="" width={48} height={48} style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', background: 'var(--bg-elevated)', border: '1px solid var(--border)' }} unoptimized />
                              <div>
                                <h4 style={{ fontFamily: 'Space Grotesk', fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{m.name}</h4>
                                <p style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600 }}>{m.designation}</p>
                                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{m.department}</span>
                              </div>
                            </div>
                            {m.bio && <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 12, flex: 1 }}>{m.bio}</p>}
                            {m.skills && (
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
                                {m.skills.split(',').map((s) => (
                                  <span key={s} style={{ fontSize: 10, background: 'var(--bg-elevated)', color: 'var(--text-muted)', padding: '2px 6px', borderRadius: 4 }}>
                                    {s.trim()}
                                  </span>
                                ))}
                              </div>
                            )}
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6, paddingTop: 10, borderTop: '1px solid var(--border)' }}>
                              <button onClick={() => openEditTeam(m)} className="btn-outline" style={{ fontSize: 11, padding: '4px 10px', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                <Edit3 style={{ width: 11, height: 11 }} />
                                <span>Edit</span>
                              </button>
                              <button onClick={() => deleteTeamHandler(m.id)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', borderRadius: 6, padding: '4px 8px', fontSize: 11, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                <Trash2 style={{ width: 11, height: 11 }} />
                                <span>Delete</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            )}

            {/* ── TESTIMONIALS (CRUD) ── */}
            {tab === 'testimonials' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}>Client Testimonials CRUD</h2>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Manage client endorsements, verified reviews, and ratings.</p>
                  </div>
                  <button onClick={openNewTestimonial} className="btn-primary" style={{ fontSize: 13, padding: '9px 18px', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <Plus style={{ width: 14, height: 14 }} />
                    <span>Add Testimonial</span>
                  </button>
                </div>

                {isEditingTestimonial ? (
                  <SectionCard
                    title={testimonialForm.id ? 'Edit Testimonial' : 'Add Testimonial'}
                    subtitle="Client endorsement with star ratings."
                    actionButton={
                      <button onClick={() => setIsEditingTestimonial(false)} className="btn-outline" style={{ fontSize: 12, padding: '6px 12px', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                        <X style={{ width: 13, height: 13 }} />
                        <span>Cancel</span>
                      </button>
                    }
                    onSubmit={saveTestimonialHandler}
                  >
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 14 }}>
                      <div>
                        <label style={labelStyle}>Client Name *</label>
                        <input type="text" placeholder="e.g. Dr. Tariq Mahmood" value={testimonialForm.client_name} required onChange={(e) => setTestimonialForm((prev) => ({ ...prev, client_name: e.target.value }))} style={inputStyle} />
                      </div>
                      <div>
                        <label style={labelStyle}>Designation</label>
                        <input type="text" placeholder="e.g. Head of Technology" value={testimonialForm.designation} onChange={(e) => setTestimonialForm((prev) => ({ ...prev, designation: e.target.value }))} style={inputStyle} />
                      </div>
                      <div>
                        <label style={labelStyle}>Company Name</label>
                        <input type="text" placeholder="e.g. Global Tech Inc." value={testimonialForm.company} onChange={(e) => setTestimonialForm((prev) => ({ ...prev, company: e.target.value }))} style={inputStyle} />
                      </div>
                      <div>
                        <label style={labelStyle}>Rating (Stars)</label>
                        <select value={testimonialForm.rating} onChange={(e) => setTestimonialForm((prev) => ({ ...prev, rating: Number(e.target.value) }))} style={{ ...inputStyle, cursor: 'pointer' }}>
                          <option value={5}>5 Stars (Exceptional)</option>
                          <option value={4}>4 Stars (Strong)</option>
                          <option value={3}>3 Stars (Satisfactory)</option>
                        </select>
                      </div>
                    </div>
                    <div style={{ marginBottom: 16 }}>
                      <label style={labelStyle}>Testimonial Content *</label>
                      <textarea rows={3} placeholder="Client statement and feedback..." value={testimonialForm.content} required onChange={(e) => setTestimonialForm((prev) => ({ ...prev, content: e.target.value }))} style={{ ...inputStyle, resize: 'vertical' }} />
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button type="submit" className="btn-primary" style={{ fontSize: 13, padding: '9px 20px', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        <Save style={{ width: 14, height: 14 }} />
                        <span>Save Testimonial</span>
                      </button>
                      <button type="button" onClick={() => setIsEditingTestimonial(false)} className="btn-outline" style={{ fontSize: 13 }}>
                        Cancel
                      </button>
                    </div>
                  </SectionCard>
                ) : (
                  <>
                    {testimonialsLoading ? (
                      <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Loading testimonials...</p>
                    ) : testimonials.length === 0 ? (
                      <SectionCard title="No Testimonials" subtitle="Add client feedback to build high trust.">
                        <button onClick={openNewTestimonial} className="btn-primary" style={{ fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                          <Plus style={{ width: 14, height: 14 }} />
                          <span>Add Testimonial</span>
                        </button>
                      </SectionCard>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
                        {testimonials.map((t) => (
                          <div key={t.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', gap: 2, color: '#fbbf24', marginBottom: 8 }}>
                              {Array.from({ length: t.rating || 5 }).map((_, idx) => (
                                <Star key={idx} style={{ width: 13, height: 13, fill: '#fbbf24' }} />
                              ))}
                            </div>
                            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 14, fontStyle: 'italic', flex: 1 }}>
                              &ldquo;{t.content}&rdquo;
                            </p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px solid var(--border)' }}>
                              <div>
                                <h5 style={{ fontFamily: 'Space Grotesk', fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{t.client_name}</h5>
                                <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t.designation} {t.company ? `· ${t.company}` : ''}</p>
                              </div>
                              <div style={{ display: 'flex', gap: 6 }}>
                                <button onClick={() => openEditTestimonial(t)} className="btn-outline" style={{ fontSize: 10, padding: '4px 8px', display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                                  <Edit3 style={{ width: 10, height: 10 }} />
                                  <span>Edit</span>
                                </button>
                                <button onClick={() => deleteTestimonialHandler(t.id)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', borderRadius: 6, padding: '4px 8px', fontSize: 10, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                                  <Trash2 style={{ width: 10, height: 10 }} />
                                  <span>Delete</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            )}

            {/* ── INQUIRIES & CVS (LEADS) ── */}
            {tab === 'inquiries' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}>Inquiries & Career Applications</h2>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>All incoming client leads, project proposals, and candidate internship applications with CV downloads.</p>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {['ALL', 'NEW', 'CONTACTED', 'REVIEWED'].map((st) => (
                      <button
                        key={st}
                        onClick={() => setInquiryFilter(st)}
                        style={{
                          fontSize: 11,
                          padding: '6px 12px',
                          borderRadius: 8,
                          border: '1px solid var(--border)',
                          background: inquiryFilter === st ? 'var(--accent-glow)' : 'var(--bg-elevated)',
                          color: inquiryFilter === st ? 'var(--accent)' : 'var(--text-muted)',
                          cursor: 'pointer',
                          fontWeight: 600,
                        }}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {inquiriesLoading ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Loading inquiries...</p>
                ) : inquiries.length === 0 ? (
                  <SectionCard title="No Inquiries Yet" subtitle="Submissions through the website contact form or careers application modal will appear here." />
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {inquiries
                      .filter((iq) => inquiryFilter === 'ALL' || iq.status === inquiryFilter)
                      .map((iq) => {
                        const cvUrl = extractCvUrl(iq.message)
                        const isCareer = iq.service?.toLowerCase().includes('career') || Boolean(cvUrl)

                        return (
                          <div key={iq.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '18px 22px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10, marginBottom: 12 }}>
                              <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                                  <h4 style={{ fontFamily: 'Space Grotesk', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>{iq.name}</h4>
                                  <span className="table-badge" style={{ background: iq.status === 'NEW' ? 'rgba(99,102,241,0.1)' : iq.status === 'CONTACTED' ? 'rgba(34,197,94,0.1)' : 'rgba(156,163,175,0.1)', color: iq.status === 'NEW' ? '#6366f1' : iq.status === 'CONTACTED' ? '#22c55e' : '#9ca3af' }}>
                                    {iq.status}
                                  </span>
                                  <span style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                    {isCareer ? <Briefcase style={{ width: 12, height: 12 }} /> : <Mail style={{ width: 12, height: 12 }} />}
                                    <span>{iq.service || 'General Inquiry'}</span>
                                  </span>
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                    <Mail style={{ width: 12, height: 12 }} /> {iq.email}
                                  </span>
                                  {iq.company && (
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                      <Building2 style={{ width: 12, height: 12 }} /> {iq.company}
                                    </span>
                                  )}
                                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                    <Calendar style={{ width: 12, height: 12 }} /> {new Date(iq.created_at).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>

                              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                {cvUrl && (
                                  <a href={cvUrl} target="_blank" rel="noopener noreferrer" download className="cv-download-btn">
                                    <FileDown style={{ width: 14, height: 14 }} />
                                    <span>Download CV</span>
                                  </a>
                                )}
                                {iq.status !== 'CONTACTED' && (
                                  <button onClick={() => markInquiryStatus(iq.id, 'CONTACTED')} className="btn-outline" style={{ fontSize: 11, padding: '5px 10px', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                    <Check style={{ width: 12, height: 12 }} />
                                    <span>Mark Contacted</span>
                                  </button>
                                )}
                                {iq.status !== 'REVIEWED' && (
                                  <button onClick={() => markInquiryStatus(iq.id, 'REVIEWED')} className="btn-outline" style={{ fontSize: 11, padding: '5px 10px', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                    <CheckCircle2 style={{ width: 12, height: 12 }} />
                                    <span>Mark Reviewed</span>
                                  </button>
                                )}
                                <button onClick={() => deleteInquiryHandler(iq.id)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', borderRadius: 6, padding: '5px 8px', fontSize: 11, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                  <Trash2 style={{ width: 12, height: 12 }} />
                                  <span>Delete</span>
                                </button>
                              </div>
                            </div>

                            <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 16px', fontSize: 13, lineHeight: 1.6, color: 'var(--text-secondary)', whiteSpace: 'pre-line' }}>
                              {iq.message}
                            </div>
                          </div>
                        )
                      })}
                  </div>
                )}
              </motion.div>
            )}

            {/* ── SERVICES & LOCAL SEO ── */}
            {tab === 'services' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>
                      Services & Local SEO Management
                    </h2>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                      Control service content, meta tags, and local search dominance for Nawabshah, Karachi, and Hyderabad.
                    </p>
                  </div>
                </div>

                {isEditingService ? (
                  <SectionCard
                    title={`Editing Service: ${serviceForm.title || serviceForm.slug}`}
                    subtitle="Update production titles, deliverables, metadata, and local search radius"
                    actionButton={
                      <button onClick={() => setIsEditingService(false)} className="btn-outline" style={{ fontSize: 12, padding: '6px 14px' }}>
                        Cancel
                      </button>
                    }
                    onSubmit={saveServiceHandler}
                  >
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14, marginBottom: 14 }}>
                      <div>
                        <label style={labelStyle}>Service Title *</label>
                        <input
                          type="text" required value={serviceForm.title}
                          onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                          style={inputStyle}
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>Category</label>
                        <input
                          type="text" value={serviceForm.category}
                          onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}
                          style={inputStyle}
                        />
                      </div>
                    </div>

                    <div style={{ marginBottom: 14 }}>
                      <label style={labelStyle}>Short Overview Description</label>
                      <textarea
                        rows={3} value={serviceForm.shortDesc}
                        onChange={(e) => setServiceForm({ ...serviceForm, shortDesc: e.target.value })}
                        style={{ ...inputStyle, resize: 'vertical' }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14, marginBottom: 14 }}>
                      <div>
                        <label style={labelStyle}>SEO Meta Title (Title Tag)</label>
                        <input
                          type="text" value={serviceForm.metaTitle}
                          onChange={(e) => setServiceForm({ ...serviceForm, metaTitle: e.target.value })}
                          style={inputStyle}
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>SEO Focus Keywords (comma-separated)</label>
                        <input
                          type="text" value={serviceForm.keywords}
                          placeholder="e.g. AI company Nawabshah, machine learning Karachi, IT solutions Hyderabad"
                          onChange={(e) => setServiceForm({ ...serviceForm, keywords: e.target.value })}
                          style={inputStyle}
                        />
                      </div>
                    </div>

                    <div style={{ marginBottom: 14 }}>
                      <label style={labelStyle}>SEO Meta Description</label>
                      <textarea
                        rows={2} value={serviceForm.metaDesc}
                        onChange={(e) => setServiceForm({ ...serviceForm, metaDesc: e.target.value })}
                        style={{ ...inputStyle, resize: 'vertical' }}
                      />
                    </div>

                    <div style={{ marginBottom: 14 }}>
                      <label style={labelStyle}>Target Cities & Regional Coverage (comma-separated)</label>
                      <input
                        type="text" value={serviceForm.citiesCovered}
                        placeholder="Nawabshah, Karachi, Hyderabad, Sukkur, Lahore, Islamabad, Global"
                        onChange={(e) => setServiceForm({ ...serviceForm, citiesCovered: e.target.value })}
                        style={inputStyle}
                      />
                    </div>

                    <div style={{ marginBottom: 18 }}>
                      <label style={labelStyle}>Technical Architecture Blueprint</label>
                      <textarea
                        rows={3} value={serviceForm.architecture}
                        onChange={(e) => setServiceForm({ ...serviceForm, architecture: e.target.value })}
                        style={{ ...inputStyle, resize: 'vertical' }}
                      />
                    </div>

                    <button type="submit" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, padding: '10px 20px' }}>
                      <Save style={{ width: 14, height: 14 }} />
                      <span>Save Service & Update Live SEO</span>
                    </button>
                  </SectionCard>
                ) : servicesLoading ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Loading services...</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {services.map((s) => (
                      <div key={s.slug} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '18px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
                        <div style={{ flex: 1, minWidth: 260 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                            <span style={{ fontSize: 10, padding: '2px 8px', background: 'var(--accent-glow)', border: '1px solid var(--border-hover)', borderRadius: 100, color: 'var(--accent)', fontWeight: 700 }}>
                              {s.category || 'Enterprise'}
                            </span>
                            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>/services/{s.slug}</span>
                          </div>
                          <h4 style={{ fontFamily: 'Space Grotesk', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
                            {s.title}
                          </h4>
                          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, maxWidth: 640 }}>
                            {s.shortDesc}
                          </p>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                            {(Array.isArray(s.citiesCovered) ? s.citiesCovered : []).slice(0, 4).map((c) => (
                              <span key={c} style={{ fontSize: 10, padding: '2px 7px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 100, color: 'var(--text-muted)' }}>
                                {c}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: 8 }}>
                          <Link href={`/services/${s.slug}`} target="_blank" className="btn-outline" style={{ fontSize: 12, padding: '7px 12px', display: 'inline-flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
                            <ExternalLink style={{ width: 12, height: 12 }} />
                            <span>Preview Page</span>
                          </Link>
                          <button onClick={() => openEditService(s)} className="btn-primary" style={{ fontSize: 12, padding: '7px 14px', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                            <Edit3 style={{ width: 12, height: 12 }} />
                            <span>Edit Service & SEO</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* ── CYBER SHIELD & SECURITY TELEMETRY ── */}
            {tab === 'security' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Shield style={{ width: 20, height: 20, color: '#22c55e' }} />
                      Cyber Shield & WAF Telemetry
                    </h2>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                      Real-time threat interception (SQL Injection, XSS, RCE, Reverse Shells, Path Traversal) and rate limiter status.
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={fetchSecurityStats} className="btn-outline" style={{ fontSize: 12, padding: '6px 12px', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                      <RefreshCw style={{ width: 12, height: 12 }} /> Refresh
                    </button>
                    <button onClick={handleClearCache} className="btn-outline" style={{ fontSize: 12, padding: '6px 12px', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                      <Zap style={{ width: 12, height: 12, color: '#f59e0b' }} /> Flush Cache
                    </button>
                    <button onClick={() => handleUnbanIp('ALL')} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#ef4444', borderRadius: 8, padding: '6px 12px', fontSize: 12, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                      Unban All IPs
                    </button>
                  </div>
                </div>

                {/* Telemetry Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 24 }}>
                  <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: 18 }}>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Cyber Shield Status</span>
                    <div style={{ fontFamily: 'Space Grotesk', fontSize: 22, fontWeight: 800, color: '#22c55e', marginTop: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Shield size={18} /> ACTIVE & LOCKED
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, display: 'block' }}>Deep inspection of all payloads</span>
                  </div>

                  <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: 18 }}>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Blocked Attacks</span>
                    <div style={{ fontFamily: 'Space Grotesk', fontSize: 22, fontWeight: 800, color: '#ef4444', marginTop: 6 }}>
                      {securityStats?.shield?.totalLoggedThreats ?? 0}
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, display: 'block' }}>SQLi, XSS, RCE & Path Traversal</span>
                  </div>

                  <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: 18 }}>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Active IP Restrictions</span>
                    <div style={{ fontFamily: 'Space Grotesk', fontSize: 22, fontWeight: 800, color: '#f59e0b', marginTop: 6 }}>
                      {securityStats?.shield?.activeBannedIps ?? 0}
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, display: 'block' }}>Rate-limited abusive IPs</span>
                  </div>

                  <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: 18 }}>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Balance Loader Cache</span>
                    <div style={{ fontFamily: 'Space Grotesk', fontSize: 22, fontWeight: 800, color: 'var(--accent)', marginTop: 6 }}>
                      {securityStats?.cache?.hitRate ?? '100%'}
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, display: 'block' }}>Sub-2ms response speed</span>
                  </div>
                </div>

                {/* Threat Logs Table */}
                <SectionCard
                  title="Live Cyber Defense Incident Log"
                  subtitle="Latest blocked intrusion and vulnerability probing attempts"
                >
                  {(!securityStats?.shield?.recentThreats || securityStats.shield.recentThreats.length === 0) ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: 13, padding: '16px 0' }}>
                      No hostile intrusions detected. Cyber Shield is actively inspecting all traffic.
                    </p>
                  ) : (
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left', color: 'var(--text-muted)', fontSize: 11 }}>
                            <th style={{ padding: '8px 10px' }}>TIMESTAMP</th>
                            <th style={{ padding: '8px 10px' }}>ORIGIN IP</th>
                            <th style={{ padding: '8px 10px' }}>ATTACK VECTOR</th>
                            <th style={{ padding: '8px 10px' }}>BLOCKED PAYLOAD SAMPLE</th>
                            <th style={{ padding: '8px 10px' }}>DEFENSE ACTION</th>
                          </tr>
                        </thead>
                        <tbody>
                          {securityStats.shield.recentThreats.map((t) => (
                            <tr key={t.id} style={{ borderBottom: '1px solid var(--border)' }}>
                              <td style={{ padding: '10px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                                {new Date(t.timestamp).toLocaleTimeString()}
                              </td>
                              <td style={{ padding: '10px', fontFamily: 'monospace', color: 'var(--accent)' }}>
                                {t.ip}
                              </td>
                              <td style={{ padding: '10px' }}>
                                <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: 'rgba(239,68,68,0.1)', color: '#ef4444', fontWeight: 700 }}>
                                  {t.attackType}
                                </span>
                              </td>
                              <td style={{ padding: '10px', color: 'var(--text-secondary)', fontFamily: 'monospace', fontSize: 11, maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {t.snippet}
                              </td>
                              <td style={{ padding: '10px', color: '#22c55e', fontWeight: 600 }}>
                                403 FORBIDDEN & BANNED
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </SectionCard>
              </motion.div>
            )}

            {/* ── SUPERADMIN MASTER ACCOUNT SETTINGS ── */}
            {tab === 'account' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20 }}>
                  SuperAdmin Master Account Settings
                </h2>

                <SectionCard
                  title="Update Administrator Credentials"
                  subtitle="Change your master email address, display name, or update your password."
                  onSubmit={handleUpdateAccount}
                >
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 16 }}>
                    <div>
                      <label style={labelStyle}>SuperAdmin Display Name</label>
                      <input
                        type="text" required value={accountForm.name}
                        onChange={(e) => setAccountForm({ ...accountForm, name: e.target.value })}
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Master Email Address</label>
                      <input
                        type="email" required value={accountForm.email}
                        onChange={(e) => setAccountForm({ ...accountForm, email: e.target.value })}
                        style={inputStyle}
                      />
                    </div>
                  </div>

                  <div style={{ padding: '16px', background: 'var(--bg-elevated)', borderRadius: 12, border: '1px solid var(--border)', marginBottom: 18 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: 12 }}>
                      Change Master Password (Optional)
                    </span>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                      <div>
                        <label style={labelStyle}>Current Password</label>
                        <input
                          type="password" placeholder="Verify current password"
                          value={accountForm.currentPassword}
                          onChange={(e) => setAccountForm({ ...accountForm, currentPassword: e.target.value })}
                          style={inputStyle}
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>New Master Password</label>
                        <input
                          type="password" placeholder="Minimum 8 characters"
                          value={accountForm.newPassword}
                          onChange={(e) => setAccountForm({ ...accountForm, newPassword: e.target.value })}
                          style={inputStyle}
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>Confirm New Password</label>
                        <input
                          type="password" placeholder="Repeat new password"
                          value={accountForm.confirmPassword}
                          onChange={(e) => setAccountForm({ ...accountForm, confirmPassword: e.target.value })}
                          style={inputStyle}
                        />
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, padding: '10px 22px' }}>
                    <Save style={{ width: 14, height: 14 }} />
                    <span>Save Master Credentials</span>
                  </button>
                </SectionCard>
              </motion.div>
            )}
          </main>
        </div>
      </div>
    </>
  )
}
