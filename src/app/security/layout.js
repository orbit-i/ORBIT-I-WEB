export const metadata = {
  title: 'Security Policy | ORBIT-I Private Limited',
  description: 'Security architecture, encryption standards (AES-256, TLS 1.3), vulnerability disclosure policy (security.txt), and compliance frameworks.',
  openGraph: {
    title: 'Security Policy | ORBIT-I Private Limited',
    description: 'Security architecture, encryption standards, vulnerability disclosure, and compliance standards.',
    url: 'https://orbit-i.tech/security',
    siteName: 'ORBIT-I Private Limited',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'ORBIT-I Security' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Security Policy | ORBIT-I Private Limited',
    description: 'Security architecture and vulnerability disclosure policy.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://orbit-i.tech/security',
  },
}

export default function SecurityLayout({ children }) {
  return children
}
