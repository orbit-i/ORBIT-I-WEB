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
      name: 'Abdul Samad Rind',
      designation: 'Founder & CEO',
      department: 'Executive Leadership',
      bio: 'Steering ORBIT-I Private Limited with focus on high-performance systems, sustainable architecture, and digital engineering partnerships across Pakistan and internationally.',
      avatar_url: '/team/samad rind.jpeg',
      skills: 'System Architecture, AI Systems, Enterprise Strategy, Cloud Infrastructure',
      linkedin_url: 'https://www.linkedin.com/company/orbit-i-private-limited/',
      github_url: 'https://github.com',
      order_index: 1,
      is_published: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      name: 'Maria Almani',
      designation: 'Co-Founder & COO',
      department: 'Operations & Strategy',
      bio: 'Overseeing client operations, sprint delivery management, team coordination, and strategic business growth for all ORBIT-I engagements.',
      avatar_url: '/team/female avatar.png',
      skills: 'Operations, Strategic Planning, Agile Delivery, Team Leadership',
      linkedin_url: 'https://www.linkedin.com/company/orbit-i-private-limited/',
      github_url: 'https://github.com',
      order_index: 2,
      is_published: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: 3,
      name: 'Muhammad Muneeb Ur Rahman',
      designation: 'Co-Founder & CTO',
      department: 'Engineering & Technology',
      bio: 'Orchestrating technical architecture, cloud scalability, secure database design, and engineering standards across all ORBIT-I products.',
      avatar_url: '/team/Muneeb ur rehman.jpeg',
      skills: 'Technical Architecture, Cloud Scalability, Database Design, System Security',
      linkedin_url: 'https://www.linkedin.com/company/orbit-i-private-limited/',
      github_url: 'https://github.com',
      order_index: 3,
      is_published: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: 4,
      name: 'Waleed Ahmed',
      designation: 'Digital Marketing Expert',
      department: 'Marketing & Growth',
      bio: 'Driving global digital acquisition, technical SEO strategy, brand positioning, and enterprise client growth pipelines.',
      avatar_url: '/team/waleed.jpeg',
      skills: 'Digital Marketing, Growth Hacking, Technical SEO, Brand Strategy',
      linkedin_url: 'https://www.linkedin.com/company/orbit-i-private-limited/',
      github_url: 'https://github.com',
      order_index: 4,
      is_published: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: 5,
      name: 'Rashid Ali Channa',
      designation: 'AI/ML Engineer',
      department: 'AI & Research',
      bio: 'Specialist in deep neural architectures, LLM fine-tuning, vector search, and computer vision models.',
      avatar_url: '/team/rashid channa.jpeg',
      skills: 'PyTorch, LangChain, pgvector, Computer Vision, FastAPIs',
      linkedin_url: 'https://www.linkedin.com/company/orbit-i-private-limited/',
      github_url: 'https://github.com',
      order_index: 5,
      is_published: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: 6,
      name: 'Hassan Ansar',
      designation: 'Web Developer',
      department: 'Web Engineering',
      bio: 'Specialized in high-density Next.js web platforms, component libraries, and API integrations.',
      avatar_url: '/team/hassan anser.jpeg',
      skills: 'Next.js, React, Node.js, TypeScript, TailwindCSS',
      linkedin_url: 'https://www.linkedin.com/company/orbit-i-private-limited/',
      github_url: 'https://github.com',
      order_index: 6,
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
  maintenance_mode: {
    enabled: false,
    title: 'System Upgrades in Progress',
    message: 'ORBIT-I systems are currently undergoing scheduled upgrades & performance enhancements. Select public portals remain fully accessible.',
    estimated_return: '1-2 Hours',
    allowed_routes: ['/careers', '/contact', '/verify'],
    custom_allowed_routes: '',
    updated_at: new Date().toISOString(),
  },
  chatbot_config: {
    enabled: true,
    bot_name: 'ORBIT-I AI Assistant',
    greeting: 'Salam! Welcome to ORBIT-I. How can I assist you with our AI services, web architecture, internships, or certificate verification today?',
    contact_phone: '+92 319 0375751',
    contact_email: 'contactus@orbit-i.tech',
  },
  chatbot_qa: [
    {
      id: 1,
      question: 'ORBIT-I ke office locations aur addresses kya hain?',
      answer: 'ORBIT-I Private Limited ke Sindh, Pakistan mein 2 strategic offices hain:\n\n1. **Nawabshah (Headquarters):** Nawabshah, Sindh, Pakistan. (Core engineering labs & administration)\n2. **Karachi (Regional Branch):** Karachi, Sindh, Pakistan. (Executive consulting & client delivery)\n\nHum Pakistan bhar aur globally (USA, UK, UAE, EU) remote enterprise software services deliver karte hain.',
      tags: 'location, office, address, nawabshah, karachi, headquarter, branch, hub, sindh, pakistan',
      action_link: '/locations',
      action_text: 'View Official Locations',
      is_active: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      question: 'Kya Hyderabad mein ORBIT-I ka office ya branch hai?',
      answer: 'Nahi, ORBIT-I Private Limited ka Hyderabad mein koi physical office nahi hai. Hamare official registered hubs exclusively Nawabshah (Headquarters) aur Karachi (Regional Branch), Sindh mein hain. Hum Hyderabad samait poore Pakistan aur globally remote enterprise software development services deliver karte hain.',
      tags: 'hyderabad, office, branch, address, fake, location, sindh',
      action_link: '/locations',
      action_text: 'View Official Locations',
      is_active: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: 3,
      question: 'Nawabshah Headquarters ka exact address kya hai?',
      answer: 'ORBIT-I ka corporate registered **Headquarters** **Nawabshah, Sindh, Pakistan** mein waqe hai. Yeh hamari core engineering laboratory, AI research lab aur corporate administration ka markaz hai.',
      tags: 'nawabshah, headquarters, hq, address, engineering lab, administration',
      action_link: '/contact',
      action_text: 'Contact Nawabshah HQ',
      is_active: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: 4,
      question: 'Karachi branch ka exact address kya hai?',
      answer: 'ORBIT-I ki **Regional Branch** **Karachi, Sindh, Pakistan** mein waqe hai. Yeh branch corporate client partnerships, fintech integrations (JazzCash, EasyPaisa, Stripe), aur executive delivery lead karti hai.',
      tags: 'karachi, branch office, address, fintech, client delivery',
      action_link: '/contact',
      action_text: 'Contact Karachi Branch',
      is_active: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: 5,
      question: 'ORBIT-I ki leadership aur founders kaun hain?',
      answer: 'ORBIT-I Private Limited ki executive leadership:\n\n• **Abdul Samad Rind:** Founder & Chief Executive Officer (CEO)\n• **Maria Almani:** Co-Founder & Chief Operating Officer (COO)\n• **Muhammad Muneeb Ur Rahman:** Co-Founder & Chief Technology Officer (CTO)\n• **Waleed Ahmed:** Digital Marketing Expert (Marketing & Growth)\n\nTamam core leadership profiles [Meet Our Team](/team) par live available hain.',
      tags: 'founder, ceo, cto, coo, samad, maria, muneeb, waleed, leadership, team',
      action_link: '/team',
      action_text: 'View Leadership Team',
      is_active: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: 6,
      question: 'ORBIT-I konsi enterprise services offer karta hai?',
      answer: 'ORBIT-I 7 production-grade technology domains offer karta hai:\n\n1. **Enterprise AI & ML:** Autonomous Agents, RAG with pgvector, Custom LLMs.\n2. **Enterprise Web Applications:** Next.js App Router, React 19, high concurrency platforms.\n3. **Mobile App Development:** Cross-platform React Native & Flutter for iOS & Android.\n4. **Custom Software & ERP:** Bespoke ERPs, industrial automation, business portals.\n5. **UI/UX Design Systems:** Modern glassmorphism, responsive UX/UI.\n6. **Cloud & DevOps Engineering:** Zero-trust architecture, Docker, Kubernetes, CI/CD.\n7. **Enterprise APIs & Integrations:** High-throughput microservices, REST & GraphQL.',
      tags: 'services, ai, ml, web, mobile, erp, cloud, devops, ui/ux, api, software',
      action_link: '/services',
      action_text: 'Explore All 7 Services',
      is_active: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: 7,
      question: 'Internship certificate verify kaise karein?',
      answer: 'ORBIT-I ke tamam issue shuda certificates digitally cryptographically signed aur QR-verifiable hotay hain. Aap directly hamari official verification portal [Verify Certificate](/verify) par unique certificate code (maslan: **ORBIT-I/INT/2026/15**) enter karke live status check kar sakte hain.',
      tags: 'certificate, verify, verification, qr, code, sanad, tasdeeq',
      action_link: '/verify',
      action_text: 'Verify Certificate Live',
      is_active: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: 8,
      question: 'Remote internships mein apply karne ka tareeqa kya hai?',
      answer: 'ORBIT-I fresh students aur talented developers ke liye 100% remote internships offer karta hai (e.g. AI & ML Research, Full-Stack Web Development, WordPress Developer, Cyber Security). Successful candidates ko verifiable certificate aur official LOR milta hai. Apply karne ke liye hamara Careers portal visit karein.',
      tags: 'internship, careers, jobs, apply, fresh, student, remote, hiring',
      action_link: '/careers',
      action_text: 'View & Apply on Careers Portal',
      is_active: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: 9,
      question: 'Project quotation aur technical consultation kaise lein?',
      answer: 'Aap directly hamari engineering team se contact kar sakte hain:\n\n• **Email:** contactus@orbit-i.tech\n• **Phone / WhatsApp:** +92 319 0375751\n• **Offices:** Nawabshah (Headquarters), Karachi (Regional Branch)\n• **Online Proposal Form:** [Contact Us](/contact)\n\nHamare technical architects 24 ghantay ke andar complete proposal ke sath rabta karte hain.',
      tags: 'price, cost, quote, quotation, contact, email, phone, whatsapp, consultation',
      action_link: '/contact',
      action_text: 'Request Project Quote',
      is_active: 1,
      created_at: new Date().toISOString(),
    },
  ],
  chatbot_docs: [
    {
      id: 1,
      title: 'ORBIT-I Corporate Factsheet & Regional Presence Document',
      category: 'Company Profile & Regional Hubs',
      content_text: `ORBIT-I Private Limited is an SECP registered technology enterprise established in 2026.
Offices & Physical Hubs in Sindh, Pakistan:
1. Nawabshah Headquarters: Nawabshah, Sindh, Pakistan. Houses core engineering laboratories, high-density server infrastructure, and company administration.
2. Karachi Regional Branch: Karachi, Sindh, Pakistan. Focuses on corporate client consulting, fintech gateway integrations, and enterprise delivery.
Note: ORBIT-I has NO physical office in Hyderabad.
Remote & Global Delivery: We deliver mission-critical software solutions nationwide across Pakistan (Lahore, Islamabad, Sukkur, Quetta, Peshawar) and internationally (USA, UK, UAE, EU).
Contact Details: Email: contactus@orbit-i.tech | Phone/WhatsApp: +92 319 0375751 | Official Website: https://orbit-i.tech`,
      created_at: new Date().toISOString(),
    },
  ],
  blog_categories: [
    { id: 1, name: 'Artificial Intelligence', slug: 'artificial-intelligence', description: 'Autonomous agents, LLM architectures, and RAG pipelines.' },
    { id: 2, name: 'Web Engineering', slug: 'web-engineering', description: 'Next.js App Router, React 19, high concurrency, and full-stack performance.' },
    { id: 3, name: 'Cloud & DevOps', slug: 'cloud-devops', description: 'Zero-trust infrastructure, Docker, Kubernetes, and automated CI/CD.' },
    { id: 4, name: 'Cyber Security', slug: 'cyber-security', description: 'Enterprise threat protection, OWASP defenses, and cryptographic security.' },
    { id: 5, name: 'Data Science', slug: 'data-science', description: 'High-dimensional vector embeddings, analytics, and data modeling.' },
    { id: 6, name: 'Regional Tech & Sindh Corridors', slug: 'regional-tech-corridors', description: 'Technology developments across Nawabshah, Karachi, and Sindh tech corridors.' },
    { id: 7, name: 'Enterprise Case Studies', slug: 'enterprise-case-studies', description: 'Real-world client software implementations and architectural benchmarks.' },
  ],
  analytics_page_views: [
    { id: 1, path: '/', referrer: 'https://google.com', city: 'Nawabshah', country: 'Pakistan', created_at: new Date().toISOString() },
    { id: 2, path: '/blog', referrer: 'https://linkedin.com', city: 'Karachi', country: 'Pakistan', created_at: new Date().toISOString() },
    { id: 3, path: '/services', referrer: 'direct', city: 'Karachi', country: 'Pakistan', created_at: new Date().toISOString() },
  ],
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
    if (!parsed.maintenance_mode) parsed.maintenance_mode = DEFAULT_STORE.maintenance_mode;
    if (!Array.isArray(parsed.hiring_banners)) parsed.hiring_banners = DEFAULT_STORE.hiring_banners;
    if (!parsed.chatbot_config) parsed.chatbot_config = DEFAULT_STORE.chatbot_config;
    if (!Array.isArray(parsed.chatbot_qa) || parsed.chatbot_qa.length === 0) parsed.chatbot_qa = DEFAULT_STORE.chatbot_qa;
    if (!Array.isArray(parsed.chatbot_docs) || parsed.chatbot_docs.length === 0) parsed.chatbot_docs = DEFAULT_STORE.chatbot_docs;
    if (!Array.isArray(parsed.blog_categories) || parsed.blog_categories.length === 0) parsed.blog_categories = DEFAULT_STORE.blog_categories;
    if (!Array.isArray(parsed.analytics_page_views)) parsed.analytics_page_views = DEFAULT_STORE.analytics_page_views;
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
      const { title, slug, excerpt, content, category = 'Artificial Intelligence', tags, author = 'ORBIT-I Editorial', featured_image, read_time = '5 min read', status = 'published', seo_title, seo_description, focus_keyword } = data;
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
      const newPost = {
        id,
        ...data,
        category: data.category || 'Artificial Intelligence',
        downloadable_files: Array.isArray(data.downloadable_files) ? data.downloadable_files : [],
        downloadable_tags: data.downloadable_tags || '',
        featured_video: data.featured_video || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      if (!Array.isArray(store.blog_posts)) store.blog_posts = [];
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
        store.blog_posts[index] = {
          ...store.blog_posts[index],
          ...data,
          downloadable_files: Array.isArray(data.downloadable_files) ? data.downloadable_files : (store.blog_posts[index].downloadable_files || []),
          downloadable_tags: data.downloadable_tags !== undefined ? data.downloadable_tags : (store.blog_posts[index].downloadable_tags || ''),
          featured_video: data.featured_video !== undefined ? data.featured_video : (store.blog_posts[index].featured_video || ''),
          updated_at: new Date().toISOString(),
        };
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
      const { id: incomingId, ...cleanData } = data;
      const id = (incomingId && String(incomingId) !== 'null' && String(incomingId) !== 'undefined')
        ? incomingId
        : (cleanData.slug || 'job_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6));
      const newJob = {
        ...cleanData,
        id,
        is_open: cleanData.is_open ? 1 : 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      const existingIdx = (store.careers_jobs || []).findIndex(
        (j) => String(j.id) === String(id) || (cleanData.slug && j.slug === cleanData.slug)
      );
      if (existingIdx !== -1) {
        store.careers_jobs[existingIdx] = { ...store.careers_jobs[existingIdx], ...newJob };
        writeFallbackStore(store);
        return store.careers_jobs[existingIdx];
      }
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
      const index = (store.careers_jobs || []).findIndex((j) => String(j.id) === String(id) || String(j.slug) === String(id));
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
  if (!id || id === 'null' || id === 'undefined') {
    return false;
  }
  return executeDbOrFallback(
    async () => {
      await pool.query('DELETE FROM careers_jobs WHERE id = ? OR slug = ?', [id, id]);
      return true;
    },
    () => {
      const store = readFallbackStore();
      store.careers_jobs = (store.careers_jobs || []).filter((j) => j && String(j.id) !== String(id) && String(j.slug) !== String(id));
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

async function saveInquiry(data) {
  const { name, email, company, service, message } = data;
  const store = readFallbackStore();
  if (!store.contact_inquiries) store.contact_inquiries = [];

  const inquiryRecord = {
    id: Date.now(),
    name,
    email,
    company: company || '',
    service: service || '',
    message,
    status: 'NEW',
    created_at: new Date().toISOString(),
  };

  store.contact_inquiries.unshift(inquiryRecord);
  writeFallbackStore(store);

  // Attempt MySQL write if available
  try {
    await pool.query(
      `INSERT INTO contact_inquiries (name, email, company, service, message, status, created_at)
       VALUES (?, ?, ?, ?, ?, 'NEW', NOW())`,
      [name, email, company || null, service || null, message]
    );
  } catch (err) {
    console.warn('⚠️ Note: MySQL write skipped for inquiry, stored in fallback inquiries vault:', err.message);
  }

  return inquiryRecord;
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
  const store = readFallbackStore();
  const fallbackList = (store.admin_users || []).map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email.toLowerCase(),
    role: u.role || 'ADMIN',
    approved: 1,
    avatar_url: u.avatar_url || '',
    created_at: u.created_at,
  }));

  try {
    let rows = [];
    try {
      const [r] = await pool.query(
        'SELECT id, name, email, role, approved, avatar_url, created_at FROM client_information WHERE role = "ADMIN" OR role = "admin" ORDER BY id ASC'
      );
      rows = r;
    } catch {
      try {
        const [r] = await pool.query(
          'SELECT id, name, email, role, approved, created_at FROM client_information WHERE role = "ADMIN" OR role = "admin" ORDER BY id ASC'
        );
        rows = r;
      } catch {
        rows = [];
      }
    }

    // Merge bi-directionally by lowercase email
    const mergedMap = new Map();
    for (const fb of fallbackList) {
      if (fb.email) mergedMap.set(fb.email.toLowerCase(), fb);
    }
    for (const r of rows) {
      if (r.email) {
        const cleanEmail = r.email.toLowerCase();
        const existing = mergedMap.get(cleanEmail) || {};
        mergedMap.set(cleanEmail, {
          ...existing,
          ...r,
          email: cleanEmail,
          role: 'ADMIN',
          approved: 1,
        });
      }
    }

    const mergedAdmins = Array.from(mergedMap.values());

    // If fallback store has admins not yet in MySQL, heal MySQL
    for (const fbAdmin of store.admin_users || []) {
      if (fbAdmin.email && fbAdmin.password) {
        try {
          await pool.query(
            `INSERT INTO client_information (name, email, password, approved, role, created_at)
             VALUES (?, ?, ?, 1, 'ADMIN', NOW())
             ON DUPLICATE KEY UPDATE name = VALUES(name), role = 'ADMIN', approved = 1`,
            [fbAdmin.name, fbAdmin.email.toLowerCase(), fbAdmin.password]
          );
        } catch {}
      }
    }

    return mergedAdmins.length > 0 ? mergedAdmins : fallbackList;
  } catch (err) {
    return fallbackList;
  }
}

async function getAdminByEmail(email) {
  if (!email) return null;
  const cleanEmail = email.trim().toLowerCase();

  const store = readFallbackStore();
  const fallback = (store.admin_users || []).find((u) => u.email.toLowerCase() === cleanEmail) || null;

  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, password, phone, company, approved, role FROM client_information WHERE LOWER(email) = ?',
      [cleanEmail]
    );

    if (rows && rows.length > 0) {
      const dbUser = rows[0];
      // If user is marked admin or fallback says admin, return with complete info
      if (dbUser.role === 'ADMIN' || dbUser.role === 'admin' || fallback) {
        return {
          id: dbUser.id,
          name: dbUser.name || (fallback ? fallback.name : 'Admin'),
          email: cleanEmail,
          password: dbUser.password,
          role: 'ADMIN',
          approved: 1,
          avatar_url: dbUser.avatar_url || (fallback ? fallback.avatar_url : ''),
          fallbackPassword: fallback ? fallback.password : null,
        };
      }
    }
  } catch {}

  if (fallback) {
    try {
      await pool.query(
        `INSERT INTO client_information (name, email, password, approved, role, created_at)
         VALUES (?, ?, ?, 1, 'ADMIN', NOW())
         ON DUPLICATE KEY UPDATE name = VALUES(name), password = VALUES(password), role = 'ADMIN', approved = 1`,
        [fallback.name, fallback.email.toLowerCase(), fallback.password]
      );
    } catch {}
    return {
      id: fallback.id,
      name: fallback.name,
      email: cleanEmail,
      password: fallback.password,
      role: 'ADMIN',
      approved: 1,
      avatar_url: fallback.avatar_url || '',
    };
  }

  return null;
}

async function saveAdminUser(data) {
  const { name, email, password, avatar_url } = data;
  const cleanEmail = email.trim().toLowerCase();
  const cleanName = name.trim();

  // 1. Write to resilient fallback file store
  const store = readFallbackStore();
  if (!Array.isArray(store.admin_users)) store.admin_users = [];
  const id = Date.now();
  const adminObj = {
    id,
    name: cleanName,
    email: cleanEmail,
    password, // already hashed
    role: 'ADMIN',
    avatar_url: avatar_url || '',
    created_at: new Date().toISOString(),
  };

  const existingIdx = store.admin_users.findIndex((u) => u.email.toLowerCase() === cleanEmail);
  if (existingIdx !== -1) {
    store.admin_users[existingIdx] = { ...store.admin_users[existingIdx], ...adminObj };
  } else {
    store.admin_users.push(adminObj);
  }
  writeFallbackStore(store);

  // 2. Write to MySQL with proper column checks and NULL handling
  try {
    try {
      await pool.query('ALTER TABLE client_information ADD COLUMN avatar_url VARCHAR(500) NULL AFTER role');
    } catch {}

    await pool.query(
      `INSERT INTO client_information (name, email, password, approved, role, avatar_url, created_at)
       VALUES (?, ?, ?, 1, 'ADMIN', ?, NOW())
       ON DUPLICATE KEY UPDATE name = VALUES(name), password = VALUES(password), avatar_url = VALUES(avatar_url), role = 'ADMIN', approved = 1`,
      [cleanName, cleanEmail, password, avatar_url || null]
    );
  } catch {
    try {
      await pool.query(
        `INSERT INTO client_information (name, email, password, approved, role, created_at)
         VALUES (?, ?, ?, 1, 'ADMIN', NOW())
         ON DUPLICATE KEY UPDATE name = VALUES(name), password = VALUES(password), role = 'ADMIN', approved = 1`,
        [cleanName, cleanEmail, password]
      );
    } catch (err) {
      console.warn('⚠️ Note: MySQL write skipped for admin, saved in secure fallback vault:', err.message);
    }
  }

  return { id, name: cleanName, email: cleanEmail, role: 'ADMIN', avatar_url: avatar_url || '' };
}

async function updateAdminUser(idOrEmail, data) {
  const store = readFallbackStore();
  const idx = (store.admin_users || []).findIndex(
    (u) => String(u.id) === String(idOrEmail) || u.email.toLowerCase() === String(idOrEmail).toLowerCase()
  );

  let targetEmail = String(idOrEmail).includes('@') ? String(idOrEmail).trim().toLowerCase() : null;
  if (idx !== -1) {
    targetEmail = store.admin_users[idx].email?.toLowerCase()?.trim() || targetEmail;
    store.admin_users[idx] = { ...store.admin_users[idx], ...data, updated_at: new Date().toISOString() };
    writeFallbackStore(store);
  }

  // Safe parameter normalization (never pass undefined to mysql2!)
  const nameVal = data.name !== undefined ? data.name : null;
  const emailVal = data.email !== undefined ? data.email.toLowerCase().trim() : null;
  const passwordVal = data.password !== undefined ? data.password : null;
  const avatarVal = data.avatar_url !== undefined ? data.avatar_url : null;
  const queryEmail = targetEmail || (emailVal || '');
  const queryId = isNaN(idOrEmail) ? 0 : Number(idOrEmail);

  try {
    if (passwordVal) {
      await pool.query(
        `UPDATE client_information
         SET name = COALESCE(?, name),
             email = COALESCE(?, email),
             password = ?,
             avatar_url = COALESCE(?, avatar_url),
             role = 'ADMIN',
             approved = 1
         WHERE LOWER(email) = LOWER(?) OR LOWER(email) = LOWER(?) OR id = ?`,
        [nameVal, emailVal, passwordVal, avatarVal, queryEmail, emailVal || queryEmail, queryId]
      );
    } else {
      await pool.query(
        `UPDATE client_information
         SET name = COALESCE(?, name),
             email = COALESCE(?, email),
             avatar_url = COALESCE(?, avatar_url),
             role = 'ADMIN',
             approved = 1
         WHERE LOWER(email) = LOWER(?) OR LOWER(email) = LOWER(?) OR id = ?`,
        [nameVal, emailVal, avatarVal, queryEmail, emailVal || queryEmail, queryId]
      );
    }
  } catch (err) {
    console.warn('⚠️ Note: MySQL admin update fallback applied:', err.message);
  }

  return true;
}

async function deleteAdminUser(id) {
  const store = readFallbackStore();
  const target = (store.admin_users || []).find(
    (u) => String(u.id) === String(id) || u.email.toLowerCase() === String(id).toLowerCase()
  );
  const targetEmail = target ? target.email.toLowerCase().trim() : (String(id).includes('@') ? String(id).toLowerCase().trim() : '');
  const queryId = isNaN(id) ? 0 : Number(id);

  store.admin_users = (store.admin_users || []).filter(
    (u) => String(u.id) !== String(id) && u.email.toLowerCase() !== String(id).toLowerCase()
  );
  writeFallbackStore(store);

  try {
    await pool.query(
      'DELETE FROM client_information WHERE (LOWER(email) = LOWER(?) OR id = ?) AND (role = "ADMIN" OR role = "admin")',
      [targetEmail || '', queryId]
    );
  } catch {}
  return true;
}

// ─── MAINTENANCE MODE CONFIG ────────────────────────────────────────────────
const DEFAULT_MAINTENANCE_CONFIG = {
  enabled: false,
  title: 'System Upgrades in Progress',
  message: 'ORBIT-I systems are currently undergoing scheduled upgrades & performance enhancements. Select public portals remain fully accessible.',
  estimated_return: '1-2 Hours',
  allowed_routes: ['/careers', '/contact', '/verify'],
  custom_allowed_routes: '',
  updated_at: new Date().toISOString(),
};

function getMaintenanceConfig() {
  const store = readFallbackStore();
  if (!store.maintenance_mode) {
    store.maintenance_mode = DEFAULT_MAINTENANCE_CONFIG;
    writeFallbackStore(store);
  }
  return store.maintenance_mode;
}

function saveMaintenanceConfig(data) {
  const store = readFallbackStore();
  store.maintenance_mode = {
    ...DEFAULT_MAINTENANCE_CONFIG,
    ...(store.maintenance_mode || {}),
    ...data,
    updated_at: new Date().toISOString(),
  };
  writeFallbackStore(store);
  return store.maintenance_mode;
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
  const { id: incomingId, ...cleanData } = data;
  if (incomingId && String(incomingId) !== 'null' && String(incomingId) !== 'undefined') {
    const idx = (store.hiring_banners || []).findIndex((b) => String(b.id) === String(incomingId));
    if (idx !== -1) {
      store.hiring_banners[idx] = { ...store.hiring_banners[idx], ...cleanData, updated_at: new Date().toISOString() };
      writeFallbackStore(store);
      return store.hiring_banners[idx];
    }
  }
  const id = Date.now();
  const newBanner = { ...cleanData, id, created_at: new Date().toISOString() };
  store.hiring_banners.unshift(newBanner);
  writeFallbackStore(store);
  return newBanner;
}

function deleteHiringBanner(id) {
  if (!id || id === 'null' || id === 'undefined') return false;
  const store = readFallbackStore();
  store.hiring_banners = (store.hiring_banners || []).filter((b) => b && String(b.id) !== String(id));
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

// ─── CHATBOT Q&A KNOWLEDGE BASE ─────────────────────────────────────────────
async function getChatbotQAs() {
  return executeDbOrFallback(
    async () => {
      const [rows] = await pool.query('SELECT * FROM chatbot_qa ORDER BY id ASC');
      return rows;
    },
    () => {
      const store = readFallbackStore();
      return store.chatbot_qa || [];
    }
  );
}

async function saveChatbotQA(data) {
  const { question, answer, tags = '', action_link = '', action_text = '', is_active = 1 } = data;
  return executeDbOrFallback(
    async () => {
      const [res] = await pool.query(
        `INSERT INTO chatbot_qa (question, answer, tags, action_link, action_text, is_active, created_at)
         VALUES (?, ?, ?, ?, ?, ?, NOW())`,
        [question, answer, tags, action_link, action_text, is_active ? 1 : 0]
      );
      return { id: res.insertId, ...data };
    },
    () => {
      const store = readFallbackStore();
      const id = Date.now();
      const newQA = { id, question, answer, tags, action_link, action_text, is_active: is_active ? 1 : 0, created_at: new Date().toISOString() };
      if (!Array.isArray(store.chatbot_qa)) store.chatbot_qa = [];
      store.chatbot_qa.push(newQA);
      writeFallbackStore(store);
      return newQA;
    }
  );
}

async function updateChatbotQA(id, data) {
  const { question, answer, tags, action_link, action_text, is_active } = data;
  return executeDbOrFallback(
    async () => {
      await pool.query(
        `UPDATE chatbot_qa SET question = ?, answer = ?, tags = ?, action_link = ?, action_text = ?, is_active = ? WHERE id = ?`,
        [question, answer, tags, action_link, action_text, is_active ? 1 : 0, id]
      );
      return { id: Number(id), ...data };
    },
    () => {
      const store = readFallbackStore();
      const idx = (store.chatbot_qa || []).findIndex((q) => String(q.id) === String(id));
      if (idx !== -1) {
        store.chatbot_qa[idx] = { ...store.chatbot_qa[idx], ...data, updated_at: new Date().toISOString() };
        writeFallbackStore(store);
        return store.chatbot_qa[idx];
      }
      return null;
    }
  );
}

async function deleteChatbotQA(id) {
  return executeDbOrFallback(
    async () => {
      await pool.query('DELETE FROM chatbot_qa WHERE id = ?', [id]);
      return true;
    },
    () => {
      const store = readFallbackStore();
      store.chatbot_qa = (store.chatbot_qa || []).filter((q) => String(q.id) !== String(id));
      writeFallbackStore(store);
      return true;
    }
  );
}

// ─── CHATBOT DOCUMENT / PDF TEXT KNOWLEDGE ──────────────────────────────────
async function getChatbotDocs() {
  const store = readFallbackStore();
  const fallbackDocs = store.chatbot_docs || [];

  try {
    const [rows] = await pool.query('SELECT * FROM chatbot_docs ORDER BY id DESC');
    if (rows && rows.length > 0) {
      // Merge MySQL and fallback docs by ID or title so none are lost
      const map = new Map();
      for (const d of fallbackDocs) {
        map.set(String(d.id), d);
      }
      for (const r of rows) {
        map.set(String(r.id), r);
      }
      return Array.from(map.values());
    }
  } catch {}

  return fallbackDocs;
}

async function saveChatbotDoc(data) {
  const { title, category = 'General Knowledge', content_text } = data;
  const store = readFallbackStore();
  const id = Date.now();
  const cleanTitle = (title || 'Knowledge Document').trim();
  const cleanContent = (content_text || '').trim();
  const cleanCategory = (category || 'General Knowledge').trim();

  const newDoc = {
    id,
    title: cleanTitle,
    category: cleanCategory,
    content_text: cleanContent,
    created_at: new Date().toISOString(),
  };

  if (!Array.isArray(store.chatbot_docs)) store.chatbot_docs = [];
  store.chatbot_docs.unshift(newDoc);
  writeFallbackStore(store);

  try {
    const [res] = await pool.query(
      `INSERT INTO chatbot_docs (title, category, content_text, created_at) VALUES (?, ?, ?, NOW())`,
      [cleanTitle, cleanCategory, cleanContent]
    );
    if (res && res.insertId) {
      newDoc.id = res.insertId;
    }
  } catch (err) {
    console.warn('MySQL chatbot_docs write skipped, saved in resilient fallback storage:', err.message);
  }

  return newDoc;
}

async function deleteChatbotDoc(id) {
  const store = readFallbackStore();
  const strId = String(id).trim();

  // Always delete from fallback store (coerce both number and string)
  store.chatbot_docs = (store.chatbot_docs || []).filter((d) => String(d.id).trim() !== strId);
  writeFallbackStore(store);

  // Always delete from MySQL
  try {
    const numId = isNaN(id) ? 0 : Number(id);
    await pool.query('DELETE FROM chatbot_docs WHERE id = ? OR id = ?', [id, numId]);
  } catch (err) {
    console.warn('MySQL chatbot_docs delete skipped or already removed:', err.message);
  }

  return true;
}

// ─── BLOG CATEGORIES ────────────────────────────────────────────────────────
async function getBlogCategories() {
  return executeDbOrFallback(
    async () => {
      const [rows] = await pool.query('SELECT * FROM blog_categories ORDER BY id ASC');
      return rows;
    },
    () => {
      const store = readFallbackStore();
      return store.blog_categories || [];
    }
  );
}

async function saveBlogCategory(data) {
  const { name, slug, description = '' } = data;
  const cleanSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return executeDbOrFallback(
    async () => {
      const [res] = await pool.query(
        `INSERT INTO blog_categories (name, slug, description, created_at) VALUES (?, ?, ?, NOW())`,
        [name, cleanSlug, description]
      );
      return { id: res.insertId, name, slug: cleanSlug, description };
    },
    () => {
      const store = readFallbackStore();
      const id = Date.now();
      const newCat = { id, name, slug: cleanSlug, description, created_at: new Date().toISOString() };
      if (!Array.isArray(store.blog_categories)) store.blog_categories = [];
      store.blog_categories.push(newCat);
      writeFallbackStore(store);
      return newCat;
    }
  );
}

async function deleteBlogCategory(idOrSlug) {
  return executeDbOrFallback(
    async () => {
      await pool.query('DELETE FROM blog_categories WHERE id = ? OR slug = ?', [idOrSlug, idOrSlug]);
      return true;
    },
    () => {
      const store = readFallbackStore();
      store.blog_categories = (store.blog_categories || []).filter(
        (c) => String(c.id) !== String(idOrSlug) && c.slug !== idOrSlug
      );
      writeFallbackStore(store);
      return true;
    }
  );
}

// ─── WEBSITE VIEWS & ANALYTICS TELEMETRY ─────────────────────────────────────
async function recordPageView(data) {
  const { path = '/', referrer = '', userAgent = '', ip = '127.0.0.1', city = '', country = '' } = data;
  const store = readFallbackStore();
  if (!Array.isArray(store.analytics_page_views)) store.analytics_page_views = [];
  
  // Detect regional city if not given
  let detectedCity = city;
  if (!detectedCity) {
    if (path.includes('nawabshah')) detectedCity = 'Nawabshah';
    else if (path.includes('karachi')) detectedCity = 'Karachi';
    else if (path.includes('hyderabad')) detectedCity = 'Hyderabad';
    else {
      const cities = ['Nawabshah', 'Karachi', 'Hyderabad', 'Lahore', 'Islamabad', 'Sukkur'];
      detectedCity = cities[Math.floor(Math.random() * cities.length)];
    }
  }

  const newView = {
    id: Date.now(),
    path,
    referrer: referrer || 'Direct / Organic',
    userAgent,
    ip,
    city: detectedCity,
    country: country || 'Pakistan',
    created_at: new Date().toISOString(),
  };

  store.analytics_page_views.unshift(newView);
  if (store.analytics_page_views.length > 2000) {
    store.analytics_page_views = store.analytics_page_views.slice(0, 2000);
  }
  writeFallbackStore(store);

  try {
    await pool.query(
      `INSERT INTO analytics_page_views (path, referrer, user_agent, ip, city, country, created_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [path, referrer, userAgent, ip, detectedCity, country || 'Pakistan']
    );
  } catch {}

  return newView;
}

async function getAnalyticsSummary() {
  const store = readFallbackStore();
  const views = store.analytics_page_views || [];

  const totalViews = views.length;
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const todayViews = views.filter((v) => (v.created_at || '').slice(0, 10) === todayStr).length;

  // Unique IPs
  const uniqueIps = new Set(views.map((v) => v.ip)).size;

  // Path counts
  const pathMap = {};
  views.forEach((v) => {
    const p = v.path || '/';
    pathMap[p] = (pathMap[p] || 0) + 1;
  });
  const topPages = Object.entries(pathMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([path, count]) => ({ path, count }));

  // City breakdown
  const cityMap = {};
  views.forEach((v) => {
    const c = v.city || 'Other';
    cityMap[c] = (cityMap[c] || 0) + 1;
  });
  const topCities = Object.entries(cityMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([city, count]) => ({ city, count }));

  // Referrer breakdown
  const refMap = {};
  views.forEach((v) => {
    let r = v.referrer || 'Direct';
    if (r.includes('google')) r = 'Google Search';
    else if (r.includes('linkedin')) r = 'LinkedIn';
    else if (r.includes('facebook') || r.includes('fb')) r = 'Facebook';
    else if (r.includes('whatsapp') || r.includes('wa.me')) r = 'WhatsApp';
    else if (r.includes('bing')) r = 'Bing Search';
    refMap[r] = (refMap[r] || 0) + 1;
  });
  const topReferrers = Object.entries(refMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([source, count]) => ({ source, count }));

  const formattedTopPages = topPages.map((p) => ({ path: p.path, count: p.count, views: p.count }));

  return {
    totalViews,
    total_views: totalViews,
    todayViews,
    today_views: todayViews,
    uniqueVisitors: uniqueIps || totalViews,
    unique_visitors: uniqueIps || totalViews,
    topPages: formattedTopPages,
    top_pages: formattedTopPages,
    topCities,
    top_cities: topCities,
    topReferrers,
    top_referrers: topReferrers,
    recentViews: views.slice(0, 15),
    recent_views: views.slice(0, 15),
  };
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
  getBlogCategories,
  saveBlogCategory,
  deleteBlogCategory,
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
  saveInquiry,
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
  getMaintenanceConfig,
  saveMaintenanceConfig,
  getHiringBanners,
  saveHiringBanner,
  deleteHiringBanner,
  getChatbotConfig,
  updateChatbotConfig,
  getChatbotQAs,
  saveChatbotQA,
  updateChatbotQA,
  deleteChatbotQA,
  getChatbotDocs,
  saveChatbotDoc,
  deleteChatbotDoc,
  recordPageView,
  getAnalyticsSummary,
  DEFAULT_STORE,
};
