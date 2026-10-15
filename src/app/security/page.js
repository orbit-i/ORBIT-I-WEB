import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata = {
  title: 'Information Security & Cyber Defense | ORBIT-I Private Limited',
  description: 'Enterprise cyber shield protocols, zero-trust infrastructure, and threat defenses engineered by ORBIT-I Private Limited.',
  alternates: {
    canonical: 'https://orbit-i.tech/security',
  },
};

export default function SecurityPage() {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: '85vh', background: 'var(--bg)', paddingTop: 120, paddingBottom: 80, paddingLeft: 24, paddingRight: 24 }}>
        <article style={{ maxWidth: 880, margin: '0 auto', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 24, padding: '48px 36px', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
          <div style={{ marginBottom: 28, borderBottom: '1px solid var(--border)', paddingBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <Link href="/" style={{ fontSize: 13, color: 'var(--accent)', textDecoration: 'none' }}>← Home</Link>
              <span style={{ color: 'var(--text-muted)' }}>/</span>
              <span style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 600 }}>Security Standards</span>
            </div>
            <h1 style={{ fontFamily: 'Space Grotesk', fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2, marginBottom: 12 }}>
              Cyber Defense & Infrastructure Security
            </h1>
            <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Multi-tier perimeter defense, autonomous threat mitigation, and encrypted data architectures engineered to resist modern attack vectors.
            </p>
          </div>

          <div style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--text-secondary)' }}>
            <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 20, color: 'var(--text-primary)', marginTop: 24, marginBottom: 12 }}>1. Cyber Shield Web Application Firewall (WAF)</h2>
            <p>Every inbound request across ORBIT-I networks is continuously scanned by our real-time inspection engine, blocking SQL injections, Cross-Site Scripting (XSS), Remote Code Execution (RCE), reverse shell payloads, path traversal attempts, and automated vulnerability scanners.</p>

            <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 20, color: 'var(--text-primary)', marginTop: 24, marginBottom: 12 }}>2. High-Concurrency Balance Loader & Rate Limiting</h2>
            <p>Our infrastructure incorporates token-bucket and sliding-window rate limiters. High-frequency credential stuffing, automated login bots, and HTTP floods are intercepted and suppressed before reaching database clusters, sustaining 10,000+ concurrent requests effortlessly.</p>

            <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 20, color: 'var(--text-primary)', marginTop: 24, marginBottom: 12 }}>3. Encryption & Access Control</h2>
            <p>We enforce mandatory TLS 1.3 encryption with strict HTTP Strict Transport Security (HSTS), pre-loaded certificates, and AES-256 encrypted database vaults with connection pooling.</p>

            <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 20, color: 'var(--text-primary)', marginTop: 24, marginBottom: 12 }}>4. Vulnerability Disclosure</h2>
            <p>Security researchers discovering potential vulnerabilities are requested to notify our incident response team at <a href="mailto:contactus@orbit-i.tech" style={{ color: 'var(--accent)' }}>contactus@orbit-i.tech</a>.</p>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
