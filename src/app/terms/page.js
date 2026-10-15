import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata = {
  title: 'Terms & Conditions | ORBIT-I Private Limited',
  description: 'Commercial service terms and conditions of ORBIT-I Private Limited, SECP registered technology company.',
  alternates: {
    canonical: 'https://orbit-i.tech/terms',
  },
};

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: '85vh', background: 'var(--bg)', paddingTop: 120, paddingBottom: 80, paddingLeft: 24, paddingRight: 24 }}>
        <article style={{ maxWidth: 880, margin: '0 auto', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 24, padding: '48px 36px', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
          <div style={{ marginBottom: 28, borderBottom: '1px solid var(--border)', paddingBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <Link href="/" style={{ fontSize: 13, color: 'var(--accent)', textDecoration: 'none' }}>← Home</Link>
              <span style={{ color: 'var(--text-muted)' }}>/</span>
              <span style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 600 }}>Terms & Conditions</span>
            </div>
            <h1 style={{ fontFamily: 'Space Grotesk', fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2, marginBottom: 12 }}>
              Terms & Conditions of Service
            </h1>
            <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Governing commercial software development, autonomous AI deployments, client portal agreements, and digital service contracts.
            </p>
          </div>

          <div style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--text-secondary)' }}>
            <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 20, color: 'var(--text-primary)', marginTop: 24, marginBottom: 12 }}>1. SECP Corporate Governance</h2>
            <p>ORBIT-I Private Limited is an SECP-incorporated entity operating under the commercial statutes of Pakistan. All signed proposals, milestone deliverables, and service-level agreements (SLAs) are legally binding.</p>

            <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 20, color: 'var(--text-primary)', marginTop: 24, marginBottom: 12 }}>2. 100% Intellectual Property Ownership</h2>
            <p>Upon final settlement of project milestones, complete ownership of customized source code, database architectures, and model artifacts transfers fully to the client, free of recurring proprietary royalty claims unless otherwise specified in dedicated SaaS agreements.</p>

            <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 20, color: 'var(--text-primary)', marginTop: 24, marginBottom: 12 }}>3. Acceptable Use & Portal Access</h2>
            <p>Attempting unauthorized penetration tests, reverse-engineering API tokens, brute-forcing administrative endpoints, or injecting hostile payloads into ORBIT-I infrastructure triggers automatic permanent IP restriction and legal reporting.</p>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
