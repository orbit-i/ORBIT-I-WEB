import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | ORBIT-I Private Limited',
  description: 'Official Privacy Policy and data protection standards of ORBIT-I Private Limited, SECP registered technology company.',
  alternates: {
    canonical: 'https://orbit-i.tech/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: '85vh', background: 'var(--bg)', paddingTop: 120, paddingBottom: 80, paddingLeft: 24, paddingRight: 24 }}>
        <article style={{ maxWidth: 880, margin: '0 auto', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 24, padding: '48px 36px', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
          <div style={{ marginBottom: 28, borderBottom: '1px solid var(--border)', paddingBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <Link href="/" style={{ fontSize: 13, color: 'var(--accent)', textDecoration: 'none' }}>← Home</Link>
              <span style={{ color: 'var(--text-muted)' }}>/</span>
              <span style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 600 }}>Privacy Policy</span>
            </div>
            <h1 style={{ fontFamily: 'Space Grotesk', fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2, marginBottom: 12 }}>
              Privacy & Data Protection Policy
            </h1>
            <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              ORBIT-I Private Limited (SECP Registered, Est. 2026) is committed to protecting client intellectual property, candidate submissions, and confidential business data.
            </p>
          </div>

          <div style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--text-secondary)' }}>
            <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 20, color: 'var(--text-primary)', marginTop: 24, marginBottom: 12 }}>1. Data Confidentiality & Non-Disclosure</h2>
            <p>We treat all client source code, enterprise datasets, architecture blueprints, and commercial inquiries with strict non-disclosure safeguards. We do not sell, rent, or lease private data to third parties.</p>

            <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 20, color: 'var(--text-primary)', marginTop: 24, marginBottom: 12 }}>2. Technical Information We Collect</h2>
            <p>When you use the ORBIT-I portal or inquiry forms, we may collect your name, email, company name, phone number, and project brief. This data is used solely to respond to your technical requirements and fulfill contracted engineering services.</p>

            <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 20, color: 'var(--text-primary)', marginTop: 24, marginBottom: 12 }}>3. Encryption & Storage Standards</h2>
            <p>All transmitted payloads are secured with TLS 1.3 in transit and AES-256 encryption at rest. Internal database access is restricted via VPC isolation and strict Role-Based Access Control (RBAC).</p>

            <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 20, color: 'var(--text-primary)', marginTop: 24, marginBottom: 12 }}>4. Corporate Inquiries & Data Rights</h2>
            <p>To request data erasure or an audit of your stored information, contact our data protection team directly at <a href="mailto:contactus@orbit-i.tech" style={{ color: 'var(--accent)' }}>contactus@orbit-i.tech</a>.</p>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
