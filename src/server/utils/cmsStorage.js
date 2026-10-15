const fs = require('fs');
const path = require('path');
const { pool } = require('../config/db');

const FALLBACK_FILE = path.join(process.cwd(), 'src', 'data', 'cmsStorageFallback.json');

// Default starter data
const DEFAULT_STORE = {
  cms_pages: [
    {
      id: 1,
      title: 'Enterprise Architecture & Cloud Standards',
      slug: 'enterprise-architecture-standards',
      content_html: '<h2>Enterprise Architecture & Cloud Governance</h2><p>ORBIT-I adheres to zero-trust cloud topologies, high-throughput microservices, and VPC-isolated model deployments. Our engineering practices guarantee sub-second latency and 99.99% uptime for mission-critical client workloads.</p><h3>Core Principles</h3><ul><li>Stateless API tiers with Redis caching</li><li>PostgreSQL / MySQL with connection pooling</li><li>End-to-end TLS 1.3 encryption and automated certificate rotation</li></ul>',
      excerpt: 'Comprehensive architectural blueprints and cloud standards for ORBIT-I enterprise software deployments.',
      status: 'published',
      meta_title: 'Enterprise Architecture & Cloud Standards | ORBIT-I',
      meta_description: 'Official enterprise architectural blueprints, zero-trust cloud security standards, and SLA guarantees.',
      keywords: 'enterprise architecture, cloud standards, zero trust, microservices, Pakistan software house',
      schema_type: 'TechArticle',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 2,
      title: 'Information Security & Data Protection Policy',
      slug: 'security-policy',
      content_html: '<h2>Information Security & Client Data Protection</h2><p>At ORBIT-I, we protect proprietary IP, confidential datasets, and customer credentials with military-grade AES-256 encryption at rest and TLS 1.3 in transit.</p><h3>Data Governance</h3><p>We enforce strict role-based access control (RBAC), multi-factor authorization, and continuous audit trails for every project repository.</p>',
      excerpt: 'Our security framework guarantees data isolation, encryption standards, and compliance across all client projects.',
      status: 'published',
      meta_title: 'Information Security Policy | ORBIT-I',
      meta_description: 'Strict enterprise data protection, AES-256 encryption, and client confidentiality policies.',
      keywords: 'data security, privacy, enterprise encryption, compliance',
      schema_type: 'WebPage',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 3,
      title: 'Privacy Policy & Terms of Service',
      slug: 'privacy-terms',
      content_html: '<h2>Privacy Policy</h2><p>ORBIT-I respects client and candidate privacy. We do not sell, rent, or share proprietary data with third parties. All submissions via our website portal are strictly confidential and governed by non-disclosure protocols.</p>',
      excerpt: 'Official privacy commitments and website terms of service for ORBIT-I Private Limited.',
      status: 'published',
      meta_title: 'Privacy Policy & Terms | ORBIT-I',
      meta_description: 'Official privacy terms and conditions governing the ORBIT-I website and portal.',
      keywords: 'privacy policy, terms of service, legal',
      schema_type: 'WebPage',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  blog_posts: [
    {
      id: 1,
      title: 'Building Autonomous Enterprise AI Agents with Next.js & FastAPI',
      slug: 'building-autonomous-ai-agents',
      excerpt: 'How modern enterprises in 2026 are replacing rigid workflow engines with autonomous multi-step reasoning agents that interact with ERP databases.',
      content: '<h2>The Shift Towards Autonomous Execution</h2><p>Traditional chatbots simply return textual completions. Modern AI agents, however, are capable of reasoning, decomposing high-level directives into discrete tool invocations, querying internal database schemas, and executing verified mutations.</p><h3>Architectural Foundations</h3><p>By pairing Next.js App Router for high-density reactive user interfaces with a FastAPI Python gateway running LangGraph or custom tool routers, organizations achieve sub-second execution loops with rigorous safety guardrails.</p><blockquote>"Autonomy without observability is a liability. Every tool invocation must be verified, idempotent, and tracked in audit ledgers."</blockquote><h3>Key Takeaways</h3><ul><li>Isolate reasoning LLMs from direct execution environments using VPC endpoints.</li><li>Always employ strict JSON schema validation for tool input arguments.</li><li>Implement human-in-the-loop approvals for sensitive write actions.</li></ul>',
      category: 'Artificial Intelligence',
      tags: 'AI, LLM, Autonomous Agents, Next.js, FastAPI',
      author: 'ORBIT-I AI Research Team',
      featured_image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      read_time: '6 min read',
      status: 'published',
      seo_title: 'Building Autonomous Enterprise AI Agents | ORBIT-I Blog',
      seo_description: 'Explore the modern architecture of autonomous AI agents using Next.js and FastAPI for enterprise operational intelligence.',
      focus_keyword: 'autonomous AI agents Next.js',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 2,
      title: 'Why RAG Replaces Traditional Search in Enterprise Systems',
      slug: 'why-rag-replaces-traditional-search',
      excerpt: 'Retrieval-Augmented Generation (RAG) combined with hybrid semantic re-ranking is redefining enterprise document discovery and knowledge synthesis.',
      content: '<h2>Beyond Keyword Inverted Indexes</h2><p>Keyword-based search engines fail when domain terminologies diverge. RAG couples high-dimensional vector embeddings with dense lexical matching, returning synthesised answers grounded in your organization’s exact policy documents and codebases.</p><h3>Zero Hallucination Protocols</h3><p>By enforcing citation mapping where every generated sentence is grounded in specific retrieved chunks, hallucinations drop below 0.1% in production testing.</p>',
      category: 'Data Science',
      tags: 'RAG, Vector Database, pgvector, Search, Enterprise AI',
      author: 'ORBIT-I Engineering',
      featured_image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1200&q=80',
      read_time: '5 min read',
      status: 'published',
      seo_title: 'Why RAG Replaces Search | ORBIT-I Research',
      seo_description: 'Learn how Retrieval-Augmented Generation eliminates hallucinations and provides semantic answers in enterprise repositories.',
      focus_keyword: 'enterprise RAG systems',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  careers_jobs: [
    {
      id: 1,
      slug: 'ai-ml-intern',
      title: 'AI & Machine Learning Research Intern',
      department: 'Artificial Intelligence & Data',
      category: 'internship',
      location: 'Remote (All Pakistan / Global)',
      type: 'Internship',
      mode: '100% Remote',
      duration: '2 Months',
      openings: '3 Seats',
      compensation: 'Unpaid (Verifiable Certificate & LOR)',
      experience: 'Fresh / Students / Self-Taught',
      summary: 'Join our AI engineering group to develop and evaluate production-ready Large Language Models, RAG pipelines, and intelligent computer vision workflows.',
      requirements: 'Python, NumPy, Pandas, Basic PyTorch or TensorFlow, Git version control, 15-20 hours/week commitment',
      responsibilities: 'Assist in prototyping LLM pipelines, benchmark open-source models (Llama 3, Mistral), integrate AI API endpoints into web clients',
      perks: 'Official Verifiable Certificate, Letter of Recommendation, Direct mentorship from senior engineers',
      is_open: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 2,
      slug: 'web-dev-intern',
      title: 'Full-Stack Web Development Intern',
      department: 'Web Engineering',
      category: 'internship',
      location: 'Remote (All Pakistan / Global)',
      type: 'Internship',
      mode: '100% Remote',
      duration: '2 Months',
      openings: '4 Seats',
      compensation: 'Unpaid (Verifiable Certificate & LOR)',
      experience: 'Fresh / Students / Self-Taught',
      summary: 'Build high-performance, responsive web applications using modern JavaScript/TypeScript frameworks including Next.js, React, Node.js, and SQL databases.',
      requirements: 'JavaScript (ES6+), HTML5, CSS3, React or Next.js basics, Node.js/Express, Git',
      responsibilities: 'Develop reactive web interfaces, assist with backend REST APIs, implement authentication flows and responsive CSS layouts',
      perks: 'Verifiable Digital Certificate, Performance LOR, Fast-track to paid freelance projects',
      is_open: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 3,
      slug: 'cyber-security-intern',
      title: 'Cyber Security & Penetration Testing Intern',
      department: 'Security & Infrastructure',
      category: 'internship',
      location: 'Remote (All Pakistan / Global)',
      type: 'Internship',
      mode: '100% Remote',
      duration: '2 Months',
      openings: '2 Seats',
      compensation: 'Unpaid (Verifiable Certificate & LOR)',
      experience: 'Fresh / Students with ethical hacking background',
      summary: 'Participate in security assessments, OWASP vulnerability scanning, defensive API hardening, and secure coding audits.',
      requirements: 'Networking fundamentals (TCP/IP, DNS, TLS), Linux CLI, Web vulnerabilities (OWASP Top 10), Burp Suite or Nmap basics',
      responsibilities: 'Conduct vulnerability assessments, write security disclosure reports, assist in auditing authorization logic and cryptographic controls',
      perks: 'Official Certificate of Cybersecurity Internship, Direct guidance from security specialists',
      is_open: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  team_members: [
    {
      id: 1,
      name: 'Abdul Samad',
      designation: 'Founder & Chief Executive Officer',
      department: 'Leadership',
      bio: 'Visionary technologist and systems architect leading enterprise software, AI engineering, and technology strategy across Pakistan and international markets.',
      avatar_url: '/orbitlogo-removebg-preview.png',
      skills: 'System Architecture, AI Systems, Enterprise Strategy, Cloud Infrastructure',
      linkedin_url: 'https://linkedin.com',
      github_url: 'https://github.com',
      order_index: 1,
      is_published: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      name: 'Engr. M. Waleed',
      designation: 'Co-Founder & Chief Operating Officer',
      department: 'Operations & Strategy',
      bio: 'Operations and engineering leader managing client delivery pipelines, compliance, organizational scaling, and strategic partnerships.',
      avatar_url: '/orbitlogo-removebg-preview.png',
      skills: 'Operations, Strategic Planning, Agile Delivery, Team Leadership',
      linkedin_url: 'https://linkedin.com',
      github_url: 'https://github.com',
      order_index: 2,
      is_published: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: 3,
      name: 'Lead AI Engineer',
      designation: 'Head of Artificial Intelligence',
      department: 'AI & Data Science',
      bio: 'Specialist in deep neural architectures, LangChain / LlamaIndex workflows, vector databases, and domain fine-tuning.',
      avatar_url: '/orbitlogo-removebg-preview.png',
      skills: 'PyTorch, LangChain, pgvector, LLM Fine-Tuning, FastAPIs',
      linkedin_url: 'https://linkedin.com',
      github_url: 'https://github.com',
      order_index: 3,
      is_published: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: 4,
      name: 'Senior Full-Stack Architect',
      designation: 'Lead Solutions Architect',
      department: 'Web Engineering',
      bio: 'Architecting ultra-low latency Next.js web applications, scalable REST/GraphQL APIs, and robust database layers.',
      avatar_url: '/orbitlogo-removebg-preview.png',
      skills: 'Next.js, React, Node.js, MySQL, PostgreSQL, Docker',
      linkedin_url: 'https://linkedin.com',
      github_url: 'https://github.com',
      order_index: 4,
      is_published: 1,
      created_at: new Date().toISOString(),
    },
  ],
  testimonials: [
    {
      id: 1,
      client_name: 'Dr. Tariq Mahmood',
      designation: 'Head of IT & Digital Transformation',
      company: 'Sindh Enterprise Tech Consortium',
      content: 'ORBIT-I engineered our custom AI knowledge retrieval engine within 4 weeks. Their dedication to zero data leaks and sub-second query latency was truly impressive.',
      rating: 5,
      avatar_url: '',
      is_published: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      client_name: 'Farhan Zaidi',
      designation: 'Managing Director',
      company: 'Apex Logistics & Freight',
      content: 'The web application portal built by ORBIT-I streamlined our cargo tracking and client onboarding. Highly recommended for enterprise-grade software development.',
      rating: 5,
      avatar_url: '',
      is_published: 1,
      created_at: new Date().toISOString(),
    },
  ],
  intern_certificates: [
    {
      id: 1,
      name: 'Chander Parkash',
      role: 'Backend Developer',
      department: 'Development | Software Engineering',
      duration: '2 Month',
      start_date: '2026-07-23',
      end_date: '2026-07-23',
      status: 'COMPLETED',
      certificate_code: 'ORBIT-I/INT/2026/15',
      issued_by: 'ORBIT-I Private Limited',
      created_at: new Date().toISOString(),
    },
  ],
  admin_users: [],
  site_notice: {
    enabled: false,
    message: '🚀 Admissions open for Autumn 2026 Internship Batch! Apply now.',
    type: 'HIRING',
    link_text: 'Apply Now',
    link_url: '/careers',
    updated_at: new Date().toISOString(),
  },
  hiring_banners: [
    {
      id: 1,
      title: 'We are Hiring Interns & Engineers for 2026',
      subtitle: "Join Pakistan's premier enterprise AI & full-stack development house. Remote & Hybrid options.",
      image_url: '/orbitlogo-removebg-preview.png',
      action_text: 'Explore Open Roles',
      action_url: '/careers',
      is_active: 1,
      created_at: new Date().toISOString(),
    },
  ],
  chatbot_config: {
    enabled: true,
    bot_name: 'ORBIT-I AI Assistant',
    greeting: 'Salam! Welcome to ORBIT-I. How can I assist you with our AI services, web architecture, internships, or certificate verification today?',
    contact_phone: '+92 300 0000000',
    contact_email: 'contact@orbit-i.tech',
  },
};

function readFallbackStore() {
  try {
    if (!fs.existsSync(FALLBACK_FILE)) {
      fs.mkdirSync(path.dirname(FALLBACK_FILE), { recursive: true });
      fs.writeFileSync(FALLBACK_FILE, JSON.stringify(DEFAULT_STORE, null, 2), 'utf8');
      return JSON.parse(JSON.stringify(DEFAULT_STORE));
    }
    const data = fs.readFileSync(FALLBACK_FILE, 'utf8');
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed.intern_certificates)) parsed.intern_certificates = DEFAULT_STORE.intern_certificates;
    if (!Array.isArray(parsed.admin_users)) parsed.admin_users = [];
    if (!parsed.site_notice) parsed.site_notice = DEFAULT_STORE.site_notice;
    if (!Array.isArray(parsed.hiring_banners)) parsed.hiring_banners = DEFAULT_STORE.hiring_banners;
    if (!parsed.chatbot_config) parsed.chatbot_config = DEFAULT_STORE.chatbot_config;
    return parsed;
  } catch (err) {
    console.error('Error reading fallback store:', err.message);
    return JSON.parse(JSON.stringify(DEFAULT_STORE));
  }
}

function writeFallbackStore(store) {
  try {
    fs.mkdirSync(path.dirname(FALLBACK_FILE), { recursive: true });
    fs.writeFileSync(FALLBACK_FILE, JSON.stringify(store, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing fallback store:', err.message);
  }
}

// Check if MySQL table exists and query it, otherwise fall back gracefully
async function executeDbOrFallback(queryFn, fallbackFn) {
  try {
    return await queryFn();
  } catch (err) {
    // If DB error (connection refused, table not created yet, etc.), use resilient fallback
    return fallbackFn();
  }
}

// ─── CMS PAGES ──────────────────────────────────────────────────────────────
async function getCmsPages() {
  return executeDbOrFallback(
    async () => {
      const [rows] = await pool.query('SELECT * FROM cms_pages ORDER BY updated_at DESC');
      return rows;
    },
    () => {
      const store = readFallbackStore();
      return store.cms_pages || [];
    }
  );
}

async function getCmsPageBySlug(slug) {
  return executeDbOrFallback(
    async () => {
      const [rows] = await pool.query('SELECT * FROM cms_pages WHERE slug = ?', [slug]);
      return rows[0] || null;
    },
    () => {
      const store = readFallbackStore();
      return store.cms_pages.find((p) => p.slug === slug) || null;
    }
  );
}

async function saveCmsPage(data) {
  return executeDbOrFallback(
    async () => {
      const { title, slug, content_html, excerpt, status = 'published', meta_title, meta_description, keywords, schema_type = 'WebPage' } = data;
      const [res] = await pool.query(
        `INSERT INTO cms_pages (title, slug, content_html, excerpt, status, meta_title, meta_description, keywords, schema_type)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [title, slug, content_html, excerpt || null, status, meta_title || null, meta_description || null, keywords || null, schema_type]
      );
      return { id: res.insertId, ...data };
    },
    () => {
      const store = readFallbackStore();
      const id = Date.now();
      const newPage = { id, ...data, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
      store.cms_pages.unshift(newPage);
      writeFallbackStore(store);
      return newPage;
    }
  );
}

async function updateCmsPage(id, data) {
  return executeDbOrFallback(
    async () => {
      const { title, slug, content_html, excerpt, status, meta_title, meta_description, keywords, schema_type } = data;
      await pool.query(
        `UPDATE cms_pages
         SET title = ?, slug = ?, content_html = ?, excerpt = ?, status = ?, meta_title = ?, meta_description = ?, keywords = ?, schema_type = ?
         WHERE id = ?`,
        [title, slug, content_html, excerpt || null, status, meta_title || null, meta_description || null, keywords || null, schema_type || 'WebPage', id]
      );
      return { id: Number(id), ...data };
    },
    () => {
      const store = readFallbackStore();
      const index = store.cms_pages.findIndex((p) => String(p.id) === String(id));
      if (index !== -1) {
        store.cms_pages[index] = { ...store.cms_pages[index], ...data, updated_at: new Date().toISOString() };
        writeFallbackStore(store);
        return store.cms_pages[index];
      }
      return null;
    }
  );
}

async function deleteCmsPage(id) {
  return executeDbOrFallback(
    async () => {
      await pool.query('DELETE FROM cms_pages WHERE id = ?', [id]);
      return true;
    },
    () => {
      const store = readFallbackStore();
      store.cms_pages = store.cms_pages.filter((p) => String(p.id) !== String(id));
      writeFallbackStore(store);
      return true;
    }
  );
}

// ─── BLOG POSTS ─────────────────────────────────────────────────────────────
async function getBlogPosts() {
  return executeDbOrFallback(
    async () => {
      const [rows] = await pool.query('SELECT * FROM blog_posts ORDER BY created_at DESC');
      return rows;
    },
    () => {
      const store = readFallbackStore();
      return store.blog_posts || [];
    }
  );
}

async function getBlogPostBySlug(slug) {
  return executeDbOrFallback(
    async () => {
      const [rows] = await pool.query('SELECT * FROM blog_posts WHERE slug = ?', [slug]);
      return rows[0] || null;
    },
    () => {
      const store = readFallbackStore();
      return store.blog_posts.find((p) => p.slug === slug) || null;
    }
  );
}

async function saveBlogPost(data) {
  return executeDbOrFallback(
    async () => {
      const { title, slug, excerpt, content, category = 'Engineering', tags, author = 'ORBIT-I Editorial', featured_image, read_time = '5 min read', status = 'published', seo_title, seo_description, focus_keyword } = data;
      const [res] = await pool.query(
        `INSERT INTO blog_posts (title, slug, excerpt, content, category, tags, author, featured_image, read_time, status, seo_title, seo_description, focus_keyword)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [title, slug, excerpt || null, content, category, tags || null, author, featured_image || null, read_time, status, seo_title || null, seo_description || null, focus_keyword || null]
      );
      return { id: res.insertId, ...data };
    },
    () => {
      const store = readFallbackStore();
      const id = Date.now();
      const newPost = { id, ...data, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
      store.blog_posts.unshift(newPost);
      writeFallbackStore(store);
      return newPost;
    }
  );
}

async function updateBlogPost(id, data) {
  return executeDbOrFallback(
    async () => {
      const { title, slug, excerpt, content, category, tags, author, featured_image, read_time, status, seo_title, seo_description, focus_keyword } = data;
      await pool.query(
        `UPDATE blog_posts
         SET title = ?, slug = ?, excerpt = ?, content = ?, category = ?, tags = ?, author = ?, featured_image = ?, read_time = ?, status = ?, seo_title = ?, seo_description = ?, focus_keyword = ?
         WHERE id = ?`,
        [title, slug, excerpt || null, content, category, tags || null, author, featured_image || null, read_time, status, seo_title || null, seo_description || null, focus_keyword || null, id]
      );
      return { id: Number(id), ...data };
    },
    () => {
      const store = readFallbackStore();
      const index = store.blog_posts.findIndex((p) => String(p.id) === String(id));
      if (index !== -1) {
        store.blog_posts[index] = { ...store.blog_posts[index], ...data, updated_at: new Date().toISOString() };
        writeFallbackStore(store);
        return store.blog_posts[index];
      }
      return null;
    }
  );
}

async function deleteBlogPost(id) {
  return executeDbOrFallback(
    async () => {
      await pool.query('DELETE FROM blog_posts WHERE id = ?', [id]);
      return true;
    },
    () => {
      const store = readFallbackStore();
      store.blog_posts = store.blog_posts.filter((p) => String(p.id) !== String(id));
      writeFallbackStore(store);
      return true;
    }
  );
}

// ─── CAREERS JOBS ───────────────────────────────────────────────────────────
async function getCareersJobs() {
  return executeDbOrFallback(
    async () => {
      const [rows] = await pool.query('SELECT * FROM careers_jobs ORDER BY created_at DESC');
      return rows;
    },
    () => {
      const store = readFallbackStore();
      return store.careers_jobs || [];
    }
  );
}

async function saveCareerJob(data) {
  return executeDbOrFallback(
    async () => {
      const { slug, title, department, category = 'internship', location = 'Remote', type = 'Internship', mode = '100% Remote', duration = '2 Months', openings = '3 Seats', compensation = 'Unpaid', experience = 'Fresh', summary, requirements, responsibilities, perks, is_open = 1 } = data;
      const [res] = await pool.query(
        `INSERT INTO careers_jobs (slug, title, department, category, location, type, mode, duration, openings, compensation, experience, summary, requirements, responsibilities, perks, is_open)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [slug, title, department, category, location, type, mode, duration, openings, compensation, experience, summary, requirements || '', responsibilities || '', perks || '', is_open ? 1 : 0]
      );
      return { id: res.insertId, ...data };
    },
    () => {
      const store = readFallbackStore();
      const id = Date.now();
      const newJob = { id, ...data, is_open: data.is_open ? 1 : 0, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
      store.careers_jobs.unshift(newJob);
      writeFallbackStore(store);
      return newJob;
    }
  );
}

async function updateCareerJob(id, data) {
  return executeDbOrFallback(
    async () => {
      const { slug, title, department, category, location, type, mode, duration, openings, compensation, experience, summary, requirements, responsibilities, perks, is_open } = data;
      await pool.query(
        `UPDATE careers_jobs
         SET slug = ?, title = ?, department = ?, category = ?, location = ?, type = ?, mode = ?, duration = ?, openings = ?, compensation = ?, experience = ?, summary = ?, requirements = ?, responsibilities = ?, perks = ?, is_open = ?
         WHERE id = ?`,
        [slug, title, department, category, location, type, mode, duration, openings, compensation, experience, summary, requirements || '', responsibilities || '', perks || '', is_open ? 1 : 0, id]
      );
      return { id: Number(id), ...data };
    },
    () => {
      const store = readFallbackStore();
      const index = store.careers_jobs.findIndex((j) => String(j.id) === String(id));
      if (index !== -1) {
        store.careers_jobs[index] = { ...store.careers_jobs[index], ...data, updated_at: new Date().toISOString() };
        writeFallbackStore(store);
        return store.careers_jobs[index];
      }
      return null;
    }
  );
}

async function deleteCareerJob(id) {
  return executeDbOrFallback(
    async () => {
      await pool.query('DELETE FROM careers_jobs WHERE id = ?', [id]);
      return true;
    },
    () => {
      const store = readFallbackStore();
      store.careers_jobs = store.careers_jobs.filter((j) => String(j.id) !== String(id));
      writeFallbackStore(store);
      return true;
    }
  );
}

// ─── TEAM MEMBERS ───────────────────────────────────────────────────────────
async function getTeamMembers() {
  return executeDbOrFallback(
    async () => {
      const [rows] = await pool.query('SELECT * FROM team_members ORDER BY order_index ASC, id ASC');
      return rows;
    },
    () => {
      const store = readFallbackStore();
      return store.team_members || [];
    }
  );
}

async function saveTeamMember(data) {
  return executeDbOrFallback(
    async () => {
      const { name, designation, department = 'Leadership', bio, avatar_url, skills, linkedin_url, github_url, order_index = 0, is_published = 1 } = data;
      const [res] = await pool.query(
        `INSERT INTO team_members (name, designation, department, bio, avatar_url, skills, linkedin_url, github_url, order_index, is_published)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [name, designation, department, bio || null, avatar_url || null, skills || null, linkedin_url || null, github_url || null, Number(order_index) || 0, is_published ? 1 : 0]
      );
      return { id: res.insertId, ...data };
    },
    () => {
      const store = readFallbackStore();
      const id = Date.now();
      const newMember = { id, ...data, created_at: new Date().toISOString() };
      store.team_members.push(newMember);
      writeFallbackStore(store);
      return newMember;
    }
  );
}

async function updateTeamMember(id, data) {
  return executeDbOrFallback(
    async () => {
      const { name, designation, department, bio, avatar_url, skills, linkedin_url, github_url, order_index, is_published } = data;
      await pool.query(
        `UPDATE team_members
         SET name = ?, designation = ?, department = ?, bio = ?, avatar_url = ?, skills = ?, linkedin_url = ?, github_url = ?, order_index = ?, is_published = ?
         WHERE id = ?`,
        [name, designation, department, bio || null, avatar_url || null, skills || null, linkedin_url || null, github_url || null, Number(order_index) || 0, is_published ? 1 : 0, id]
      );
      return { id: Number(id), ...data };
    },
    () => {
      const store = readFallbackStore();
      const index = store.team_members.findIndex((m) => String(m.id) === String(id));
      if (index !== -1) {
        store.team_members[index] = { ...store.team_members[index], ...data };
        writeFallbackStore(store);
        return store.team_members[index];
      }
      return null;
    }
  );
}

async function deleteTeamMember(id) {
  return executeDbOrFallback(
    async () => {
      await pool.query('DELETE FROM team_members WHERE id = ?', [id]);
      return true;
    },
    () => {
      const store = readFallbackStore();
      store.team_members = store.team_members.filter((m) => String(m.id) !== String(id));
      writeFallbackStore(store);
      return true;
    }
  );
}

// ─── TESTIMONIALS ───────────────────────────────────────────────────────────
async function getTestimonials() {
  return executeDbOrFallback(
    async () => {
      const [rows] = await pool.query('SELECT * FROM testimonials ORDER BY id DESC');
      return rows;
    },
    () => {
      const store = readFallbackStore();
      return store.testimonials || [];
    }
  );
}

async function saveTestimonial(data) {
  return executeDbOrFallback(
    async () => {
      const { client_name, designation, company, content, rating = 5, avatar_url, is_published = 1 } = data;
      const [res] = await pool.query(
        `INSERT INTO testimonials (client_name, designation, company, content, rating, avatar_url, is_published)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [client_name, designation || null, company || null, content, Number(rating) || 5, avatar_url || null, is_published ? 1 : 0]
      );
      return { id: res.insertId, ...data };
    },
    () => {
      const store = readFallbackStore();
      const id = Date.now();
      const newTestimonial = { id, ...data, created_at: new Date().toISOString() };
      store.testimonials.unshift(newTestimonial);
      writeFallbackStore(store);
      return newTestimonial;
    }
  );
}

async function updateTestimonial(id, data) {
  return executeDbOrFallback(
    async () => {
      const { client_name, designation, company, content, rating, avatar_url, is_published } = data;
      await pool.query(
        `UPDATE testimonials
         SET client_name = ?, designation = ?, company = ?, content = ?, rating = ?, avatar_url = ?, is_published = ?
         WHERE id = ?`,
        [client_name, designation || null, company || null, content, Number(rating) || 5, avatar_url || null, is_published ? 1 : 0, id]
      );
      return { id: Number(id), ...data };
    },
    () => {
      const store = readFallbackStore();
      const index = store.testimonials.findIndex((t) => String(t.id) === String(id));
      if (index !== -1) {
        store.testimonials[index] = { ...store.testimonials[index], ...data };
        writeFallbackStore(store);
        return store.testimonials[index];
      }
      return null;
    }
  );
}

async function deleteTestimonial(id) {
  return executeDbOrFallback(
    async () => {
      await pool.query('DELETE FROM testimonials WHERE id = ?', [id]);
      return true;
    },
    () => {
      const store = readFallbackStore();
      store.testimonials = store.testimonials.filter((t) => String(t.id) !== String(id));
      writeFallbackStore(store);
      return true;
    }
  );
}

// ─── CONTACT INQUIRIES & LEADS ──────────────────────────────────────────────
async function getInquiries() {
  return executeDbOrFallback(
    async () => {
      const [rows] = await pool.query('SELECT * FROM contact_inquiries ORDER BY created_at DESC');
      return rows;
    },
    () => {
      const store = readFallbackStore();
      return store.contact_inquiries || [];
    }
  );
}

async function updateInquiryStatus(id, status) {
  return executeDbOrFallback(
    async () => {
      await pool.query('UPDATE contact_inquiries SET status = ? WHERE id = ?', [status, id]);
      return true;
    },
    () => {
      const store = readFallbackStore();
      if (store.contact_inquiries) {
        const item = store.contact_inquiries.find((iq) => String(iq.id) === String(id));
        if (item) {
          item.status = status;
          writeFallbackStore(store);
        }
      }
      return true;
    }
  );
}

async function deleteInquiry(id) {
  return executeDbOrFallback(
    async () => {
      await pool.query('DELETE FROM contact_inquiries WHERE id = ?', [id]);
      return true;
    },
    () => {
      const store = readFallbackStore();
      if (store.contact_inquiries) {
        store.contact_inquiries = store.contact_inquiries.filter((iq) => String(iq.id) !== String(id));
        writeFallbackStore(store);
      }
      return true;
    }
  );
}

// ─── INTERN CERTIFICATES ────────────────────────────────────────────────────
async function getCertificates() {
  return executeDbOrFallback(
    async () => {
      const [rows] = await pool.query('SELECT * FROM intern_certificates ORDER BY created_at DESC');
      return rows;
    },
    () => {
      const store = readFallbackStore();
      return store.intern_certificates || [];
    }
  );
}

async function getCertificateByCode(code) {
  if (!code) return null;
  const upperCode = code.trim().toUpperCase();

  // First try DB
  try {
    const [rows] = await pool.query('SELECT * FROM intern_certificates WHERE certificate_code = ?', [upperCode]);
    if (rows && rows.length > 0) return rows[0];
  } catch (err) {
    // DB offline, fall through to fallback
  }

  // Fallback to local store
  const store = readFallbackStore();
  const cert = (store.intern_certificates || []).find(
    (c) => (c.certificate_code || '').trim().toUpperCase() === upperCode
  );
  return cert || null;
}

async function saveCertificate(data) {
  const { name, role, department, startDate, endDate, duration, certificateCode, status = 'COMPLETED', issuedBy = 'ORBIT-I Private Limited' } = data;
  const upperCode = certificateCode.trim().toUpperCase();

  // 1. Always persist to fallback store for 100% guarantee
  const store = readFallbackStore();
  const existingIdx = (store.intern_certificates || []).findIndex(
    (c) => (c.certificate_code || '').trim().toUpperCase() === upperCode
  );

  const certRecord = {
    id: existingIdx !== -1 ? store.intern_certificates[existingIdx].id : Date.now(),
    name,
    role,
    department,
    start_date: startDate,
    end_date: endDate,
    duration,
    status,
    certificate_code: upperCode,
    issued_by: issuedBy,
    created_at: new Date().toISOString(),
  };

  if (existingIdx !== -1) {
    store.intern_certificates[existingIdx] = certRecord;
  } else {
    store.intern_certificates.unshift(certRecord);
  }
  writeFallbackStore(store);

  // 2. Also attempt MySQL write if available
  try {
    await pool.query(
      `INSERT INTO intern_certificates 
       (name, role, department, start_date, end_date, duration, status, certificate_code, issued_by, issued_at, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURDATE(), NOW())
       ON DUPLICATE KEY UPDATE 
       name = VALUES(name), role = VALUES(role), department = VALUES(department), duration = VALUES(duration)`,
      [name, role, department, startDate, endDate, duration, status, upperCode, issuedBy]
    );
  } catch (err) {
    console.warn('⚠️ Note: MySQL write skipped for certificate, stored in verified fallback ledger:', err.message);
  }

  return certRecord;
}

async function deleteCertificate(codeOrId) {
  // Update fallback
  const store = readFallbackStore();
  store.intern_certificates = (store.intern_certificates || []).filter(
    (c) => String(c.id) !== String(codeOrId) && (c.certificate_code || '').toUpperCase() !== String(codeOrId).toUpperCase()
  );
  writeFallbackStore(store);

  // Try DB
  try {
    await pool.query('DELETE FROM intern_certificates WHERE id = ? OR certificate_code = ?', [codeOrId, codeOrId]);
  } catch {}
  return true;
}

// ─── ADMIN USERS & ACCOUNTS ─────────────────────────────────────────────────
async function getAdminUsers() {
  return executeDbOrFallback(
    async () => {
      const [rows] = await pool.query(
        'SELECT id, name, email, role, approved, avatar_url, created_at FROM client_information WHERE role = "ADMIN" ORDER BY id ASC'
      );
      return rows;
    },
    () => {
      const store = readFallbackStore();
      return (store.admin_users || []).map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role || 'ADMIN',
        approved: 1,
        avatar_url: u.avatar_url || '',
        created_at: u.created_at,
      }));
    }
  );
}

async function getAdminByEmail(email) {
  if (!email) return null;
  const cleanEmail = email.trim().toLowerCase();

  try {
    const [rows] = await pool.query('SELECT * FROM client_information WHERE email = ? AND role = "ADMIN"', [cleanEmail]);
    if (rows && rows.length > 0) return rows[0];
  } catch {}

  const store = readFallbackStore();
  return (store.admin_users || []).find((u) => u.email.toLowerCase() === cleanEmail) || null;
}

async function saveAdminUser(data) {
  const { name, email, password, avatar_url } = data;
  const cleanEmail = email.trim().toLowerCase();

  // Always write to fallback store
  const store = readFallbackStore();
  const id = Date.now();
  const adminObj = {
    id,
    name: name.trim(),
    email: cleanEmail,
    password, // already hashed
    role: 'ADMIN',
    avatar_url: avatar_url || '',
    created_at: new Date().toISOString(),
  };

  const existingIdx = (store.admin_users || []).findIndex((u) => u.email.toLowerCase() === cleanEmail);
  if (existingIdx !== -1) {
    store.admin_users[existingIdx] = { ...store.admin_users[existingIdx], ...adminObj };
  } else {
    store.admin_users.push(adminObj);
  }
  writeFallbackStore(store);

  // Also try MySQL
  try {
    await pool.query(
      `INSERT INTO client_information (name, email, password, approved, role, avatar_url, created_at)
       VALUES (?, ?, ?, 1, 'ADMIN', ?, NOW())
       ON DUPLICATE KEY UPDATE name = VALUES(name), password = VALUES(password), avatar_url = VALUES(avatar_url)`,
      [name.trim(), cleanEmail, password, avatar_url || null]
    );
  } catch (err) {
    console.warn('⚠️ Note: MySQL write skipped for admin, saved in secure fallback vault:', err.message);
  }

  return { id, name, email: cleanEmail, role: 'ADMIN', avatar_url: avatar_url || '' };
}

async function updateAdminUser(idOrEmail, data) {
  const store = readFallbackStore();
  const idx = (store.admin_users || []).findIndex(
    (u) => String(u.id) === String(idOrEmail) || u.email.toLowerCase() === String(idOrEmail).toLowerCase()
  );

  if (idx !== -1) {
    store.admin_users[idx] = { ...store.admin_users[idx], ...data, updated_at: new Date().toISOString() };
    writeFallbackStore(store);
  }

  try {
    if (data.password) {
      await pool.query(
        'UPDATE client_information SET name = COALESCE(?, name), email = COALESCE(?, email), password = ?, avatar_url = COALESCE(?, avatar_url) WHERE id = ? OR email = ?',
        [data.name, data.email, data.password, data.avatar_url, idOrEmail, idOrEmail]
      );
    } else {
      await pool.query(
        'UPDATE client_information SET name = COALESCE(?, name), email = COALESCE(?, email), avatar_url = COALESCE(?, avatar_url) WHERE id = ? OR email = ?',
        [data.name, data.email, data.avatar_url, idOrEmail, idOrEmail]
      );
    }
  } catch {}

  return true;
}

async function deleteAdminUser(id) {
  const store = readFallbackStore();
  store.admin_users = (store.admin_users || []).filter((u) => String(u.id) !== String(id));
  writeFallbackStore(store);

  try {
    await pool.query('DELETE FROM client_information WHERE id = ? AND role = "ADMIN"', [id]);
  } catch {}
  return true;
}

// ─── QUICK SITE NOTICE & BROADCAST ALERT ────────────────────────────────────
function getSiteNotice() {
  const store = readFallbackStore();
  return store.site_notice || {
    enabled: false,
    message: '',
    type: 'INFO',
    link_text: '',
    link_url: '',
  };
}

function updateSiteNotice(data) {
  const store = readFallbackStore();
  store.site_notice = { ...store.site_notice, ...data, updated_at: new Date().toISOString() };
  writeFallbackStore(store);
  return store.site_notice;
}

// ─── HIRING BANNERS ─────────────────────────────────────────────────────────
function getHiringBanners() {
  const store = readFallbackStore();
  return store.hiring_banners || [];
}

function saveHiringBanner(data) {
  const store = readFallbackStore();
  if (data.id) {
    const idx = store.hiring_banners.findIndex((b) => String(b.id) === String(data.id));
    if (idx !== -1) {
      store.hiring_banners[idx] = { ...store.hiring_banners[idx], ...data, updated_at: new Date().toISOString() };
      writeFallbackStore(store);
      return store.hiring_banners[idx];
    }
  }
  const newBanner = { id: Date.now(), ...data, created_at: new Date().toISOString() };
  store.hiring_banners.unshift(newBanner);
  writeFallbackStore(store);
  return newBanner;
}

function deleteHiringBanner(id) {
  const store = readFallbackStore();
  store.hiring_banners = (store.hiring_banners || []).filter((b) => String(b.id) !== String(id));
  writeFallbackStore(store);
  return true;
}

// ─── CHATBOT CONFIG & KNOWLEDGE ─────────────────────────────────────────────
function getChatbotConfig() {
  const store = readFallbackStore();
  return store.chatbot_config || {
    enabled: true,
    bot_name: 'ORBIT-I AI Assistant',
    greeting: 'Salam! Welcome to ORBIT-I. How can I assist you today?',
  };
}

function updateChatbotConfig(data) {
  const store = readFallbackStore();
  store.chatbot_config = { ...store.chatbot_config, ...data, updated_at: new Date().toISOString() };
  writeFallbackStore(store);
  return store.chatbot_config;
}

module.exports = {
  getCmsPages,
  getCmsPageBySlug,
  saveCmsPage,
  updateCmsPage,
  deleteCmsPage,
  getBlogPosts,
  getBlogPostBySlug,
  saveBlogPost,
  updateBlogPost,
  deleteBlogPost,
  getCareersJobs,
  saveCareerJob,
  updateCareerJob,
  deleteCareerJob,
  getTeamMembers,
  saveTeamMember,
  updateTeamMember,
  deleteTeamMember,
  getTestimonials,
  saveTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getInquiries,
  updateInquiryStatus,
  deleteInquiry,
  getCertificates,
  getCertificateByCode,
  saveCertificate,
  deleteCertificate,
  getAdminUsers,
  getAdminByEmail,
  saveAdminUser,
  updateAdminUser,
  deleteAdminUser,
  getSiteNotice,
  updateSiteNotice,
  getHiringBanners,
  saveHiringBanner,
  deleteHiringBanner,
  getChatbotConfig,
  updateChatbotConfig,
};
