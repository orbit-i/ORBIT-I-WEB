import { NextResponse } from 'next/server';
import { getChatbotConfig, getCertificateByCode, getCareersJobs, getTeamMembers } from '@/server/utils/cmsStorage';

// Grounded knowledge retriever
function generateGroundedAnswer(queryText, jobs, team) {
  const q = (queryText || '').toLowerCase().trim();

  // 1. Certificate verification inquiries
  const certMatch = q.match(/orbit[-_i/0-9a-z]+/i);
  if (q.includes('certificate') || q.includes('verify') || q.includes('sanad') || q.includes('tasdeeq')) {
    if (certMatch) {
      return {
        answer: `Aap certificate code **${certMatch[0].toUpperCase()}** ko directly hamari official verification page [Verify Certificate](/verify) par enter karke live verify kar sakte hain. ORBIT-I ke tamam issue shuda certificates digitally cryptographically signed aur QR-verifiable hotay hain.`,
        actionLink: `/verify?code=${encodeURIComponent(certMatch[0].toUpperCase())}`,
        actionText: 'Verify Certificate Live',
      };
    }
    return {
      answer: `ORBIT-I ke tamam internship aur professional experience certificates ko aap hamaray official portal [Verify Certificate](/verify) par ja kar code daal kar foran check kar sakte hain. Har certificate par unique code (maslan: **ORBIT-I/INT/2026/15**) hota hai.`,
      actionLink: '/verify',
      actionText: 'Open Verification Portal',
    };
  }

  // 2. Internship & Careers inquiries
  if (q.includes('intern') || q.includes('career') || q.includes('job') || q.includes('hiring') || q.includes('apply') || q.includes('naukri')) {
    const jobTitles = jobs && jobs.length > 0 
      ? jobs.slice(0, 3).map((j) => `• **${j.title}** (${j.mode || 'Remote'}, ${j.duration || '2 Months'})`).join('\n')
      : '• **AI & ML Research Intern**\n• **Full-Stack Web Development Intern**\n• **Cyber Security Intern**';

    return {
      answer: `ORBIT-I mein fresh students aur developers ke liye structured internships open hain!\n\n**Current Openings:**\n${jobTitles}\n\n**Perks:**\n• Official Verifiable Experience Certificate\n• Letter of Recommendation (LOR)\n• Direct Mentorship from Senior Engineers\n• 100% Remote flexibility.\n\nAap directly hamari careers page se apply kar sakte hain:`,
      actionLink: '/careers',
      actionText: 'Apply for Internship',
    };
  }

  // 3. Locations (Nawabshah, Karachi, Hyderabad)
  if (q.includes('location') || q.includes('office') || q.includes('nawabshah') || q.includes('karachi') || q.includes('hyderabad') || q.includes('address') || q.includes('kahan')) {
    return {
      answer: `ORBIT-I Private Limited ke Sindh mein 3 strategic offices aur hubs hain:\n\n1. **Nawabshah (Headquarters):** VIP Road / Academic Technology Corridor, Sindh.\n2. **Karachi (Regional Branch):** Shahrah-e-Faisal / Clifton Enterprise District.\n3. **Hyderabad (Technology Hub):** Auto Bhan Road / Qasimabad.\n\nHum all over Pakistan aur globally remote services aur client delivery provide karte hain.`,
      actionLink: '/contact',
      actionText: 'Contact Our Offices',
    };
  }

  // 4. Services & Tech Stack
  if (q.includes('service') || q.includes('ai') || q.includes('web') || q.includes('cyber') || q.includes('security') || q.includes('cloud') || q.includes('software') || q.includes('project')) {
    return {
      answer: `ORBIT-I enterprise-grade custom engineering solutions provide karta hai:\n\n• **Autonomous AI Agents & RAG:** Multi-step reasoning LLM systems with LangGraph/FastAPI.\n• **Enterprise Web Applications:** Ultra-fast, responsive Next.js/React platforms with 10,000+ RPS concurrency.\n• **Cyber Shield & WAF Defense:** Military-grade protection against SQLi, XSS, RCE, Reverse Shells, aur brute-force.\n• **Cloud Architecture & Microservices:** Zero-trust infrastructure, Redis cache, and connection pooling.\n\nAap kisi bhi service ka dedicated blueprint hamaray Services page par dekh sakte hain:`,
      actionLink: '/#services',
      actionText: 'Explore All Services',
    };
  }

  // 5. Founders & Leadership
  if (q.includes('founder') || q.includes('ceo') || q.includes('owner') || q.includes('abdul samad') || q.includes('waleed') || q.includes('team') || q.includes('leader')) {
    return {
      answer: `ORBIT-I ki leadership team:\n\n• **Abdul Samad:** Founder & Chief Executive Officer (CEO) — Systems Architect leading AI Systems & Enterprise Strategy.\n• **Engr. M. Waleed:** Co-Founder & Chief Operating Officer (COO) — Operations & Agile Delivery Specialist.\n\nAap poori engineering team ke profiles [Hamari Team](/team) page par dekh sakte hain.`,
      actionLink: '/team',
      actionText: 'View Team Members',
    };
  }

  // 6. Pricing & Project Quote / Contact
  if (q.includes('price') || q.includes('cost') || q.includes('quote') || q.includes('contact') || q.includes('email') || q.includes('phone') || q.includes('whatsapp') || q.includes('rabta')) {
    return {
      answer: `ORBIT-I har enterprise project ke scope, SLA, aur architectural requirements ke mutabiq custom quotation provide karta hai. Aap hamari engineering team se directly rabta kar sakte hain:\n\n• **Email:** contact@orbit-i.tech\n• **Portal:** [Contact Form](/contact)\n• **Fast Consultation:** Hamary representative 24 ghantay ke andar reply karte hain.`,
      actionLink: '/contact',
      actionText: 'Request a Project Quote',
    };
  }

  // 7. Strict Grounding Fallback ("no fake chat")
  return {
    answer: `Main ORBIT-I ka official AI assistant hoon aur main strictly factual information provide karta hoon taake koi ghalat baat na ho.\n\nAap mujh se pooch sakte hain:\n1. **Certificates:** Internship certificate verify kaise karein?\n2. **Careers:** Fresh internships aur open jobs mein apply karne ka tareeqa?\n3. **Services:** AI Agents, Web Development, Cloud & Cybersecurity solutions?\n4. **Offices:** Nawabshah HQ, Karachi aur Hyderabad locations?\n5. **Contact:** New project quotation aur direct consultation?`,
    actionLink: '/contact',
    actionText: 'Talk to Engineering Team',
  };
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { query } = body;

    if (!query || typeof query !== 'string' || !query.trim()) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const config = getChatbotConfig();
    if (!config.enabled) {
      return NextResponse.json({
        answer: 'Chatbot service is currently in maintenance. Please contact us via contact@orbit-i.tech or our Contact page.',
      });
    }

    const jobs = await getCareersJobs();
    const team = await getTeamMembers();

    const responseData = generateGroundedAnswer(query, jobs, team);

    return NextResponse.json({
      success: true,
      botName: config.bot_name || 'ORBIT-I AI Assistant',
      ...responseData,
    });
  } catch (error) {
    console.error('Chatbot error:', error);
    return NextResponse.json({ error: error.message || 'Chatbot service error' }, { status: 500 });
  }
}
