export const metadata = {
  title: 'Verify Certificate | ORBIT-I Credential Registry',
  description: 'Official verification system for ORBIT-I internship completion letters, engineering certificates, and professional development credentials.',
  openGraph: {
    title: 'Verify Certificate | ORBIT-I Credential Registry',
    description: 'Official verification system for ORBIT-I certificates and credentials.',
    url: 'https://orbit-i.tech/verify',
    siteName: 'ORBIT-I Private Limited',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'ORBIT-I Certificate Verification' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Verify Certificate | ORBIT-I Credential Registry',
    description: 'Official verification system for ORBIT-I certificates and credentials.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://orbit-i.tech/verify',
  },
}

export default function VerifyLayout({ children }) {
  return children
}
