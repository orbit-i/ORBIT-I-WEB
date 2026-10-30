export const metadata = {
  title: 'Terms of Service | ORBIT-I Private Limited',
  description: 'Terms of service, engineering agreements, intellectual property assignments, and service level agreements (SLAs) for ORBIT-I clients.',
  openGraph: {
    title: 'Terms of Service | ORBIT-I Private Limited',
    description: 'Terms of service and engineering standards for ORBIT-I clients.',
    url: 'https://orbit-i.tech/terms',
    siteName: 'ORBIT-I Private Limited',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'ORBIT-I Terms' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms of Service | ORBIT-I Private Limited',
    description: 'Terms of service and engineering standards for ORBIT-I clients.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://orbit-i.tech/terms',
  },
}

export default function TermsLayout({ children }) {
  return children
}
