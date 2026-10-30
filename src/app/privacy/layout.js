export const metadata = {
  title: 'Privacy Policy | ORBIT-I Private Limited',
  description: 'Official Privacy Policy of ORBIT-I Private Limited. How we collect, safeguard, and maintain zero-trust security for client proprietary datasets and candidate information.',
  openGraph: {
    title: 'Privacy Policy | ORBIT-I Private Limited',
    description: 'How ORBIT-I collects, safeguards, and maintains zero-trust security for client datasets.',
    url: 'https://orbit-i.tech/privacy',
    siteName: 'ORBIT-I Private Limited',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'ORBIT-I Privacy Policy' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy | ORBIT-I Private Limited',
    description: 'Privacy Policy and data protection standards at ORBIT-I.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://orbit-i.tech/privacy',
  },
}

export default function PrivacyLayout({ children }) {
  return children
}
