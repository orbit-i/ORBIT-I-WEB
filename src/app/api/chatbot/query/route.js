import { NextResponse } from 'next/server';
import {
  getChatbotConfig,
  getCareersJobs,
  getTeamMembers,
  getChatbotQAs,
  getChatbotDocs,
} from '@/server/utils/cmsStorage';

// Grounded knowledge retriever with real-time website context & dynamic Q&As / learned documents
async function generateGroundedAnswer(queryText, jobs = [], team = [], qas = [], docs = []) {
  const q = (queryText || '').toLowerCase().trim();
  const tokens = q
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 2);

  // ─── STEP 1: DYNAMIC Q&A MATCHING FROM LEARNED KNOWLEDGE BASE ───
  let bestQAMatch = null;
  let highestScore = 0;

  for (const item of qas) {
    if (!item.is_active && item.is_active !== undefined) continue;

    const qText = (item.question || '').toLowerCase();
    const tags = (item.tags || '').toLowerCase();
    const qTokens = qText.replace(/[^a-z0-9\s]/g, ' ').split(/\s+/);
    const tagTokens = tags.replace(/[^a-z0-9\s,]/g, ' ').split(/[\s,]+/);

    let score = 0;

    // Full or substring question match
    if (q.includes(qText) || qText.includes(q)) score += 8;

    // Token intersection
    tokens.forEach((tok) => {
      if (qTokens.includes(tok)) score += 3;
      if (tagTokens.includes(tok)) score += 2;
    });

    if (score > highestScore) {
      highestScore = score;
      bestQAMatch = item;
    }
  }

  // If dynamic Q&A has a solid match, return it directly
  if (bestQAMatch && highestScore >= 4) {
    return {
      answer: bestQAMatch.answer,
      actionLink: bestQAMatch.action_link || '/contact',
      actionText: bestQAMatch.action_text || 'Learn More',
    };
  }

  // ─── STEP 2: LEARNED PDF / DOCUMENT CHUNK RETRIEVAL ───
  if (docs && docs.length > 0) {
    let bestDocSnippet = '';
    let docMatchScore = 0;

    for (const doc of docs) {
      const text = doc.content_text || '';
      const paragraphs = text.split(/\n\n+/);

      for (const para of paragraphs) {
        const lowerPara = para.toLowerCase();
        let matchCount = 0;
        tokens.forEach((t) => {
          if (lowerPara.includes(t)) matchCount++;
        });

        if (matchCount > docMatchScore) {
          docMatchScore = matchCount;
          bestDocSnippet = para.trim();
        }
      }
    }

    if (docMatchScore >= 2 && bestDocSnippet) {
      return {
        answer: bestDocSnippet,
        actionLink: '/contact',
        actionText: 'Contact ORBIT-I',
      };
    }
  }

  // ─── STEP 3: STRICT COMPANY FACTUAL GROUNDING (NO HALLUCINATIONS) ───

  // A. Locations & Offices (Nawabshah HQ & Karachi Branch Only)
  const isLocationQuery =
    q.includes('location') ||
    q.includes('office') ||
    q.includes('address') ||
    q.includes('pata') ||
    q.includes('kahan') ||
    q.includes('city') ||
    q.includes('branch') ||
    q.includes('hub') ||
    q.includes('nawabshah') ||
    q.includes('karachi') ||
    q.includes('hyderabad') ||
    q.includes('fake');

  if (isLocationQuery) {
    // Specific Hyderabad inquiry
    if (q.includes('hyderabad')) {
      return {
        answer: `Nahi, **ORBIT-I Private Limited** ka Hyderabad mein koi physical office ya branch nahi hai. Hamare do official registered hubs hain:\n\n1. 📍 **Nawabshah (Headquarters):** Nawabshah, Sindh, Pakistan. (Core engineering labs & corporate administration)\n2. 📍 **Karachi (Regional Branch):** Karachi, Sindh, Pakistan. (Executive consulting & client delivery)\n\nHum Hyderabad samait poore Pakistan aur globally (USA, UK, UAE, EU) remote software development services deliver karte hain.`,
        actionLink: '/locations',
        actionText: 'View Official Locations',
      };
    }

    // Specific Nawabshah inquiry
    if (q.includes('nawabshah') || q.includes('headquarter') || q.includes('hq')) {
      return {
        answer: `ORBIT-I Private Limited ka registered corporate **Headquarters**:\n\n📍 **Nawabshah (Headquarters):** Nawabshah, Sindh, Pakistan.\n\nYahan hamari core engineering laboratories, autonomous AI research facilities, high-density server operations, aur corporate governance team qaim hain.`,
        actionLink: '/contact',
        actionText: 'Contact Headquarters',
      };
    }

    // Specific Karachi inquiry
    if (q.includes('karachi')) {
      return {
        answer: `ORBIT-I Private Limited ki **Regional Branch**:\n\n📍 **Karachi (Regional Branch):** Karachi, Sindh, Pakistan.\n\nKarachi office hamare enterprise commercial clients, fintech payment gateways (JazzCash, EasyPaisa, Stripe), aur executive technology consulting ko manage karta hai.`,
        actionLink: '/contact',
        actionText: 'Contact Karachi Branch',
      };
    }

    // General office locations
    return {
      answer: `ORBIT-I Private Limited ke Sindh, Pakistan mein 2 strategic offices hain:\n\n1. **Nawabshah (Headquarters):** Nawabshah, Sindh, Pakistan. (Core engineering labs & administration)\n2. **Karachi (Regional Branch):** Karachi, Sindh, Pakistan. (Executive consulting & client delivery)\n\nHum Pakistan bhar (Lahore, Islamabad, Sukkur, Quetta) aur globally (USA, UK, UAE, EU) remote enterprise software services deliver karte hain. (Note: ORBIT-I ka Hyderabad mein koi physical office nahi hai).`,
      actionLink: '/locations',
      actionText: 'View All Locations',
    };
  }

  // B. Founders, Co-Founders & Core Leadership
  const isFounderQuery =
    q.includes('founder') ||
    q.includes('co-founder') ||
    q.includes('cofounder') ||
    q.includes('ceo') ||
    q.includes('cto') ||
    q.includes('coo') ||
    q.includes('owner') ||
    q.includes('malik') ||
    q.includes('leader') ||
    q.includes('head') ||
    q.includes('samad') ||
    q.includes('waleed') ||
    q.includes('maria') ||
    q.includes('muneeb');

  if (isFounderQuery) {
    if (q.includes('waleed')) {
      return {
        answer: `Nahi, **Waleed Ahmed** ORBIT-I ke co-founder nahi hain. Woh hamari core team mein **Digital Marketing Expert** (Marketing & Growth) hain jo international client acquisition, growth branding, aur technical SEO lead karte hain.\n\n**ORBIT-I ki Official Leadership:**\n• **Abdul Samad Rind:** Founder & Chief Executive Officer (CEO)\n• **Maria Almani:** Co-Founder & Chief Operating Officer (COO)\n• **Muhammad Muneeb Ur Rahman:** Co-Founder & Chief Technology Officer (CTO)\n\nAap complete leadership profiles hamare official [Team Page](/team) par dekh sakte hain.`,
        actionLink: '/team',
        actionText: 'Meet The Full Team',
      };
    }

    return {
      answer: `ORBIT-I Private Limited ki official executive leadership:\n\n• **Abdul Samad Rind:** Founder & Chief Executive Officer (CEO) — Enterprise Systems Architect leading AI Systems & Corporate Strategy.\n• **Maria Almani:** Co-Founder & Chief Operating Officer (COO) — Managing client operations, agile sprint deliveries, and business scaling.\n• **Muhammad Muneeb Ur Rahman:** Co-Founder & Chief Technology Officer (CTO) — Orchestrating technical architecture, cloud scalability, and database engineering.\n\n*Marketing & Growth Lead:* **Waleed Ahmed** (Digital Marketing Expert).\n\nAap sabhi profiles hamare official [Team & Leadership](/team) page par dekh sakte hain.`,
      actionLink: '/team',
      actionText: 'View Leadership & Team',
    };
  }

  // C. Certificate Verification
  const certMatch = q.match(/orbit[-_i/0-9a-z]+/i);
  if (
    q.includes('certificate') ||
    q.includes('verify') ||
    q.includes('sanad') ||
    q.includes('tasdeeq') ||
    q.includes('code') ||
    certMatch
  ) {
    if (certMatch) {
      return {
        answer: `Aap certificate code **${certMatch[0].toUpperCase()}** ko directly hamari official verification page [Verify Certificate](/verify) par enter karke live check kar sakte hain. ORBIT-I ke tamam issue shuda certificates digitally cryptographically signed aur QR-verifiable hotay hain.`,
        actionLink: `/verify?code=${encodeURIComponent(certMatch[0].toUpperCase())}`,
        actionText: 'Verify Certificate Live',
      };
    }
    return {
      answer: `ORBIT-I ke tamam internship aur professional experience certificates ko aap hamare official portal [Verify Certificate](/verify) par ja kar code enter kar ke foran verify kar sakte hain. Har certificate par unique cryptographic code (maslan: **ORBIT-I/INT/2026/15**) hota hai.`,
      actionLink: '/verify',
      actionText: 'Open Verification Portal',
    };
  }

  // D. Careers & Internships
  if (
    q.includes('intern') ||
    q.includes('career') ||
    q.includes('job') ||
    q.includes('hiring') ||
    q.includes('apply') ||
    q.includes('naukri') ||
    q.includes('vacancy')
  ) {
    const jobTitles =
      jobs && jobs.length > 0
        ? jobs
            .slice(0, 4)
            .map((j) => `• **${j.title}** (${j.mode || '100% Remote'}, ${j.duration || '2 Months'})`)
            .join('\n')
        : '• **AI & ML Research Intern** (100% Remote, 2 Months)\n• **Full-Stack Web Development Intern** (100% Remote, 2 Months)\n• **WordPress Developer Intern** (100% Remote, 2 Months)\n• **Cyber Security Intern** (100% Remote, 2 Months)';

    return {
      answer: `ORBIT-I mein fresh students aur passionate developers ke liye structured remote internships open hain!\n\n**Current Open Roles:**\n${jobTitles}\n\n**Key Perks:**\n• Official Cryptographically Verifiable Digital Experience Certificate (QR-coded)\n• Official Letter of Recommendation (LOR)\n• Direct Mentorship from Founders & Senior Engineers\n• 100% Remote flexibility across Pakistan & Globally.\n\nAap directly hamari careers page se apply kar sakte hain:`,
      actionLink: '/careers',
      actionText: 'Apply on Careers Portal',
    };
  }

  // E. Enterprise Services & Tech Stack
  if (
    q.includes('service') ||
    q.includes('ai') ||
    q.includes('ml') ||
    q.includes('web') ||
    q.includes('mobile') ||
    q.includes('app') ||
    q.includes('software') ||
    q.includes('cloud') ||
    q.includes('devops') ||
    q.includes('cyber') ||
    q.includes('security') ||
    q.includes('api') ||
    q.includes('tech stack') ||
    q.includes('kaam')
  ) {
    return {
      answer: `ORBIT-I 7 production-grade enterprise technology services provide karta hai:\n\n1. **Enterprise AI & ML:** Autonomous AI Agents, RAG with pgvector, Custom LLM fine-tuning.\n2. **Enterprise Web Applications:** Ultra-fast Next.js App Router & React 19 platforms with 10,000+ RPS concurrency.\n3. **Mobile App Development:** Cross-platform React Native & Flutter apps for iOS & Android.\n4. **Custom Software Solutions & ERP:** Scalable enterprise ERPs and bespoke workflow automation.\n5. **UI/UX Design Systems:** Modern glassmorphic, accessible, production-ready interfaces.\n6. **Cloud & DevOps Engineering:** Zero-trust architecture, Docker, Kubernetes, automated CI/CD.\n7. **Enterprise APIs & Integrations:** High-throughput microservices, REST & GraphQL gateways.\n\nAap kisi bhi service ka detailed architectural blueprint hamare Services page par explore kar sakte hain:`,
      actionLink: '/services',
      actionText: 'Explore All 7 Services',
    };
  }

  // F. Pricing, Quotations & Direct Contact
  if (
    q.includes('price') ||
    q.includes('cost') ||
    q.includes('quote') ||
    q.includes('rate') ||
    q.includes('contact') ||
    q.includes('email') ||
    q.includes('phone') ||
    q.includes('number') ||
    q.includes('whatsapp') ||
    q.includes('rabta')
  ) {
    return {
      answer: `ORBIT-I har project ke scope aur enterprise architecture ke mutabiq transparent quotation provide karta hai. Aap hamari technical team se directly rabta kar sakte hain:\n\n• **Email:** contactus@orbit-i.tech\n• **Phone / WhatsApp:** +92 319 0375751\n• **Offices:** Nawabshah (Headquarters) & Karachi (Regional Branch), Sindh\n• **Online Proposal Form:** [Contact Us](/contact)\n\nHamare technical leads 24 ghantay ke andar complete proposal ke sath reply karte hain.`,
      actionLink: '/contact',
      actionText: 'Get Project Quotation',
    };
  }

  // G. Grounded Fallback
  return {
    answer: `Main ORBIT-I ka official factual AI assistant hoon aur main strictly company ke verified knowledge base se jawab deta hoon.\n\nAap mujh se pooch sakte hain:\n1. **Offices & Locations:** Nawabshah Headquarters aur Karachi branch ke baray mein?\n2. **Leadership & Team:** Founders, Co-Founders, ya engineering team members ke baray mein?\n3. **Certificates:** Internship certificate verification kaise karein?\n4. **Careers:** Open remote internships aur apply karne ka tareeqa?\n5. **Services:** AI Agents, Web Development, Cloud & Mobile solutions?`,
    actionLink: '/contact',
    actionText: 'Contact Technical Team',
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
        answer: 'Chatbot service is currently in maintenance. Please contact us via contactus@orbit-i.tech or our Contact page.',
      });
    }

    const [jobs, team, qas, docs] = await Promise.all([
      getCareersJobs().catch(() => []),
      getTeamMembers().catch(() => []),
      getChatbotQAs().catch(() => []),
      getChatbotDocs().catch(() => []),
    ]);

    const responseData = await generateGroundedAnswer(query, jobs, team, qas, docs);

    return NextResponse.json({
      success: true,
      botName: config.bot_name || 'ORBIT-I AI Assistant',
      ...responseData,
    });
  } catch (error) {
    console.error('Chatbot error:', error);
    return NextResponse.json({ error: 'Unable to process inquiry at this moment.' }, { status: 500 });
  }
}
