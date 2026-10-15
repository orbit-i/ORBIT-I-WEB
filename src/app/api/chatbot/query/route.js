import { NextResponse } from 'next/server';
import { getChatbotConfig, getCareersJobs, getTeamMembers, getCmsPages, getBlogPosts } from '@/server/utils/cmsStorage';
import { servicesList } from '@/data/servicesData';

// Grounded knowledge retriever with real-time website context
function generateGroundedAnswer(queryText, jobs = [], team = []) {
  const q = (queryText || '').toLowerCase().trim();

  // 1. Founders, Co-Founders, Waleed & Leadership inquiries
  const isFounderQuery = q.includes('founder') || q.includes('co-founder') || q.includes('cofounder') ||
    q.includes('ceo') || q.includes('cto') || q.includes('coo') || q.includes('owner') ||
    q.includes('malik') || q.includes('leader') || q.includes('head') ||
    q.includes('samad') || q.includes('waleed') || q.includes('maria') || q.includes('muneeb');

  if (isFounderQuery) {
    const isAskingAboutWaleed = q.includes('waleed');
    
    if (isAskingAboutWaleed) {
      return {
        answer: `Nahi, **Waleed Ahmed** ORBIT-I ke co-founder nahi hain. Woh hamari core team mein **Digital Marketing Expert** (Marketing & Growth) hain jo global digital marketing, branding aur technical SEO lead karte hain.\n\n**ORBIT-I ki Official Leadership:**\n• **Abdul Samad Rind:** Founder & Chief Executive Officer (CEO)\n• **Maria Almani:** Co-Founder & Chief Operating Officer (COO)\n• **Muhammad Muneeb Ur Rahman:** Co-Founder & Chief Technology Officer (CTO)\n\nAap hamari poori leadership aur engineering team ko [Team Page](/team) par dekh sakte hain.`,
        actionLink: '/team',
        actionText: 'Meet The Full Team',
      };
    }

    return {
      answer: `ORBIT-I Private Limited ki official executive leadership:\n\n• **Abdul Samad Rind:** Founder & Chief Executive Officer (CEO) — Systems Architect leading AI Systems & Enterprise Strategy.\n• **Maria Almani:** Co-Founder & Chief Operating Officer (COO) — Overseeing client operations, agile sprint deliveries, and business growth.\n• **Muhammad Muneeb Ur Rahman:** Co-Founder & Chief Technology Officer (CTO) — Orchestrating technical architecture, cloud scalability, and database engineering.\n\n*Note:* Hamare marketing lead **Waleed Ahmed** hain (Digital Marketing Expert).\n\nAap complete team profiles hamare official [Team & Leadership](/team) page par dekh sakte hain.`,
      actionLink: '/team',
      actionText: 'View Leadership & Team',
    };
  }

  // 2. Team Members & Engineering inquiries
  if (q.includes('team') || q.includes('developer') || q.includes('engineer') || q.includes('staff') || q.includes('members')) {
    return {
      answer: `ORBIT-I ki specialized engineering aur leadership team mein shamil hain:\n\n• **Abdul Samad Rind:** Founder & CEO\n• **Maria Almani:** Co-Founder & COO\n• **Muhammad Muneeb Ur Rahman:** Co-Founder & CTO\n• **Waleed Ahmed:** Digital Marketing Expert\n• **Rashid Ali Channa:** AI/ML Engineer\n• **Hassan Ansar:** Web Developer\n• **Laiba:** Backend Developer\n• **Abdul Rehman:** .NET Developer\n• **Chander:** Software Engineer\n• **Umar Farooque:** Frontend Developer\n• **Ahsan Ali:** DevOps Engineer\n• **Hamnah:** UI/UX Designer\n\nAap sab ke verified profiles aur bios [Hamari Team](/team) page par explore kar sakte hain.`,
      actionLink: '/team',
      actionText: 'Explore Team Profiles',
    };
  }

  // 3. Certificate verification inquiries
  const certMatch = q.match(/orbit[-_i/0-9a-z]+/i);
  if (q.includes('certificate') || q.includes('verify') || q.includes('sanad') || q.includes('tasdeeq') || q.includes('code') || certMatch) {
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

  // 4. Internship & Careers inquiries
  if (q.includes('intern') || q.includes('career') || q.includes('job') || q.includes('hiring') || q.includes('apply') || q.includes('naukri') || q.includes('vacancy')) {
    const jobTitles = jobs && jobs.length > 0 
      ? jobs.slice(0, 4).map((j) => `• **${j.title}** (${j.mode || '100% Remote'}, ${j.duration || '2 Months'})`).join('\n')
      : '• **AI & ML Research Intern** (100% Remote, 2 Months)\n• **Full-Stack Web Development Intern** (100% Remote, 2 Months)\n• **Cyber Security Intern** (100% Remote, 2 Months)';

    return {
      answer: `ORBIT-I mein fresh students aur talented developers ke liye structured remote internships open hain!\n\n**Current Open Roles:**\n${jobTitles}\n\n**Key Perks:**\n• Official Verifiable Digital Experience Certificate (QR-coded)\n• Official Letter of Recommendation (LOR)\n• Direct Mentorship from Founders & Senior Engineers\n• 100% Remote flexibility across Pakistan & Global.\n\nAap directly hamari careers page se apply kar sakte hain:`,
      actionLink: '/careers',
      actionText: 'Apply on Careers Portal',
    };
  }

  // 5. Locations & Offices (Nawabshah, Karachi, Hyderabad)
  if (q.includes('location') || q.includes('office') || q.includes('nawabshah') || q.includes('karachi') || q.includes('hyderabad') || q.includes('address') || q.includes('kahan') || q.includes('city')) {
    return {
      answer: `ORBIT-I Private Limited ke Sindh, Pakistan mein 3 strategic offices aur technical hubs hain:\n\n1. **Nawabshah (Headquarters):** VIP Road / Academic Technology Corridor, Sindh. (Core engineering labs & administration)\n2. **Karachi (Regional Branch):** Shahrah-e-Faisal / Clifton Enterprise District. (Executive consulting & client delivery)\n3. **Hyderabad (Technology Hub):** Auto Bhan Road / Qasimabad.\n\nHum Pakistan bhar aur globally (USA, UK, UAE, EU) remote enterprise software services deliver karte hain.`,
      actionLink: '/contact',
      actionText: 'View Office Locations',
    };
  }

  // 6. Services & Tech Stack
  if (q.includes('service') || q.includes('ai') || q.includes('ml') || q.includes('web') || q.includes('mobile') || q.includes('app') || q.includes('software') || q.includes('cloud') || q.includes('devops') || q.includes('cyber') || q.includes('security') || q.includes('api') || q.includes('tech stack') || q.includes('kaam')) {
    return {
      answer: `ORBIT-I 7 core enterprise technology services provide karta hai:\n\n1. **Enterprise AI & ML:** Autonomous AI Agents, RAG with pgvector, Custom LLM fine-tuning.\n2. **Enterprise Web Applications:** Ultra-fast Next.js/React platforms with 10,000+ RPS concurrency.\n3. **Mobile App Development:** Cross-platform React Native & Flutter apps for iOS & Android.\n4. **Custom Software Solutions:** Scalable enterprise ERPs and bespoke workflow automation.\n5. **UI/UX Design Systems:** Modern glassmorphic, accessible, production-ready interfaces.\n6. **Cloud & DevOps Engineering:** Zero-trust architecture, Docker, Kubernetes, CI/CD pipelines.\n7. **Enterprise APIs & Integrations:** High-throughput microservices, REST/GraphQL gateways.\n\nAap kisi bhi service ka dedicated blueprint hamare Services page par explore kar sakte hain:`,
      actionLink: '/services',
      actionText: 'Explore All 7 Services',
    };
  }

  // 7. Pricing, Quotations & Direct Contact
  if (q.includes('price') || q.includes('cost') || q.includes('quote') || q.includes('rate') || q.includes('contact') || q.includes('email') || q.includes('phone') || q.includes('number') || q.includes('whatsapp') || q.includes('rabta')) {
    return {
      answer: `ORBIT-I har project ke scope aur enterprise architecture ke mutabiq transparent quotation provide karta hai. Aap hamari technical team se directly rabta kar sakte hain:\n\n• **Email:** contactus@orbit-i.tech\n• **Phone / WhatsApp:** +92 319 0375751\n• **Headquarters:** Nawabshah, Sindh\n• **Branch Office:** Karachi, Sindh\n• **Online Form:** [Contact Us](/contact)\n\nHamary technical leads 24 ghantay ke andar complete proposal ke sath reply karte hain.`,
      actionLink: '/contact',
      actionText: 'Get Project Quotation',
    };
  }

  // 8. Company Profile / Registration / SECP
  if (q.includes('orbit-i') || q.includes('orbit') || q.includes('company') || q.includes('secp') || q.includes('register') || q.includes('about')) {
    return {
      answer: `**ORBIT-I Private Limited** ek SECP-registered Pakistani engineering technology company hai (Est. 2026), jo enterprise AI systems, high-concurrency web platforms, aur mission-critical software solutions deliver karti hai.\n\n• **Headquartered:** Nawabshah, Sindh\n• **Branch:** Karachi, Sindh\n• **Executive Leadership:** Abdul Samad Rind (CEO), Maria Almani (COO), Muhammad Muneeb Ur Rahman (CTO)\n• **Services:** AI & ML, Web, Mobile, Cloud DevOps, Custom Software`,
      actionLink: '/about',
      actionText: 'Learn About ORBIT-I',
    };
  }

  // 9. Grounded Fallback
  return {
    answer: `Main ORBIT-I ka official factual AI assistant hoon aur main strictly company ke verified data se jawab deta hoon.\n\nAap mujh se pooch sakte hain:\n1. **Leadership & Team:** Founders, Co-Founders, ya engineering team members ke baray mein?\n2. **Certificates:** Internship certificate verification kaise karein?\n3. **Careers:** Open internships aur apply karne ka tareeqa?\n4. **Services:** AI Agents, Web Development, Cloud & Mobile solutions?\n5. **Offices & Contact:** Nawabshah HQ, Karachi branch, ya project quotation?`,
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
    return NextResponse.json({ error: 'Unable to process inquiry at this moment.' }, { status: 500 });
  }
}
